import {
  registerPlugin,
} from "@capacitor/core";

export type StoreKitProduct = {
  id: string;
  displayName: string;
  description: string;
  displayPrice: string;
};

export type StoreKitProductsResponse = {
  products: StoreKitProduct[];
};

export type StoreKitPurchaseResponse =
  | {
      productId: string;
      transactionId: string;
      originalTransactionId: string;
      signedTransaction: string;
      status?: undefined;
    }
  | {
      status: "PENDING" | "CANCELLED";
      productId?: undefined;
      transactionId?: undefined;
      originalTransactionId?: undefined;
      signedTransaction?: undefined;
    };

export type StoreKitRestoredTransaction = {
  productId: string;
  transactionId: string;
  originalTransactionId: string;
  signedTransaction: string;
};

export type StoreKitRestoreResponse = {
  transactions:
    StoreKitRestoredTransaction[];
};

export type StoreKitFinishResponse = {
  success: boolean;
  transactionId: string;
  alreadyFinished?: boolean;
};

type IronAgeStoreKitPlugin = {
  getProducts(options?: {
    productIds?: string[];
  }): Promise<
    StoreKitProductsResponse
  >;

  purchase(options: {
    productId: string;
  }): Promise<
    StoreKitPurchaseResponse
  >;

  restorePurchases(): Promise<
    StoreKitRestoreResponse
  >;

  finishTransaction(options: {
    transactionId: string;
  }): Promise<
    StoreKitFinishResponse
  >;
};

export const IronAgeStoreKit =
  registerPlugin<IronAgeStoreKitPlugin>(
    "IronAgeStoreKit"
  );
