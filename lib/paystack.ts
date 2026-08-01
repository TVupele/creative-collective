const PAYSTACK_BASE = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not set. Add your Paystack secret key to .env.local."
    );
  }
  return key;
}

interface InitializeParams {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

interface InitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializeTransaction(
  params: InitializeParams
): Promise<InitializeResponse["data"]> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const data = (await res.json()) as InitializeResponse;
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Paystack initialization failed.");
  }
  return data.data;
}

interface VerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    customer: { email: string };
  };
}

export async function verifyTransaction(reference: string): Promise<VerifyResponse["data"]> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${getSecretKey()}` },
    }
  );

  const data = (await res.json()) as VerifyResponse;
  if (!res.ok || !data.status) {
    throw new Error(data.message || "Paystack verification failed.");
  }
  return data.data;
}

export function getPublicKey(): string {
  const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set.");
  }
  return key;
}
