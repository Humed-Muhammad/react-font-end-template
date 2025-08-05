import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Printer } from "lucide-react";
import { motion } from "framer-motion";

interface BarcodeGeneratorProps {
  value: string;
  productName?: string;
  productPrice?: number;
  showControls?: boolean;
  format?: "CODE128" | "EAN13" | "EAN8" | "UPC" | "CODE39";
  size?: "small" | "medium" | "large";
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  productName = "Product",
  productPrice,
  showControls = true,
  format = "CODE128",
  size = "medium",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const sizeConfig = {
    small: { width: 1.5, height: 60 },
    medium: { width: 2, height: 80 },
    large: { width: 3, height: 100 },
  };

  const { width, height } = sizeConfig[size];

  useEffect(() => {
    if (value && svgRef.current) {
      try {
        svgRef.current.innerHTML = "";

        JsBarcode(svgRef.current, value, {
          format: format,
          width: width,
          height: height,
          displayValue: true,
          fontSize: 12,
          textAlign: "center",
          textPosition: "bottom",
          textMargin: 6,
          fontOptions: "bold",
          font: "Arial",
          background: "#ffffff",
          lineColor: "#000000",
          margin: 8,
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [value, format, width, height]);

  const downloadBarcode = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `barcode-${productName
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const printBarcode = () => {
    if (!svgRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcode - ${productName}</title>
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
            .barcode-container {
              border: 2px dashed #ccc;
              padding: 20px;
              margin: 20px;
              text-align: center;
              background: white;
              border-radius: 8px;
            }
            .product-info {
              margin-bottom: 15px;
            }
            .product-name {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .product-price {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .barcode-value {
              font-size: 12px;
              color: #888;
              margin-top: 10px;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .barcode-container { 
                border: 1px solid #000; 
                margin: 10px;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="barcode-container">
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
            ${svgData}
            <div class="barcode-value">Barcode: ${value}</div>
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

  const copyBarcodeValue = async () => {
    try {
      await navigator.clipboard.writeText(value);
      // You can add a toast notification here
    } catch (error) {
      console.error("Failed to copy barcode value:", error);
    }
  };

  if (!value) {
    return (
      <Card className="w-full max-w-sm mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No barcode value provided</p>
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
      <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border shadow-lg">
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

          {/* Barcode Display */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-inner">
            <svg
              ref={svgRef}
              className="w-full h-auto"
              style={{ maxWidth: "100%" }}
            />
          </div>

          {/* Barcode Value */}
          <div className="text-center">
            <p className="text-xs text-gray-500 font-mono">{value}</p>
          </div>

          {/* Controls */}
          {showControls && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={printBarcode}
                className="flex items-center space-x-1"
              >
                <Printer className="w-3 h-3" />
                <span>Print</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadBarcode}
                className="flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyBarcodeValue}
                className="flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
