import multer from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

// Configure multer storage
const storage = multer.memoryStorage();

// Enhanced file filter
const fileFilter = (req, file, cb) => {
  // Check if file exists and has content
  if (!file || !file.originalname) {
    return cb(new Error("No file provided"), false);
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`
      ),
      false
    );
  }

  // Validate file extension
  const fileExt = file.originalname.split(".").pop()?.toLowerCase();
  if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
    return cb(
      new Error(
        `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
      ),
      false
    );
  }

  // File is valid
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? `File too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
          : err.message,
    });
  }

  // Handle custom errors
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Error processing file",
    });
  }

  next();
};

export { upload, handleMulterError };
