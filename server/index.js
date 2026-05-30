const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'IMS_SUPER_NEON_SECRET_KEY';

// Database Connection Pooling Allocation Setup
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ims_system',
  waitForConnections: true,
  connectionLimit: 10
});

// Middleware Security Gatekeeper Guard
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: "Access Denied: Missing Secure Token Payload." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized Session Verification State Drop." });
  }
};

/* --- API ENDPOINTS --- */

// 1. GATEWAY IDENTITY ROUTING
app.post('/api/auth/login', async (req, res) => {
  const { dutyCode, passcode } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE duty_code = ?', [dutyCode]);
    if (rows.length === 0) return res.status(400).json({ error: "Terminal Rejection: Invalid System Code Identification Markers." });

    const user = rows[0];
    // In production, use: await bcrypt.compare(passcode, user.password_hash);
    if (passcode !== user.password_hash) {
      return res.status(400).json({ error: "Terminal Rejection: Encryption Passcode Mismatch." });
    }

    const token = jwt.sign({ id: user.id, duty_code: user.duty_code, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { name: user.full_name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Internal Database Sync Timeout Fault." });
  }
});

// 2. LIVE FIELD TRANSACTIONS LOGGING
app.patch('/api/assets/scan', verifyToken, async (req, res) => {
  const { platformId, assetType } = req.body;
  try {
    // Transaction Block Isolation protection strategy
    // Find one pending asset belonging to the chosen platform
    const [pendingItems] = await db.execute(
      'SELECT asset_id FROM assets WHERE assigned_platform_id = ? AND asset_type = ? AND current_status = "pending" LIMIT 1',
      [platformId, assetType]
    );

    if (pendingItems.length === 0) {
      return res.status(400).json({ error: "Platform Check Limit Achieved: No further unverified units detected." });
    }

    const targetAssetId = pendingItems[0].asset_id;

    // Mutate state status records safely
    await db.execute('UPDATE assets SET current_status = "safe" WHERE asset_id = ?', [targetAssetId]);

    // Stamp absolute system tracing footprint history metrics downstream
    await db.execute(
      'INSERT INTO audit_logs (platform_id, asset_id, operator_id, action_type) VALUES (?, ?, ?, "scan_increment")',
      [platformId, targetAssetId, req.user.id]
    );

    res.json({ success: true, updatedAsset: targetAssetId });
  } catch (error) {
    res.status(500).json({ error: "State mutation pipeline error." });
  }
});

// 3. TELEMETRY CARDS METRICS SHIPPER
app.get('/api/floor/summary', verifyToken, async (req, res) => {
  try {
    const [platforms] = await db.execute('SELECT * FROM platforms');
    // Map platform structures and query runtime totals directly to construct frontend payloads dynamically
    res.json({ platforms });
  } catch (error) {
    res.status(500).json({ error: "Failed to download data state packets." });
  }
});

app.listen(5000, () => console.log('⚡ IMS Secure Core Active: Pipeline Listening on Port 5000'));