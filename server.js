const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
const path = require('path');

const app = express();
const port = 3000;

// Configure CORS options
const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5501', 
        'http://localhost:5501'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

// Middleware
app.use(cors(corsOptions)); 
app.use(express.json()); 

// 🔥 FINAL FIX: Define the static path ONCE. Express will now default to looking for index.html.
const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath)); 
// -------------------------------------------------------------------------------------

// Ensure you DELETE the manual app.get('/', ...) block if it still exists later in the file!

// --- CRITICAL: DATABASE CONNECTION DETAILS (Customize This!) ---
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root', // Check this
    password: 'root', // Check this
    database: 'pawsitive_match' 
});

// Test the database connection
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Backend connected to MySQL database!');
});

// ==========================================================
// API ENDPOINT: GET User Details by ID (for form pre-population)
// ==========================================================
app.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    // Check both 'users' and 'admins' tables
    const userSql = 'SELECT user_id AS id, name, email FROM users WHERE user_id = ?';
    const adminSql = 'SELECT admin_id AS id, name, email FROM admins WHERE admin_id = ?';

    db.query(userSql, [userId], (err, results) => {
        if (err || results.length === 0) {
            // Check admin table if not found in users
            db.query(adminSql, [userId], (err, adminResults) => {
                if (err || adminResults.length === 0) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                res.json(adminResults[0]);
            });
        } else {
            res.json(results[0]);
        }
    });
});


// ==========================================================
// API ENDPOINTS (Client and Authentication)
// ==========================================================

// ==========================================================
// API ENDPOINT 1: READ Pets with Filters (GET Request)
// ==========================================================
app.get('/api/pets', (req, res) => {
    // Extract filter parameters from the query string (e.g., ?species=Dog&age=Young)
    const { species, age } = req.query;

    let sql = 'SELECT id, name, species, breed, age_years, description, image_url FROM pets WHERE 1=1';
    let values = [];

    // Filter by Species
    if (species && species !== 'All Species') {
        sql += ' AND species = ?';
        values.push(species);
    }

    // Filter by Age (This requires checking the age_years column)
    if (age && age !== 'All Ages') {
        // Define age ranges based on common shelter categories
        if (age === 'Puppy/Kitten') {
            sql += ' AND age_years < ?'; // Assuming < 1 year for puppy/kitten
            values.push(1);
        } else if (age === 'Young') {
            sql += ' AND age_years BETWEEN ? AND ?'; // 1 to 3 years
            values.push(1, 3);
        } else if (age === 'Adult') {
            sql += ' AND age_years BETWEEN ? AND ?'; // 3 to 7 years
            values.push(3, 7);
        } else if (age === 'Senior') {
            sql += ' AND age_years >= ?'; // 7 years and older
            values.push(7);
        }
    }
    
    // Finalize the SQL query (optional: order by name)
    sql += ' ORDER BY name ASC';

    db.query(sql, values, (err, results) => {
        if (err) { 
            console.error('Error fetching pets with filters:', err);
            return res.status(500).json({ error: 'Failed to fetch pets.' }); 
        }
        res.json(results);
    });
});

// POST /api/adoption-request - Saves new request from user
app.post('/api/adoption-request', (req, res) => {
    const { fullName, email, phone, petId, address, reason, user_id } = req.body;
    if (!fullName || !email || !petId || !reason || !user_id) { 
        return res.status(400).json({ message: 'Missing required fields (User ID, Pet ID, Full Name, Reason, Email).' });
    }
    const sql = `INSERT INTO adoption_requests (full_name, email, phone, pet_id, address, reason, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [fullName, email, phone, petId, address, reason, user_id];
    db.query(sql, values, (err, result) => {
        if (err) { console.error(err); return res.status(500).json({ message: 'Failed to submit request.' }); }
        res.status(201).json({ message: 'Adoption request submitted successfully!' });
    });
});

// POST /api/register - Registers a new user
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    const values = [name, email, password]; 
    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') { return res.status(409).json({ message: 'Email already registered.' }); }
            console.error(err); return res.status(500).json({ message: 'Registration failed.' });
        }
        res.status(201).json({ message: 'User registered successfully!', user: { name: name, id: result.insertId, role: 'user' } });
    });
});

// POST /api/login - Regular customer login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT user_id, name, email, password FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) { return res.status(500).json({ message: 'Server error during login.' }); }
        if (results.length === 0 || results[0].password !== password) { return res.status(401).json({ message: 'Invalid email or password.' }); }
        res.status(200).json({ message: 'Login successful!', user: { name: results[0].name, id: results[0].user_id, role: 'user' } });
    });
});

// POST /api/admin-login - Admin/Shelter login
app.post('/api/admin-login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT admin_id, name, email, password, shelter_name FROM admins WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) { return res.status(500).json({ message: 'Server error during admin login.' }); }
        if (results.length === 0 || results[0].password !== password) { return res.status(401).json({ message: 'Access Denied: Invalid credentials.' }); }
        res.status(200).json({ message: 'Admin login successful!', user: { name: results[0].name, id: results[0].admin_id, role: 'admin', shelter: results[0].shelter_name } });
    });
});

// ==========================================================
// API ENDPOINTS (Shelter Management)
// ==========================================================
// GET /api/shelter/requests - Fetches all pending requests
app.get('/api/shelter/requests', (req, res) => {
    const sql = `SELECT ar.request_id, ar.full_name, ar.email, ar.phone, ar.reason, p.name AS pet_name, p.breed, ar.request_date FROM adoption_requests ar JOIN pets p ON ar.pet_id = p.id WHERE ar.status = 'Pending' ORDER BY ar.request_date ASC;`;
    db.query(sql, (err, results) => {
        if (err) { console.error('Error fetching shelter requests:', err); return res.status(500).json({ message: 'Failed to fetch pending requests.' }); }
        res.json(results);
    });
});

// PUT /api/shelter/requests/:requestId - Updates request status
app.put('/api/shelter/requests/:requestId', (req, res) => {
    const requestId = req.params.requestId;
    const { status } = req.body; 
    if (!['Approved', 'Rejected'].includes(status)) { return res.status(400).json({ message: 'Invalid status provided.' }); }
    const sql = `UPDATE adoption_requests SET status = ?, update_date = CURRENT_TIMESTAMP WHERE request_id = ?`;
    db.query(sql, [status, requestId], (err, result) => {
        if (err) { console.error('Error updating request status:', err); return res.status(500).json({ message: 'Failed to update request status.' }); }
        res.status(200).json({ message: `Request ${requestId} status updated to ${status}.` });
    });
});

// POST /api/shelter/pets - Adds new pet to the database
app.post('/api/shelter/pets', (req, res) => {
    const { name, species, breed, age_years, description, image_url, shelter_user_id } = req.body;
    if (!name || !species || !breed || !shelter_user_id) { return res.status(400).json({ message: 'Missing required pet details.' }); }
    const sql = `INSERT INTO pets (name, species, breed, age_years, description, image_url, shelter_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, species, breed, age_years, description, image_url, shelter_user_id];
    db.query(sql, values, (err, result) => {
        if (err) { console.error('Error adding pet:', err); return res.status(500).json({ message: 'Failed to add pet to database.' }); }
        res.status(201).json({ message: `New pet ${name} added successfully!`, petId: result.insertId });
    });
});


// --- Start Server ---
app.listen(port, () => {
    console.log(`Backend API running at http://localhost:${port}`);
});