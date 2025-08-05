import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Image as ImageIcon,
  FileImage,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Eye,
  Trash2,
  Star,
  StarOff,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Props for the ProductImageUpload component
 */
interface ProductImageUploadProps {
  /**
   * Array of currently uploaded image files
   */
  images: File[];

  /**
   * Callback function called when the images array changes
   * @param images - Updated array of image files
   */
  onImagesChange: (images: File[]) => void;

  /**
   * Maximum number of images that can be uploaded
   * @default 10
   */
  maxImages?: number;

  /**
   * Maximum file size allowed per image in megabytes
   * @default 5
   */
  maxFileSize?: number; // in MB

  /**
   * Array of accepted image MIME types
   * @default ["image/jpeg", "image/png", "image/webp", "image/gif"]
   */
  acceptedFormats?: string[];
}

interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxFileSize = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
}) => {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);

  // Generate previews when images change
  React.useEffect(() => {
    const previews: ImagePreview[] = images.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${index}-${Date.now()}`,
    }));

    setImagePreviews(previews);

    // Cleanup function to revoke object URLs
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.preview));
    };
  }, [images]);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `File type ${
        file.type
      } is not supported. Please use ${acceptedFormats.join(", ")}.`;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB.`;
    }

    return null;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadError(null);

      // Validate files
      const validFiles: File[] = [];
      const errors: string[] = [];

      acceptedFiles.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      // Check if adding these files would exceed the limit
      if (images.length + validFiles.length > maxImages) {
        errors.push(`Maximum ${maxImages} images allowed.`);
        const allowedCount = maxImages - images.length;
        validFiles.splice(allowedCount);
      }

      if (errors.length > 0) {
        setUploadError(errors.join(" "));
      }

      if (validFiles.length > 0) {
        const newImages = [...images, ...validFiles];
        onImagesChange(newImages);
      }
    },
    [images, onImagesChange, maxImages, maxFileSize, acceptedFormats]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": acceptedFormats.map((format) => format.replace("image/", ".")),
    },
    multiple: true,
    disabled: images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // Adjust primary image index if necessary
    if (primaryImageIndex >= newImages.length) {
      setPrimaryImageIndex(Math.max(0, newImages.length - 1));
    } else if (index < primaryImageIndex) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
    // Reorder images to put primary first
    const newImages = [...images];
    const [primaryImage] = newImages.splice(index, 1);
    newImages.unshift(primaryImage);
    onImagesChange(newImages);
    setPrimaryImageIndex(0);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);

    // Update primary image index
    if (fromIndex === primaryImageIndex) {
      setPrimaryImageIndex(toIndex);
    } else if (fromIndex < primaryImageIndex && toIndex >= primaryImageIndex) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    } else if (fromIndex > primaryImageIndex && toIndex <= primaryImageIndex) {
      setPrimaryImageIndex(primaryImageIndex + 1);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <span>Product Images</span>
            <Badge variant="secondary" className="ml-2">
              {images.length}/{maxImages}
            </Badge>
          </CardTitle>
          <CardDescription>
            Upload high-quality images of your product. The first image will be
            used as the primary image.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Error */}
          <AnimatePresence>
            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }
              ${
                images.length >= maxImages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {isDragActive ? "Drop images here" : "Upload product images"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Drag and drop images here, or click to browse
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Supports:{" "}
                  {acceptedFormats.map((f) => f.split("/")[1]).join(", ")} • Max{" "}
                  {maxFileSize}MB each • Up to {maxImages} images
                </p>
              </div>
            </div>
          </div>

          {/* Image Previews */}
          <AnimatePresence>
            {imagePreviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Uploaded Images ({imagePreviews.length})
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onImagesChange([])}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((imagePreview, index) => (
                    <motion.div
                      key={imagePreview.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="relative group"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={imagePreview.preview}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Primary Image Badge */}
                        {index === primaryImageIndex && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-blue-600 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Primary
                            </Badge>
                          </div>
                        )}

                        {/* Image Actions Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex space-x-2">
                            {/* Set as Primary Button */}
                            {index !== primaryImageIndex && (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => setPrimaryImage(index)}
                                className="bg-white/90 hover:bg-white text-gray-900"
                              >
                                <Star className="w-4 h-4" />
                              </Button>
                            )}

                            {/* Preview Button */}
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                window.open(imagePreview.preview, "_blank")
                              }
                              className="bg-white/90 hover:bg-white text-gray-900"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            {/* Remove Button */}
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => removeImage(index)}
                              className="bg-red-600/90 hover:bg-red-600 text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Image Info */}
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {imagePreview.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(imagePreview.file.size)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Image Management Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.multiple = true;
                      input.accept = acceptedFormats.join(",");
                      input.onchange = (e) => {
                        const files = Array.from(
                          (e.target as HTMLInputElement).files || []
                        );
                        onDrop(files);
                      };
                      input.click();
                    }}
                    disabled={images.length >= maxImages}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Add More
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const shuffled = [...images].sort(
                        () => Math.random() - 0.5
                      );
                      onImagesChange(shuffled);
                      setPrimaryImageIndex(0);
                    }}
                    disabled={images.length <= 1}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Shuffle
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Guidelines */}
          {images.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Image Upload Tips
                  </h5>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Use high-resolution images (at least 800x800px)</li>
                    <li>• Show your product from multiple angles</li>
                    <li>• Use good lighting and clean backgrounds</li>
                    <li>• The first image will be your main product image</li>
                    <li>• Supported formats: JPEG, PNG, WebP, GIF</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Upload Progress Summary */}
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    {images.length} image{images.length !== 1 ? "s" : ""}{" "}
                    uploaded successfully
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Total size:{" "}
                    {formatFileSize(
                      images.reduce((total, file) => total + file.size, 0)
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
