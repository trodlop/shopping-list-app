// server.js
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

// Setup environment variables and Square Payments SDK
import 'dotenv/config';

// Import different routes
import main_router from './routes/main.js';
import { log, time } from "console";

const app = express();
const PORT = process.env.PORT || 3000;

// export const website_url = `http://localhost:${PORT}`; (ONLY FOR TESTING!!!)
// export const website_url = process.env.NODE_ENV === "production"
//     ? "https://autoworx-test-1b3129537a3f.herokuapp.com"
//     : `http://localhost:${PORT}`;

export let website_url;

if (process.env.NODE_ENV === "production") {
  website_url = "https://autoworx-test-1b3129537a3f.herokuapp.com";
} else {
  website_url = `http://localhost:${PORT}`;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set trust proxy to true for Heroku or other reverse proxies
// This is important for getting the correct IP address of the user
app.set('trust proxy', true);

// Middleware to log user IPs
// app.use((req, res, next) => {
//     const ip = req.ip;
//     console.log(`User IP: ${ip}`);
//     next();
// });

// Middleware to log response status code after response is sent
app.use((req, res, next) => {
    res.on('finish', function() {
    console.log(`Response Status: ${res.statusCode} for ${req.method} ${req.originalUrl}`); // Optional for debugging
    });
    next();
});

// Body-parsing middleware (fix for req.body being undefined)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import fs from "fs";

const appointment_json_file_path = path.join(__dirname, 'public', 'data', 'appointment_booking.json');

//! IGNORE FOR NOW!
function update_appointment_json_file(date, time) {

    const all_timeslots = ["0900", "0930", "1000", "1030", "1100", "1130", "1200", "1230", "1300", "1330", "1400", "1430", "1500", "1530", "1600", "1630", "1700"];
    const formatted_time = time.replace(":", "");

    try {
        let appointment_data = {};

        // Load existing data if file exists
        if (fs.existsSync(appointment_json_file_path)) {
            const raw_data = fs.readFileSync(appointment_json_file_path);
            appointment_data = JSON.parse(raw_data);
        };

        // Add or update the slot for the date
        if (!appointment_data[date]) {
            appointment_data[date] = {
                availability: "available",
                slots: [formatted_time]
            };
        } else {
            if (!appointment_data[date].slots.includes(formatted_time)) {
                appointment_data[date].slots.push(formatted_time);
            };
        };

        // Check if selected date is now fully booked
        const bookedSlots = appointment_data[date].slots;
        const is_fully_booked = all_timeslots.every(slot => bookedSlots.includes(slot));

        appointment_data[date].availability = is_fully_booked ? "unavailable" : "available";

        // Write back to the file
        fs.writeFileSync(appointment_json_file_path, JSON.stringify(appointment_data, null, 4));
    } catch (err) {
        console.error("Error updating appointment JSON file:", err);
    };
};
//! IGNORE FOR NOW!

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory 
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => { // Redirect the root to /home
    res.redirect("/main");
});

app.use('/', main_router); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});