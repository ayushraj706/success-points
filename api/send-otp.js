import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otp, type } = req.body;
  
  try {
    const subject = type === 'signup' ? 'Verify your Account - Success Point' : 'Reset Password OTP';
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: subject,
      html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2>Success Point Hub</h2>
              <p>Your OTP Code is:</p>
              <h1 style="color: #008069; letter-spacing: 5px;">${otp}</h1>
              <p>This code is valid for 10 minutes.</p>
             </div>`
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
