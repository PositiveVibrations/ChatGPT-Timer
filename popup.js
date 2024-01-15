document.addEventListener('DOMContentLoaded', function () {
    const searchResultDiv = document.getElementById('searchResult');

    // Add event listener to the search button
    document.getElementById('triggerSearch').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "searchForRestrictions"}, function(response) {
                if (response && response.found) {
                    searchResultDiv.textContent = "Timer Detected";
                } else {
                    searchResultDiv.textContent = "No Timer Detected";
                }
            });
        });
    });
});