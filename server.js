const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())

// In-memory course data
const courses = [
    {
        code: "ICT461",
        name: "Web Standards and HTTP Fundamentals"
    },
    {
        code: "ICT462",
        name: "Database Systems"
    },
    {
        code: "ICT463",
        name: "Software Engineering"
    }
];

// In-memory registration records
const registrations = [];

// --------------------------------------------------
// GET /api/courses
// --------------------------------------------------
app.get("/api/courses", (req, res) => {
    res.status(200).json(courses);
});

// --------------------------------------------------
// GET /api/registrations/:id
// --------------------------------------------------

app.get("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const registration = registrations.find(
        (record) => record.id === id
    );

    if (!registration) {
        return res.status(404).json({
            error: "Registration not found"
        });
    }

    res.status(200).json(registration);
});

// --------------------------------------------------
// POST /api/registrations
// --------------------------------------------------

app.post("/api/registrations", (req, res) => {
    const {
        name,
        studentId,
        programme,
        course
    } = req.body;
    // Basic server-side validation
    if (!name || !studentId || !programme || !course) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    // Check whether the selected course exists
    const selectedCourse = courses.find(
        (item) => item.code === course
    );

    if (!selectedCourse) {
        return res.status(400).json({
            error: "Invalid course"
        });
    }

    // Reject duplicate student + course combination
    const duplicate = registrations.find(
        (record) =>
            record.studentId === studentId &&
            record.course === course
    );

    if (duplicate) {
        return res.status(409).json({
            error: "This student is already registered for this course"
        });
    }

    const registration = {
        id: registrations.length + 1,
        name,
        studentId,
        programme,
        course
    };

    registrations.push(registration);

    res
        .status(201)
        .location(`/api/registrations/${registration.id}`)
        .json(registration);
});

// --------------------------------------------------
// PUT /api/registrations/:id
// Replace an entire registration.
// --------------------------------------------------

app.put("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const registration = registrations.find(
        (record) => record.id === id
    );

    // Registration does not exist.
    if (!registration) {
        return res.status(404).json({
            error: "Registration not found"
        });
    }

    const {
        name,
        studentId,
        programme,
        course
    } = req.body;

    // PUT requires the complete resource.
    if (!name || !studentId || !programme || !course) {
        return res.status(400).json({
            error: "All fields are required for PUT"
        });
    }

    // Make sure the course exists.
    const selectedCourse = courses.find(
        (item) => item.code === course
    );

    if (!selectedCourse) {
        return res.status(400).json({
            error: "Invalid course"
        });
    }

    // Replace the existing registration.
    registration.name = name;
    registration.studentId = studentId;
    registration.programme = programme;
    registration.course = course;

    res.status(200).json(registration);
});


// --------------------------------------------------
// PATCH /api/registrations/:id
// Partially update a registration.
// --------------------------------------------------

app.patch("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const registration = registrations.find(
        (record) => record.id === id
    );

    if (!registration) {
        return res.status(404).json({
            error: "Registration not found"
        });
    }

    const {
        name,
        studentId,
        programme,
        course
    } = req.body;

    // Only update fields that were supplied.
    if (name !== undefined) {
        registration.name = name;
    }

    if (studentId !== undefined) {
        registration.studentId = studentId;
    }

    if (programme !== undefined) {
        registration.programme = programme;
    }

    if (course !== undefined) {

        const selectedCourse = courses.find(
            (item) => item.code === course
        );

        if (!selectedCourse) {
            return res.status(400).json({
                error: "Invalid course"
            });
        }

        registration.course = course;
    }

    res.status(200).json(registration);
});


// --------------------------------------------------
// DELETE /api/registrations/:id
// Delete a registration.
// --------------------------------------------------

app.delete("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = registrations.findIndex(
        (record) => record.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Registration not found"
        });
    }

    registrations.splice(index, 1);

    res.status(204).send();
});

// --------------------------------------------------
// GET /inspect
// Diagnostic endpoint for examining HTTP requests.
// --------------------------------------------------

app.get("/inspect", (req, res) => {
    res.status(200).json({
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        query: req.query,
        body: req.body
    });
});


// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
});