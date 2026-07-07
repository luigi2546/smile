"use client";

import { useState } from "react";
import { Button, Input, Label } from "@/components/ui/primitives";
import type { SubscriptionPlan } from "@/lib/types";

type Props = {
  plan: SubscriptionPlan;
  publicKey: string;
};

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

export function PaystackCheckoutClient({ plan, publicKey }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const loadPaystack = async () => {
    if (typeof window === "undefined") return;
    if (window.PaystackPop) return;

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Paystack script."));
      document.body.appendChild(script);
    });
  };

  const verifyPayment = async (reference: string) => {
    const result = await fetch("/api/paystack/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    });

    const data = await result.json();
    if (!result.ok) {
      throw new Error(data?.error || "Could not verify payment.");
    }

    return data;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Full name, email, and phone number are required.");
      return;
    }

    setPending(true);

    try {
      await loadPaystack();
      if (!window.PaystackPop) {
        throw new Error("Paystack is not available.");
      }

      const initRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          fullName,
          email,
          phone,
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok) {
        throw new Error(initData?.error || "Unable to initialize payment.");
      }

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: initData.amount,
        currency: "GHS",
        ref: initData.reference,
        metadata: {
          planId: plan.id,
          fullName,
          phone,
        },
        callback: function (response: { reference: string }) {
          verifyPayment(response.reference)
            .then((verifyData) => {
              window.location.href = `/membership/checkout/success?subscriptionId=${encodeURIComponent(
                verifyData.subscriptionId
              )}&planId=${encodeURIComponent(plan.id)}`;
            })
            .catch((verifyError: any) => {
              setError(verifyError?.message || "Payment succeeded but verification failed.");
              setPending(false);
            });
        },
        onClose: function () {
          setPending(false);
          if (!status) {
            setError("Payment window closed before completion.");
          }
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setPending(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="jane@example.com"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          name="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+233 24 000 0000"
          required
        />
      </div>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {status && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {status}
        </div>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Opening Paystack…" : `Pay ${formatAmount(plan.price_ghs)} now`}
      </Button>
    </form>
  );
}

function formatAmount(amount: number) {
  return `GHS ${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
