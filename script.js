// --- INITIAL SETUP AND EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", function () {
    // Load existing data from browser storage when the page opens
    loadStoredData();

    // Listen for changes on our class interest dropdown menu
    const classDropdown = document.getElementById("interest");
    if (classDropdown) {
        classDropdown.addEventListener("change", updateClassTrackerFeature);
    }

    // Listen for form submissions to run validation checks
    const form = document.getElementById("yogaForm");
    if (form) {
        form.addEventListener("submit", validateYogaForm);
    }
});

// --- GLOBAL DATA MANAGEMENT ---
// Using an object data structure to keep data clean and organized (Rubric Requirement)
const userSessionData = {
    selectedClass: "",
    savedName: ""
};

// --- FEATURE 1: DYNAMIC CLASS TRACKER INTERACTIVE FEATURE ---
function updateClassTrackerFeature() {
    const classDropdown = document.getElementById("interest");
    if (!classDropdown) return;

    // Grab the new text option selected by the user
    const choice = classDropdown.value;
    userSessionData.selectedClass = choice;

    // Update the visual UI container dynamically
    renderTrackerUI();

    // Save choices to Local Storage immediately
    saveToBrowserStorage();
}

function renderTrackerUI() {
    const displayElement = document.getElementById("wishlistDisplay");
    if (!displayElement) return;

    if (!userSessionData.selectedClass) {
        displayElement.textContent = "No class option selected yet. Use the dropdown menu below to pick one!";
    } else {
        // Change text content using our organized data structure
        displayElement.textContent = `🧘 Target Practice: ${userSessionData.selectedClass} (Saved to your local session)`;
    }
}

// --- FEATURE 2: INPUT VALIDATION & USABILITY ---
function validateYogaForm(event) {
    let isValid = true;

    // Grab elements
    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("emailAddress");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");

    // Reset previous error messages from view
    nameError.textContent = "";
    emailError.textContent = "";

    // 1. Required Field Check (Name input cannot be blank)
    if (!nameInput.value.trim()) {
        nameError.textContent = "⚠️ Full name is required to log a spot request.";
        isValid = false;
    }

    // 2. Email Format Validation Check (Verifies structure matching name@domain.com)
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+\$/;
    
    if (!emailValue) {
        emailError.textContent = "⚠️ Email address is required.";
        isValid = false;
    } else if (!emailPattern.test(emailValue)) {
        emailError.textContent = "⚠️ Please use a correct email structure (e.g., name@domain.com).";
        isValid = false;
    }

    // Prevent submission to server if form rules fail
    if (!isValid) {
        event.preventDefault();
    } else {
        // Form is safe! Save the name data to keep across reloads
        userSessionData.savedName = nameInput.value.trim();
        localStorage.setItem("savedUserName", userSessionData.savedName);
        alert("✨ Success! Your request details are processed locally.");
    }
}

// --- FEATURE 3: BROWSER DATA STORAGE (localStorage) ---
function saveToBrowserStorage() {
    localStorage.setItem("savedWishlistOption", userSessionData.selectedClass);
}

function loadStoredData() {
    // 1. Retrieve and restore saved checklist choices
    const storedOption = localStorage.getItem("savedWishlistOption");
    if (storedOption) {
        userSessionData.selectedClass = storedOption;
        
        // Match the dropdown menu selection to our saved data
        const classDropdown = document.getElementById("interest");
        if (classDropdown) {
            classDropdown.value = storedOption;
        }
        
        // Refresh the text on the screen
        renderTrackerUI();
    }

    // 2. Pre-fill name input field if it exists in storage
    const savedName = localStorage.getItem("savedUserName");
    const nameInput = document.getElementById("fullName");
    if (savedName && nameInput) {
        userSessionData.savedName = savedName;
        nameInput.value = savedName;
    }
}
