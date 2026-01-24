export default async function handler(req, res) {
  const resendKey = process.env.RESEND_API_KEY;

  if (req.method === 'POST') {
    try {
      const { to, subject, html } = req.body; 
      
      // OTP nikalne ka logic: subject se ya html se
      const otpCode = html ? html.replace(/[^0-9]/g, '') : '------';
      const requestTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // BaseKey Premium Template
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="padding: 30px 20px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                <h1 style="color: #008069; margin: 0; font-size: 28px; letter-spacing: 1px;">BaseKey</h1>
                <p style="color: #666; font-size: 10px; margin-top: 5px; text-transform: uppercase;">Secure Authentication</p>
            </div>

            <div style="padding: 20px; text-align: center;">
                <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="30" r="8" fill="#008069" opacity="0.2"/>
                    <circle cx="20" cy="30" r="4" fill="#008069"/>
                    <circle cx="80" cy="30" r="8" fill="#008069" opacity="0.2"/>
                    <path d="M80 26V34M76 30H84" stroke="#008069" stroke-width="2" stroke-linecap="round"/>
                    <path d="M30 30H70" stroke="#008069" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"/>
                    <path d="M45 25L55 35M55 25L45 35" stroke="#008069" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>

            <div style="padding: 0 40px 30px 40px; text-align: center;">
                <h2 style="color: #333; font-size: 20px;">Verify Your Identity</h2>
                <p style="color: #555; font-size: 14px;">Hello Topper,<br>Use the secure code below to access Success Point Hub.</p>
                
                <div style="margin: 30px 0; padding: 20px; border: 2px dashed #008069; border-radius: 12px; background-color: #f6fff9;">
                    <span style="font-size: 36px; font-weight: bold; color: #008069; letter-spacing: 10px;">${otpCode}</span>
                </div>

                <p style="color: #999; font-size: 12px;">This code is valid for 10 minutes. Please do not share it.</p>
                
                <div style="background-color: #000000; color: #ffffff; padding: 12px; border-radius: 8px; font-size: 10px; font-weight: bold; letter-spacing: 2px; margin-top: 20px; display: inline-block; width: 80%;">
                    PROTECTED BY BASEKEY PROTOCOL
                </div>

                <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #f0f0f0; text-align: left;">
                    <p style="color: #888; font-size: 11px; margin: 0;"><strong>Request Time:</strong> ${requestTime}</p>
                    <p style="color: #888; font-size: 11px; margin: 5px 0 0 0;"><strong>Origin:</strong> Samastipur, Bihar (Success Point)</p>
                </div>
            </div>

            <div style="background-color: #fafafa; padding: 20px; text-align: center; color: #aaa; font-size: 10px;">
                <p style="margin: 0;">© 2026 BaseKey | Part of SuperKey Brand</p>
                <p style="margin: 5px 0 0 0;">Designed for Bihar Board Toppers</p>
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
          from: 'Success Point <admin@ayus.fun>', 
          to: to ? [to] : ['ayushrajayushhh@gmail.com'], 
          subject: subject || 'Security Verification Code',
          html: emailHtml,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return res.status(200).json({ success: true, id: data.id });
      } else {
        return res.status(400).json({ success: false, error: data.message });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
