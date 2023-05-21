function start() {
  chrome.storage.local.get('config', function (res) {
    if ('config' in res) {
      // remove old context menus
      chrome.contextMenus.removeAll(function () {
        initContextMenus(res.config);
      });
    } else {
      // writing settings will invoke chrome.storage.onChanged
      chrome.storage.local.set({
        config: DEFAULT_SETTINGS,
      });
    }
  });
}

function initContextMenus(settings) {
  settings.rules.forEach(function (item) {
    chrome.contextMenus.create({
      id: item.toString(),
      title: `${item}x`,
    });
  });
}

chrome.browserAction.onClicked.addListener(function () {
  chrome.runtime.openOptionsPage();
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.sendMessage(tab.id, {
    playbackRate: Number.parseFloat(info.menuItemId),
  });
});

chrome.storage.onChanged.addListener(function () {
  // restart
  start();
});

// start
start();
