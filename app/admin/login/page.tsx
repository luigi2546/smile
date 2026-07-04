"use client";

import { Suspense, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "@/app/admin/actions";
import { Button, Card, Input, Label } from "@/components/ui/primitives";
import { useSearchParams } from "next/navigation";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/dashboard";
  const [state, formAction] = useFormState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-darker px-6">
      <Card className="w-full max-w-sm p-8">
        <p className="font-serif text-xl font-bold text-ink">Smile Center GH</p>
        <p className="mt-1 text-sm text-muted">Staff &amp; Admin Login</p>

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@smilecentergh.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {state?.error && (
            <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{state.error}</p>
          )}
          <SubmitButton />
        </form>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Signing in…" : "Sign In"}
    </Button>
  );
}
