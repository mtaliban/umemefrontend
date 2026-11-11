'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CheckCircle2, Phone, MessageCircle, Mail, Wrench } from 'lucide-react';

const tanzanianPhone = /^(\+2557\d{8}|\+2556\d{8}|07\d{8}|06\d{8})$/;

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(tanzanianPhone, 'Invalid Tanzanian phone number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  organisation: z.string().optional(),
  service_id: z.string().min(1, 'Please select a service'),
  region: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
  description: z.string().min(20, 'Please provide more detail (at least 20 characters)'),
  contact_method: z.enum(['phone', 'whatsapp', 'email']),
  consent: z.boolean().refine((v) => v, 'You must agree to the Privacy Policy'),
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

interface ServiceOption {
  id: string;
  name: string;
}

interface ServiceRequestFormProps {
  services: ServiceOption[];
  preselectedServiceId?: string;
  locale: string;
}

const TZ_REGIONS = [
  'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera',
  'Katavi', 'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara',
  'Mbeya', 'Morogoro', 'Mtwara', 'Mwanza', 'Njombe', 'Pemba North',
  'Pemba South', 'Pwani', 'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu',
  'Singida', 'Songwe', 'Tabora', 'Tanga', 'Unguja North', 'Unguja South',
  'Zanzibar City',
];

export default function ServiceRequestForm({
  services,
  preselectedServiceId,
  locale,
}: ServiceRequestFormProps) {
  const t = useTranslations('requestService');
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_id: preselectedServiceId ?? '',
      contact_method: 'phone',
    },
  });

  const selectedMethod = watch('contact_method');

  const onSubmit = async (data: FormData) => {
    setServerError('');
    if (data.website) return;

    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'website' && key !== 'consent' && value !== undefined && value !== '') {
        fd.append(key, String(value));
      }
    });
    fd.append('consent', 'true');

    const photoInput = document.querySelector<HTMLInputElement>('input[name="photo"]');
    if (photoInput?.files?.[0]) fd.append('photo', photoInput.files[0]);

    try {
      const res = await fetch('/api/forms/service-request', { method: 'POST', body: fd });
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
      <div className="bg-white rounded-2xl p-12 shadow-card border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">{t('successTitle')}</h3>
        <p className="text-gray-500 max-w-sm mx-auto">{t('successMessage')}</p>
      </div>
    );
  }

  const contactOptions = [
    { value: 'phone', label: t('contactPhone'), icon: Phone },
    { value: 'whatsapp', label: t('contactWhatsApp'), icon: MessageCircle },
    { value: 'email', label: t('contactEmail'), icon: Mail },
  ] as const;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      {/* Form header */}
      <div className="p-6 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #7C2D12, #9A3412)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">{t('title')}</h2>
            <p className="text-white/95 text-xs mt-0.5">{locale === 'sw' ? 'Jaza fomu hapa chini' : 'Fill in the form below'}</p>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {serverError && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <input type="text" {...register('website')} className="hidden" aria-hidden="true" tabIndex={-1} />

          {/* Personal info */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              {locale === 'sw' ? 'Taarifa Zako' : 'Your Information'}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('name')} *</label>
                <input type="text" {...register('name')} className={inputClass} />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelClass}>{t('phone')} *</label>
                <input type="tel" {...register('phone')} placeholder="07XXXXXXXX" className={inputClass} />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>
              <div>
                <label className={labelClass}>{t('email')}</label>
                <input type="email" {...register('email')} className={inputClass} />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelClass}>{t('organisation')}</label>
                <input type="text" {...register('organisation')} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Service & Location */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              {locale === 'sw' ? 'Huduma & Mahali' : 'Service & Location'}
            </p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('service')} *</label>
                <select {...register('service_id')} className={inputClass}>
                  <option value="">{t('selectService')}</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {errors.service_id && <p className="mt-1 text-xs text-red-600">{errors.service_id.message}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('region')}</label>
                  <select {...register('region')} className={inputClass}>
                    <option value="">—</option>
                    {TZ_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t('district')}</label>
                  <input type="text" {...register('district')} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('address')}</label>
                <input type="text" {...register('address')} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              {locale === 'sw' ? 'Maelezo' : 'Details'}
            </p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('description')} *</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder={locale === 'sw' ? 'Elezea mahitaji yako kwa undani...' : 'Describe your requirements in detail...'}
                  className={`${inputClass} resize-y`}
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
              </div>

              {/* Photo upload */}
              <div>
                <label className={labelClass}>{t('photo')}</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/jpeg,image/png,image/webp"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                />
                <p className="mt-1 text-xs text-gray-400">{t('photoHint')}</p>
              </div>
            </div>
          </div>

          {/* Contact method */}
          <div>
            <label className={labelClass}>{t('contactMethod')}</label>
            <div className="grid grid-cols-3 gap-3">
              {contactOptions.map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedMethod === value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 bg-surface text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input type="radio" value={value} {...register('contact_method')} className="sr-only" />
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold text-center leading-tight">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Consent */}
          <div className="flex items-start gap-3 p-4 bg-surface rounded-xl">
            <input
              type="checkbox"
              id="sr-consent"
              {...register('consent')}
              className="mt-0.5 w-4 h-4 text-primary focus:ring-primary rounded accent-primary"
            />
            <label htmlFor="sr-consent" className="text-sm text-gray-600 leading-relaxed">
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
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 text-sm"
            style={{ background: 'linear-gradient(135deg, #7C2D12, #9A3412)' }}
          >
            {isSubmitting ? t('sending') : t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
