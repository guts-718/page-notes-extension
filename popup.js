// Run this after the popup's HTML has loaded
document.addEventListener("DOMContentLoaded", () => {
  const urlDisplay = document.getElementById("urlDisplay");
  const noteInput = document.getElementById("noteInput");
  const saveButton = document.getElementById("saveButton");
  const clearButton = document.getElementById("clearButton");
  const status = document.getElementById("status");

  // Find the active tab 
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const pageUrl = tab.url;

    // Show the URL in popup
    urlDisplay.textContent = pageUrl;

    // Load any existing note for this URL from storage
    chrome.storage.sync.get([pageUrl], (result) => {
      const existingNote = result[pageUrl] || "";
      noteInput.value = existingNote;
    });

    // on save, store the note under this URL key
    saveButton.addEventListener("click", () => {
      const noteText = noteInput.value;

      // obj with key=url and value=note
      const dataToSave = {};
      dataToSave[pageUrl] = noteText;

      chrome.storage.sync.set(dataToSave, () => {
        status.textContent = "Saved!";
        setTimeout(() => {
          status.textContent = "";
        }, 1500);
      });
    });

    // on clear, remove the note for this URL
    clearButton.addEventListener("click", () => {
      chrome.storage.sync.remove(pageUrl, () => {
        noteInput.value = "";
        status.textContent = "Cleared!";
        setTimeout(() => {
          status.textContent = "";
        }, 1500);
      });
    });
  });
});
