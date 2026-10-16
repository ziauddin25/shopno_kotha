export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
}

export type ContactFieldKey = keyof ContactFormValues;

export type ContactErrorKey =
  | "nameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "subjectRequired"
  | "messageRequired"
  | "messageShort"
  | "consentRequired";

export type ContactErrors = Partial<Record<ContactFieldKey, ContactErrorKey>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(values: ContactFormValues): ContactErrors {
  const errors: ContactErrors = {};

  if (!values.name.trim()) errors.name = "nameRequired";
  if (!values.email.trim()) {
    errors.email = "emailRequired";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "emailInvalid";
  }
  if (!values.subject.trim()) errors.subject = "subjectRequired";
  if (!values.message.trim()) {
    errors.message = "messageRequired";
  } else if (values.message.trim().length < 10) {
    errors.message = "messageShort";
  }
  if (!values.consent) errors.consent = "consentRequired";

  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Phase 1 submission is intentionally inert: it waits briefly and resolves so
 * the success state can be demonstrated. Nothing leaves the browser.
 */
export async function submitContactMessage(): Promise<{ ok: true }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { ok: true };
}
