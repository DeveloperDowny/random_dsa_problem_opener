async function openRandomLink() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  // Extract all links using querySelectorAll
  const links = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () =>
      Array.from(document.querySelectorAll("a[href]")).map((link) => link.href),
  });

  // Filter out empty URLs and the current page URL and only keep the links that start with "https://www.geeksforgeeks.org/problems/"
  const prefix = "https://www.geeksforgeeks.org/problems/";

  // href="https://practice.geeksforgeeks.org/problems/merge-two-sorted-linked-lists/1"

  const prefixList = [
    "https://practice.geeksforgeeks.org/problems/",
    "https://www.geeksforgeeks.org/problems/",
    "https://leetcode.com/problems/",
    "https://www.naukri.com/code360/problems/",
  ];

  const filteredLinks = links[0].result.filter(
    (link) =>
      link &&
      link !== url &&
      prefixList.some((prefix) => link.startsWith(prefix))
  );
  console.log(filteredLinks);
  // crate new links list with ids of the links
  const linksWithId = filteredLinks.map((link, index) => ({
    id: index,
    url: link,
    title: link,
  }));
  const sheetData = {
    sheetData: linksWithId,
  };
  console.log(sheetData);

  if (filteredLinks.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredLinks.length);
    const randomUrl = filteredLinks[randomIndex];
    await chrome.tabs.create({ url: randomUrl });
  } else {
    console.log("No links found on this page.");
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message === "openRandomLink") {
    openRandomLink();
  }
});
