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
      <section className="bg-section-gold-tint pt-28 pb-16 text-center px-6 border-b border-gold/15">
        <span className="badge-gold mb-4 inline-flex">Get In Touch</span>
        <h1 className="font-serif text-5xl md:text-6xl text-cream heading-decorated">Contact Us</h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed mt-8">
          Whether you want to enquire about a piece, request a custom design, or simply visit our store —
          we are here to help.
        </p>
      </section>

      <div className="divider-gold" />

      {/* Info Cards Row */}
      <section className="py-12 px-6 bg-charcoal border-b border-gold/10">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {infoItems.map((item, i) => (
              <div key={i} className="bg-[#141414] border border-gold/15 p-5 hover:border-gold/40 transition-colors">
                <h4 className="text-gold text-xs uppercase tracking-widest mb-3">{item.label}</h4>
                {item.lines.map((line, j) => (
                  <p key={j} className="text-gray-400 text-sm leading-relaxed">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-6 bg-charcoal">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Left — Title + Notes */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-3xl text-cream mb-3 heading-decorated heading-decorated-left">
                  Send an Enquiry
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mt-6">
                  Fill in your details and we will get back to you within 24 hours.
                  For urgent matters, please call us directly.
                </p>
              </div>

              <div className="bg-[#141414] border border-gold/15 p-5">
                <p className="text-xs uppercase tracking-widest text-gold mb-2">Response Time</p>
                <p className="text-gray-400 text-sm">We respond to all enquiries within 24 business hours.</p>
              </div>

              <div className="bg-[#141414] border border-gold/15 p-5">
                <p className="text-xs uppercase tracking-widest text-gold mb-2">Custom Orders</p>
                <p className="text-gray-400 text-sm">We accept bespoke commissions. Tell us your vision and we will craft it.</p>
              </div>

              <div className="overflow-hidden border border-gold/15 bg-[#141414]">
                <iframe
                  title="Rajlaxmi Jewellers location"
                  src="https://maps.app.goo.gl/dZESmzsffKfkgxoZA"
                  className="h-72 w-full border-0 grayscale contrast-125"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
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