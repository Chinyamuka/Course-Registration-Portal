// Base URL of our Express API
const API_BASE_URL = "http://localhost:3000/api";


// --------------------------------------------------
// Load courses from the API
// --------------------------------------------------

async function loadCourses() {
    const courseSelect = document.getElementById("course");

    try {
        const response = await fetch(`${API_BASE_URL}/courses`);

        if (!response.ok) {
            throw new Error("Failed to load courses");
        }

        const courses = await response.json();

        // Clear the loading option
        courseSelect.innerHTML = "";

        // Add the default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select a course";
        defaultOption.disabled = true;
        defaultOption.selected = true;

        courseSelect.appendChild(defaultOption);

        // Add courses received from the API
        courses.forEach((course) => {
            const option = document.createElement("option");

            option.value = course.code;
            option.textContent = `${course.code} - ${course.name}`;

            courseSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading courses:", error);

        courseSelect.innerHTML =
            '<option value="">Unable to load courses</option>';
    }
}


// --------------------------------------------------
// Submit registration
// --------------------------------------------------

async function submitRegistration(event) {
    event.preventDefault();

    const message = document.getElementById("message");
    message.hidden = false;

    const registrationData = {
        name: document.getElementById("name").value.trim(),
        studentId: document.getElementById("studentId").value.trim(),
        programme: document.getElementById("programme").value.trim(),
        course: document.getElementById("course").value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(registrationData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Registration failed");
        }

        message.textContent =
            `Registration successful! Registration ID: ${result.id}`;

        document.getElementById("registrationForm").reset();

        // Reload the courses so the default option appears again.
        loadCourses();

    } catch (error) {
        console.error("Registration error:", error);

        message.textContent = error.message;
    }
}


// --------------------------------------------------
// Find registration by ID
// --------------------------------------------------

async function findRegistration(event) {
    event.preventDefault();

    const registrationId =
        document.getElementById("registrationId").value;

    const resultContainer =
        document.getElementById("registrationResult");
        resultContainer.hidden = false;

    try {
        const response = await fetch(
            `${API_BASE_URL}/registrations/${registrationId}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Registration not found");
        }

        resultContainer.innerHTML = `
            <h3>Registration Found</h3>
            <p><strong>ID:</strong> ${result.id}</p>
            <p><strong>Name:</strong> ${result.name}</p>
            <p><strong>Student ID:</strong> ${result.studentId}</p>
            <p><strong>Programme:</strong> ${result.programme}</p>
            <p><strong>Course:</strong> ${result.course}</p>
        `;

    } catch (error) {
        console.error("Lookup error:", error);

        resultContainer.textContent = error.message;
    }
}


// --------------------------------------------------
// Event listeners
// --------------------------------------------------

document
    .getElementById("registrationForm")
    .addEventListener("submit", submitRegistration);

document
    .getElementById("lookupForm")
    .addEventListener("submit", findRegistration);


// --------------------------------------------------
// Load courses when the page opens
// --------------------------------------------------

loadCourses();