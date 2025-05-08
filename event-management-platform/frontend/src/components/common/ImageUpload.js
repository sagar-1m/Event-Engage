import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const ImageUpload = ({
  onImageSelect,
  currentImage,
  onImageRemove,
  error,
  isUploading = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onImageSelect(file);
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onImageRemove && onImageRemove();
  };

  return (
    <Box sx={{ width: "100%", mt: 2, mb: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed",
          borderColor: dragActive ? "primary.main" : "grey.300",
          borderRadius: 1,
          p: 2,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: dragActive ? "action.hover" : "background.paper",
          position: "relative",
        }}
      >
        {isUploading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : previewUrl ? (
          <Box position="relative">
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                objectFit: "contain",
              }}
            />
            <IconButton
              onClick={handleRemove}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "error.light",
                  color: "white",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Box
            component="label"
            htmlFor="image-upload"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 4,
              cursor: "pointer",
            }}
          >
            <CloudUploadIcon
              sx={{ fontSize: 48, mb: 2, color: "primary.main" }}
            />
            <Typography variant="body1" gutterBottom>
              Drag and drop an image here or click to select
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Supported formats: JPG, JPEG, PNG (max 5MB)
            </Typography>
          </Box>
        )}
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: "none" }}
        />
      </Box>
    </Box>
  );
};

export default ImageUpload;
