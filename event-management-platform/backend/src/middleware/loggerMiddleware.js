export const logCloudinaryOperations = (req, res, next) => {
  console.log("Cloudinary Operation:", {
    method: req.method,
    path: req.path,
    imageUrl: req.body?.image || "No image",
  });
  next();
};
