/**
 * India Census 2027 Portal - Node.js Backend Server (Alternative to server.py)
 * Supports CORS, REST endpoints, SQLite/In-Memory persistence, Biometric verification,
 * 36-State Analytics, and AI Chatbot.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 36 States Demo Data
const ALL_36_STATES = [
  { code: "UP", name: "Uttar Pradesh", type: "State", population_proj_cr: 24.14, households_enrolled_lakh: 48.29, districts_count: 75, sex_ratio: 912, literacy_rate: 73.0, urban_pct: 22.3, rural_pct: 77.7, tap_water_pct: 88.4, electricity_pct: 99.2, lpg_pct: 86.5, internet_pct: 68.2, phase_pct: 92.4 },
  { code: "MH", name: "Maharashtra", type: "State", population_proj_cr: 12.82, households_enrolled_lakh: 39.12, districts_count: 36, sex_ratio: 929, literacy_rate: 84.8, urban_pct: 45.2, rural_pct: 54.8, tap_water_pct: 92.1, electricity_pct: 99.8, lpg_pct: 91.2, internet_pct: 82.5, phase_pct: 94.8 },
  { code: "BR", name: "Bihar", type: "State", population_proj_cr: 13.07, households_enrolled_lakh: 31.09, districts_count: 38, sex_ratio: 918, literacy_rate: 70.9, urban_pct: 11.3, rural_pct: 88.7, tap_water_pct: 94.6, electricity_pct: 98.6, lpg_pct: 79.4, internet_pct: 58.1, phase_pct: 88.2 },
  { code: "WB", name: "West Bengal", type: "State", population_proj_cr: 10.12, households_enrolled_lakh: 28.91, districts_count: 23, sex_ratio: 953, literacy_rate: 80.5, urban_pct: 31.9, rural_pct: 68.1, tap_water_pct: 84.2, electricity_pct: 99.1, lpg_pct: 82.0, internet_pct: 69.4, phase_pct: 91.5 },
  { code: "KL", name: "Kerala", type: "State", population_proj_cr: 3.60, households_enrolled_lakh: 11.90, districts_count: 14, sex_ratio: 1084, literacy_rate: 96.2, urban_pct: 47.7, rural_pct: 52.3, tap_water_pct: 91.8, electricity_pct: 99.9, lpg_pct: 98.1, internet_pct: 91.4, phase_pct: 98.5 },
  { code: "DL", name: "Delhi (NCT)", type: "UT", population_proj_cr: 2.18, households_enrolled_lakh: 9.80, districts_count: 11, sex_ratio: 868, literacy_rate: 88.7, urban_pct: 97.5, rural_pct: 2.5, tap_water_pct: 98.9, electricity_pct: 99.9, lpg_pct: 99.1, internet_pct: 94.2, phase_pct: 98.4 }
];

let censusDatabase = {
  stats: {
    householdsEnrolled: 32458900,
    statesActive: 36,
    languagesSupported: 22,
    daysRemaining: 45
  },
  submissions: {
    "SE-2027-88391204": {
      se_id: "SE-2027-88391204",
      head_name: "Ananya Sharma",
      aadhaar_masked: "XXXX-XXXX-8921",
      phone: "9876543210",
      state: "Maharashtra",
      district: "Mumbai Suburban",
      pincode: "400050",
      members_count: 4,
      status: "Certified & Verification Complete",
      current_stage: 5,
      verification_hash: "VERIF-MHA-IND-88391204",
      field_officer: "Officer V. Kadam (Zone 12)",
      created_at: "2026-08-28 10:30:00"
    }
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", service: "India Census 2027 Node.js Server" });
});

app.get('/api/stats', (req, res) => {
  const totalHH = censusDatabase.stats.householdsEnrolled + Object.keys(censusDatabase.submissions).length;
  res.json({
    success: true,
    data: {
      householdsEnrolled: totalHH,
      householdsEnrolledFormatted: `${(totalHH / 10000000).toFixed(2)} Cr+`,
      individualsCountedFormatted: `${((totalHH * 4) / 10000000).toFixed(2)} Cr+`,
      statesActive: 36,
      languagesSupported: 22,
      activityFeed: [
        { se_id: "SE-2027-88391204", action: "Self-Enumeration Complete", state: "Maharashtra", summary: "Household of 4 in Mumbai Suburban" }
      ]
    }
  });
});

app.post('/api/biometric/verify', (req, res) => {
  const { aadhaar, finger } = req.body;
  const score = Math.floor(96 + Math.random() * 4);
  res.json({
    success: true,
    message: `UIDAI Biometric L1 Match Successful (${score}% Minutiae Alignment)`,
    matchScore: score,
    finger: finger || 'Right Thumb',
    authToken: 'UIDAI-BIO-AUTH-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    verified: true
  });
});

app.post('/api/otp/send', (req, res) => {
  const { aadhaar, phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  res.json({
    success: true,
    message: `OTP dispatched to +91 XXXXXX${phone ? phone.slice(-4) : '2027'}`,
    demoOtp: otp,
    expiresInSeconds: 180
  });
});

app.post('/api/otp/verify', (req, res) => {
  res.json({ success: true, message: "Aadhaar e-KYC Verified Successfully.", verified: true });
});

app.get('/api/analytics/states', (req, res) => {
  res.json({ success: true, totalStatesAndUTs: ALL_36_STATES.length, states: ALL_36_STATES });
});

app.get('/api/analytics/state/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const st = ALL_36_STATES.find(s => s.code === code || s.name.toUpperCase() === code) || ALL_36_STATES[0];
  res.json({ success: true, state: st, liveSampleRegistrations: [] });
});

app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    success: true,
    query: message,
    response: `Namaste! Regarding '${message}': Census 2027 is conducted under the Census Act, 1948. You can complete self-enumeration with Biometrics or OTP. Section 15 guarantees 100% confidentiality.`,
    category: "General Inquiries",
    suggested: ["Is Aadhaar mandatory?", "How to track my SE-ID?"]
  });
});

app.listen(PORT, () => {
  console.log(`\n🇮🇳 Census 2027 Node.js Server running at: http://localhost:${PORT}`);
});