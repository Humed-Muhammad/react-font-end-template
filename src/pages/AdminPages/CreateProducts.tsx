/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  DollarSign,
  Tag,
  Truck,
  Globe,
  Settings,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Save,
  Eye,
  BarChart3,
  Palette,
  ArrowLeft,
  FileText,
  AlertCircleIcon,
  ArrowUpRight,
  Search,
  Barcode,
  QrCode,
} from "lucide-react";
import { db } from "@/utils/pockatbase";
import { useSelector } from "react-redux";
import { selectUser } from "../Auth/slice/selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductImageUpload } from "@/components/ProductImageUpload";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { v4 } from "uuid";
import { useGetProductCategoriesQuery } from "./Products/service";

// Product form data interface
interface ProductFormData {
  businessId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice: number;
  costPrice: number;
  sku: string;
  barcode: string;
  variants: string[];
  status: "active" | "draft" | "archived";
  tags: string[];
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "in";
  };
  isDigital: boolean;
  requiresShipping: boolean;
  taxable: boolean;
  taxRate: number;
  seoTitle: string;
  seoDescription: string;
  images: File[];
  seoKeywords: string[];
  createdBy?: string;
  updatedBy?: string;
  slug?: string;
}

// Validation schema
const productValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be less than 100 characters")
    .required("Product name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .required("Product description is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number()
    .min(0, "Price must be positive")
    .required("Price is required"),
  compareAtPrice: Yup.number()
    .min(0, "Compare at price must be positive")
    .test(
      "compare-price",
      "Compare at price should be higher than selling price",
      function (value) {
        const { price } = this.parent;
        return !value || value >= price;
      }
    ),
  costPrice: Yup.number()
    .min(0, "Cost price must be positive")
    .required("Cost price is required"),
  sku: Yup.string()
    .min(2, "SKU must be at least 2 characters")
    .required("SKU is required"),
  weight: Yup.number().min(0, "Weight must be positive"),
  taxRate: Yup.number()
    .min(0, "Tax rate must be positive")
    .max(100, "Tax rate cannot exceed 100%"),
  seoTitle: Yup.string().max(60, "SEO title should be under 60 characters"),
  seoDescription: Yup.string().max(
    160,
    "SEO description should be under 160 characters"
  ),
});

export const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [error, setError] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [previewMode, setPreviewMode] = useState(false);
  const [showBarcodePreview, setShowBarcodePreview] = useState(false);
  const { data, isLoading: isFetchingProductCategory } =
    useGetProductCategoriesQuery();

  const initialValues: ProductFormData = {
    businessId: "current-business-id", // This should come from context
    name: "",
    description: "",
    category: "",
    price: 0,
    compareAtPrice: 0,
    costPrice: 0,
    sku: "",
    barcode: "",
    variants: [],
    status: "draft",
    tags: [],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: "cm",
    },
    isDigital: false,
    requiresShipping: true,
    taxable: true,
    taxRate: 0,
    seoTitle: "",
    seoDescription: "",
    images: [],
    seoKeywords: [],
  };

  const handleSubmit = async (values: ProductFormData) => {
    setLoading(true);
    setError(null);
    try {
      // Transform data for PocketBase
      const productData = {
        ...values,
        tags: JSON.stringify(values.tags),
        dimensions: JSON.stringify(values.dimensions),
        createdBy: user?.id as string,
        updatedBy: user?.id as string,
      };

      await db.collection("products").create(productData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (error) {
      setError(error);
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-emerald-900 dark:to-blue-900">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Created Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Redirecting to products page...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Product
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Add a new product to your inventory with detailed information
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>{previewMode ? "Edit" : "Preview"}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/products")}
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="mb-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Unable to create product.</AlertTitle>
              <AlertDescription>{error?.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={productValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isValid }) => (
            <Form className="space-y-6">
              <motion.div variants={itemVariants}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-7 bg-gray-100 border border-indigo-100 dark:bg-gray-800/50 backdrop-blur-sm">
                    <TabsTrigger
                      value="basic"
                      className="flex items-center space-x-2"
                    >
                      <Package className="w-4 h-4" />
                      <span className="hidden sm:inline">Basic</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="pricing"
                      className="flex items-center space-x-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span className="hidden sm:inline">Pricing</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="images"
                      className="flex items-center space-x-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span className="hidden sm:inline">Product Images</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="inventory"
                      className="flex items-center space-x-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Inventory</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="shipping"
                      className="flex items-center space-x-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span className="hidden sm:inline">Shipping</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="seo"
                      className="flex items-center space-x-2"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="hidden sm:inline">SEO</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="advanced"
                      className="flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Advanced</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Package className="w-5 h-5 text-blue-600" />
                            <span>Basic Information</span>
                          </CardTitle>
                          <CardDescription>
                            Essential details about your product
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Product Name */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="text-sm font-medium"
                            >
                              Product Name *
                            </Label>
                            <Field name="name">
                              {({ field }: any) => (
                                <Input
                                  {...field}
                                  id="name"
                                  placeholder="Enter product name"
                                  className={`h-12 ${
                                    errors.name && touched.name
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                />
                              )}
                            </Field>
                            <AnimatePresence>
                              {errors.name && touched.name && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="text-red-500 text-xs flex items-center space-x-1"
                                >
                                  <AlertCircle className="w-3 h-3" />
                                  <span>{errors.name}</span>
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="description"
                              className="text-sm font-medium"
                            >
                              Description *
                            </Label>
                            <Field name="description">
                              {({ field }: any) => (
                                <Textarea
                                  {...field}
                                  id="description"
                                  placeholder="Describe your product in detail"
                                  rows={4}
                                  className={`resize-none ${
                                    errors.description && touched.description
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                />
                              )}
                            </Field>
                            <div className="flex justify-between items-center">
                              <AnimatePresence>
                                {errors.description && touched.description && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-500 text-xs flex items-center space-x-1"
                                  >
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{errors.description}</span>
                                  </motion.p>
                                )}
                              </AnimatePresence>
                              <span className="text-xs text-gray-500">
                                {values.description.length}/1000
                              </span>
                            </div>
                          </div>

                          {/* Category */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="category"
                              className="text-sm font-medium"
                            >
                              Category *
                            </Label>
                            <Field name="category">
                              {({ field }: any) => (
                                <Select
                                  value={field.value}
                                  onValueChange={(value) =>
                                    setFieldValue("category", value)
                                  }
                                >
                                  <SelectTrigger
                                    className={`h-12 ${
                                      errors.category && touched.category
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                  >
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {data?.map((category) => (
                                      <SelectItem
                                        key={category.id}
                                        value={category.id}
                                      >
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </Field>
                            <AnimatePresence>
                              {errors.category && touched.category && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="text-red-500 text-xs flex items-center space-x-1"
                                >
                                  <AlertCircle className="w-3 h-3" />
                                  <span>{errors.category}</span>
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Tags */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Tags</Label>
                            <FieldArray name="tags">
                              {({ push, remove }) => (
                                <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                    {values?.tags?.map((tag, index) => (
                                      <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                      >
                                        <Badge
                                          variant="secondary"
                                          className="flex items-center space-x-1 px-3 py-1"
                                        >
                                          <Tag className="w-3 h-3" />
                                          <span>{tag}</span>
                                          <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="ml-1 hover:text-red-500"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </Badge>
                                      </motion.div>
                                    ))}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Input
                                      placeholder="Add a tag"
                                      onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          const value = (
                                            e.target as HTMLInputElement
                                          ).value.trim();
                                          if (
                                            value &&
                                            !values.tags.includes(value)
                                          ) {
                                            push(value);
                                            (
                                              e.target as HTMLInputElement
                                            ).value = "";
                                          }
                                        }
                                      }}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const input = document.querySelector(
                                          'input[placeholder="Add a tag"]'
                                        ) as HTMLInputElement;
                                        const value = input?.value.trim();
                                        if (
                                          value &&
                                          !values.tags.includes(value)
                                        ) {
                                          push(value);
                                          input.value = "";
                                        }
                                      }}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </FieldArray>
                          </div>

                          {/* Status */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Product Status
                            </Label>
                            <Field name="status">
                              {({ field }: any) => (
                                <Select
                                  value={field.value}
                                  onValueChange={(value) =>
                                    setFieldValue("status", value)
                                  }
                                >
                                  <SelectTrigger className="h-12">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="draft">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        <span>Draft</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="active">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Active</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="archived">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span>Archived</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </Field>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Pricing Tab */}
                  <TabsContent value="pricing" className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <span>Pricing Information</span>
                          </CardTitle>
                          <CardDescription>
                            Set your product pricing and cost details
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Price */}
                            <div className="space-y-2">
                              <Label
                                htmlFor="price"
                                className="text-sm font-medium"
                              >
                                Selling Price *
                              </Label>
                              <Field name="price">
                                {({ field }: any) => (
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                      {...field}
                                      id="price"
                                      type="number"
                                      step="0.01"
                                      placeholder="0.00"
                                      className={`pl-10 h-12 ${
                                        errors.price && touched.price
                                          ? "border-red-500"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                )}
                              </Field>
                              <AnimatePresence>
                                {errors.price && touched.price && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-500 text-xs flex items-center space-x-1"
                                  >
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{errors.price}</span>
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Compare at Price */}
                            <div className="space-y-2">
                              <Label
                                htmlFor="compareAtPrice"
                                className="text-sm font-medium"
                              >
                                Compare at Price
                              </Label>
                              <Field name="compareAtPrice">
                                {({ field }: any) => (
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                      {...field}
                                      id="compareAtPrice"
                                      type="number"
                                      step="0.01"
                                      placeholder="0.00"
                                      className={`pl-10 h-12 ${
                                        errors.compareAtPrice &&
                                        touched.compareAtPrice
                                          ? "border-red-500"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                )}
                              </Field>
                              <AnimatePresence>
                                {errors.compareAtPrice &&
                                  touched.compareAtPrice && (
                                    <motion.p
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="text-red-500 text-xs flex items-center space-x-1"
                                    >
                                      <AlertCircle className="w-3 h-3" />
                                      <span>{errors.compareAtPrice}</span>
                                    </motion.p>
                                  )}
                              </AnimatePresence>
                            </div>

                            {/* Cost Price */}
                            <div className="space-y-2">
                              <Label
                                htmlFor="costPrice"
                                className="text-sm font-medium"
                              >
                                Cost Price *
                              </Label>
                              <Field name="costPrice">
                                {({ field }: any) => (
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                      {...field}
                                      id="costPrice"
                                      type="number"
                                      step="0.01"
                                      placeholder="0.00"
                                      className={`pl-10 h-12 ${
                                        errors.costPrice && touched.costPrice
                                          ? "border-red-500"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                )}
                              </Field>
                              <AnimatePresence>
                                {errors.costPrice && touched.costPrice && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-500 text-xs flex items-center space-x-1"
                                  >
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{errors.costPrice}</span>
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          {/* Profit Margin Display */}
                          {values.price > 0 && values.costPrice > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  Profit Margin:
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                  {(
                                    ((values.price - values.costPrice) /
                                      values.price) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm text-gray-600">
                                  Profit Amount:
                                </span>
                                <span className="text-sm font-medium">
                                  $
                                  {(values.price - values.costPrice).toFixed(2)}
                                </span>
                              </div>
                            </motion.div>
                          )}

                          {/* Tax Settings */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm font-medium">
                                  Taxable Product
                                </Label>
                                <p className="text-xs text-gray-500">
                                  This product is subject to tax
                                </p>
                              </div>
                              <Field name="taxable">
                                {({ field }: any) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                      setFieldValue("taxable", checked)
                                    }
                                  />
                                )}
                              </Field>
                            </div>

                            {values.taxable && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                              >
                                <Label
                                  htmlFor="taxRate"
                                  className="text-sm font-medium"
                                >
                                  Tax Rate (%)
                                </Label>
                                <Field name="taxRate">
                                  {({ field }: any) => (
                                    <div className="relative">
                                      <Input
                                        {...field}
                                        id="taxRate"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className={`h-12 ${
                                          errors.taxRate && touched.taxRate
                                            ? "border-red-500"
                                            : ""
                                        }`}
                                      />
                                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        %
                                      </span>
                                    </div>
                                  )}
                                </Field>
                                <AnimatePresence>
                                  {errors.taxRate && touched.taxRate && (
                                    <motion.p
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="text-red-500 text-xs flex items-center space-x-1"
                                    >
                                      <AlertCircle className="w-3 h-3" />
                                      <span>{errors.taxRate}</span>
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Product Images */}
                  <TabsContent value="images" className="space-y-6">
                    <ProductImageUpload
                      images={values.images}
                      onImagesChange={(images) =>
                        setFieldValue("images", images)
                      }
                      maxImages={5}
                      maxFileSize={10}
                    />
                  </TabsContent>

                  {/* Inventory Tab */}
                  <TabsContent value="inventory" className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            <span>Inventory Management</span>
                          </CardTitle>
                          <CardDescription>
                            Track your product inventory and variants
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* SKU */}
                            <div className="space-y-2">
                              <Label
                                htmlFor="sku"
                                className="text-sm font-medium"
                              >
                                SKU (Stock Keeping Unit) *
                              </Label>
                              <Field name="sku">
                                {({ field }: any) => (
                                  <Input
                                    {...field}
                                    id="sku"
                                    placeholder="e.g., PROD-001"
                                    className={`h-12 ${
                                      errors.sku && touched.sku
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                  />
                                )}
                              </Field>
                              <AnimatePresence>
                                {errors.sku && touched.sku && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-500 text-xs flex items-center space-x-1"
                                  >
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{errors.sku}</span>
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Barcode */}
                            <div className="space-y-2">
                              <Label
                                htmlFor="barcode"
                                className="text-sm font-medium"
                              >
                                Barcode
                              </Label>
                              <Field name="barcode">
                                {({ field }: any) => (
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      id="barcode"
                                      placeholder="e.g., 123456789012"
                                      className="h-12 pr-20"
                                    />
                                    <div className="flex items-center justify-center gap-2 absolute right-2 top-1/2 transform -translate-y-1/2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          // Generate barcode based on product values
                                          const generateBarcode = () => {
                                            const timestamp = Date.now()
                                              .toString()
                                              .slice(-6);
                                            const skuPart = values.sku
                                              ? values.sku
                                                  .replace(/[^a-zA-Z0-9]/g, "")
                                                  .slice(0, 4)
                                                  .toUpperCase()
                                              : "PROD";
                                            const categoryPart = values.category
                                              ? values.category
                                                  .slice(0, 2)
                                                  .toUpperCase()
                                              : "GN";
                                            const pricePart = values.price
                                              ? Math.floor(values.price)
                                                  .toString()
                                                  .padStart(3, "0")
                                              : "000";

                                            return `${skuPart}${categoryPart}${pricePart}${timestamp}`;
                                          };

                                          const generatedBarcode =
                                            generateBarcode();
                                          setFieldValue(
                                            "barcode",
                                            generatedBarcode
                                          );
                                          setShowBarcodePreview(true); // Show preview after generation
                                        }}
                                        className=" h-8 px-3 text-xs"
                                      >
                                        <BarChart3 className="w-3 h-3 mr-1" />
                                        Generate
                                      </Button>
                                      {values.barcode && (
                                        <div className="flex items-center gap-2">
                                          <Tooltip>
                                            <TooltipContent>
                                              Preview Barcode
                                            </TooltipContent>

                                            <TooltipTrigger>
                                              <Button
                                                type="button"
                                                onClick={() => {
                                                  const params =
                                                    new URLSearchParams({
                                                      productId: v4(),
                                                      barcode: values.barcode,
                                                      productName:
                                                        values.name ||
                                                        "New Product",
                                                      productPrice:
                                                        values.price.toString(),
                                                      sku: values.sku || "",
                                                    });
                                                  window.open(
                                                    `/barcode?${params.toString()}`,
                                                    "_blank"
                                                  );
                                                }}
                                                variant="outline"
                                                size="icon"
                                              >
                                                <Barcode />
                                              </Button>
                                            </TooltipTrigger>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipContent>
                                              Preview QRCode
                                            </TooltipContent>

                                            <TooltipTrigger>
                                              <Button
                                                type="button"
                                                onClick={() => {
                                                  const params =
                                                    new URLSearchParams({
                                                      productId: v4(),
                                                      barcode: values.barcode,
                                                      productName:
                                                        values.name ||
                                                        "New Product",
                                                      productPrice:
                                                        values.price.toString(),
                                                      sku: values.sku || "",
                                                    });
                                                  window.open(
                                                    `/qrcode?${params.toString()}`,
                                                    "_blank"
                                                  );
                                                }}
                                                variant="outline"
                                                size="icon"
                                              >
                                                <QrCode />
                                              </Button>
                                            </TooltipTrigger>
                                          </Tooltip>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Field>
                            </div>
                          </div>

                          {/* Product Variants */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Product Variants
                            </Label>
                            <FieldArray name="variants">
                              {({ push, remove }) => (
                                <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                    {values?.variants?.map((variant, index) => (
                                      <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                      >
                                        <Badge
                                          variant="outline"
                                          className="flex items-center space-x-1 px-3 py-1"
                                        >
                                          <Palette className="w-3 h-3" />
                                          <span>{variant}</span>
                                          <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="ml-1 hover:text-red-500"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </Badge>
                                      </motion.div>
                                    ))}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Input
                                      placeholder="Add a variant (e.g., Red, Large)"
                                      onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          const value = (
                                            e.target as HTMLInputElement
                                          ).value.trim();
                                          if (
                                            value &&
                                            !values.variants.includes(value)
                                          ) {
                                            push(value);
                                            (
                                              e.target as HTMLInputElement
                                            ).value = "";
                                          }
                                        }
                                      }}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const input = document.querySelector(
                                          'input[placeholder*="variant"]'
                                        ) as HTMLInputElement;
                                        const value = input?.value.trim();
                                        if (
                                          value &&
                                          !values.variants.includes(value)
                                        ) {
                                          push(value);
                                          input.value = "";
                                        }
                                      }}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </FieldArray>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Shipping Tab */}
                  <TabsContent value="shipping" className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Truck className="w-5 h-5 text-orange-600" />
                            <span>Shipping Information</span>
                          </CardTitle>
                          <CardDescription>
                            Configure shipping settings for this product
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Digital Product Toggle */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm font-medium">
                                  Digital Product
                                </Label>
                                <p className="text-xs text-gray-500">
                                  This product doesn't require physical shipping
                                </p>
                              </div>
                              <Field name="isDigital">
                                {({ field }: any) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                      setFieldValue("isDigital", checked);
                                      setFieldValue(
                                        "requiresShipping",
                                        !checked
                                      );
                                    }}
                                  />
                                )}
                              </Field>
                            </div>

                            {!values.isDigital && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                              >
                                {/* Requires Shipping */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Requires Shipping
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                      This product needs to be shipped to
                                      customers
                                    </p>
                                  </div>
                                  <Field name="requiresShipping">
                                    {({ field }: any) => (
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={(checked) =>
                                          setFieldValue(
                                            "requiresShipping",
                                            checked
                                          )
                                        }
                                      />
                                    )}
                                  </Field>
                                </div>

                                {/* Weight */}
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="weight"
                                    className="text-sm font-medium"
                                  >
                                    Weight
                                  </Label>
                                  <Field name="weight">
                                    {({ field }: any) => (
                                      <div className="relative">
                                        <Input
                                          {...field}
                                          id="weight"
                                          type="number"
                                          step="0.01"
                                          placeholder="0.00"
                                          className={`h-12 ${
                                            errors.weight && touched.weight
                                              ? "border-red-500"
                                              : ""
                                          }`}
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                          kg
                                        </span>
                                      </div>
                                    )}
                                  </Field>
                                  <AnimatePresence>
                                    {errors.weight && touched.weight && (
                                      <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-xs flex items-center space-x-1"
                                      >
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{errors.weight}</span>
                                      </motion.p>
                                    )}
                                  </AnimatePresence>
                                </div>

                                {/* Dimensions */}
                                <div className="space-y-4">
                                  <Label className="text-sm font-medium">
                                    Dimensions
                                  </Label>
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="length"
                                        className="text-xs text-gray-500"
                                      >
                                        Length
                                      </Label>
                                      <Field name="dimensions.length">
                                        {({ field }: any) => (
                                          <Input
                                            {...field}
                                            id="length"
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            className="h-10"
                                          />
                                        )}
                                      </Field>
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="width"
                                        className="text-xs text-gray-500"
                                      >
                                        Width
                                      </Label>
                                      <Field name="dimensions.width">
                                        {({ field }: any) => (
                                          <Input
                                            {...field}
                                            id="width"
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            className="h-10"
                                          />
                                        )}
                                      </Field>
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="height"
                                        className="text-xs text-gray-500"
                                      >
                                        Height
                                      </Label>
                                      <Field name="dimensions.height">
                                        {({ field }: any) => (
                                          <Input
                                            {...field}
                                            id="height"
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            className="h-10"
                                          />
                                        )}
                                      </Field>
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="unit"
                                        className="text-xs text-gray-500"
                                      >
                                        Unit
                                      </Label>
                                      <Field name="dimensions.unit">
                                        {({ field }: any) => (
                                          <Select
                                            value={field.value}
                                            onValueChange={(value) =>
                                              setFieldValue(
                                                "dimensions.unit",
                                                value
                                              )
                                            }
                                          >
                                            <SelectTrigger className="h-10">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="cm">
                                                cm
                                              </SelectItem>
                                              <SelectItem value="in">
                                                in
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        )}
                                      </Field>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* SEO Tab */}
                  <TabsContent value="seo" className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Globe className="w-5 h-5 text-blue-600" />
                            <span>SEO Optimization</span>
                          </CardTitle>
                          <CardDescription>
                            Optimize your product for search engines
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* SEO Title */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="seoTitle"
                              className="text-sm font-medium"
                            >
                              SEO Title
                            </Label>
                            <Field name="seoTitle">
                              {({ field }: any) => (
                                <Input
                                  {...field}
                                  id="seoTitle"
                                  placeholder="Enter SEO title (recommended: 50-60 characters)"
                                  className={`h-12 ${
                                    errors.seoTitle && touched.seoTitle
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                />
                              )}
                            </Field>
                            <div className="flex justify-between items-center">
                              <AnimatePresence>
                                {errors.seoTitle && touched.seoTitle && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-500 text-xs flex items-center space-x-1"
                                  >
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{errors.seoTitle}</span>
                                  </motion.p>
                                )}
                              </AnimatePresence>
                              <span
                                className={`text-xs ${
                                  values.seoTitle.length > 60
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }`}
                              >
                                {values.seoTitle.length}/60
                              </span>
                            </div>
                          </div>

                          {/* SEO Description */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="seoDescription"
                              className="text-sm font-medium"
                            >
                              SEO Description
                            </Label>
                            <Field name="seoDescription">
                              {({ field }: any) => (
                                <Textarea
                                  {...field}
                                  id="seoDescription"
                                  placeholder="Enter SEO description (recommended: 150-160 characters)"
                                  rows={3}
                                  className={`resize-none ${
                                    errors.seoDescription &&
                                    touched.seoDescription
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                />
                              )}
                            </Field>
                            <div className="flex justify-between items-center">
                              <AnimatePresence>
                                {errors.seoDescription &&
                                  touched.seoDescription && (
                                    <motion.p
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="text-red-500 text-xs flex items-center space-x-1"
                                    >
                                      <AlertCircle className="w-3 h-3" />
                                      <span>{errors.seoDescription}</span>
                                    </motion.p>
                                  )}
                              </AnimatePresence>
                              <span
                                className={`text-xs ${
                                  values.seoDescription.length > 160
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }`}
                              >
                                {values.seoDescription.length}/160
                              </span>
                            </div>
                          </div>

                          {/* SEO Preview */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              SEO Preview
                            </Label>
                            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                              <div className="space-y-1">
                                <h3 className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                                  {values.seoTitle ||
                                    values.name ||
                                    "Product Title"}
                                </h3>
                                <p className="text-green-600 text-sm">
                                  https://yourstore.com/products/
                                  {values.name
                                    ?.toLowerCase()
                                    .replace(/\s+/g, "-") || "product-name"}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {values.seoDescription ||
                                    values.description ||
                                    "Product description will appear here..."}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* SEO Keywords */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              SEO Keywords
                            </Label>
                            <FieldArray name="seoKeywords">
                              {({ push, remove }) => (
                                <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                    {values.seoKeywords.map(
                                      (keyword, index) => (
                                        <motion.div
                                          key={index}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.8 }}
                                        >
                                          <Badge
                                            variant="secondary"
                                            className="flex items-center space-x-1 px-3 py-1"
                                          >
                                            <Search className="w-3 h-3" />
                                            <span>{keyword}</span>
                                            <button
                                              type="button"
                                              onClick={() => remove(index)}
                                              className="ml-1 hover:text-red-500"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </Badge>
                                        </motion.div>
                                      )
                                    )}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Input
                                      placeholder="Add SEO keyword"
                                      onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          const value = (
                                            e.target as HTMLInputElement
                                          ).value.trim();
                                          if (
                                            value &&
                                            !values.seoKeywords.includes(value)
                                          ) {
                                            push(value);
                                            (
                                              e.target as HTMLInputElement
                                            ).value = "";
                                          }
                                        }
                                      }}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const input = document.querySelector(
                                          'input[placeholder="Add SEO keyword"]'
                                        ) as HTMLInputElement;
                                        const value = input?.value.trim();
                                        if (
                                          value &&
                                          !values.seoKeywords.includes(value)
                                        ) {
                                          push(value);
                                          input.value = "";
                                        }
                                      }}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </FieldArray>
                          </div>

                          {/* URL Slug */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="slug"
                              className="text-sm font-medium"
                            >
                              URL Slug
                            </Label>
                            <Field name="slug">
                              {({ field }: any) => (
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                    /products/
                                  </span>
                                  <Input
                                    {...field}
                                    id="slug"
                                    placeholder="product-url-slug"
                                    className={`rounded-l-none h-12 ${
                                      errors.slug && touched.slug
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                  />
                                </div>
                              )}
                            </Field>
                            <AnimatePresence>
                              {errors.slug && touched.slug && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="text-red-500 text-xs flex items-center space-x-1"
                                >
                                  <AlertCircle className="w-3 h-3" />
                                  <span>{errors.slug}</span>
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Advanced Tab */}
                  <TabsContent value="advanced" className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Settings className="w-5 h-5 text-gray-600" />
                            <span>Advanced Settings</span>
                          </CardTitle>
                          <CardDescription>
                            Additional configuration options for your product
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Product Type */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="productType"
                              className="text-sm font-medium"
                            >
                              Product Type
                            </Label>
                            <Field name="productType">
                              {({ field }: any) => (
                                <Select
                                  value={field.value}
                                  onValueChange={(value) =>
                                    setFieldValue("productType", value)
                                  }
                                >
                                  <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select product type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="simple">
                                      Simple Product
                                    </SelectItem>
                                    <SelectItem value="variable">
                                      Variable Product
                                    </SelectItem>
                                    <SelectItem value="grouped">
                                      Grouped Product
                                    </SelectItem>
                                    <SelectItem value="external">
                                      External/Affiliate Product
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </Field>
                          </div>

                          {/* Vendor */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="vendor"
                              className="text-sm font-medium"
                            >
                              Vendor
                            </Label>
                            <Field name="vendor">
                              {({ field }: any) => (
                                <Input
                                  {...field}
                                  id="vendor"
                                  placeholder="Enter vendor name"
                                  className="h-12"
                                />
                              )}
                            </Field>
                          </div>

                          {/* Additional Settings */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm font-medium">
                                  Featured Product
                                </Label>
                                <p className="text-xs text-gray-500">
                                  Show this product in featured sections
                                </p>
                              </div>
                              <Field name="featured">
                                {({ field }: any) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                      setFieldValue("featured", checked)
                                    }
                                  />
                                )}
                              </Field>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm font-medium">
                                  Track Quantity
                                </Label>
                                <p className="text-xs text-gray-500">
                                  Track inventory levels for this product
                                </p>
                              </div>
                              <Field name="trackQuantity">
                                {({ field }: any) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                      setFieldValue("trackQuantity", checked)
                                    }
                                  />
                                )}
                              </Field>
                            </div>

                            {values.trackQuantity && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="quantity"
                                      className="text-sm font-medium"
                                    >
                                      Current Stock
                                    </Label>
                                    <Field name="quantity">
                                      {({ field }: any) => (
                                        <Input
                                          {...field}
                                          id="quantity"
                                          type="number"
                                          placeholder="0"
                                          className={`h-12 ${
                                            errors.quantity && touched.quantity
                                              ? "border-red-500"
                                              : ""
                                          }`}
                                        />
                                      )}
                                    </Field>
                                    <AnimatePresence>
                                      {errors.quantity && touched.quantity && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          className="text-red-500 text-xs flex items-center space-x-1"
                                        >
                                          <AlertCircle className="w-3 h-3" />
                                          <span>{errors.quantity}</span>
                                        </motion.p>
                                      )}
                                    </AnimatePresence>
                                  </div>

                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="lowStockThreshold"
                                      className="text-sm font-medium"
                                    >
                                      Low Stock Threshold
                                    </Label>
                                    <Field name="lowStockThreshold">
                                      {({ field }: any) => (
                                        <Input
                                          {...field}
                                          id="lowStockThreshold"
                                          type="number"
                                          placeholder="5"
                                          className="h-12"
                                        />
                                      )}
                                    </Field>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm font-medium">
                                  Allow Backorders
                                </Label>
                                <p className="text-xs text-gray-500">
                                  Allow customers to purchase when out of stock
                                </p>
                              </div>
                              <Field name="allowBackorders">
                                {({ field }: any) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                      setFieldValue("allowBackorders", checked)
                                    }
                                  />
                                )}
                              </Field>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm font-medium">
                                  Sold Individually
                                </Label>
                                <p className="text-xs text-gray-500">
                                  Limit purchases to 1 item per order
                                </p>
                              </div>
                              <Field name="soldIndividually">
                                {({ field }: any) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                      setFieldValue("soldIndividually", checked)
                                    }
                                  />
                                )}
                              </Field>
                            </div>
                          </div>

                          {/* Custom Fields */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Custom Fields
                            </Label>
                            <FieldArray name="customFields">
                              {({ push, remove }) => (
                                <div className="space-y-3">
                                  {values.customFields?.map((field, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="flex space-x-2"
                                    >
                                      <Input
                                        placeholder="Field name"
                                        value={field.name}
                                        onChange={(e) =>
                                          setFieldValue(
                                            `customFields.${index}.name`,
                                            e.target.value
                                          )
                                        }
                                        className="flex-1"
                                      />
                                      <Input
                                        placeholder="Field value"
                                        value={field.value}
                                        onChange={(e) =>
                                          setFieldValue(
                                            `customFields.${index}.value`,
                                            e.target.value
                                          )
                                        }
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => remove(index)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </motion.div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      push({ name: "", value: "" })
                                    }
                                    className="w-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Custom Field
                                  </Button>
                                </div>
                              )}
                            </FieldArray>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </Tabs>

                {/* Form Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 pt-6"
                >
                  <Button
                    type="submit"
                    onClick={() => {
                      setFieldValue("status", "active");
                      handleSubmit(values);
                    }}
                    disabled={isSubmitting || !isValid}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Product...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Product
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFieldValue("status", "draft");
                      handleSubmit(values);
                    }}
                    disabled={isSubmitting}
                    className="flex-1 h-12"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                </motion.div>
              </motion.div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};
