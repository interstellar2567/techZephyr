const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./profiles.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Create profiles table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            skills TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Profiles table ready.');
            }
        });
    }
});

// API endpoint to save profile data
app.post('/api/profile', (req, res) => {
    const { name, email, phone, skills } = req.body;

    // Validate input
    if (!name || !email || !phone || !skills) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if profile with this email already exists
    const checkSql = 'SELECT id FROM profiles WHERE email = ?';
    db.get(checkSql, [email], (err, row) => {
        if (err) {
            console.error('Error checking existing profile:', err.message);
            return res.status(500).json({ error: 'Failed to save profile data' });
        }

        if (row) {
            // Update existing profile
            const updateSql = 'UPDATE profiles SET name = ?, phone = ?, skills = ? WHERE email = ?';
            db.run(updateSql, [name, phone, skills, email], function(err) {
                if (err) {
                    console.error('Error updating data:', err.message);
                    return res.status(500).json({ error: 'Failed to update profile data' });
                }
                console.log(`Profile updated for email: ${email}`);
                res.status(200).json({ message: 'Profile updated successfully', id: row.id });
            });
        } else {
            // Insert new profile
            const insertSql = 'INSERT INTO profiles (name, email, phone, skills) VALUES (?, ?, ?, ?)';
            db.run(insertSql, [name, email, phone, skills], function(err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return res.status(500).json({ error: 'Failed to save profile data' });
                }
                console.log(`Profile saved with ID: ${this.lastID}`);
                res.status(201).json({ message: 'Profile saved successfully', id: this.lastID });
            });
        }
    });
});

// API endpoint to get profile data
app.get('/api/profile/:email', (req, res) => {
    const email = req.params.email;
    const sql = 'SELECT name, email, phone, skills FROM profiles WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        if (err) {
            console.error('Error fetching profile:', err.message);
            return res.status(500).json({ error: 'Failed to fetch profile data' });
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
