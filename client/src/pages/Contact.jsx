import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../lib/api';
import HoneypotField from '../components/HoneypotField';
import { useUser } from '../context/UserContext';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const productName = searchParams.get('productName');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useUser();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    document.title = 'Contact Us | Rajlaxmi Jewellers';
    if (user) {
      reset({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (data._honey) return;
    setIsSubmitting(true);
    try {
      await api.post('/enquiries', {
        name: data.name, email: data.email, phone: data.phone, message: data.message,
        ...(productId && { productId }),
      });
      setIsSuccess(true);
      reset();
    } catch (err) {
      toast.error(err.response?.status === 429
        ? 'Too many requests. Please try again in 15 minutes.'
        : 'Failed to send enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-charcoal">
        <motion.div
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-20 h-20 bg-gold/10 border border-gold/30 flex items-center justify-center mb-8 text-gold">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <span className="badge-gold mb-4 inline-flex">Message Received</span>
        <h2 className="font-serif text-4xl text-cream mb-4">Thank You!</h2>
        <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
          Your enquiry has been received. Our team at Rajlaxmi Jewellers will get back to you within 24 hours.
        </p>
        <Link to="/shop" className="btn-gold-shimmer inline-block px-10 py-4 text-sm">
          Continue Browsing
        </Link>
      </div>
    );
  }

  const inputClass = (hasError) =>
    `w-full bg-[#141414] border ${hasError ? 'border-red-500' : 'border-gold/20'} focus:border-gold px-4 py-3 outline-none text-cream text-sm placeholder-gray-600 transition-colors`;

  const infoItems = [
    { label: 'Visit Us', lines: ['Shop no.2, Krishna chawl, yashwantrao chavan marg, Maharashtra Nagar, Mankhurd, Mumbai, Maharashtra 400088'] },
    { label: 'Call Us', lines: ['+91 9821593191', '+91 9372652693'] },
    { label: 'Email Us', lines: ['vishal.chauhan.vc04@gmail.com'] },
    { label: 'Store Hours', lines: ['Mon – Sat: 10:00 AM – 8:00 PM', 'Sunday: 11:00 AM – 6:00 PM'] },
  ];

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Page Hero */}
      <section className="bg-section-gold-tint pt-24 pb-12 sm:pt-28 sm:pb-16 text-center px-4 sm:px-6 border-b border-gold/15">
        <span className="badge-gold mb-3 sm:mb-4 inline-flex">Get In Touch</span>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream heading-decorated">Contact Us</h1>
        <p className="text-gray-400 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed mt-6 sm:mt-8 px-2">
          Whether you want to enquire about a piece, request a custom design, or visit our atelier —
          our master jewellers are here to assist you.
        </p>
      </section>

      <div className="divider-gold" />

      {/* Info Cards Row */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-charcoal border-b border-gold/10">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[#141414] border border-gold/15 p-4 sm:p-5 hover:border-gold/40 transition-colors rounded-sm">
              <h4 className="text-gold text-xs uppercase tracking-widest mb-2 font-semibold">Visit Atelier</h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Shop no.2, Krishna chawl, yashwantrao chavan marg, Maharashtra Nagar, Mankhurd, Mumbai 400088
              </p>
              <a
                href="https://maps.app.goo.gl/dZESmzsffKfkgxoZA"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-gold text-xs underline uppercase tracking-wider"
              >
                Directions →
              </a>
            </div>

            <div className="bg-[#141414] border border-gold/15 p-4 sm:p-5 hover:border-gold/40 transition-colors rounded-sm">
              <h4 className="text-gold text-xs uppercase tracking-widest mb-2 font-semibold">Call Atelier</h4>
              <a href="tel:+919821593191" className="block text-gray-300 hover:text-gold text-xs sm:text-sm mb-1 transition-colors">
                +91 9821593191
              </a>
              <a href="tel:+919372652693" className="block text-gray-300 hover:text-gold text-xs sm:text-sm transition-colors">
                +91 9372652693
              </a>
              <span className="block text-[10px] uppercase text-gold/60 tracking-wider mt-2">Instant Telephone Support</span>
            </div>

            <div className="bg-[#141414] border border-gold/15 p-4 sm:p-5 hover:border-gold/40 transition-colors rounded-sm">
              <h4 className="text-gold text-xs uppercase tracking-widest mb-2 font-semibold">Email Us</h4>
              <a href="mailto:vishal.chauhan.vc04@gmail.com" className="block text-gray-300 hover:text-gold text-xs sm:text-sm break-all transition-colors">
                vishal.chauhan.vc04@gmail.com
              </a>
              <span className="block text-[10px] uppercase text-gold/60 tracking-wider mt-2">24hr Response Time</span>
            </div>

            <div className="bg-[#141414] border border-gold/15 p-4 sm:p-5 hover:border-gold/40 transition-colors rounded-sm">
              <h4 className="text-gold text-xs uppercase tracking-widest mb-2 font-semibold">Store Hours</h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Mon – Sat: 10:00 AM – 8:00 PM</p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Sunday: 11:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-charcoal">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">

            {/* Left — Title + Notes */}
            <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-2 heading-decorated heading-decorated-left">
                  Send an Enquiry
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mt-4 sm:mt-6">
                  Fill in your details below and our jewellery team will get back to you promptly.
                  For immediate consultation, tap Call or WhatsApp.
                </p>
              </div>

              <div className="bg-[#141414] border border-gold/15 p-4 sm:p-5 rounded-sm">
                <p className="text-xs uppercase tracking-widest text-gold mb-1.5 font-semibold">Response Time</p>
                <p className="text-gray-400 text-xs sm:text-sm">We respond to all piece enquiries within 24 business hours.</p>
              </div>

              <div className="bg-[#141414] border border-gold/15 p-4 sm:p-5 rounded-sm">
                <p className="text-xs uppercase tracking-widest text-gold mb-1.5 font-semibold">Bespoke Orders</p>
                <p className="text-gray-400 text-xs sm:text-sm">We craft custom bridal sets, engagement rings, and traditional ornaments to your exact vision.</p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              {productName && (
                <div className="mb-6 p-4 border border-gold/30 bg-gold/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Enquiring about</span>
                    <span className="font-serif text-cream text-lg">{productName}</span>
                  </div>
                  <Link to={`/shop/${productId}`} className="text-gold text-xs uppercase tracking-widest hover:text-gold-200 transition-colors">
                    View →
                  </Link>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <HoneypotField register={register} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gold/70 mb-1.5">Full Name *</label>
                    <input type="text" placeholder="Your full name"
                      className={inputClass(errors.name)}
                      {...register('name', { required: 'Name is required' })} />
                    {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gold/70 mb-1.5">Phone Number *</label>
                    <input type="tel" placeholder="+91 98765 43210"
                      className={inputClass(errors.phone)}
                      {...register('phone', { required: 'Phone is required', minLength: { value: 7, message: 'Invalid phone number' } })} />
                    {errors.phone && <span className="text-red-400 text-xs mt-1 block">{errors.phone.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold/70 mb-1.5">Email Address *</label>
                  <input type="email" placeholder="your@email.com"
                    className={inputClass(errors.email)}
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
                  {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold/70 mb-1.5">Your Message *</label>
                  <textarea rows="5" placeholder="Tell us what you are looking for..."
                    className={inputClass(errors.message) + ' resize-none'}
                    {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Please write at least 10 characters' } })} />
                  {errors.message && <span className="text-red-400 text-xs mt-1 block">{errors.message.message}</span>}
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="btn-gold-shimmer w-full py-4 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Sending Enquiry...' : 'Send Enquiry →'}
                </button>

                <p className="text-center text-gray-600 text-xs tracking-wider">
                  Your details are kept confidential and never shared with third parties.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;