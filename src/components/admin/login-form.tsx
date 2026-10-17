"use client";

import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, type SignInState } from "@/lib/auth/actions";
import type { Messages } from "@/messages";
import type { Locale } from "@/types";

interface LoginFormProps {
  locale: Locale;
  labels: Messages["auth"];
}

export function LoginForm({ locale, labels }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<SignInState, FormData>(
    signInAction,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8"
    >
      <input type="hidden" name="locale" value={locale} />

      {state?.error ? (
        <Alert variant="destructive">
          <AlertTitle>{labels.loginTitle}</AlertTitle>
          <AlertDescription>{labels.errors[state.error]}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">{labels.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder={labels.emailPlaceholder}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{labels.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder={labels.passwordPlaceholder}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? labels.signingIn : labels.signIn}
      </Button>
    </form>
  );
}
