"use server";

import { revalidatePath } from "next/cache";

export type BulkSmsState = {
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

export async function sendBulkSms(
  _prevState: BulkSmsState,
  formData: FormData
): Promise<BulkSmsState> {
  const recipientsRaw = String(formData.get("recipients") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!message) {
    return { error: "Please enter a message to send." };
  }

  const recipients = recipientsRaw
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return { error: "Add at least one phone number or recipient entry." };
  }

  const username = process.env.NALO_SMS_USERNAME;
  const password = process.env.NALO_SMS_PASSWORD;
  const senderId = process.env.NALO_SMS_SENDER_ID;
  const reseller = process.env.NALO_SMS_RESELLER || "Resl_Nalo";

  if (!username || !password || !senderId) {
    return { error: "Nalo SMS credentials are not configured yet." };
  }

  const failures: string[] = [];

  for (const recipient of recipients) {
    const destination = normalizePhone(recipient);
    if (!destination) {
      failures.push(recipient);
      continue;
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

      if (!response.ok || !body.trim()) {
        failures.push(recipient);
      }
    } catch {
      failures.push(recipient);
    }
  }

  revalidatePath("/admin/sms");

  if (failures.length > 0) {
    return {
      error: `Some recipients could not be processed: ${failures.join(", ")}`,
    };
  }

  return {
    success: `Bulk SMS queued for ${recipients.length} recipient(s).`,
  };
}
