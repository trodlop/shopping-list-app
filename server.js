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
// app.use((req, res, next) => {
//     res.on('finish', function() {
//     console.log(`Response Status: ${res.statusCode} for ${req.method} ${req.originalUrl}`); // Optional for debugging
//     });
//     next();
// });

// Body-parsing middleware (fix for req.body being undefined)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import fs from "fs";

const path_to_data = path.join(__dirname, "public", "data.json");

// Write updated data to file
function update_data_json(data, res) {
    // Write to the file
    try {
        fs.writeFileSync(path_to_data, JSON.stringify(data, null, 4));
        res.send("Saved data");

    } catch (err) {
        console.error("Error updating data JSON file:", err);
        return res.status(500).send("Failed to save data");
    };
};
app.post("/write-data", (req, res) => {
    update_data_json(req.body, res)
});

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