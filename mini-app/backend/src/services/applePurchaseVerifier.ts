import {
  Environment,
  SignedDataVerifier,
  Type,
  type JWSTransactionDecodedPayload,
} from "@apple/app-store-server-library";

import {
  getAppleRootCertificates,
} from "./appleCertificates.js";

const APPLE_BUNDLE_ID =
  "com.ironage.app";

const PREMIUM_PRODUCTS =
  new Set([
    "com.ironage.app.premium.monthly",
    "com.ironage.app.premium.yearly",
  ]);

export type AppleVerifiedTransaction = {
  transactionId: string;
  originalTransactionId: string | null;
  productId: string;
  purchasedAt: Date;
  expiresAt: Date | null;
  environment: string;
};

function requireString(
  value: unknown,
  field: string
): string {
  if (
    typeof value !== "string" ||
    value.length === 0
  ) {
    throw new Error(
      `Apple transaction missing ${field}`
    );
  }

  return value;
}

function requireTimestamp(
  value: unknown,
  field: string
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    throw new Error(
      `Apple transaction missing ${field}`
    );
  }

  return value;
}

function validateCommonTransaction(
  transaction:
    JWSTransactionDecodedPayload
): Omit<
  AppleVerifiedTransaction,
  "expiresAt"
> {
  const transactionId =
    requireString(
      transaction.transactionId,
      "transactionId"
    );

  const productId =
    requireString(
      transaction.productId,
      "productId"
    );

  const bundleId =
    requireString(
      transaction.bundleId,
      "bundleId"
    );

  const environment =
    requireString(
      transaction.environment,
      "environment"
    );

  const purchaseDate =
    requireTimestamp(
      transaction.purchaseDate,
      "purchaseDate"
    );

  if (bundleId !== APPLE_BUNDLE_ID) {
    throw new Error(
      "Apple transaction bundle ID mismatch"
    );
  }

  if (
    typeof transaction.revocationDate ===
      "number" &&
    Number.isFinite(
      transaction.revocationDate
    )
  ) {
    throw new Error(
      "Apple transaction has been revoked"
    );
  }

  const purchasedAt =
    new Date(purchaseDate);

  if (
    Number.isNaN(
      purchasedAt.getTime()
    )
  ) {
    throw new Error(
      "Apple purchase date is invalid"
    );
  }

  return {
    transactionId,

    originalTransactionId:
      typeof transaction.originalTransactionId ===
      "string"
        ? transaction.originalTransactionId
        : null,

    productId,
    purchasedAt,
    environment,
  };
}

async function decodeAppleTransaction(
  signedTransaction: string,
  options: {
    environment: Environment;
    appAppleId?: number;
  }
): Promise<
  JWSTransactionDecodedPayload
> {
  if (
    typeof signedTransaction !== "string" ||
    signedTransaction.length === 0
  ) {
    throw new Error(
      "Apple signed transaction is required"
    );
  }

  if (
    options.environment ===
      Environment.PRODUCTION &&
    !options.appAppleId
  ) {
    throw new Error(
      "Apple app ID is required in production"
    );
  }

  const rootCertificates =
    getAppleRootCertificates();

  const verifier =
    new SignedDataVerifier(
      rootCertificates,
      true,
      options.environment,
      APPLE_BUNDLE_ID,
      options.appAppleId
    );

  return verifier.verifyAndDecodeTransaction(
    signedTransaction
  );
}

/* =========================================================
   PREMIUM SUBSCRIPTION VERIFICATION

   Existing behaviour is preserved.
========================================================= */

export async function verifyAppleTransaction(
  signedTransaction: string,
  options: {
    environment: Environment;
    appAppleId?: number;
  }
): Promise<AppleVerifiedTransaction> {
  const decoded =
    await decodeAppleTransaction(
      signedTransaction,
      options
    );

  const common =
    validateCommonTransaction(
      decoded
    );

  if (
    !PREMIUM_PRODUCTS.has(
      common.productId
    )
  ) {
    throw new Error(
      "Unsupported Apple Premium product"
    );
  }

  if (
    decoded.type !==
    Type.AUTO_RENEWABLE_SUBSCRIPTION
  ) {
    throw new Error(
      "Apple Premium product is not an auto-renewable subscription"
    );
  }

  const expiresDate =
    requireTimestamp(
      decoded.expiresDate,
      "expiresDate"
    );

  const expiresAt =
    new Date(expiresDate);

  if (
    Number.isNaN(
      expiresAt.getTime()
    )
  ) {
    throw new Error(
      "Apple expiration date is invalid"
    );
  }

  if (
    expiresAt.getTime() <=
    common.purchasedAt.getTime()
  ) {
    throw new Error(
      "Apple subscription expiration is invalid"
    );
  }

  if (
    expiresAt.getTime() <=
    Date.now()
  ) {
    throw new Error(
      "Apple subscription has expired"
    );
  }

  return {
    ...common,
    expiresAt,
  };
}

/* =========================================================
   PROGRAM PURCHASE VERIFICATION

   Standalone IRONAGE programs are Apple NON_CONSUMABLE
   products.

   IMPORTANT:
   Product ownership is NOT decided here.

   The caller must compare transaction.productId with the
   TrainingProgram.appleProductId stored in the database.
========================================================= */

export async function verifyAppleProgramTransaction(
  signedTransaction: string,
  options: {
    environment: Environment;
    appAppleId?: number;
  }
): Promise<AppleVerifiedTransaction> {
  const decoded =
    await decodeAppleTransaction(
      signedTransaction,
      options
    );

  const common =
    validateCommonTransaction(
      decoded
    );

  if (
    decoded.type !==
    Type.NON_CONSUMABLE
  ) {
    throw new Error(
      "Apple program product is not a non-consumable purchase"
    );
  }

  return {
    ...common,
    expiresAt: null,
  };
}
