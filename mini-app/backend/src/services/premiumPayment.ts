export type PremiumPlan =
  | "MONTHLY"
  | "YEARLY";

export type PaymentPlatform =
  | "IOS"
  | "ANDROID"
  | "WEB"
  | "TELEGRAM";

export type PaymentProvider =
  | "APPLE"
  | "GOOGLE"
  | "WEB";

export type PurchaseVerificationInput = {
  provider: PaymentProvider;
  platform: PaymentPlatform;
  productId: string;
  transactionId: string;
  verificationPayload: string;
};

export type VerifiedPurchase = {
  provider: PaymentProvider;
  platform: PaymentPlatform;
  productId: string;
  plan: PremiumPlan;
  transactionId: string;
  originalTransactionId: string | null;
  purchasedAt: Date;
  expiresAt: Date | null;
};

const PRODUCT_PLANS: Record<
  string,
  PremiumPlan
> = {
  "com.ironage.app.premium.monthly":
    "MONTHLY",

  "com.ironage.app.premium.yearly":
    "YEARLY",
};

export function getPremiumPlanForProduct(
  productId: string
): PremiumPlan | null {
  return PRODUCT_PLANS[productId] ?? null;
}

export async function verifyPremiumPurchase(
  input: PurchaseVerificationInput
): Promise<VerifiedPurchase> {
  const plan =
    getPremiumPlanForProduct(
      input.productId
    );

  if (!plan) {
    throw new Error(
      "Unsupported Premium product"
    );
  }

  switch (input.provider) {
    case "APPLE":
      throw new Error(
        "Apple purchase verification is not configured"
      );

    case "GOOGLE":
      throw new Error(
        "Google purchase verification is not configured"
      );

    case "WEB":
      throw new Error(
        "Web payment verification is not configured"
      );

    default: {
      const exhaustiveCheck: never =
        input.provider;

      throw new Error(
        `Unsupported payment provider: ${exhaustiveCheck}`
      );
    }
  }
}
