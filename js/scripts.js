// Set this to true after successful Google login
let userLoggedIn = false;

// Function to toggle login/signup buttons and profile icon visibility
function toggleLoginProfile() {
    if (userLoggedIn) {
        document.getElementById("loginItem").style.display = "none";
        document.getElementById("signUpItem").style.display = "none";
        document.getElementById("profileItem").style.display = "block";
    } else {
        document.getElementById("loginItem").style.display = "block";
        document.getElementById("signUpItem").style.display = "block";
        document.getElementById("profileItem").style.display = "block"; /* Set to 'none' once finished. */
    }
}

// Initialize all tooltips on the page
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Call the function to update navbar when page loads
toggleLoginProfile();
