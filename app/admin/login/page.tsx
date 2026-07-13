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
    <div className="relative flex min-h-screen items-center overflow-hidden bg-[#000a54] px-6 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,_rgba(250,204,21,0.18),_transparent_28%),radial-gradient(circle_at_82%_22%,_rgba(45,212,191,0.22),_transparent_30%),radial-gradient(circle_at_50%_100%,_rgba(255,255,255,0.12),_transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute -left-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <section className="flex-1 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/15 backdrop-blur-xl lg:p-12">
          <div className="max-w-lg">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Admin dashboard</p>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Welcome back to Smile Center GH.
            </h1>
            <p className="mt-6 text-base leading-7 text-slate-200 sm:text-lg">
              Manage appointments, customers, services, and subscriptions from one elegant staff portal.
            </p>

            <div className="mt-10 grid gap-4 text-sm sm:grid-cols-2">
              {[
                "Quick appointment review",
                "Customer and branch tools",
                "Secure staff authentication",
                "Real-time operational insights",
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-100 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full">
          <Card className="mx-auto max-w-md border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-8">
              <p className="font-serif text-3xl font-bold text-white">Sign in</p>
              <p className="mt-2 text-sm text-slate-300">Enter your staff credentials to access the admin console.</p>
            </div>

            <form action={formAction} className="space-y-4">
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
                <p className="rounded-2xl bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">{state.error}</p>
              )}
              <SubmitButton />
            </form>
          </Card>
        </section>
      </div>
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
