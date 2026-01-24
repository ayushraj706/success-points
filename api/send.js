export default async function handler(req, res) {
  // Vercel se API Key uthayega
  const resendKey = process.env.RESEND_API_KEY;

  if (req.method === 'POST') {
    try {
      const { to, subject, html } = req.body; 
      
      // OTP nikalne ka logic (Jo number frontend se aaya, use nikal liya)
      const otpCode = html ? html.replace(/[^0-9]/g, '') : '------';
      
      // Bharat ka time (IST)
      const requestTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // --- BASEKEY FINAL TEMPLATE (No Broken Lines) ---
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <div style="padding: 25px 20px; text-align: center; border-bottom: 1px solid #f0f0f0; background-color: #fcfcfc;">
                <h1 style="color: #008069; margin: 0; font-size: 26px; letter-spacing: 1px;">BaseKey</h1>
                <p style="color: #666; font-size: 10px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">Secure Authentication Protocol</p>
            </div>

            <div style="padding: 20px; text-align: center;">
                <svg width="120" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="30" r="8" fill="#008069" opacity="0.2"/>
                    <circle cx="20" cy="30" r="4" fill="#008069"/>
                    <circle cx="80" cy="30" r="8" fill="#008069" opacity="0.2"/>
                    <path d="M80 26V34M76 30H84" stroke="#008069" stroke-width="2" stroke-linecap="round"/>
                    <path d="M30 30H70" stroke="#008069" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"/>
                    <path d="M45 25L55 35M55 25L45 35" stroke="#008069" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>

            <div style="padding: 0 30px 30px 30px; text-align: center;">
                <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">Verify Your Identity</h2>
                <p style="color: #666; font-size: 13px; line-height: 1.5;">Hello Topper,<br>Use the secure code below to access Success Point Hub.</p>
                
                <div style="margin: 25px 0; padding: 15px 10px; border: 2px dashed #008069; border-radius: 10px; background-color: #f0fdf9;">
                    <span style="font-size: 30px; font-weight: bold; color: #008069; letter-spacing: 5px; white-space: nowrap;">${otpCode}</span>
                </div>

                <p style="color: #999; font-size: 11px;">This code is valid for 10 minutes. Please do not share it.</p>
                
                <div style="background-color: #000000; color: #ffffff; padding: 12px 20px; border-radius: 6px; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-top: 20px; display: inline-block;">
                    SECURE ENCRYPTED LOGIN
                </div>

                <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #f0f0f0; text-align: left;">
                    <p style="color: #888; font-size: 10px; margin: 2px 0;"><strong>Time:</strong> ${requestTime}</p>
                    <p style="color: #888; font-size: 10px; margin: 2px 0;"><strong>Server:</strong> Success Point Hub (Bihar Node)</p>
                </div>
            </div>

            <div style="background-color: #fafafa; padding: 15px; text-align: center; color: #bbb; font-size: 10px; border-top: 1px solid #eee;">
                <p style="margin: 0;">© 2026 BaseKey Systems.</p>
            </div>
        </div>
      `;

      // Resend API ko call lagana
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
  } else {
    // Agar koi aur method (GET/PUT) use kare
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
