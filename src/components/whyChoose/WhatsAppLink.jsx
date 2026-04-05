import React from "react";
import Link from "next/link";
const WhatsAppLink = ({ packageName }) => {
    const phone = "919947617000"; // Your WhatsApp number
    const message = `Hello, I am interested in your ${packageName} package from your website.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;

    return (
        <Link
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn1"
        >
            Send an Enquiry
        </Link>
    );
};

export default WhatsAppLink;
