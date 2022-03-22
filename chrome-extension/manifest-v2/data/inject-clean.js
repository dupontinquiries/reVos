'use strict';

// var analyser;

// for legacy browsers
// const AudioContext = window.AudioContext || window.webkitAudioContext;


// reVos hooks

// base is the base (non-dynamic) playback rate (ie. I can watch a video at 1.2 speed + the dynamic speed modulation from runAnalysis)
var base = 1;
// steps controls the precision of total video speed modulation
var steps = 10; // 5
// dynamic_steps controls the precision of reVos' speed modulation (only one part of the algorithm)
// 4: increments of .25 speed
// 5: increments of .2 speed
var dynamic_steps = 20;

// vol_arr is a vector that acts as a ring buffer for storing audio data
var vol_arr = [];
var ordered_vol_arr = [];
// counter is a helper variable that keeps track of the most recently added audio level average in the audio buffer (located in runAnalysis)
var counter = 0;
// update rate changes how often the playback speed can be changed
// update rate should higher than 12 in order to work with slower systems
// for m1 mac users: turn off "optimize video playback on battery" in settings to fix the unsync problem
const update_rate = 24;
// max counter dictates the number of samples stored at any moment
// scan time * max counter effectively dictates the number of milliseconds of sampled audio that will be used to make a speed adjustment
const max_counter = 48; //48, 18, 24
// scan time dictates the period of runAnalysis::setInterval
// scan time updates the audio memory with a new value
const scan_time = 8; //48, 18, 32

// calculates the time saved by using reVos
var time_saved = 0;

for (let i = 0; i < max_counter; ++i) {
    vol_arr[i] = 10;
}

var should_analyze = null;

function create_reVos_analyzer(target, settings) {
    target.analyser = target.context.createAnalyser();
    target.analyser.minDecibels = -90; // -90
    target.analyser.maxDecibels = -10;
    target.analyser.fftSize = 1024;
    target.analyser.smoothingTimeConstant = 0.0;
}

function runAnalysis(target) {
    // should_analyze = target;

    var video = document.getElementsByTagName('video')[0];
    if (window.location.hostname.includes('webex')) {
        // make the controls less bulky (helps for screenshots)
        document.getElementsByClassName('vjs-fill')[0].style = 'overflow: scroll; height: 100%; width: 100%;';
        document.getElementsByClassName('vjs-control-bar')[0].style = 'max-width: calc(2rem + 4vh + 10vw) !important;';
        document.getElementsByClassName('vjs-slider-horizontal')[0].style = 'height: 20px !important;';
        // theater mode the background
        document.getElementById('ngPlayerContainer').style = 'background-color: black !important; color: white !important;';
        document.body.style = 'background-color: black !important; color: white !important;';
        document.getElementsByClassName('unifiedPlayerLayout')[0].style = 'background-color: black !important; color: white !important;';
        // fullscreen the video
        document.getElementsByClassName('ngPlayerWrapper')[0].style = 'height: 100vh; width: 100vw;';
        document.getElementsByClassName('vjs-unified')[0].style = 'height: 90vh !important;';
    }

    time_saved = 0;

    setInterval(function() {

        let multiplier = settings.reVos_multiplier;
        let offset = settings.reVos_offset - 1;

        if (video.paused) {
            if (window.location.hostname.includes('webex')) {
                // webex show bar
                // document.getElementsByClassName('vjs-control-bar')[0].style = 'transform: scaleY(.9) translateY(10px) !important; max-width: calc(2rem + 4vh + 10vw) !important;';
                // document.getElementsByClassName('vjs-control-bar')[0].style = 'transform: scaleY(.9) translateY(10px) !important; max-width: 100% !important;';
                // document.getElementsByClassName('vjs-slider-horizontal')[0].style = 'height: auto !important;';
            }
        } else {
            if (window.location.hostname.includes('webex')) {
                // webex hide bar
                // document.getElementsByClassName('vjs-control-bar')[0].style = 'transform: scaleY(.7) translateY(30px) !important; max-width: calc(2rem + 4vh + 10vw) !important;';
            }
        }

        if (video.paused || multiplier == 0) {
            // console.log('paused');
            video.playbackRate = 1 + offset;
            return;
        }

        if (!settings.enabled) {
            video.playbackRate = 1;
            // console.log('disabled');
            return;
        }

        var bufferLength = target.analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        target.analyser.getByteFrequencyData(dataArray);

        // const run_average = Math.pow ( dataArray.reduce((a, b) => a + b) / bufferLength, .85 );
        const run_average = dataArray.reduce((a, b) => a + b) / dataArray.length; //, 1.1 ) / 1.05;
        const vol_average = vol_arr.reduce((a, b) => a + b) / vol_arr.length;

        if (counter >= max_counter) {
            counter = 0;
        }
        vol_arr[counter] = run_average;
        ++counter;

        // reorder signal
        for (let i = 0; i < max_counter - counter; ++i) {
            // shifting by counter
            ordered_vol_arr[i] = vol_arr[i + counter];
        }
        for (let i = 0; i < counter; ++i) {
            ordered_vol_arr[max_counter - counter + i] = vol_arr[i];
        }

        let change1 = 0;
        let change2 = 0;
        for (let i = 0; i < max_counter / 2; ++i) {
            change1 += ordered_vol_arr[i];
        }
        for (let i = max_counter / 2; i < max_counter; ++i) {
            change2 += ordered_vol_arr[i];
        }
        let change = (change2 - change1) / max_counter * 1;

        var pbr_change = base * Math.max(0 - (.05 * change), 0);

        var pbr = base * Math.max(
            multiplier * (1.3 + ((-.063 * pbr_change) + (-1.017 * run_average))), 1);

        pbr = Math.round(dynamic_steps * pbr) / dynamic_steps;


        if (counter % update_rate == 0) {
            if (video.playbackRate > 1) { //TODO: add to settings
                // if (video.playbackRate > 1 && settings.time_saved_logging) { //TODO: add to settings
                console.log('time saved:' + Math.round(time_saved / 1000) + "s");
            }
            if (video.playbackRate != pbr + offset) {
                video.playbackRate = Math.round((pbr + offset) * steps) / steps;
            }
        }

        if (video.playbackRate > 1) {
            time_saved += scan_time * (video.playbackRate - 1);
        }

    }, scan_time);
}

// !reVos hooks

var prefs = {
    sites: {
        'default': {
            enabled: false,
            threshold: -24,
            knee: 30,
            ratio: 12,
            attack: .003,
            release: .25,
            boost: 0
        }
    }
    //disableForCrossSiteElements: false
};
var settings = prefs.sites.default;
var parameterChangeDuration = .1;

var logPrefix = 'Audio Compressor: ';

//console.log(logPrefix + 'injecting compressor');

window.audioCompressor = {};

function adjustSource(target, settings) {
    /*
    document.querySelectorAll('video, audio').forEach((e) => {
      e.crossOrigin = 'anonymous';
    });
    */

    if (typeof target === 'undefined') {
        return;
    }

    window.audioCompressor.target = target;

    if (typeof(target.attached) === 'undefined') {
        target.attached = false;
    }

    if (!target.attached && settings.enabled) {
        /*
        var targetURL;
        try {
          targetURL = new URL(target.currentSrc);
        }
        catch (e) {}

        // not as simple as checking the url host
        // videos can have a source like: blob:twitch.tv/ajhakjdshakhdsj
        if (prefs.disableForCrossSiteElements &&
            targetURL != null &&
            window.location.host != targetURL.host) {
          console.log(logPrefix + ' cross-origin source, not enabling', target);
          return;
        }
        */

        if (!target.initialized) {
            console.log(logPrefix + 'creating compressor', settings);
            //console.log(logPrefix + 'creating compressor', settings, target);

            //target.crossOrigin = 'anonymous';

            target.context = new AudioContext();
            target.source = target.context.createMediaElementSource(target);
            target.compressor = target.context.createDynamicsCompressor();
            target.boost = target.context.createGain();
            create_reVos_analyzer(target, settings); // add reVos
            target.initialized = true;
        }

        try {
            target.source.disconnect();
        } catch (e) {
            console.log(logPrefix + 'caught error disconnecting source', e);
        }

        target.source.connect(target.compressor);
        target.compressor.connect(target.boost);
        target.boost.connect(target.context.destination);
        // reVos
        target.source.connect(target.analyser);

        applySettings();
        target.attached = true;
    } else if (target.attached && !settings.enabled) {
        console.log(logPrefix + 'disabling compressor');

        target.source.disconnect(target.compressor);
        target.compressor.disconnect(target.boost);
        target.boost.disconnect(target.context.destination);
        target.source.connect(target.context.destination);
        target.attached = false;
    } else if (target.attached && settings.enabled) {
        applySettings();
    }

    function applySettings() {
        for (var s in settings) {

            // console.log('\n' + 'dcs:' + s + ' - ' + settings[s] + '\n');

            var value = settings[s];

            if (s == 'enabled') {

            } else if (s == 'boost') {
                try {
                    target.boost.gain.exponentialRampToValueAtTime(value * 4 + 1, parameterChangeDuration);
                } catch (e) {
                    console.log(logPrefix + 'error setting gain', e);
                    target.boost.gain.value = value * 4 + 1;
                }
            } else /*if (s == 'knee' || s == 'attack' || s == 'release')*/ {
                try {
                    if (s == 'knee' || s == 'attack' || s == 'release') {
                        if (value <= 0) {
                            value = .001;
                        }
                    }

                    if (s == 'threshold') {
                        target.compressor[s].linearRampToValueAtTime(value, parameterChangeDuration);
                    } else if (s == 'reVos_multiplier' || s == 'reVos_offset') {
                        // alert('set');
                        target.compressor[s] = value;
                    } else {
                        target.compressor[s].exponentialRampToValueAtTime(value, parameterChangeDuration);
                    }
                } catch (e) {
                    console.log(logPrefix + 'error setting ' + s, e);
                    target.compressor[s].value = value;
                }
            }

        }
    }

    if (typeof browser === 'undefined') {
        window.browser = chrome;
    }
    browser.runtime.sendMessage({
        active: target.attached == true
    });
}

function getBestSiteMatch() {
    var bestSiteMatch = 'default';
    var maxLength = 0;
    for (var s in prefs.sites) {
        if (s == 'default') {
            continue;
        }
        if (document.location.href.startsWith(s) && s.length > maxLength) {
            bestSiteMatch = s;
            maxLength = s.length
        }
    }

    return bestSiteMatch;
}

var update = (target) => {
    if (target == null) {
        if (typeof audioCompressor !== 'undefined') {
            target = audioCompressor.target;
        }
    }

    settings = prefs.sites[getBestSiteMatch()];
    adjustSource(target, settings);
};

chrome.storage.local.get(prefs, results => {
    Object.assign(prefs, results);
    update();
});

chrome.storage.onChanged.addListener(changes => {
    /*
    if (changes.disableForCrossSiteElements) {
      prefs.disableForCrossSiteElements = changes.disableForCrossSiteElements.newValue == true;
    }
    */
    if (changes.sites) {
        prefs.sites = changes.sites.newValue;
        update();
    }
});

window.addEventListener('playing', ({
    target
}) => {
    update(target, settings);
    if (should_analyze != target) {
        console.log('PLAYING');
        should_analyze = target;
        runAnalysis(target);
    }
}, true);

window.addEventListener('canplay', ({
    target
}) => {
    update(target, settings);
}, true);

if (typeof play === 'undefined') {
    const play = Audio.prototype.play;
}

Audio.prototype.play = function() {
    try {
        update(this, settings);
    } catch (e) {
        console.log(logPrefix, e)
    }
    return play.apply(this, arguments);
};

if (typeof browser === 'undefined') {
    window.browser = chrome;
}
browser.runtime.onMessage.addListener(() => {
    if (window.audioCompressor == null) {
        return;
    }
    if (window.audioCompressor.target == null) {
        return;
    }
    if (!window.audioCompressor.target.attached) {
        return;
    }

    chrome.runtime.sendMessage({
        active: true
    });
});
