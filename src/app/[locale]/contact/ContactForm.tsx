'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CheckCircle2, Send } from 'lucide-react';

const tanzanianPhone = /^(\+2557\d{8}|\+2556\d{8}|07\d{8}|06\d{8})$/;

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(tanzanianPhone, 'Invalid phone number').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.boolean().refine((v) => v, 'You must agree to the Privacy Policy'),
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    if (data.website) return;

    try {
      const res = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone || undefined,
          email: data.email,
          subject: data.subject || undefined,
          message: data.message,
          consent: true,
          website: '',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(err.detail ?? 'Submission failed');
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError('Submission failed. Please try again.');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-surface';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  if (submitted) {
    return (
      <div className="py-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">{t('successTitle')}</h3>
        <p className="text-gray-500 text-sm">{t('successMessage')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <input type="text" {...register('website')} className="hidden" aria-hidden="true" tabIndex={-1} />

      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {serverError}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('name')} *</label>
          <input type="text" {...register('name')} className={inputClass} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>{t('phone')}</label>
          <input type="tel" {...register('phone')} placeholder="07XXXXXXXX" className={inputClass} />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label className={labelClass}>{t('email')} *</label>
          <input type="email" {...register('email')} className={inputClass} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass}>{t('subject')}</label>
          <input type="text" {...register('subject')} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('message')} *</label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder={locale === 'sw' ? 'Andika ujumbe wako hapa...' : 'Write your message here...'}
          className={`${inputClass} resize-y`}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <div className="flex items-start gap-3 p-4 bg-surface rounded-xl">
        <input
          type="checkbox"
          id="contact-consent"
          {...register('consent')}
          className="mt-0.5 w-4 h-4 text-primary focus:ring-primary rounded accent-primary"
        />
        <label htmlFor="contact-consent" className="text-sm text-gray-600 leading-relaxed">
          {t('consent')}{' '}
          <Link href="/privacy" className="text-primary font-semibold hover:underline">
            {locale === 'sw' ? 'Sera ya Faragha' : 'Privacy Policy'}
          </Link>
        </label>
      </div>
      {errors.consent && <p className="text-xs text-red-600">{errors.consent.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2 text-sm"
        style={{ background: 'linear-gradient(135deg, #7C2D12, #9A3412)' }}
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
