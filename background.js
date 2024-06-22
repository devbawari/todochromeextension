chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('timerEndTime', (data) => {
      if (data.timerEndTime) {
        const remainingTime = data.timerEndTime - Date.now();
        if (remainingTime > 0) {
          startBackgroundTimer(remainingTime);
        }
      }
    });
  });
  
  function startBackgroundTimer(remainingTime) {
    chrome.alarms.create('timer', { when: Date.now() + remainingTime });
  }
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'timer') {
      chrome.storage.sync.remove('timerEndTime');
      chrome.notifications.create('timerEnded', {
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Timer Ended',
        message: 'Your timer has ended!',
        priority: 2
      });
    }
  });
  
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.timerEndTime) {
      const timerEndTime = changes.timerEndTime.newValue;
      if (timerEndTime) {
        const remainingTime = timerEndTime - Date.now();
        if (remainingTime > 0) {
          startBackgroundTimer(remainingTime);
        }
      } else {
        chrome.alarms.clear('timer');
      }
    }
  });
  
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      return { cancel: true };
    },
    { urls: [] },
    ["blocking"]
  );
  
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.blockedSites) {
      const blockedSites = changes.blockedSites.newValue || [];
      const urls = blockedSites.map(site => `*://${site}/*`);
      chrome.webRequest.onBeforeRequest.removeListener(blockSiteListener);
      chrome.webRequest.onBeforeRequest.addListener(
        blockSiteListener,
        { urls },
        ["blocking"]
      );
    }
  });
  
  function blockSiteListener(details) {
    return { cancel: true };
  }
  