import Foundation
import Capacitor
import StoreKit

@objc(IronAgeStoreKitPlugin)
public class IronAgeStoreKitPlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier =
        "IronAgeStoreKitPlugin"

    public let jsName =
        "IronAgeStoreKit"

    public let pluginMethods: [
        CAPPluginMethod
    ] = [
        CAPPluginMethod(
            name: "getProducts",
            returnType: CAPPluginReturnPromise
        ),
        CAPPluginMethod(
            name: "purchase",
            returnType: CAPPluginReturnPromise
        )
    ]

    private let supportedProductIDs: Set<String> = [
        "com.ironage.app.premium.monthly",
        "com.ironage.app.premium.yearly"
    ]

    @objc func getProducts(
        _ call: CAPPluginCall
    ) {
        Task {
            do {
                let products =
                    try await Product.products(
                        for: supportedProductIDs
                    )

                let result: [
                    [String: Any]
                ] = products.map { product in
                    [
                        "id": product.id,
                        "displayName":
                            product.displayName,
                        "description":
                            product.description,
                        "displayPrice":
                            product.displayPrice
                    ]
                }

                await MainActor.run {
                    call.resolve([
                        "products": result
                    ])
                }
            } catch {
                await MainActor.run {
                    call.reject(
                        "Failed to load StoreKit products",
                        nil,
                        error
                    )
                }
            }
        }
    }

    @objc func purchase(
        _ call: CAPPluginCall
    ) {
        guard
            let productId =
                call.getString("productId"),
            supportedProductIDs.contains(
                productId
            )
        else {
            call.reject(
                "Unsupported Premium product"
            )
            return
        }

        Task {
            do {
                let products =
                    try await Product.products(
                        for: [productId]
                    )

                guard
                    let product =
                        products.first
                else {
                    await MainActor.run {
                        call.reject(
                            "Premium product not found"
                        )
                    }
                    return
                }

                let result =
                    try await product.purchase()

                switch result {
                case .success(
                    let verification
                ):
                    switch verification {
                    case .verified(
                        let transaction
                    ):
                        let signedTransaction =
                            verification
                                .jwsRepresentation

                        await transaction.finish()

                        await MainActor.run {
                            call.resolve([
                                "productId":
                                    transaction.productID,
                                "transactionId":
                                    String(
                                        transaction.id
                                    ),
                                "originalTransactionId":
                                    String(
                                        transaction
                                            .originalID
                                    ),
                                "signedTransaction":
                                    signedTransaction
                            ])
                        }

                    case .unverified(
                        _,
                        let error
                    ):
                        await MainActor.run {
                            call.reject(
                                "StoreKit transaction verification failed",
                                nil,
                                error
                            )
                        }
                    }

                case .pending:
                    await MainActor.run {
                        call.resolve([
                            "status": "PENDING"
                        ])
                    }

                case .userCancelled:
                    await MainActor.run {
                        call.resolve([
                            "status":
                                "CANCELLED"
                        ])
                    }

                @unknown default:
                    await MainActor.run {
                        call.reject(
                            "Unknown StoreKit purchase result"
                        )
                    }
                }
            } catch {
                await MainActor.run {
                    call.reject(
                        "StoreKit purchase failed",
                        nil,
                        error
                    )
                }
            }
        }
    }
}
