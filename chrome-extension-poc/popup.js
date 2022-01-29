
let btn = document.getElementById("toggle_button");
let is_enabled = chrome.storage.sync.get("is_enabled");

btn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: main,
    });
  });
  
function toggle() {
    chrome.storage.sync.get("is_enabled", ({ is_enabled }) => {
        if (is_enabled) is_enabled = false
        if (!is_enabled) is_enabled = true
        chrome.storage.sync.set({ is_enabled });
        console.log("is_enabled = " + is_enabled);
        if (is_enabled) main();
    });
}

// main code
function main() {
    document.getElementsByTagName("video")[0].playbackRate = 2;
}

// function run() {
//     // v = document.getElementsByTagName("video")[0]; 
//     videos = document.getElementsByTagName("video"); 
//     for (var i = 0; i < videos.length; ++i) {
//         v.playbackRate = 5.0;
//     }
//     // v.playbackRate = 5.0;
// }

// execute main code
if (is_enabled) {
    // run();
    // videos = document.getElementsByTagName("video"); 
    // for (var i = 0; i < videos.length; ++i) {
    //     v.playbackRate = 5.0;
    // }
    // document.getElementsByTagName("video")[0].playbackRate = 2;
}

// var analyzer = target.context.createAnalyser();
//         analyzer.minDecibels = -90;
//         analyzer.maxDecibels = -10;
//         analyzer.smoothingTimeConstant = 0.85;
//         target.reVos = analyzer;

// setInterval(function() {
  
// }, 100);