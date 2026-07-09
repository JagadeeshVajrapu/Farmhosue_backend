export declare const propertyValidation: import("express-validator").ValidationChain[];
/** Get all properties with optional filters */
export declare const getProperties: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** Get single property by slug */
export declare const getPropertyBySlug: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** Create property (admin only) */
export declare const createProperty: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** Update property (admin only) */
export declare const updateProperty: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** Delete property (admin only) */
export declare const deleteProperty: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** Get featured properties for homepage */
export declare const getFeaturedProperties: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=propertyController.d.ts.map