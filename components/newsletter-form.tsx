'use client'

import { useState } from 'react'
import { ApiClientError, submitZienswijze } from '@/lib/api/client'
import type { ZienswijzeSubmission } from '@/types/backend'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

type FormFields = {
  name: string
  email: string
  postalCode: string
  newsletterConsent: boolean
}

type FieldErrors = Partial<Record<keyof FormFields, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const POSTAL_CODE_PATTERN = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/

const INITIAL_FIELDS: FormFields = {
  name: '',
  email: '',
  postalCode: '',
  newsletterConsent: false,
}

function validateFields(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {}

  if (fields.name.trim().length < 2) {
    errors.name = 'Vul een geldige naam in.'
  }

  if (!EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = 'Vul een geldig e-mailadres in.'
  }

  if (!POSTAL_CODE_PATTERN.test(fields.postalCode.trim())) {
    errors.postalCode = 'Vul een geldige postcode in, bijvoorbeeld 6211 AB.'
  }

  if (!fields.newsletterConsent) {
    errors.newsletterConsent = 'Bevestig dat je op de hoogte wilt blijven.'
  }

  return errors
}

export function NewsletterForm() {
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function updateField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage(null)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validateFields(fields)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setStatus('error')
      setErrorMessage('Controleer de ingevulde gegevens.')
      return
    }

    const payload: ZienswijzeSubmission = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      postalCode: fields.postalCode.trim().toUpperCase().replace(/\s+/g, ' '),
      newsletterConsent: fields.newsletterConsent,
    }

    setStatus('loading')
    setErrorMessage(null)
    setFieldErrors({})

    try {
      await submitZienswijze(payload)
      setStatus('success')
      setFields(INITIAL_FIELDS)
    } catch (error) {
      setStatus('error')

      if (error instanceof ApiClientError) {
        setErrorMessage(error.message)
        if (error.fields) {
          setFieldErrors(error.fields as FieldErrors)
        }
        return
      }

      setErrorMessage('Er ging iets mis. Probeer het later opnieuw.')
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-paper">
        Bedankt — je ontvangt binnenkort een bevestiging per e-mail.
      </p>
    )
  }

  const isLoading = status === 'loading'

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="zienswijze-name"
          label="Naam"
          error={fieldErrors.name}
        >
          <input
            id="zienswijze-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={isLoading}
            value={fields.name}
            onChange={(event) => updateField('name', event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'zienswijze-name-error' : undefined}
            className="w-full bg-transparent font-mono text-sm text-paper placeholder:text-paper/50 focus:outline-none disabled:opacity-60"
            placeholder="Jouw naam"
          />
        </Field>

        <Field
          id="zienswijze-email"
          label="E-mailadres"
          error={fieldErrors.email}
        >
          <input
            id="zienswijze-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isLoading}
            value={fields.email}
            onChange={(event) => updateField('email', event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'zienswijze-email-error' : undefined}
            className="w-full bg-transparent font-mono text-sm text-paper placeholder:text-paper/50 focus:outline-none disabled:opacity-60"
            placeholder="jij@voorbeeld.nl"
          />
        </Field>
      </div>

      <Field
        id="zienswijze-postal"
        label="Postcode"
        error={fieldErrors.postalCode}
      >
        <input
          id="zienswijze-postal"
          name="postalCode"
          type="text"
          autoComplete="postal-code"
          required
          disabled={isLoading}
          value={fields.postalCode}
          onChange={(event) => updateField('postalCode', event.target.value)}
          aria-invalid={Boolean(fieldErrors.postalCode)}
          aria-describedby={fieldErrors.postalCode ? 'zienswijze-postal-error' : undefined}
          className="w-full bg-transparent font-mono text-sm text-paper placeholder:text-paper/50 focus:outline-none disabled:opacity-60"
          placeholder="6211 AB"
        />
      </Field>

      <div>
        <label className="flex items-start gap-3 font-serif text-sm leading-relaxed text-paper/85">
          <input
            id="zienswijze-consent"
            name="newsletterConsent"
            type="checkbox"
            disabled={isLoading}
            checked={fields.newsletterConsent}
            onChange={(event) => updateField('newsletterConsent', event.target.checked)}
            aria-invalid={Boolean(fieldErrors.newsletterConsent)}
            aria-describedby={fieldErrors.newsletterConsent ? 'zienswijze-consent-error' : undefined}
            className="mt-1 size-4 shrink-0 accent-[var(--color-accent-nature)] disabled:opacity-60"
          />
          <span>Ik wil op de hoogte blijven van de zienswijze en gerelateerde updates.</span>
        </label>
        {fieldErrors.newsletterConsent ? (
          <p id="zienswijze-consent-error" role="alert" className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-nature">
            {fieldErrors.newsletterConsent}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/20 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="font-mono text-xs uppercase tracking-[0.16em] text-paper transition-colors hover:text-accent-nature disabled:cursor-wait disabled:opacity-70"
        >
          {isLoading ? 'Verzenden…' : 'Aanmelden'}
        </button>

        {status === 'error' && errorMessage ? (
          <p role="alert" className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-nature">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70">
        {label}
      </label>
      <div
        className={`border-b pb-2 transition-colors focus-within:border-accent-nature ${
          error ? 'border-accent-nature' : 'border-paper/30'
        }`}
      >
        {children}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-nature">
          {error}
        </p>
      ) : null}
    </div>
  )
}
