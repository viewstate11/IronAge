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

const SUPPORTED_PRODUCTS =
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

function validateDecodedTransaction(
  transaction:
    JWSTransactionDecodedPayload
): AppleVerifiedTransaction {
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

  if (!SUPPORTED_PRODUCTS.has(productId)) {
    throw new Error(
      "Unsupported Apple Premium product"
    );
  }

  if (
    transaction.type !==
    Type.AUTO_RENEWABLE_SUBSCRIPTION
  ) {
    throw new Error(
      "Apple Premium product is not an auto-renewable subscription"
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

  const expiresDate =
    requireTimestamp(
      transaction.expiresDate,
      "expiresDate"
    );

  const purchasedAt =
    new Date(purchaseDate);

  const expiresAt =
    new Date(expiresDate);

  if (
    Number.isNaN(
      purchasedAt.getTime()
    )
  ) {
    throw new Error(
      "Apple purchase date is invalid"
    );
  }

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
    purchasedAt.getTime()
  ) {
    throw new Error(
      "Apple subscription expiration is invalid"
    );
  }

  if (
    expiresAt.getTime() <= Date.now()
  ) {
    throw new Error(
      "Apple subscription has expired"
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

    expiresAt,

    environment,
  };
}

export async function verifyAppleTransaction(
  signedTransaction: string,
  options: {
    environment: Environment;
    appAppleId?: number;
  }
): Promise<AppleVerifiedTransaction> {
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

  const decoded =
    await verifier.verifyAndDecodeTransaction(
      signedTransaction
    );

  return validateDecodedTransaction(
    decoded
  );
}
