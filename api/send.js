import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
    const { email, otp } = req.body;
    try {
        const data = await resend.emails.send({
            from: 'BaseKey <otp@ayus.fun>', // Aapka verified domain
            to: email,
            subject: 'Your 6-Digit BaseKey OTP',
            html: `<h1>BaseKey Security</h1><p>Aapka login OTP hai: <strong>${otp}</strong></p>`
        });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
