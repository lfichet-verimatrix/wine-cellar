const { ValidationError } = require("../utils/errors");

/**
 * Middleware factory that validates req.body, req.query, and req.params
 * against a Zod schema object: { body?, query?, params? }.
 */
function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const source of ["params", "query", "body"]) {
      if (schema[source]) {
        const result = schema[source].safeParse(req[source]);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            errors.push({
              source,
              path: issue.path.join("."),
              message: issue.message,
            });
          });
        } else {
          // Replace with parsed/coerced values
          req[source] = result.data;
        }
      }
    }

    if (errors.length > 0) {
      return next(new ValidationError("Validation failed", errors));
    }

    next();
  };
}

module.exports = validate;
