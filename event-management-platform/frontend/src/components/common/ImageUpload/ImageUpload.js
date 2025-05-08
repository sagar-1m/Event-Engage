import React, { useState, useCallback } from "react";
import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@mui/styles";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const useStyles = makeStyles((theme) => ({
  dropzone: {
    border: `2px dashed ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    textAlign: "center",
    cursor: "pointer",
    minHeight: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
  },
  preview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: theme.shape.borderRadius,
  },
  deleteButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: theme.palette.error.light,
      color: "white",
    },
  },
}));

const ImageUpload = ({ onUpload, previewUrl, isUploading }) => {
  const classes = useStyles();
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    if (!file) return "No file selected";
    if (!file.type.startsWith("image/")) return "File must be an image";
    if (file.size > MAX_FILE_SIZE)
      return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      return `File type must be one of: ${Object.values(ACCEPTED_TYPES)
        .flat()
        .join(", ")}`;
    }
    return null;
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        await onUpload(file);
        setError(null);
      } catch (err) {
        setError(err.message || "Error uploading file");
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (!rejection) return;

      const error = rejection.errors[0];
      switch (error?.code) {
        case "file-too-large":
          setError(
            `File is too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
          );
          break;
        case "file-invalid-type":
          setError(
            `Invalid file type. Accepted types: ${Object.values(ACCEPTED_TYPES)
              .flat()
              .join(", ")}`
          );
          break;
        default:
          setError(error?.message || "Invalid file");
      }
    },
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onUpload(null);
    setError(null);
  };

  return (
    <Box>
      <div
        {...getRootProps()}
        className={classes.dropzone}
        style={{
          opacity: isUploading ? 0.6 : 1,
          pointerEvents: isUploading ? "none" : "auto",
        }}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <CircularProgress />
        ) : previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className={classes.preview} />
            <IconButton
              className={classes.deleteButton}
              onClick={handleRemove}
              size="small"
            >
              <Delete />
            </IconButton>
          </>
        ) : (
          <Box sx={{ p: 2 }}>
            <CloudUpload sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography>
              {isDragActive
                ? "Drop the image here"
                : "Drag and drop an image here, or click to select"}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Maximum file size: 5MB
            </Typography>
          </Box>
        )}
      </div>
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
