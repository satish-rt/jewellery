import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../lib/api';

const ContactModal = ({ productId, productName, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('lumiereUser') || 'null');
    if (user) {
      if (user.name) setValue('name', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
    }
  }, [setValue]);

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
      toast.success('Enquiry submitted — we will contact you shortly.');
      reset();
      onClose();
    } catch (err) {
      toast.error('Failed to submit enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-charcoal border border-gray-800 w-full max-w-xl p-6 mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400">×</button>

        <h3 className="font-serif text-2xl text-cream mb-2">Enquire about this piece</h3>
        {productName && <p className="text-gray-400 mb-4">{productName}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('_honey')} />

          <div>
            <label className="block text-xs text-gray-400 mb-1">Name *</label>
            <input className="w-full bg-transparent border-b border-gray-700 py-2 text-cream outline-none" {...register('name', { required: true })} />
            {errors.name && <div className="text-red-500 text-xs">Name required</div>}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Email *</label>
            <input type="email" className="w-full bg-transparent border-b border-gray-700 py-2 text-cream outline-none" {...register('email', { required: true })} />
            {errors.email && <div className="text-red-500 text-xs">Email required</div>}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Phone *</label>
            <input className="w-full bg-transparent border-b border-gray-700 py-2 text-cream outline-none" {...register('phone', { required: true })} />
            {errors.phone && <div className="text-red-500 text-xs">Phone required</div>}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Message *</label>
            <textarea rows="4" className="w-full bg-transparent border-b border-gray-700 py-2 text-cream outline-none resize-none" {...register('message', { required: true, minLength: 10 })}></textarea>
            {errors.message && <div className="text-red-500 text-xs">Message is required (min 10 chars)</div>}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs uppercase tracking-widest text-gray-400 border border-gray-700">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-gold text-charcoal px-6 py-2 text-xs uppercase tracking-widest font-medium hover:bg-cream transition-colors disabled:opacity-50">{isSubmitting ? 'Sending...' : 'Send Enquiry'}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default ContactModal;
