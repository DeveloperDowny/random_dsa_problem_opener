document.getElementById("open-random-link").addEventListener("click", () => {
  chrome.runtime.sendMessage("openRandomLink");
});
