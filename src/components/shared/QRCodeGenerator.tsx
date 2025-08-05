import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Printer, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface QRCodeGeneratorProps {
  productId: string;
  productName?: string;
  productPrice?: number;
  showControls?: boolean;
  size?: "small" | "medium" | "large";
  baseUrl?: string; // Base URL for your product pages
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  productId,
  productName = "Product",
  productPrice,
  showControls = true,
  size = "medium",
  baseUrl = window.location.origin, // Default to current domain
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  const sizeConfig = {
    small: { width: 150, margin: 2 },
    medium: { width: 200, margin: 4 },
    large: { width: 300, margin: 6 },
  };

  const { width, margin } = sizeConfig[size];

  // Generate the product URL that the QR code will link to
  const productUrl = `${baseUrl}/product/${productId}`;

  useEffect(() => {
    if (productId && canvasRef.current) {
      generateQRCode();
    }
  }, [productId, width, margin, productUrl]);

  const generateQRCode = async () => {
    try {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;

      await QRCode.toCanvas(canvas, productUrl, {
        width: width,
        margin: margin,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      });

      // Convert canvas to data URL for download functionality
      const dataUrl = canvas.toDataURL("image/png");
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement("a");
    link.download = `qrcode-${productName
      .replace(/\s+/g, "-")
      .toLowerCase()}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const printQRCode = () => {
    if (!qrCodeDataUrl) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - ${productName}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              background: white;
            }
            .qrcode-container {
              border: 2px dashed #ccc;
              padding: 20px;
              margin: 20px;
              text-align: center;
              background: white;
              border-radius: 8px;
              max-width: 400px;
            }
            .product-info {
              margin-bottom: 15px;
            }
            .product-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
              color: #333;
            }
            .product-price {
              font-size: 16px;
              color: #666;
              margin-bottom: 10px;
            }
            .qr-image {
              max-width: 100%;
              height: auto;
              margin: 15px 0;
            }
            .scan-instruction {
              font-size: 12px;
              color: #888;
              margin-top: 10px;
              font-style: italic;
            }
            .product-url {
              font-size: 10px;
              color: #aaa;
              margin-top: 5px;
              word-break: break-all;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .qrcode-container { 
                border: 1px solid #000; 
                margin: 10px;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="qrcode-container">
            <div class="product-info">
              <div class="product-name">${productName}</div>
              ${
                productPrice
                  ? `<div class="product-price">$${productPrice.toFixed(
                      2
                    )}</div>`
                  : ""
              }
            </div>
            <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-image" />
            <div class="scan-instruction">Scan with your phone to view product</div>
            <div class="product-url">${productUrl}</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const copyProductUrl = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      // You can add a toast notification here
    } catch (error) {
      console.error("Failed to copy product URL:", error);
    }
  };

  const openProductUrl = () => {
    window.open(productUrl, "_blank");
  };

  if (!productId) {
    return (
      <Card className="w-full max-w-sm mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No product ID provided</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto"
    >
      <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border shadow-sm">
        <CardContent className="p-4 space-y-4">
          {/* Product Info */}
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {productName}
            </h3>
            {productPrice && (
              <p className="text-lg font-bold text-green-600">
                ${productPrice.toFixed(2)}
              </p>
            )}
          </div>

          {/* QR Code Display */}
          <div className="bg-white p-3 rounded-lg border border-gray-200  flex justify-center">
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>

          {/* Scan Instruction */}
          <div className="text-center">
            <p className="text-xs text-gray-500 italic">
              Scan to view product details
            </p>
            <p className="text-xs text-gray-400 mt-1 break-all">{productUrl}</p>
          </div>

          {/* Controls */}
          {showControls && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={printQRCode}
                className="flex items-center justify-center space-x-1"
              >
                <Printer className="w-3 h-3" />
                <span>Print</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadQRCode}
                className="flex items-center justify-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyProductUrl}
                className="flex items-center justify-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Link</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openProductUrl}
                className="flex items-center justify-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
