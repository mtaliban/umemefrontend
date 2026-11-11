'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { CheckCircle2, GraduationCap } from 'lucide-react';
import type { TrainingIntake } from '@/lib/types';

const tanzanianPhone = /^(\+2557\d{8}|\+2556\d{8}|07\d{8}|06\d{8})$/;

function getSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t('validation.required')),
    phone: z.string().regex(tanzanianPhone, t('validation.invalidPhone')),
    email: z.string().email(t('validation.invalidEmail')).optional().or(z.literal('')),
    gender: z.string().optional(),
    region: z.string().optional(),
    education_level: z.string().optional(),
    intake_id: z.string().optional(),
    consent: z.boolean().refine((v) => v, t('validation.mustAgreeToPrivacy')),
    website: z.string().max(0).optional(),
  });
}

type FormData = z.infer<ReturnType<typeof getSchema>>;

interface TrainingApplicationFormProps {
  programmeId: string;
  programmeName: string;
  intakes: TrainingIntake[];
  locale: string;
}

export default function TrainingApplicationForm({
  programmeId,
  programmeName,
  intakes,
  locale,
}: TrainingApplicationFormProps) {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const schema = getSchema((key) => {
    const parts = key.split('.');
    if (parts.length === 2) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return t(key) ?? key;
    }
    return key;
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    if (data.website) return;

    const fd = new FormData();
    fd.append('name', data.name);
    fd.append('phone', data.phone);
    if (data.email) fd.append('email', data.email);
    if (data.gender) fd.append('gender', data.gender);
    if (data.region) fd.append('region', data.region);
    if (data.education_level) fd.append('education_level', data.education_level);
    fd.append('programme_id', programmeId);
    if (data.intake_id) fd.append('intake_id', data.intake_id);
    fd.append('consent', 'true');

    const cvInput = document.querySelector<HTMLInputElement>('input[name="cv"]');
    if (cvInput?.files?.[0]) fd.append('cv', cvInput.files[0]);

    try {
      const res = await fetch('/api/forms/training-application', { method: 'POST', body: fd });
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

  const resolveLocale = (en: string, sw: string) => locale === 'sw' ? sw : en;

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-surface';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-10 shadow-card border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">
          {t('trainingApplication.successTitle')}
        </h3>
        <p className="text-gray-500">{t('trainingApplication.successMessage')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #7C2D12, #9A3412)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">
              {t('trainingApplication.title')}
            </h2>
            <p className="text-white/95 text-xs mt-0.5">{programmeName}</p>
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

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>{t('trainingApplication.name')} *</label>
              <input type="text" {...register('name')} className={inputClass} />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelClass}>{t('trainingApplication.phone')} *</label>
              <input type="tel" {...register('phone')} className={inputClass} placeholder="07XXXXXXXX" />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>

            <div>
              <label className={labelClass}>{t('trainingApplication.email')}</label>
              <input type="email" {...register('email')} className={inputClass} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelClass}>{t('trainingApplication.gender')}</label>
              <select {...register('gender')} className={inputClass}>
                <option value="">—</option>
                <option value="male">{t('trainingApplication.male')}</option>
                <option value="female">{t('trainingApplication.female')}</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>{t('trainingApplication.region')}</label>
              <input type="text" {...register('region')} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>{t('trainingApplication.educationLevel')}</label>
              <select {...register('education_level')} className={inputClass}>
                <option value="">—</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary (O-Level)</option>
                <option value="advanced">Advanced (A-Level)</option>
                <option value="diploma">Diploma</option>
                <option value="degree">Bachelor&apos;s Degree</option>
                <option value="masters">Master&apos;s Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            {intakes.length > 0 && (
              <div className="sm:col-span-2">
                <label className={labelClass}>{resolveLocale('Preferred Intake', 'Chaguo la Ulizaji')}</label>
                <select {...register('intake_id')} className={inputClass}>
                  <option value="">—</option>
                  {intakes.filter((i) => i.status === 'open').map((intake) => (
                    <option key={intake._id} value={intake._id}>
                      {new Date(intake.start_date).toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', { day: 'numeric', month: 'long', year: 'numeric' })} —{' '}
                      {new Date(intake.end_date).toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className={labelClass}>{t('trainingApplication.cv')}</label>
              <input
                type="file"
                name="cv"
                accept=".pdf"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
              />
              <p className="mt-1.5 text-xs text-gray-400">{t('trainingApplication.cvHint')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-surface rounded-xl">
            <input
              type="checkbox"
              id="ta-consent"
              {...register('consent')}
              className="mt-0.5 w-4 h-4 text-primary focus:ring-primary rounded accent-primary"
            />
            <label htmlFor="ta-consent" className="text-sm text-gray-600 leading-relaxed">
              {t('trainingApplication.consent')}{' '}
              <a href="/privacy" className="text-primary font-semibold hover:underline">
                {resolveLocale('Privacy Policy', 'Sera ya Faragha')}
              </a>
            </label>
          </div>
          {errors.consent && <p className="text-xs text-red-600">{errors.consent.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
          >
            {isSubmitting ? t('trainingApplication.sending') : t('trainingApplication.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
