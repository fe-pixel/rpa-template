

//加载就跳转到index.html
chrome.runtime.onInstalled.addListener(function (reason) {
  chrome.tabs.update({ "url": `${window.location.origin}/index.html`, "selected": true });
});


