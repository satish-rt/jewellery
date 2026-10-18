import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useUser } from '../context/UserContext';

const ContactModal = ({ productId, productName, onClose }) => {
  const { user } = useUser();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setValue('name', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    if (data._honey) return;
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        ...(productId && { productId }),
      };
      await api.post('/enquiries', payload);
      toast.success('Enquiry submitted — our atelier will contact you shortly.');
      reset();
      onClose();
    } catch (err) {
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#141414] border border-gold/30 w-full max-w-lg p-6 sm:p-8 relative shadow-gold">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-cream text-2xl leading-none w-8 h-8 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>

        {!user ? (
          <div className="text-center py-4">
            <span className="text-gold text-3xl mb-3 block">✦</span>
            <h3 className="font-serif text-2xl text-cream mb-2">Member Sign In Required</h3>
            {productName && (
              <p className="text-gold/80 text-sm mb-4 font-serif italic">"{productName}"</p>
            )}
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              You can browse our complete collection anytime. To submit an enquiry or consult our master jewellers, please log in first.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/login"
                state={{ from: location, message: `Please login to enquire about ${productName || 'this piece'}.` }}
                onClick={onClose}
                className="btn-gold-shimmer py-3.5 px-6 text-xs uppercase tracking-widest text-center"
              >
                Sign In to Enquire →
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="border border-gold/40 text-cream hover:text-gold hover:border-gold py-3.5 px-6 text-xs uppercase tracking-widest text-center transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-serif text-2xl text-cream mb-1">Enquire About This Piece</h3>
            {productName && <p className="text-gold text-sm mb-5 font-serif">{productName}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register('_honey')} />

              <div>
                <label className="block text-xs uppercase tracking-widest text-gold/70 mb-1">Name *</label>
                <input
                  className="w-full bg-[#0F0F0F] border border-gold/20 focus:border-gold px-3 py-2.5 text-cream text-sm outline-none transition-colors"
                  {...register('name', { required: true })}
                />
                {errors.name && <div className="text-red-400 text-xs mt-1">Name is required</div>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold/70 mb-1">Email *</label>
                  <input
                    type="email"
                    className="w-full bg-[#0F0F0F] border border-gold/20 focus:border-gold px-3 py-2.5 text-cream text-sm outline-none transition-colors"
                    {...register('email', { required: true })}
                  />
                  {errors.email && <div className="text-red-400 text-xs mt-1">Email is required</div>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold/70 mb-1">Phone *</label>
                  <input
                    className="w-full bg-[#0F0F0F] border border-gold/20 focus:border-gold px-3 py-2.5 text-cream text-sm outline-none transition-colors"
                    {...register('phone', { required: true })}
                  />
                  {errors.phone && <div className="text-red-400 text-xs mt-1">Phone is required</div>}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gold/70 mb-1">Message *</label>
                <textarea
                  rows="3"
                  placeholder="I would like to enquire about availability, customisation, and pricing..."
                  className="w-full bg-[#0F0F0F] border border-gold/20 focus:border-gold px-3 py-2.5 text-cream text-sm outline-none resize-none transition-colors"
                  {...register('message', { required: true, minLength: 10 })}
                />
                {errors.message && <div className="text-red-400 text-xs mt-1">Message is required (min 10 chars)</div>}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs uppercase tracking-widest text-gray-400 border border-gray-800 hover:border-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold-shimmer px-6 py-2.5 text-xs uppercase tracking-widest font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default ContactModal;
