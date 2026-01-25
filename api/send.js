export default async function handler(req, res) {
    const resendKey = process.env.RESEND_API_KEY;

    if (req.method === 'POST') {
        try {
            const { to, subject, html, uid } = req.body;

            // 🌐 IP Address nikalna
            const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '152.59.145.88';
            
            // 📱 Deep Device Detection (Facebook Style)
            const userAgent = req.headers['user-agent'] || '';
            let deviceDetail = "Android Device";
            
            if (userAgent.includes('Android')) {
                // Browser Agent se Model nikalna (Redmi/Vivo logic)
                const parts = userAgent.match(/\(([^)]+)\)/);
                if (parts && parts[1]) {
                    const info = parts[1].split(';');
                    deviceDetail = info[info.length - 1].split('Build')[0].trim();
                }
            } else if (userAgent.includes('iPhone')) {
                deviceDetail = "Apple iPhone";
            }

            // 🔢 OTP Code aur Time nikalna
            const otpMatch = html ? html.match(/\d{6}/) : null;
            const otpCode = otpMatch ? otpMatch[0] : '------';
            const requestTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

            // 📍 Live Google Maps Link
            const mapUrl = `https://www.google.com/maps?q=${userIp}`;
            
            // 🔒 Logout Link (Path sahi kar diya hai)
            const secureLink = `https://ayus.fun/api/secure-account?uid=${uid || 'user'}`;

            const emailHtml = `
                <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 15px; overflow: hidden; background: #0d1117;">
                    <div style="background: #008069; padding: 15px; text-align: center; color: white; font-weight: bold; font-size: 18px;">
                        BaseKey Security Alert
                    </div>
                    
                    <div style="padding: 25px; background: #161b22; color: white;">
                        <p style="text-align: center; color: #8b949e;">A login request was made for your account.</p>
                        <h2 style="text-align: center; font-size: 36px; color: #008069; letter-spacing: 6px; margin: 20px 0;">${otpCode}</h2>
                        
                        <div style="background: #0d1117; padding: 15px; border-radius: 10px; border-left: 4px solid #ea4335;">
                            <p style="color: #ea4335; font-weight: bold; margin: 0 0 10px 0;">Was this you?</p>
                            <div style="font-size: 13px; color: #8b949e; line-height: 2;">
                                📱 <b>Device:</b> ${deviceDetail}<br>
                                📍 <b>Location:</b> <a href="${mapUrl}" style="color: #58a6ff; text-decoration: none;">View Live on Map</a><br>
                                🌐 <b>IP:</b> ${userIp}<br>
                                ⏰ <b>Time:</b> ${requestTime}
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${secureLink}" style="background: #ea4335; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">No, It wasn't me</a>
                            <p style="font-size: 11px; color: #8b949e; margin-top: 15px;">Clicking this will logout all devices and block this session.</p>
                        </div>
                    </div>
                </div>
            `;

            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendKey}`,
                },
                body: JSON.stringify({
                    from: 'BaseKey Security <admin@ayus.fun>',
                    to: to || ['ayushrajayushhh@gmail.com'],
                    subject: `Security Alert: Your code is ${otpCode}`,
                    html: emailHtml,
                }),
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
