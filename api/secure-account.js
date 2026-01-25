// api/secure-account.js
import { adminAuth } from '../lib/firebase-admin';

export default async function handler(req, res) {
    const { uid } = req.query;

    if (!uid || uid === 'user') {
        return res.status(400).send("Security Error: User ID not verified.");
    }

    try {
        // 1. Force Logout: Sare devices se session uda do
        await adminAuth.revokeRefreshTokens(uid);
        
        // 2. Security UI dikhao
        res.setHeader('Content-Type', 'text/html');
        return res.send(`
            <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0d1117; color: white;">
                <div style="background: #161b22; padding: 40px; border-radius: 20px; border: 1px solid #ea4335; display: inline-block;">
                    <h1 style="color: #ea4335;">🛡️ Account Secured!</h1>
                    <p>Bhai Ayush, humne is request ko block kar diya hai aur <b>sare active sessions se logout</b> kar diya hai.</p>
                    <p style="color: #8b949e;">Ab koi bhi purana session ya ye OTP kaam nahi karega.</p>
                    <br>
                    <a href="https://ayus.fun" style="background: #238636; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Back to Safety</a>
                </div>
            </body>
        `);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }
}
