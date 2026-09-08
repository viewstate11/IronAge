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
        ),
        CAPPluginMethod(
            name: "restorePurchases",
            returnType: CAPPluginReturnPromise
        ),
        CAPPluginMethod(
            name: "finishTransaction",
            returnType: CAPPluginReturnPromise
        )
    ]

    private let premiumProductIDs: Set<String> = [
        "com.ironage.app.premium.monthly",
        "com.ironage.app.premium.yearly"
    ]

    private let programProductPrefix =
        "com.ironage.app.program."

    private func isSupportedProductID(
        _ productId: String
    ) -> Bool {
        if premiumProductIDs.contains(
            productId
        ) {
            return true
        }

        return productId.hasPrefix(
            programProductPrefix
        )
    }

    @objc func getProducts(
        _ call: CAPPluginCall
    ) {
        let requestedProductIDs =
            call.getArray(
                "productIds",
                String.self
            ) ?? Array(
                premiumProductIDs
            )

        let validProductIDs =
            Set(
                requestedProductIDs.filter {
                    isSupportedProductID($0)
                }
            )

        guard
            !validProductIDs.isEmpty
        else {
            call.reject(
                "No supported StoreKit products requested"
            )
            return
        }

        Task {
            do {
                let products =
                    try await Product.products(
                        for: validProductIDs
                    )

                let result: [
                    [String: Any]
                ] = products.map { product in
                    [
                        "id":
                            product.id,

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
                        "products":
                            result
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
                call.getString(
                    "productId"
                ),
            isSupportedProductID(
                productId
            )
        else {
            call.reject(
                "Unsupported StoreKit product"
            )
            return
        }

        Task {
            do {
                let products =
                    try await Product.products(
                        for: [
                            productId
                        ]
                    )

                guard
                    let product =
                        products.first
                else {
                    await MainActor.run {
                        call.reject(
                            "StoreKit product not found"
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

                        /*
                         * IMPORTANT:
                         * Do NOT finish here.
                         *
                         * Backend must verify the signed
                         * transaction and grant access
                         * first. The frontend will then
                         * call finishTransaction().
                         */
                        await MainActor.run {
                            call.resolve([
                                "productId":
                                    transaction
                                        .productID,

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
                            "status":
                                "PENDING"
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

    @objc func restorePurchases(
        _ call: CAPPluginCall
    ) {
        Task {
            do {
                /*
                 * Ask App Store to synchronize
                 * the customer's purchases.
                 */
                try await AppStore.sync()

                var restored: [
                    [String: Any]
                ] = []

                for await result
                    in Transaction.currentEntitlements
                {
                    switch result {

                    case .verified(
                        let transaction
                    ):
                        guard
                            isSupportedProductID(
                                transaction.productID
                            )
                        else {
                            continue
                        }

                        /*
                         * Revoked transactions must not
                         * restore access.
                         */
                        if transaction.revocationDate
                            != nil
                        {
                            continue
                        }

                        restored.append([
                            "productId":
                                transaction
                                    .productID,

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
                                result
                                    .jwsRepresentation
                        ])

                    case .unverified:
                        /*
                         * Never grant anything from an
                         * unverified StoreKit result.
                         */
                        continue
                    }
                }

                await MainActor.run {
                    call.resolve([
                        "transactions":
                            restored
                    ])
                }
            } catch {
                await MainActor.run {
                    call.reject(
                        "Failed to restore StoreKit purchases",
                        nil,
                        error
                    )
                }
            }
        }
    }

    @objc func finishTransaction(
        _ call: CAPPluginCall
    ) {
        guard
            let rawTransactionId =
                call.getString(
                    "transactionId"
                ),
            let transactionId =
                UInt64(
                    rawTransactionId
                )
        else {
            call.reject(
                "Invalid transactionId"
            )
            return
        }

        Task {
            /*
             * Look through unfinished transactions.
             * Only finish the exact transaction
             * acknowledged by our backend.
             */
            for await result
                in Transaction.unfinished
            {
                switch result {

                case .verified(
                    let transaction
                ):
                    guard
                        transaction.id ==
                            transactionId
                    else {
                        continue
                    }

                    guard
                        isSupportedProductID(
                            transaction.productID
                        )
                    else {
                        await MainActor.run {
                            call.reject(
                                "Unsupported StoreKit transaction"
                            )
                        }
                        return
                    }

                    await transaction.finish()

                    await MainActor.run {
                        call.resolve([
                            "success":
                                true,

                            "transactionId":
                                String(
                                    transaction.id
                                )
                        ])
                    }

                    return

                case .unverified:
                    continue
                }
            }

            /*
             * Idempotent behavior:
             * if StoreKit no longer reports it as
             * unfinished, it may already be finished.
             */
            await MainActor.run {
                call.resolve([
                    "success":
                        true,

                    "transactionId":
                        rawTransactionId,

                    "alreadyFinished":
                        true
                ])
            }
        }
    }
}
