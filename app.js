require('dotenv').config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

// Import API and Page Routers
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aiRoutes = require("./routes/aiRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const emergencyService = require("./services/emergencyService");
const { attachSessionUser, requireAuth, redirectIfLoggedIn } = require("./middleware/sessionMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine & static middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Request body & cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Attach session user to all requests
app.use(attachSessionUser);

// =========================================================
// API ENDPOINTS (Dual-Data Mode Architecture)
// =========================================================
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/appointments", appointmentRoutes);

// =========================================================
// DASHBOARD & AUTHENTICATED PAGE ROUTES
// =========================================================
app.use("/profile", profileRoutes);
app.use("/dashboard", requireAuth, dashboardRoutes);

app.get("/hospitals", requireAuth, (req, res) => {
    res.redirect("/dashboard/patient#hospitals-section");
});

app.get("/doctors", requireAuth, (req, res) => {
    res.redirect("/dashboard/patient#doctors-section");
});

app.get("/appointments", requireAuth, (req, res) => {
    res.redirect("/dashboard/patient#appointments-section");
});

app.get("/emergency", requireAuth, (req, res) => {
    res.redirect("/dashboard/patient#emergency-section");
});

app.get("/notifications", requireAuth, (req, res) => {
    res.redirect("/dashboard/patient#notifications-section");
});

app.get("/", (req, res) => {
    res.render("index", { 
        user: req.user || null, 
        currentUser: req.user || null,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
    });
});

app.get("/login", redirectIfLoggedIn, (req, res) => {
    res.render("login");
});

app.get("/signup", redirectIfLoggedIn, (req, res) => {
    res.render("signup");
});

app.get("/forgot-password", (req, res) => {
    res.render("forgot-password");
});

app.get("/reset-password", (req, res) => {
    res.render("reset-password");
});

app.get("/emergency-tracking/:id", requireAuth, async (req, res, next) => {
    try {
        const emergency = await emergencyService.getRequestById(req.params.id);
        res.render("emergency-tracking", { emergency: emergency || {} });
    } catch (err) {
        next(err);
    }
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`PulseX Health Platform running on http://localhost:${PORT} [DATA_MODE: ${process.env.DATA_MODE || 'dummy'}]`);
});

module.exports = app;