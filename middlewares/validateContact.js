const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");

exports.validateContact = [
  // Validation rules
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 100 })
    .withMessage("Full name cannot exceed 100 characters"),
  body("companyName")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/^[\d\s\+\-\(\)]{10,20}$/)
    .withMessage("Invalid phone number"),
  body("services").optional().isArray(),
  body("services.*").optional().isString(),
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10-1000 characters"),

  // Handle validation
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Additional business logic validation
    try {
      const { services } = req.body;
      const validServices = [
        "web-development",
        "consulting",
        "design",
        "marketing",
        "other",
      ];

      if (
        services &&
        services.some((service) => !validServices.includes(service))
      ) {
        return res.status(400).json({
          errors: [{ msg: "Invalid service type provided" }],
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  },
];
