function executeScript(details) {
  const temp = document.createElement('script');
  temp.textContent = details.code;
  document.documentElement.insertBefore(
    temp,
    document.documentElement.firstChild
  );
  temp.remove();
}

executeScript({
  code: `(function () {
      const _attachShadow = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function (init) {
        init.mode = 'open';
        return _attachShadow.call(this, init);
      };
    })()`,
});

chrome.runtime.onMessage.addListener(function (message) {
  const playbackRate = message.playbackRate;

  const audios = document.querySelectorAll('audio');
  const videos = document.querySelectorAll('video');

  Array.prototype.forEach.call(audios, function (item) {
    item.playbackRate = playbackRate;
  });
  Array.prototype.forEach.call(videos, function (item) {
    item.playbackRate = playbackRate;
  });

  if (/bilibili\.com/.test(location.href)) {
    executeScript({
      code: `(function () {
          const shadowHost = document.querySelector('bwp-video');
          if (shadowHost) {
            shadowHost.playbackRate = ${playbackRate};
          }
        })()`,
    });
  } else if (/pan\.baidu\.com/.test(location.href)) {
    const shadowHost = document.querySelector('#video-root');
    if (shadowHost) {
      shadowHost.shadowRoot.querySelector('video').playbackRate = playbackRate;
    }
  }
});
