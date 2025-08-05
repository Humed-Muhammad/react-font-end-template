/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Printer, Copy, Share2 } from "lucide-react";
import { BarcodeGenerator } from "@/components/shared/BarcodeGenerator";

export const BarcodePage: React.FC = () => {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  // Get data from navigation state or URL params
  const [searchParam] = useSearchParams();
  const barcode = searchParam.get("barcode");
  const productName = searchParam.get("productName");
  const productPrice = parseFloat(searchParam.get("productPrice") || "0");
  const sku = searchParam.get("sku");

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a new window with just the barcode for better printing
    const printWindow = window.open("", "_blank");
    if (printWindow && printRef.current) {
      const content = printRef.current.innerHTML;
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Barcode - ${productName || "Product"}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
              }
              .barcode-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                text-align: center;
              }
              .no-print {
                display: none !important;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .barcode-container { min-height: auto; padding: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              ${content}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCopyBarcode = async () => {
    if (barcode) {
      try {
        await navigator.clipboard.writeText(barcode);
        // You might want to show a toast notification here
        alert("Barcode copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy barcode:", err);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && barcode) {
      try {
        await navigator.share({
          title: `Barcode for ${productName || "Product"}`,
          text: `Barcode: ${barcode}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Page URL copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  if (!barcode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">No Barcode Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No barcode information was provided.
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
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Barcode Preview</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {productName || "Product Barcode"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyBarcode}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </Button>
              <Button
                onClick={handlePrint}
                className="flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Barcode Display Card */}
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {productName || "Product Barcode"}
              </CardTitle>
              {productPrice && (
                <p className="text-lg text-green-600 font-semibold">
                  ${productPrice.toFixed(2)}
                </p>
              )}
              {sku && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  SKU: {sku}
                </p>
              )}
            </CardHeader>

            <CardContent className="p-8">
              {/* Printable Barcode Area */}
              <div
                ref={printRef}
                className="flex flex-col items-center justify-center space-y-6"
              >
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <BarcodeGenerator
                    value={barcode}
                    productName={productName || "Product"}
                    productPrice={productPrice}
                  />
                </div>

                {/* Product Information */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">
                    {productName || "Product"}
                  </h3>
                  {productPrice && (
                    <p className="text-lg text-green-600 font-medium">
                      ${productPrice.toFixed(2)}
                    </p>
                  )}
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      Barcode:{" "}
                      <span className="font-mono font-medium">{barcode}</span>
                    </p>
                    {sku && (
                      <p>
                        SKU: <span className="font-medium">{sku}</span>
                      </p>
                    )}
                    <p>Format: Code 128</p>
                    <p>Generated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information - Hidden when printing */}
          <div className="no-print mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Printer className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Print Ready</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimized for standard label printers and paper sizes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">High Quality</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vector-based barcode generation for crisp printing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Easy Sharing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share barcodes instantly via URL or download for offline use
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Instructions - Hidden when printing */}
          <div className="no-print mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  How to Use Your Barcode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Printing Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          Use high-quality paper for best scanning results
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          Ensure adequate white space around the barcode
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Test scan before mass printing</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Scanning Guidelines
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          Compatible with all standard barcode scanners
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Works with smartphone barcode apps</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Optimal scanning distance: 4-12 inches</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons - Hidden when printing */}
          <div className="no-print mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handlePrint}
              size="lg"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Printer className="w-5 h-5" />
              <span>Print Barcode</span>
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="lg"
              className="flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="lg"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Products</span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Print Styles */}
      {/* @ts-ignore */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }

          .container {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .barcode-container {
            page-break-inside: avoid;
            margin: 20px;
          }
        }
      `}</style>
    </div>
  );
};
