document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    browser.storage.sync.get({
      enabled: true,
      swearingFilter: true,
      sensitivityLevel: 'moderate'
    }).then(items => {
      document.getElementById('extensionToggle').checked = items.enabled;
      document.getElementById('swearingToggle').checked = items.swearingFilter;
      document.getElementById('sensitivityLevel').value = items.sensitivityLevel;
    });
  
    // Save settings when changed
    document.getElementById('extensionToggle').addEventListener('change', function(e) {
      browser.storage.sync.set({
        enabled: e.target.checked
      });
      updateContentScript();
    });
  
    document.getElementById('swearingToggle').addEventListener('change', function(e) {
      browser.storage.sync.set({
        swearingFilter: e.target.checked
      });
      updateContentScript();
    });
  
    document.getElementById('sensitivityLevel').addEventListener('change', function(e) {
      browser.storage.sync.set({
        sensitivityLevel: e.target.value
      });
      updateContentScript();
    });
  });
  
  function updateContentScript() {
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      browser.tabs.sendMessage(tabs[0].id, {
        action: 'updateSettings'
      });
    });
  }
  