import { body } from "express-validator";
import helper from "../../helper/helper.js";

const validate = (method) => {
  switch (method) {
    case "registerUser": {
      return [
        body("firstName").notEmpty().withMessage("First name is required"),
        body("lastName").notEmpty().withMessage("Last name is required"),
        body("email").isEmail().withMessage("Invalid email"),
        body("password")
          .isLength({ min: 4 })
          .withMessage("Password must be at least 6 characters long"),

        helper.validatorMiddleware,
      ];
    }
    case "loginUser": {
      return [
        body("email").isEmail().withMessage("Invalid email"),
        helper.validatorMiddleware,
      ];
    }
  }
};

export default validate;
