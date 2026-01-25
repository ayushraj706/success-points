export default async function handler(req, res) {
    const resendKey = process.env.RESEND_API_KEY;

    if (req.method === 'POST') {
        try {
            const { to, html, uid } = req.body;

            // --- 1. जासूसी (Details निकालना) ---
            const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '152.59.145.116';
            const requestTime = new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' 
            });

            // Device का असली नाम ढूँढना (Redmi / Vivo Fix)
            const userAgent = req.headers['user-agent'] || '';
            let deviceDetail = "Unknown Device";
            if (userAgent.includes('Android')) {
                const match = userAgent.match(/;\s([^;]+)\sBuild/);
                deviceDetail = match && match[1] ? match[1].trim() : "Android Phone";
            } else if (userAgent.includes('iPhone')) deviceDetail = "iPhone";
            else if (userAgent.includes('Windows')) deviceDetail = "Windows PC";

            // OTP निकालना
            const otpMatch = html ? html.match(/\d{6}/) : null;
            const otpCode = otpMatch ? otpMatch[0] : '------';
            
            // Links
            const mapUrl = `https://www.google.com/maps?q=${userIp}`;
            const secureLink = `https://ayus.fun/api/secure-account?uid=${uid || 'user'}`;

            // --- 2. Professional Design (PhonePe Animation) ---
            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f0f2f5; }
                    .container { max-width: 500px; margin: 20px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e1e4e8; }
                    
                    /* Header & Animation */
                    .header { background: #ffffff; padding: 30px 20px 10px; text-align: center; border-bottom: 4px solid #1877F2; }
                    .anim-box { width: 100px; height: 100px; margin: 0 auto 10px; }
                    .anim-img { width: 100%; height: 100%; object-fit: contain; }
                    .title { color: #1877F2; font-size: 24px; font-weight: 700; margin: 0; }
                    
                    /* Content */
                    .content { padding: 30px 25px; color: #333; }
                    .otp-box { background: #eff4fc; border: 1px dashed #1877F2; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
                    .otp-text { font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #1c1e21; margin: 0; }
                    
                    /* Details Table */
                    .info-table { width: 100%; font-size: 14px; margin-bottom: 25px; border-collapse: separate; border-spacing: 0 8px; }
                    .info-table td { padding: 8px 0; vertical-align: middle; }
                    .label { color: #65676b; font-weight: 600; width: 100px; }
                    .value { color: #050505; font-weight: 500; }
                    
                    /* Action Button */
                    .alert-box { background-color: #fff8f8; border: 1px solid #f9ced2; padding: 20px; border-radius: 8px; text-align: center; }
                    .btn-secure { display: inline-block; background-color: #ea4335; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; margin-top: 10px; }
                    
                    .footer { background: #f7f8fa; padding: 20px; text-align: center; font-size: 12px; color: #65676b; border-top: 1px solid #e1e4e8; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="anim-box">
                            <img src="https://media.giphy.com/media/l41lM8A5pBAH7U5ig/giphy.gif" alt="Security Check" class="anim-img">
                        </div>
                        <h1 class="title">Security Verification</h1>
                    </div>

                    <div class="content">
                        <p style="text-align: center; color: #65676b; margin-top: 0;">Use the code below to sign in to <strong>ayus.fun</strong></p>
                        
                        <div class="otp-box">
                            <div class="otp-text">${otpCode}</div>
                        </div>

                        <table class="info-table">
                            <tr>
                                <td class="label">📱 Device</td>
                                <td class="value">${deviceDetail}</td>
                            </tr>
                            <tr>
                                <td class="label">📍 Location</td>
                                <td class="value"><a href="${mapUrl}" style="color: #1877F2; text-decoration: none; font-weight: 600;">View on Map</a></td>
                            </tr>
                            <tr>
                                <td class="label">⏰ Time</td>
                                <td class="value">${requestTime}</td>
                            </tr>
                        </table>

                        <div class="alert-box">
                            <strong style="color: #d93025; display: block; margin-bottom: 5px;">Did not request this?</strong>
                            <p style="margin: 0 0 10px; font-size: 13px; color: #65676b;">Someone else might be trying to access your account.</p>
                            <a href="${secureLink}" class="btn-secure">No, Secure Account</a>
                        </div>
                    </div>

                    <div class="footer">
                        Secure System by <strong>BaseKey Inc.</strong><br>
                        Narhan, Samastipur, Bihar
                    </div>
                </div>
            </body>
            </html>
            `;

            // --- 3. Sending Email (Auto-Fill Subject) ---
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendKey}` },
                body: JSON.stringify({ 
                    from: 'BaseKey Security <admin@ayus.fun>', 
                    to: to || ['ayushrajayushhh@gmail.com'], 
                    // ⚠️ यह Subject लाइन सबसे ज़रूरी है Auto-Fill के लिए
                    subject: `${otpCode} is your verification code for ayus.fun`, 
                    html: emailHtml 
                })
            });

            return res.status(200).json({ success: true });
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }
}
