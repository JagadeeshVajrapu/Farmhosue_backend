export declare const reviewValidation: import("express-validator").ValidationChain[];
/** Get approved reviews for a property */
export declare const getPropertyReviews: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** Create a review */
export declare const createReview: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** Approve review (admin) */
export declare const approveReview: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** Get pending reviews (admin) */
export declare const getPendingReviews: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=reviewController.d.ts.map