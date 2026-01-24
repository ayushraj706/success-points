export default async function handler(req, res) {
  const resendKey = process.env.RESEND_API_KEY;

  if (req.method === 'POST') {
    try {
      // Frontend se data aa raha hai (body me)
      const { to, subject, html } = req.body; 
      
      // Agar frontend se email nahi aaya, to default apna wala use karo
      const recipient = to ? [to] : ['ayushrajayushhh@gmail.com']; 
      const emailSubject = subject || 'Alert from Success Point';
      const emailHtml = html || '<p>Default Test Message</p>';

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
