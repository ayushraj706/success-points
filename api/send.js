export default async function handler(req, res) {
    const resendKey = process.env.RESEND_API_KEY;

    if (req.method === 'POST') {
        try {
            const { to, html, uid } = req.body;

            // --- 1. Data Collection ---
            const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '152.59.145.116';
            const requestTime = new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' 
            });

            // Device Name Extraction
            const userAgent = req.headers['user-agent'] || '';
            let deviceDetail = "Unknown Device";
            if (userAgent.includes('Android')) {
                const match = userAgent.match(/;\s([^;]+)\sBuild/);
                deviceDetail = match && match[1] ? match[1].trim() : "Android Phone";
            } else if (userAgent.includes('iPhone')) deviceDetail = "iPhone";
            else if (userAgent.includes('Windows')) deviceDetail = "Windows PC";

            const otpMatch = html ? html.match(/\d{6}/) : null;
            const otpCode = otpMatch ? otpMatch[0] : '------';
            
            // Links
            const mapUrl = `https://www.google.com/maps?q=${userIp}`;
            const secureLink = `https://ayus.fun/api/secure-account?uid=${uid || 'user'}`;

            // --- 2. Professional Template with Animation (GIF) ---
            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f4f8; }
                    .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
                    
                    /* Header में अब Animation आएगा */
                    .header { background: #ffffff; padding: 30px 20px 10px; text-align: center; border-bottom: 3px solid #1a73e8; }
                    .anim-container { width: 120px; height: 120px; margin: 0 auto 15px; }
                    .anim-img { width: 100%; height: auto; display: block; }
                    
                    .header h1 { color: #1a73e8; margin: 0; font-size: 26px; font-weight: 700; }
                    .content { padding: 30px 30px; color: #333333; }
                    .otp-section { text-align: center; margin: 25px 0; padding: 20px; background: #f0f7ff; border: 2px dashed #1a73e8; border-radius: 12px; }
                    .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #1a73e8; margin: 0; }
                    
                    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px; background: #f8f9fa; border-radius: 8px; overflow: hidden; }
                    .info-table td { padding: 15px; border-bottom: 1px solid #eeeeee; }
                    .info-label { color: #5f6368; font-weight: 600; width: 130px; display: flex; align-items: center; }
                    .info-value { color: #202124; font-weight: 500; }
                    
                    .warning-box { background-color: #fff5f4; border: 1px solid #f5c6cb; padding: 20px; margin-top: 30px; border-radius: 8px; text-align: center; }
                    .btn-danger { display: inline-block; background-color: #d93025; color: #ffffff; text-align: center; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; margin-top: 15px; box-shadow: 0 4px 6px rgba(217, 48, 37, 0.2); }
                    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #5f6368; border-top: 1px solid #eeeeee; }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <div class="header">
                        <div class="anim-container">
                            <img src="https://cdn.dribbble.com/users/1133892/screenshots/13986883/media/867c93883685448f7282054e4a14675c.gif" alt="Security Scan Animation" class="anim-img">
                        </div>
                        <h1>Security Verification</h1>
                    </div>

                    <div class="content">
                        <p style="margin-top: 0; font-size: 16px; text-align: center; color: #5f6368;">Please use the code below to verify your login attempt.</p>

                        <div class="otp-section">
                            <div class="otp-code">${otpCode}</div>
                        </div>

                        <table class="info-table">
                            <tr>
                                <td class="info-label">📱 Device</td>
                                <td class="info-value">${deviceDetail}</td>
                            </tr>
                            <tr>
                                <td class="info-label">📍 Location</td>
                                <td class="info-value"><a href="${mapUrl}" style="color: #1a73e8; text-decoration: none; font-weight: 600;">View on Map →</a></td>
                            </tr>
                            <tr>
                                <td class="info-label">⏰ Time</td>
                                <td class="info-value">${requestTime}</td>
                            </tr>
                            <tr>
                                <td class="info-label">🌐 IP Address</td>
                                <td class="info-value">${userIp}</td>
                            </tr>
                        </table>

                        <div class="warning-box">
                            <strong style="color: #c5221f; font-size: 18px; display: block; margin-bottom: 10px;">Not you?</strong>
                            <p style="margin: 0 0 15px; font-size: 14px; color: #5f6368;">If you didn't request this code, secure your account immediately.</p>
                            <a href="${secureLink}" class="btn-danger">No, Secure My Account</a>
                        </div>
                    </div>

                    <div class="footer">
                        <p style="margin: 0;">Sent securely by <strong>BaseKey Systems</strong></p>
                        <p style="margin: 5px 0 0;">Narhan, Bihar • <a href="#" style="color: #5f6368;">Terms & Privacy</a></p>
                    </div>
                </div>
            </body>
            </html>
            `;

            // --- 3. Send Email ---
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendKey}` },
                body: JSON.stringify({ 
                    from: 'BaseKey Security <admin@ayus.fun>', 
                    to: to || ['ayushrajayushhh@gmail.com'], 
                    subject: `🔔 Action Required: Your ${otpCode} Verification Code`, 
                    html: emailHtml 
                })
            });

            return res.status(200).json({ success: true });
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }
}
