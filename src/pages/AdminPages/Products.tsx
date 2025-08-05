import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  Star,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  BarChart3,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Download,
  Upload,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Tag,
  Calendar,
  Users,
  ShoppingCart,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { db } from "@/utils/pockatbase";
import { useSelector } from "react-redux";
import { selectUser } from "../Auth/slice/selector";
import { AdminDashboardNav } from "@/components/AdminDashboardNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductsPageSkeleton } from "@/components/Skeletons/ProductsPageSkeleton";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  costPrice: number;
  sku: string;
  status: "draft" | "active" | "archived";
  tags: string[];
  images: string[];
  stock: number;
  sales: number;
  views: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  isDigital: boolean;
  featured: boolean;
}

type ViewMode = "grid" | "list" | "table";
type SortField =
  | "name"
  | "price"
  | "stock"
  | "sales"
  | "createdAt"
  | "updatedAt";
type SortOrder = "asc" | "desc";

export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [stockFilter, setStockFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Mock data for demonstration
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      category: "electronics",
      price: 299.99,
      compareAtPrice: 399.99,
      costPrice: 150.0,
      sku: "WH-001",
      status: "active",
      tags: ["wireless", "audio", "premium"],
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
      ],
      stock: 45,
      sales: 127,
      views: 1250,
      rating: 4.8,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:22:00Z",
      isDigital: false,
      featured: true,
    },
    {
      id: "2",
      name: "Organic Cotton T-Shirt",
      description: "Comfortable organic cotton t-shirt in various colors",
      category: "clothing",
      price: 29.99,
      costPrice: 12.0,
      sku: "TS-002",
      status: "active",
      tags: ["organic", "cotton", "casual"],
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
      ],
      stock: 120,
      sales: 89,
      views: 890,
      rating: 4.5,
      createdAt: "2024-01-10T09:15:00Z",
      updatedAt: "2024-01-18T11:45:00Z",
      isDigital: false,
      featured: false,
    },
    {
      id: "3",
      name: "Digital Marketing Course",
      description: "Complete digital marketing course with certificates",
      category: "education",
      price: 199.99,
      costPrice: 0,
      sku: "DMC-003",
      status: "active",
      tags: ["digital", "course", "marketing"],
      images: [
        "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=300",
      ],
      stock: 999,
      sales: 234,
      views: 2340,
      rating: 4.9,
      createdAt: "2024-01-05T16:20:00Z",
      updatedAt: "2024-01-22T08:30:00Z",
      isDigital: true,
      featured: true,
    },
    {
      id: "4",
      name: "Smart Home Security Camera",
      description: "WiFi-enabled security camera with mobile app",
      category: "electronics",
      price: 149.99,
      compareAtPrice: 199.99,
      costPrice: 75.0,
      sku: "SC-004",
      status: "draft",
      tags: ["smart", "security", "wifi"],
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
      ],
      stock: 0,
      sales: 0,
      views: 45,
      rating: 0,
      createdAt: "2024-01-25T12:00:00Z",
      updatedAt: "2024-01-25T12:00:00Z",
      isDigital: false,
      featured: false,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || product.status === selectedStatus;
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;

      let matchesStock = true;
      if (stockFilter === "in-stock") matchesStock = product.stock > 0;
      if (stockFilter === "low-stock")
        matchesStock = product.stock > 0 && product.stock <= 10;
      if (stockFilter === "out-of-stock") matchesStock = product.stock === 0;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPrice &&
        matchesStock
      );
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedStatus,
    priceRange,
    stockFilter,
    sortField,
    sortOrder,
  ]);

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "active").length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const lowStockProducts = products.filter(
      (p) => p.stock > 0 && p.stock <= 10
    ).length;

    return {
      totalProducts,
      activeProducts,
      totalValue,
      lowStockProducts,
    };
  }, [products]);

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on products:`, selectedProducts);
    // Implement bulk actions here
    setSelectedProducts([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "archived":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600" };
    if (stock <= 10) return { label: "Low Stock", color: "text-yellow-600" };
    return { label: "In Stock", color: "text-green-600" };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return <ProductsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 ">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <AdminDashboardNav />

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50"
                />
              </div>

              <Button
                // onClick={notificationController.onOpen}
                variant="outline"
                size="icon"
                className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/api/placeholder/32/32" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      db.authStore.clear();
                      navigate("/");
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6 p-6 px-0"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your product inventory with advanced tools
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => navigate("/products/new")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: "Total Products",
              value: stats.totalProducts.toString(),
              icon: Package,
              color: "from-blue-500 to-cyan-500",
              change: "+12%",
            },
            {
              title: "Active Products",
              value: stats.activeProducts.toString(),
              icon: CheckCircle,
              color: "from-green-500 to-emerald-500",
              change: "+8%",
            },
            {
              title: "Total Value",
              value: `$${stats.totalValue.toLocaleString()}`,
              icon: DollarSign,
              color: "from-purple-500 to-pink-500",
              change: "+15%",
            },
            {
              title: "Low Stock",
              value: stats.lowStockProducts.toString(),
              icon: AlertCircle,
              color: "from-orange-500 to-red-500",
              change: "-5%",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium ml-1 text-green-600">
                      {stat.change} from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              variants={itemVariants}
            >
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Category
                      </label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Status
                      </label>
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Stock Status
                      </label>
                      <Select
                        value={stockFilter}
                        onValueChange={setStockFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Stock" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stock</SelectItem>
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="low-stock">Low Stock</SelectItem>
                          <SelectItem value="out-of-stock">
                            Out of Stock
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Price Range
                      </label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              min: Number(e.target.value),
                            }))
                          }
                          className="w-20"
                        />
                        <span className="text-gray-500">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              max: Number(e.target.value),
                            }))
                          }
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Controls */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              />
            </div>
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions ({selectedProducts.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("activate")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("archive")}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("delete")}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={() => {
                    setSelectedProducts(products.map((p) => p.id));
                  }}
                >
                  Select All
                </Button>
                <Button
                  onClick={() => {
                    setSelectedProducts([]);
                  }}
                  variant="destructive"
                  className="bg-red-100 border text-red-600 hover:bg-red-200"
                >
                  <X />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SortAsc className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortField}
                  onValueChange={(value) => setSortField(value as SortField)}
                >
                  <DropdownMenuRadioItem value="name">
                    Name
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price">
                    Price
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="stock">
                    Stock
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sales">
                    Sales
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="createdAt">
                    Created Date
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value as SortOrder)}
                >
                  <DropdownMenuRadioItem value="asc">
                    Ascending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    Descending
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center border rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Products Display */}
        <motion.div variants={itemVariants}>
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-white/60 p-0 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() =>
                            handleSelectProduct(product.id)
                          }
                          className="bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      {product.featured && (
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                ${product.price}
                              </span>
                              {product.compareAtPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.compareAtPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                              <span className="text-gray-500">
                                SKU: {product.sku}
                              </span>
                              <span
                                className={`font-medium ${
                                  getStockStatus(product.stock).color
                                }`}
                              >
                                {getStockStatus(product.stock).label}
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/products/${product.id}`)
                                }
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/products/${product.id}/edit`)
                                }
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <ShoppingCart className="w-3 h-3" />
                            <span>{product.sales} sales</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{product.views} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-current text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="space-y-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() =>
                            handleSelectProduct(product.id)
                          }
                        />
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(product.status)}>
                                {product.status}
                              </Badge>
                              {product.featured && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-gray-500">
                                SKU: {product.sku}
                              </span>
                              <span className="text-gray-500">
                                Category: {product.category}
                              </span>
                              <span
                                className={`font-medium ${
                                  getStockStatus(product.stock).color
                                }`}
                              >
                                Stock: {product.stock}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    ${product.price}
                                  </span>
                                  {product.compareAtPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ${product.compareAtPrice}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                  <span>{product.sales} sales</span>
                                  <span>{product.views} views</span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                                    <span>{product.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      navigate(`/admin/products/${product.id}`)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      navigate(
                                        `/admin/products/${product.id}/edit`
                                      )
                                    }
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Product
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {viewMode === "table" && (
            <Card className="bg-white/60 p-0 pb-2 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedProducts.length ===
                              filteredProducts.length &&
                            filteredProducts.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() =>
                              handleSelectProduct(product.id)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                SKU: {product.sku}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">${product.price}</div>
                            {product.compareAtPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                ${product.compareAtPrice}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{product.stock}</div>
                            <div
                              className={`text-xs ${
                                getStockStatus(product.stock).color
                              }`}
                            >
                              {getStockStatus(product.stock).label}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <ShoppingCart className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{product.sales}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                            {product.featured && (
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">
                              {product.rating}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/products/${product.id}`)
                                }
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/products/${product.id}/edit`)
                                }
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {searchQuery ||
                    selectedCategory !== "all" ||
                    selectedStatus !== "all"
                      ? "Try adjusting your filters or search terms"
                      : "Get started by adding your first product"}
                  </p>
                  {!searchQuery &&
                    selectedCategory === "all" &&
                    selectedStatus === "all" && (
                      <Button
                        onClick={() => navigate("/admin/products/new")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Product
                      </Button>
                    )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {filteredProducts.length} of {products.length} products
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-600 text-white"
              >
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
