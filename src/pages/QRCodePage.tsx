import React, { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeGenerator } from "@/components/shared/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  QrCode,
  Settings,
  Printer,
  Copy,
  ExternalLink,
  ArrowLeft,
  Share2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate, useSearchParams } from "react-router-dom";

export const QRCodePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get data from URL parameters
  const productId = searchParams.get("productId") || "";
  const productName = searchParams.get("productName") || "Product";
  const productPrice = parseFloat(searchParams.get("productPrice") || "0");
  const sku = searchParams.get("sku");
  const baseUrlParam = searchParams.get("baseUrl");

  const [previewSettings, setPreviewSettings] = useState({
    size: "medium" as "small" | "medium" | "large",
    showProductInfo: true,
    showPrice: true,
    showUrl: true,
    customBaseUrl: baseUrlParam || window.location.origin,
  });

  const [showSettings, setShowSettings] = useState(false);

  const printQRCode = () => {
    const productUrl = `${previewSettings.customBaseUrl}/product/${productId}`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Generate QR code canvas for printing
    const canvas = document.createElement("canvas");
    const QRCode = require("qrcode");

    const sizeConfig = {
      small: 200,
      medium: 300,
      large: 400,
    };

    const qrSize = sizeConfig[previewSettings.size];

    QRCode.toCanvas(canvas, productUrl, {
      width: qrSize,
      margin: 4,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then(() => {
        const qrDataUrl = canvas.toDataURL("image/png");

        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print QR Code - ${productName}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: Arial, sans-serif;
                background: white;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 20px;
              }
              
              .qr-print-container {
                text-align: center;
                background: white;
                border: 2px solid #000;
                padding: 30px;
                border-radius: 8px;
                max-width: 500px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              
              .product-header {
                margin-bottom: 20px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 15px;
              }
              
              .product-name {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin-bottom: 8px;
              }
              
              .product-price {
                font-size: 20px;
                color: #2563eb;
                font-weight: 600;
              }
              
              .qr-container {
                margin: 25px 0;
                display: flex;
                justify-content: center;
              }
              
              .qr-image {
                max-width: 100%;
                height: auto;
                border: 1px solid #e5e7eb;
                border-radius: 4px;
              }
              
              .scan-info {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #ddd;
              }
              
              .scan-instruction {
                font-size: 14px;
                color: #666;
                margin-bottom: 8px;
                font-style: italic;
              }
              
              .product-url {
                font-size: 11px;
                color: #888;
                word-break: break-all;
                font-family: monospace;
                background: #f8f9fa;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #e9ecef;
              }
              
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                  background: white !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                
                .qr-print-container {
                  border: 2px solid #000 !important;
                  box-shadow: none !important;
                  margin: 0;
                  page-break-inside: avoid;
                  max-width: none;
                  width: 100%;
                }
                
                .product-name {
                  color: #000 !important;
                }
                
                .product-price {
                  color: #000 !important;
                }
              }
              
              @page {
                margin: 1cm;
                size: A4;
              }
            </style>
          </head>
          <body>
            <div class="qr-print-container">
              ${
                previewSettings.showProductInfo
                  ? `
                <div class="product-header">
                  <div class="product-name">${productName}</div>
                  ${
                    previewSettings.showPrice && productPrice
                      ? `
                    <div class="product-price">$${productPrice.toFixed(2)}</div>
                  `
                      : ""
                  }
                </div>
              `
                  : ""
              }
              
              <div class="qr-container">
                <img src="${qrDataUrl}" alt="QR Code for ${productName}" class="qr-image" />
              </div>
              
              <div class="scan-info">
                <div class="scan-instruction">Scan with your phone to view product details</div>
                ${
                  previewSettings.showUrl
                    ? `
                  <div class="product-url">${productUrl}</div>
                `
                    : ""
                }
              </div>
            </div>
          </body>
        </html>
      `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      })
      .catch((error: unknown) => {
        console.error("Error generating QR code for print:", error);
        printWindow.close();
      });
  };

  const handleCopyUrl = async () => {
    const productUrl = `${previewSettings.customBaseUrl}/product/${productId}`;
    try {
      await navigator.clipboard.writeText(productUrl);
      alert("Product URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleShare = async () => {
    const productUrl = `${previewSettings.customBaseUrl}/product/${productId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${productName}`,
          text: `Check out this product: ${productName}`,
          url: productUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copying URL
      handleCopyUrl();
    }
  };

  // Check if required data is available
  if (!productId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">No Product Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No product information was provided for QR code generation.
            </p>
            <Button onClick={() => navigate(-1)} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header - Hidden when printing */}
      <div className="no-print sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className="hidden lg:flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-md md:text-xl font-semibold">
                    QR Code Generator
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {productName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {showSettings ? "Hide" : "Show"} Settings
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                onClick={printQRCode}
                className="flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-1 md:px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Settings Panel */}
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:w-80"
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      QR Code Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Size Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Size</Label>
                      <Select
                        value={previewSettings.size}
                        onValueChange={(value: "small" | "medium" | "large") =>
                          setPreviewSettings((prev) => ({
                            ...prev,
                            size: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (150px)</SelectItem>
                          <SelectItem value="medium">Medium (200px)</SelectItem>
                          <SelectItem value="large">Large (300px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Base URL */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Base URL</Label>
                      <Input
                        value={previewSettings.customBaseUrl}
                        onChange={(e) =>
                          setPreviewSettings((prev) => ({
                            ...prev,
                            customBaseUrl: e.target.value,
                          }))
                        }
                        placeholder="http://localhost:5173"
                      />
                    </div>

                    {/* Display Options */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Print Options
                      </h4>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Show Product Info</Label>
                        <Switch
                          checked={previewSettings.showProductInfo}
                          onCheckedChange={(checked) =>
                            setPreviewSettings((prev) => ({
                              ...prev,
                              showProductInfo: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Show Price</Label>
                        <Switch
                          checked={previewSettings.showPrice}
                          onCheckedChange={(checked) =>
                            setPreviewSettings((prev) => ({
                              ...prev,
                              showPrice: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Show URL</Label>
                        <Switch
                          checked={previewSettings.showUrl}
                          onCheckedChange={(checked) =>
                            setPreviewSettings((prev) => ({
                              ...prev,
                              showUrl: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* QR Code Preview */}
            <div className="flex-1">
              <Card className="h-fit shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    QR Code Preview
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Preview how your QR code will appear when printed
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <div className="w-full">
                      {/* Product Info Header */}
                      {previewSettings.showProductInfo && (
                        <div className="text-center mb-6 pb-4 border-b border-gray-200">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {productName}
                          </h3>
                          {previewSettings.showPrice && productPrice > 0 && (
                            <p className="text-lg font-semibold text-blue-600">
                              ${productPrice.toFixed(2)}
                            </p>
                          )}
                          {sku && (
                            <p className="text-sm text-gray-500 mt-1">
                              SKU: {sku}
                            </p>
                          )}
                        </div>
                      )}

                      {/* QR Code */}
                      <div className="flex justify-center mb-6">
                        <QRCodeGenerator
                          baseUrl="http://localhost:5173"
                          productName={productName}
                          productPrice={productPrice}
                          productId={productId}
                          size={previewSettings.size}
                        />
                      </div>

                      {/* Footer Info */}
                      <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2 italic">
                          Scan with your phone to view product details
                        </p>
                        {previewSettings.showUrl && (
                          <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded border break-all">
                            {previewSettings.customBaseUrl}/product/{productId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <Button
                      onClick={printQRCode}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print QR Code</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleCopyUrl}
                      className="flex items-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy URL</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex items-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        const productUrl = `${previewSettings.customBaseUrl}/product/${productId}`;
                        window.open(productUrl, "_blank");
                      }}
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Link</span>
                    </Button>
                  </div>

                  {/* Product Details Summary */}
                  <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Product Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Product ID:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {productId}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Name:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {productName}
                        </span>
                      </div>
                      {productPrice > 0 && (
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            Price:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            ${productPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {sku && (
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            SKU:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {sku}
                          </span>
                        </div>
                      )}
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Target URL:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-white break-all">
                          {previewSettings.customBaseUrl}/product/{productId}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            background: white !important;
          }

          .container {
            max-width: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
