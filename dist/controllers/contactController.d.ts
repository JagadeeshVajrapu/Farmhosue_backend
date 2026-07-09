export declare const contactValidation: import("express-validator").ValidationChain[];
/** POST /api/contact — submit a new enquiry */
export declare const createContact: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const statusValidation: import("express-validator").ValidationChain[];
/** GET /api/contact — admin list with search, filter, pagination */
export declare const getContacts: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** GET /api/contact/export — CSV export */
export declare const exportContacts: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** GET /api/contact/:id — view single enquiry */
export declare const getContactById: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** PATCH /api/contact/:id/status — update status */
export declare const updateContactStatus: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/** DELETE /api/contact/:id — delete enquiry */
export declare const deleteContact: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=contactController.d.ts.map