import {
  Environment,
} from "@apple/app-store-server-library";

import {
  verifyAppleTransaction,
} from "./applePurchaseVerifier.js";

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
  verificationPayload: string;
  productId?: string;
  transactionId?: string;
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

function getAppleVerificationConfig(): {
  environment: Environment;
  appAppleId?: number;
} {
  const configuredEnvironment =
    (
      process.env.APPLE_IAP_ENVIRONMENT ??
      "SANDBOX"
    )
      .trim()
      .toUpperCase();

  if (
    configuredEnvironment ===
    "SANDBOX"
  ) {
    return {
      environment:
        Environment.SANDBOX,
    };
  }

  if (
    configuredEnvironment ===
    "PRODUCTION"
  ) {
    const rawAppAppleId =
      process.env.APPLE_APP_ID?.trim();

    const appAppleId =
      rawAppAppleId
        ? Number(rawAppAppleId)
        : NaN;

    if (
      !Number.isSafeInteger(appAppleId) ||
      appAppleId <= 0
    ) {
      throw new Error(
        "APPLE_APP_ID is required for Apple production verification"
      );
    }

    return {
      environment:
        Environment.PRODUCTION,
      appAppleId,
    };
  }

  throw new Error(
    "Invalid APPLE_IAP_ENVIRONMENT"
  );
}

export async function verifyPremiumPurchase(
  input: PurchaseVerificationInput
): Promise<VerifiedPurchase> {
  switch (input.provider) {
    case "APPLE": {
      if (input.platform !== "IOS") {
        throw new Error(
          "Apple purchases require IOS platform"
        );
      }

      const appleConfig =
        getAppleVerificationConfig();

      const transaction =
        await verifyAppleTransaction(
          input.verificationPayload,
          appleConfig
        );

      const plan =
        getPremiumPlanForProduct(
          transaction.productId
        );

      if (!plan) {
        throw new Error(
          "Unsupported Apple Premium product"
        );
      }

      return {
        provider: "APPLE",
        platform: "IOS",
        productId:
          transaction.productId,
        plan,
        transactionId:
          transaction.transactionId,
        originalTransactionId:
          transaction.originalTransactionId,
        purchasedAt:
          transaction.purchasedAt,
        expiresAt:
          transaction.expiresAt,
      };
    }

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
