'use strict';

// var analyser;

// for legacy browsers
// const AudioContext = window.AudioContext || window.webkitAudioContext;

var multiplier = 1;
var base = 1;
var offset = 0;
var steps = 5;

var prefs = {
  sites: {
    'default': { enabled: false, threshold: -24, knee: 30, ratio: 12, attack: .003, release: .25, boost: 0 }
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

  if (typeof (target.attached) === 'undefined') {
    target.attached = false;
  }

  ////// TODO: add audio analyzer //////
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
        // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
        target.compressor = target.context.createDynamicsCompressor();
        target.boost = target.context.createGain();
        // var analyser = target.context.createAnalyser();
        // analyser.minDecibels = -50;
        // analyser.maxDecibels = -3;
        // analyser.smoothingTimeConstant = 0.85;
        // target.source.connect(analyser);
        // target.reVos_analyser = analyser;




        target.analyser = target.context.createAnalyser();
        target.analyser.minDecibels = -90;
        target.analyser.maxDecibels = -10;
        target.analyser.fftSize = 256;
        target.analyser.smoothingTimeConstant = 0.02;

        // target.source.connect(analyser);

        target.initialized = true;
    }

    try {
      target.source.disconnect();
    }
    catch (e) {
      console.log(logPrefix + 'caught error disconnecting source', e);
    }

    target.source.connect(target.compressor);
    target.compressor.connect(target.boost);
    target.boost.connect(target.context.destination);
    // reVos
    target.source.connect(target.analyser);

    applySettings();
    target.attached = true;
  }
  else if (target.attached && !settings.enabled) {
    console.log(logPrefix + 'disabling compressor');

    target.source.disconnect(target.compressor);
    target.compressor.disconnect(target.boost);
    target.boost.disconnect(target.context.destination);
    target.source.connect(target.context.destination);
    target.attached = false;
  }
  else if (target.attached && settings.enabled) {
    applySettings();
  }

  function applySettings() {
    for (var s in settings) {
      var value = settings[s];

      if (s == 'enabled') {

      }
      else if (s == 'boost') {
        try {
          target.boost.gain.exponentialRampToValueAtTime(value * 4 + 1, parameterChangeDuration);
        }
        catch (e) {
          console.log(logPrefix + 'error setting gain', e);
          target.boost.gain.value = value * 4 + 1;
        }
      }
      else {
        try {
          if (s == 'knee' || s == 'attack' || s == 'release') {
            if (value <= 0) {
              value = .001;
            }
          }

          if (s == 'threshold') {
            target.compressor[s].linearRampToValueAtTime(value, parameterChangeDuration);
          }
          else {
            target.compressor[s].exponentialRampToValueAtTime(value, parameterChangeDuration);
          }
        }
        catch (e) {
          console.log(logPrefix + 'error setting ' + s, e);
          target.compressor[s].value = value;
        }
      }
    }
  }

  if (typeof browser === 'undefined') {
    window.browser = chrome;
  }
  browser.runtime.sendMessage({ active: target.attached == true });
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

// var iii = 0;

// console.log('start\n\n\n\n');
// var analyser = new (window.AudioContext)().createAnalyser();
// analyser.fftSize = 256;
// var bufferLength = analyser.frequencyBinCount;
// var dataArray = new Uint8Array(bufferLength);
// analyser.getByteFrequencyData(dataArray);
// console.log('a: ' + dataArray);
// console.log('end\n\n\n\n');

var vol_arr = [];
var counter = 0;
const max_counter = 20;
const scan_time = 50;//133.33;//66.67;//3.75;
// var next_action;

for (let i = 0; i < max_counter; ++i ) {
  vol_arr[i] = 10;
}

var should_analyze = window;

function runAnalysis(target) {
  should_analyze = target;
  setInterval(function() {
    var bufferLength = target.analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    target.analyser.getByteFrequencyData(dataArray);
  
    // const average = dataArray.reduce((a, b) => a + b) / bufferLength;
    // const min_num = dataArray.reduce((a, b) => Math.min(a, b));
    // const max_num = dataArray.reduce((a, b) => Math.max(a, b));
  
    // const scale = .7;
    // const mmin = 1.;
    // const mmax = 3.5;

    // var avg = Math.max( 0, 1. - (average / 128.) );
    // var avg = 1. - (Math.max( 0, average ) / 255. );
    // var avg2 = 2. * (Math.max( 0, avg - .5 ) );
    
    // var pbr = Math.round( 100. * Math.max(avg, Math.min( 1. + (scale * ( avg )), mmax)) ) / 100;
    
    // console.log('data: ' + dataArray);
    // console.log('avg: ' + average);
    
    const run_average = Math.pow ( dataArray.reduce((a, b) => a + b) / bufferLength, .85 );
    const vol_average = vol_arr.reduce((a, b) => a + b) / vol_arr.length;

    if (counter >= max_counter) {
      counter = 0;
    }
    vol_arr[counter] = run_average;
    ++counter;
    
    var video = document.getElementsByTagName('video')[0];
    var curr_pb = video.playbackRate;
    var pbr = base * Math.max( 
                1 + (  multiplier * (  (-.1 * run_average)  +  ( .2 * (run_average - vol_average))  )  )
              , 1 );
    // pbr = Math.round( pbr * steps ) / steps;

  // Math.min( 
  //   multiplier * ( 2 - ( ( .08 * (run_average) + ( .04 * (vol_average - run_average)) ) ) ) / 1.4
  // , 2 )

    // if ( pbr > .07 + (.03 * run_average) )
    // video.currentTime = video.currentTime + ((pbr + offset) / 5);
    // if ( video.playbackRate != pbr + offset )
      // video.playbackRate = pbr + offset;
    
    if (!video.paused && run_average > 5) {
      var jump = pbr * 4;
      console.log('j: ' + jump);
      if (jump > 1.35 * multiplier)
        setTimeout(function() { video.currentTime = video.currentTime + jump; }, jump * 20);
      // video.playbackRate = pbr + offset;
    }
    

    // console.log('vol: ' + vol_arr);
    // console.log('pbr: ' + video.playbackRate);


    // if (run_average < vol_average) {
      
      // } else {
        
    // }

    // console.log('min: ' + min_num);
    // console.log('max: ' + max_num);
    // console.log('tot: ' + total);
    // console.log('pbr: ' + pbr);
  
    // document.getElementsByTagName('video')[0].playbackRate = pbr;
    
  },  scan_time );
}
// 75
// 60
// 120
// 66.66
// 99.99
// 133.33
// 266.66
// 7.5

window.addEventListener('playing', ({ target }) => {
  update(target, settings);
  if (should_analyze != target) runAnalysis(target);
}, true);

window.addEventListener('canplay', ({ target }) => {
  update(target, settings);
}, true);

if (typeof play === 'undefined') {
  const play = Audio.prototype.play;
}

Audio.prototype.play = function () {
  try {
    update(this, settings);
  }
  catch (e) { console.log(logPrefix, e) }
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

  chrome.runtime.sendMessage({ active: true });
});

// setInterval(function() {
  
// }, 100);