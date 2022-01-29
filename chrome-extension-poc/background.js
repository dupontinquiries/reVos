let is_enabled = false;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ is_enabled });
    console.log('Welcome to reVos!');
});