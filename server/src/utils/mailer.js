const nodemailer = require('nodemailer');

const isConfigured = process.env.EMAIL_USER && process.env.EMAIL_USER !== 'placeholder@gmail.com';

const transporter = isConfigured ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
}) : null;

const sendEnquiryNotification = async ({ name, phone, email, message, productName }) => {
  if (!isConfigured || !transporter) {
    console.log('[Dev] Email not configured — skipping notification for enquiry from:', name);
    return;
  }
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#1A1A1A;color:#F5F0E6;padding:32px;border:1px solid #B8935F;">
      <h2 style="color:#B8935F;font-size:24px;margin-bottom:24px;">New Enquiry — Rajlaxmi Jewellers</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Name</td><td style="padding:8px 0;color:#F5F0E6;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Phone</td><td style="padding:8px 0;"><a href="tel:${phone}" style="color:#B8935F;">${phone}</a></td></tr>
        <tr><td style="padding:8px 0;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#B8935F;">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Product</td><td style="padding:8px 0;color:#F5F0E6;">${productName || 'General Enquiry'}</td></tr>
      </table>
      <div style="margin-top:24px;padding:16px;background:#111;border:1px solid #333;">
        <p style="color:#999;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Message</p>
        <p style="color:#F5F0E6;line-height:1.7;">${message}</p>
      </div>
      <p style="margin-top:24px;color:#666;font-size:11px;">Reply directly to this email to respond to the customer.</p>
    </div>
  `;
  await transporter.sendMail({
    from: `"Rajlaxmi Jewellers" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Enquiry from ${name} — Rajlaxmi Jewellers`,
    html,
  });
};

module.exports = { sendEnquiryNotification };