function start() {
  chrome.contextMenus.removeAll(function () {
    chrome.storage.local.get('config', function (res) {
      if ('config' in res) {
        // create context menus
        res.config.rules.forEach(function (item) {
          chrome.contextMenus.create({
            id: item.toString(),
            title: `${item}x`,
          });
        });
      }
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
