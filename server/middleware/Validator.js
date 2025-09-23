const { BadRequestError } = require("../errors");

const Validator = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) throw new BadRequestError(error.message);
    req.body = value;
    next();
  };
};

module.exports = Validator;