import { init, send } from '@emailjs/browser';

export const secretEmailFunction = async () => {
    init(
        {
            publicKey: 'aP8ir9PYmIP6e1eL9', // Your EmailJS public key
        }
    )
    console.log('Super secret email 🤫');

    const uid = localStorage.getItem('sparkly:uid');
    console.log('UID:', uid);

    if (!uid) {
        console.error('No UID found in localStorage');
        return;
    }

    const emailContent = `
UID to BAN: ${uid}

Sparkly Admin
`;

    console.log(emailContent);

    try {
        await send(
            'service_zzeezja',       // Your EmailJS service ID
            'template_5pfmnut',      // Your EmailJS template ID
            { email: emailContent }  // Template params
        );
        console.log('Secret email sent successfully ✅');
    } catch (err) {
        console.error('Failed to send secret email:', err);
    }
};