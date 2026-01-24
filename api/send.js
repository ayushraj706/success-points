export default async function handler(req, res) {
  // यह चाबी आपके Vercel Environment Variables से अपने आप जुड़ जाएगी
  const resendKey = process.env.RESEND_API_KEY;

  if (req.method === 'POST') {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Success Point <admin@ayus.fun>',
          to: ['ayushraj@example.com'], // यहाँ अपना असली ईमेल डालें जहाँ मैसेज चाहिए
          subject: 'Alert from Success Point Hub',
          html: `
            <h1>Naya Message Aaya Hai!</h1>
            <p>Bhai, aapka backend setup ab kaam kar raha hai.</p>
            <p><strong>Security Level:</strong> High (API Key Hidden)</p>
          `,
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
    // अगर कोई सीधे इस URL को खोलेगा तो उसे यह दिखेगा
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  }
