export default async function handler(req, res) {
    // 1. Resend API Key उठाना
    const resendKey = process.env.RESEND_API_KEY;

    if (req.method === 'POST') {
        try {
            const { to, html, uid } = req.body;

            // 2. IP और Time का पता लगाना (Indian Time)
            const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
            const requestTime = new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                hour12: true,
                dateStyle: 'medium',
                timeStyle: 'short'
            });

            // 3. User Agent से असली मोबाइल का नाम निकालना (Fixed Logic)
            const userAgent = req.headers['user-agent'] || '';
            let deviceDetail = "Unknown Device";
            
            if (userAgent.includes('Android')) {
                // Android का नाम ढूँढने का स्मार्ट तरीका
                const match = userAgent.match(/;\s([^;]+)\sBuild/);
                if (match && match[1]) {
                    deviceDetail = match[1].trim(); // जैसे: Redmi 6A
                } else {
                    deviceDetail = "Android Phone";
                }
            } else if (userAgent.includes('iPhone')) {
                deviceDetail = "iPhone";
            } else if (userAgent.includes('Windows')) {
                deviceDetail = "Windows PC";
            }

            // 4. OTP और Links तैयार करना
            const otpMatch = html ? html.match(/\d{6}/) : null;
            const otpCode = otpMatch ? otpMatch[0] : '------';
            
            // यह लिंक मैप खोलेगा
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${userIp}`;
            // यह लिंक हैकर को लॉगआउट करेगा
            const secureLink = `https://ayus.fun/api/secure-account?uid=${uid || 'user'}`;

            // 5. Meta Style सुंदर ईमेल टेम्पलेट (White & Blue)
            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; }
                    .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
                    .header { background: #1877f2; padding: 20px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
                    .content { padding: 30px 20px; text-align: center; color: #1c1e21; }
                    .otp-box { background: #e7f3ff; border: 1px dashed #1877f2; padding: 15px; border-radius: 6px; margin: 20px 0; }
                    .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1877f2; margin: 0; }
                    .details { text-align: left; background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 14px; line-height: 1.6; margin-bottom: 25px; border-left: 4px solid #1877f2; }
                    .details b { color: #444; }
                    .btn-secure { display: block; width: 100%; background: #ea4335; color: white; padding: 14px 0; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 10px; }
                    .footer { text-align: center; font-size: 12px; color: #65676b; margin-top: 20px; padding-bottom: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>BaseKey Security</h1>
                    </div>
                    
                    <div class="content">
                        <p style="font-size: 16px; margin-bottom: 10px;">Login verification code</p>
                        
                        <div class="otp-box">
                            <p class="otp-code">${otpCode}</p>
                        </div>

                        <p style="color: #65676b; font-size: 14px; margin-bottom: 20px;">Use this code to verify your login.</p>

                        <div class="details">
                            <b>📱 Device:</b> ${deviceDetail}<br>
                            <b>📍 Location:</b> <a href="${mapUrl}" style="color: #1877f2; text-decoration: none;">View on Map</a><br>
                            <b>⏰ Time:</b> ${requestTime}<br>
                            <b>🌐 IP:</b> ${userIp}
                        </div>

                        <p style="font-size: 13px; color: #65676b; margin-bottom: 10px;">Did not request this code?</p>
                        <a href="${secureLink}" class="btn-secure">No, It wasn't me</a>
                    </div>

                    <div class="footer">
                        From Meta Security • BaseKey Inc.<br>
                        Narhan, Bihar
                    </div>
                </div>
            </body>
            </html>
            `;

            // Resend API को मेल भेजने का आदेश
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${resendKey}` 
                },
                body: JSON.stringify({ 
                    from: 'BaseKey <admin@ayus.fun>', 
                    to: to || ['ayushrajayushhh@gmail.com'], 
                    subject: `${otpCode} is your verification code`, 
                    html: emailHtml 
                })
            });

            return res.status(200).json({ success: true });
        } catch (e) { 
            return res.status(500).json({ error: e.message }); 
        }
    }
}
