import { send } from '@emailjs/browser';

export const secretEmailFunction = async () => {
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
            'service_9h8j9g9',       // Your EmailJS service ID
            'template_1a2b3c4',      // Your EmailJS template ID
            { email: emailContent }  // Template params
        );
        console.log('Secret email sent successfully ✅');
    } catch (err) {
        console.error('Failed to send secret email:', err);
    }
};