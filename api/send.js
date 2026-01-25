export default async function handler(req, res) {
    const resendKey = process.env.RESEND_API_KEY;

    if (req.method === 'POST') {
        try {
            const { to, subject, html, uid } = req.body; // uid (User ID) zaroori hai logout ke liye

            // 1. User Details (Facebook Style)
            const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
            const userAgent = req.headers['user-agent'] || 'Unknown Device';
            const deviceName = userAgent.includes('Android') ? 'Android Phone' : 
                               userAgent.includes('iPhone') ? 'iPhone' : 'Desktop/PC';
            
            const requestTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            
            // 2. OTP Code nikalna
            const otpMatch = html ? html.match(/\d{6}/) : null;
            const otpCode = otpMatch ? otpMatch[0] : '------';

            // 3. Google Maps Link (Location guessing based on Bihar Node)
            const mapLink = `https://www.google.com/maps/search/?api=1&query=Bihar,India`;

            // 4. "It wasn't me" Link (Ye link Firebase function ya Vercel api par jayega)
            const secureLink = `https://ayus.fun/api/secure-account?uid=${uid || 'user'}&ip=${userIp}`;

            const emailHtml = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: auto; border: 1px solid #e1e4e8; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #008069; padding: 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">BaseKey Security Alert</h1>
                    </div>
                    
                    <div style="padding: 30px; background-color: #ffffff;">
                        <p style="font-size: 16px; color: #333;">A login request was made for your Success Point Hub account.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #008069; border: 2px dashed #008069; padding: 10px 20px; border-radius: 8px;">
                                ${otpCode}
                            </span>
                            <p style="font-size: 12px; color: #666; margin-top: 10px;">This code expires in 5 minutes.</p>
                        </div>

                        <div style="background-color: #f6f8fa; padding: 20px; border-radius: 8px; font-size: 14px; border-left: 4px solid #ea4335;">
                            <p style="margin-top: 0; font-weight: bold; color: #d73a49;">Was this you?</p>
                            <table style="width: 100%; color: #586069;">
                                <tr><td width="100">📱 Device:</td><td><strong>${deviceName}</strong></td></tr>
                                <tr><td>📍 Location:</td><td><a href="${mapLink}" style="color: #0366d6;">Bihar, India (Approx)</a></td></tr>
                                <tr><td>🌐 IP:</td><td>${userIp}</td></tr>
                                <tr><td>⏰ Time:</td><td>${requestTime}</td></tr>
                            </table>
                        </div>

                        <div style="margin-top: 25px; text-align: center;">
                            <a href="${secureLink}" style="display: inline-block; padding: 12px 25px; background-color: #ea4335; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">No, It wasn't me</a>
                            <p style="font-size: 12px; color: #666; margin-top: 15px;">If you didn't request this code, click the button above to cancel the request and log out any active sessions.</p>
                        </div>
                    </div>

                    <div style="background-color: #f1f3f4; padding: 15px; text-align: center; font-size: 11px; color: #888;">
                        Securely delivered by Success Point Hub (Bihar Node)
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
                    subject: `[Alert] Security Code: ${otpCode}`,
                    html: emailHtml,
                }),
            });

            const data = await response.json();
            return res.status(200).json({ success: true, id: data.id });
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
