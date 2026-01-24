export default async function handler(req, res) {
  const resendKey = process.env.RESEND_API_KEY;

  if (req.method === 'POST') {
    try {
      const { to, subject, html } = req.body; 
      
      // Agar OTP request hai, to OTP wala template bhejenge
      // HTML variable me jo OTP number aa raha hai use nikal kar sundar banayenge
      
      const emailHtml = html || `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #008069; margin: 0;">Success Point</h1>
                <p style="color: #888; font-size: 12px;">Class 10th Hub</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="font-size: 16px; color: #333;">Login verification code:</p>
                <h2 style="font-size: 32px; letter-spacing: 5px; color: #008069; margin: 10px 0;">${subject === 'Your Login OTP' ? html.replace(/[^0-9]/g, '') : '123456'}</h2>
                <p style="font-size: 14px; color: #666;">Valid for 10 minutes only.</p>
            </div>
            
            <div style="margin-top: 20px; text-align: center; color: #aaa; font-size: 12px;">
                <p>If you didn't request this code, please ignore this email.</p>
                <p>&copy; 2026 Success Point Hub | Ayush Raj Production</p>
            </div>
        </div>
      `;

      const recipient = to ? [to] : ['ayushrajayushhh@gmail.com']; 
      const emailSubject = subject || 'Alert from Success Point';

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Success Point <admin@ayus.fun>', 
          to: recipient, 
          subject: emailSubject,
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
