import React from 'react';

const WHATSAPP_NUMBER = '';

const buildWhatsAppUrl = (productName) => {
  const text = productName
    ? `Hi! I'm interested in ${productName} from your website.`
    : 'Hi! I would like to enquire about your jewellery collection.';

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

const WhatsAppButton = ({ productName = '' }) => {
  const href = buildWhatsAppUrl(productName);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_35px_rgba(37,211,102,0.6)]"
      title="Chat on WhatsApp"
    >
      <span aria-hidden="true">✆</span>
    </a>
  );
};

export { buildWhatsAppUrl };
export default WhatsAppButton;
