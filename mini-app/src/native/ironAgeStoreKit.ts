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

type IronAgeStoreKitPlugin = {
  getProducts(): Promise<
    StoreKitProductsResponse
  >;

  purchase(options: {
    productId: string;
  }): Promise<
    StoreKitPurchaseResponse
  >;
};

export const IronAgeStoreKit =
  registerPlugin<IronAgeStoreKitPlugin>(
    "IronAgeStoreKit"
  );
