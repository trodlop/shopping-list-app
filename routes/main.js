import express from "express";
const router = express.Router();

import { website_url } from '../server.js';

// Route to render the main page
router.get("/main", (req, res) => {
    res.render("main", { website_url });
    // console.log(`\nAccessed ${website_url}/main\n\t${new Date()}`);
});
export default router;