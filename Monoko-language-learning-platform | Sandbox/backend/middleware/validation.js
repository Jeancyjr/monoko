const Joi = require('joi');

// Common validation schemas
const schemas = {
  // User registration validation
  registerUser: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
    selectedLanguage: Joi.string().valid('sw', 'ln', 'am').required().messages({
      'any.only': 'Selected language must be one of: sw (Swahili), ln (Lingala), am (Amharic)',
      'any.required': 'Selected language is required'
    })
  }),

  // User login validation
  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Book live session validation
  bookSession: Joi.object({
    speakerId: Joi.string().required().messages({
      'any.required': 'Speaker ID is required'
    }),
    date: Joi.date().greater('now').required().messages({
      'date.greater': 'Session date must be in the future',
      'any.required': 'Session date is required'
    }),
    time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
      'string.pattern.base': 'Time must be in HH:MM format',
      'any.required': 'Session time is required'
    }),
    duration: Joi.number().valid(30, 60, 90).required().messages({
      'any.only': 'Duration must be 30, 60, or 90 minutes',
      'any.required': 'Session duration is required'
    }),
    topics: Joi.array().items(Joi.string()).max(5).messages({
      'array.max': 'Maximum 5 topics allowed'
    })
  }),

  // Lesson completion validation
  completeLesson: Joi.object({
    lessonId: Joi.string().required(),
    score: Joi.number().min(0).max(100).required(),
    timeSpent: Joi.number().min(1).max(3600).required(), // 1 second to 1 hour
    mistakesCount: Joi.number().min(0).required()
  }),

  // Game score submission validation
  submitGameScore: Joi.object({
    gameId: Joi.string().valid('word-match-blitz', 'echo-me', 'memory-cards', 'trace-it').required(),
    score: Joi.number().min(0).required(),
    duration: Joi.number().min(1).required(),
    wordsCorrect: Joi.number().min(0).required(),
    wordsIncorrect: Joi.number().min(0).required()
  }),

  // Snap & Learn image analysis validation
  analyzeImage: Joi.object({
    language: Joi.string().valid('sw', 'ln', 'am').required(),
    confidence: Joi.number().min(0).max(1)
  }),

  // Update user profile validation
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    selectedLanguage: Joi.string().valid('sw', 'ln', 'am'),
    preferences: Joi.object({
      dailyGoal: Joi.number().min(1).max(100),
      notifications: Joi.boolean(),
      offlineMode: Joi.boolean(),
      audioEnabled: Joi.boolean(),
      darkMode: Joi.boolean()
    }).unknown(false)
  })
};

// Validation middleware factory
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        success: false,
        error: 'Validation Error',
        message: `Validation schema '${schemaName}' not found`
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown fields
      convert: true // Convert types when possible
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please check your input data',
        details: errorDetails
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Query parameter validation middleware
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        parameter: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      return res.status(400).json({
        success: false,
        error: 'Query Parameter Error',
        message: 'Invalid query parameters',
        details: errorDetails
      });
    }

    req.query = value;
    next();
  };
};

// Custom validation for file uploads (Snap & Learn)
const validateImageUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'File Upload Error',
      message: 'No image file provided'
    });
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      error: 'File Type Error',
      message: 'Only JPEG, PNG, and WebP images are allowed'
    });
  }

  if (req.file.size > maxFileSize) {
    return res.status(400).json({
      success: false,
      error: 'File Size Error',
      message: 'Image file size must be less than 5MB'
    });
  }

  next();
};

// Language code validation
const validateLanguageCode = (req, res, next) => {
  const validLanguages = ['sw', 'ln', 'am'];
  const { id: languageId } = req.params;

  if (!validLanguages.includes(languageId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Language',
      message: `Language code '${languageId}' is not supported. Valid codes: ${validLanguages.join(', ')}`,
      supportedLanguages: validLanguages
    });
  }

  next();
};

// Rate limiting schemas for different endpoints
const rateLimitSchemas = {
  // Stricter limits for AI-powered endpoints
  snapLearn: Joi.object({
    requests: Joi.number().max(50).default(50),
    windowMs: Joi.number().default(3600000) // 1 hour
  }),

  // Standard API limits
  standard: Joi.object({
    requests: Joi.number().max(1000).default(1000),
    windowMs: Joi.number().default(3600000) // 1 hour
  }),

  // Authentication limits (prevent brute force)
  auth: Joi.object({
    requests: Joi.number().max(10).default(10),
    windowMs: Joi.number().default(900000) // 15 minutes
  })
};

// Sanitization helpers
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return input;
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = sanitizeInput(value);
    }
  }
  return sanitized;
};

module.exports = {
  validate,
  validateQuery,
  validateImageUpload,
  validateLanguageCode,
  sanitizeInput,
  sanitizeObject,
  schemas,
  rateLimitSchemas
};
