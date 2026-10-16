"use client";

import { useState, type FormEvent } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ContactErrors,
  type ContactFormValues,
  hasErrors as formHasErrors,
  submitContactMessage,
  validateContactForm,
} from "@/lib/services/contact-service";
import type { Messages } from "@/messages";

const subjectValues = ["correction", "question", "feedback", "other"] as const;

export type ContactFormLabels = Messages["contact"];

interface ContactFormProps {
  labels: ContactFormLabels;
  locale: "bn" | "en";
}

export function ContactForm({ labels, locale }: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorFor = (key: keyof ContactErrors) => errors[key];

  function onSubjectChange(next: string | null) {
    setValues((prev) => ({ ...prev, subject: next ?? "" }));
    if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (formHasErrors(nextErrors)) return;

    setIsSubmitting(true);
    try {
      await submitContactMessage();
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setValues({ name: "", email: "", subject: "", message: "", consent: false });
    setErrors({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <Alert className="rounded-2xl border-forest/25 bg-sage/40">
        <AlertTitle className="text-base text-forest">{labels.successTitle}</AlertTitle>
        <AlertDescription className="mt-2 text-pretty text-sm text-muted-foreground">
          {labels.successBody}
        </AlertDescription>
        <div className="mt-4">
          <Button type="button" size="sm" onClick={resetForm} variant="outline">
            {labels.sendAnother}
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{labels.formTitle}</h2>
        <p className="text-sm text-muted-foreground">{labels.demoNote}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{labels.name}</Label>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={(event) => {
              setValues((prev) => ({ ...prev, name: event.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder={labels.namePlaceholder}
            autoComplete="name"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name ? (
            <p className="text-xs text-destructive">{labels.errors[errors.name]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{labels.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => {
              setValues((prev) => ({ ...prev, email: event.target.value }));
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder={labels.emailPlaceholder}
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{labels.errors[errors.email]}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{labels.subject}</Label>
        <Select value={values.subject || ""} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={labels.subjectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {subjectValues.map((value) => (
              <SelectItem key={value} value={value}>
                {labels.subjects[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subject ? (
          <p className="text-xs text-destructive">{labels.errors[errors.subject]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{labels.message}</Label>
        <Textarea
          id="message"
          name="message"
          value={values.message}
          onChange={(event) => {
            setValues((prev) => ({ ...prev, message: event.target.value }));
            if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
          }}
          placeholder={labels.messagePlaceholder}
          rows={6}
          aria-invalid={errors.message ? "true" : "false"}
        />
        {errors.message ? (
          <p className="text-xs text-destructive">{labels.errors[errors.message]}</p>
        ) : null}
      </div>

      <div className="flex items-start gap-3">
        <Switch
          id="consent"
          name="consent"
          checked={values.consent}
          onCheckedChange={(checked) => {
            setValues((prev) => ({ ...prev, consent: checked }));
            if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
          }}
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
          {labels.consent}
        </Label>
      </div>
      {errors.consent ? (
        <p className="text-xs text-destructive">{labels.errors[errors.consent]}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{labels.responseTitle}: {labels.responseBody}</p>
        <Button type="submit" disabled={isSubmitting} size="sm">
          {isSubmitting ? labels.submitting : labels.submit}
        </Button>
      </div>
    </form>
  );
}
