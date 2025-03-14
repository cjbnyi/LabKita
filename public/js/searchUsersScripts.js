document.addEventListener("DOMContentLoaded", function () {
    console.log('Checking to see if this gets triggered.'); // DEBUGGING
    const searchForm = document.querySelector("form[role='search']");
    const searchInput = searchForm.querySelector("input[type='search']");

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const query = searchInput.value.trim();
        if (!query) {
            alert("Please enter a name to search.");
            return;
        }

        // Redirect to search results page if query exists
        window.location.href = `/api/search-users?name=${encodeURIComponent(query)}`;
    });
});
