export const getCloudinaryPublicId = (imageData) => {
  try {
    // Handle new image structure
    if (typeof imageData === "object" && imageData.original) {
      const urlParts = imageData.original.split("/");
      const fileName = urlParts[urlParts.length - 1];
      return `events/${fileName.split(".")[0]}`;
    }

    // Handle legacy string format
    if (typeof imageData === "string") {
      const urlParts = imageData.split("/");
      const fileName = urlParts[urlParts.length - 1];
      return `events/${fileName.split(".")[0]}`;
    }

    console.log("Invalid image data:", imageData);
    return null;
  } catch (error) {
    console.error("Error extracting Cloudinary public ID:", error);
    return null;
  }
};
