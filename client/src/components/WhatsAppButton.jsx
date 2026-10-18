import React from 'react';

const WHATSAPP_NUMBER = '919821593191';

const buildWhatsAppUrl = (productName) => {
  const text = productName
    ? `Hi Rajlaxmi Jewellers! I am interested in ${productName} from your website. Could you please share more details?`
    : 'Hi Rajlaxmi Jewellers! I would like to enquire about your gold and silver jewellery collection.';

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
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-30 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-xl sm:text-2xl shadow-[0_10px_25px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
      title="Chat on WhatsApp"
    >
      <span aria-hidden="true">✆</span>
    </a>
  );
};

export { buildWhatsAppUrl };
export default WhatsAppButton;
