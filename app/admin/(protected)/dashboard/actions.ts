"use server";

import { revalidatePath } from "next/cache";

export type SmsActionState = {
  success?: string;
  error?: string;
};

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `233${digits.slice(1)}`;
  if (digits.startsWith("233")) return digits;
  return `233${digits}`;
}

export async function sendSms(
  _prevState: SmsActionState,
  formData: FormData
): Promise<SmsActionState> {
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!phone || !message) {
    return { error: "Phone number and message are required." };
  }

  const username = process.env.NALO_SMS_USERNAME;
  const password = process.env.NALO_SMS_PASSWORD;
  const senderId = process.env.NALO_SMS_SENDER_ID;
  const reseller = process.env.NALO_SMS_RESELLER || "Resl_Nalo";

  if (!username || !password || !senderId) {
    return { error: "Nalo SMS credentials are not configured yet." };
  }

  const destination = normalizePhone(phone);
  if (!destination) {
    return { error: "Please enter a valid phone number." };
  }

  const endpoint = new URL(
    process.env.NALO_SMS_API_URL ||
      `https://sms.nalosolutions.com/smsbackend/clientapi/${reseller}/send-message/`
  );

  endpoint.searchParams.set("username", username);
  endpoint.searchParams.set("password", password);
  endpoint.searchParams.set("type", "0");
  endpoint.searchParams.set("destination", destination);
  endpoint.searchParams.set("dlr", "1");
  endpoint.searchParams.set("source", senderId);
  endpoint.searchParams.set("message", message);

  try {
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: { Accept: "text/plain" },
    });

    const body = await response.text();
    if (!response.ok) {
      return { error: body || `SMS request failed with status ${response.status}.` };
    }

    if (!body.trim()) {
      return { error: "The SMS gateway returned an empty response." };
    }

    revalidatePath("/admin/dashboard");
    return {
      success: `SMS sent. Gateway response: ${body.trim()}`,
    };
  } catch (error) {
    console.error("Nalo SMS send error:", error);
    return { error: "The SMS request could not be completed. Please verify the gateway settings." };
  }
}
