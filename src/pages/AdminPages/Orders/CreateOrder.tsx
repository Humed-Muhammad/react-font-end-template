import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboardNav } from "@/components/AdminDashboardNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateOrderMutation } from "./services";
import { useGetAdminProductsQuery } from "../Products/service";
import type { Product } from "@/types";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";

type CartItem = {
  product: Product;
  quantity: number;
};

const currency = (n: number, currency = "ETB") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);

export const CreateOrder: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [paymentStatus, setPaymentStatus] = useState<string>("unpaid");
  const [status, setStatus] = useState<string>("pending");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);

  const [cart, setCart] = useState<CartItem[]>([]);

  const { data: productsData, isLoading: loadingProducts } =
    useGetAdminProductsQuery({ page: 1, perPage: 20 });

  const filteredProducts = useMemo(() => {
    const items = productsData?.items ?? [];
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q),
    );
  }, [productsData, searchQuery]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === productId
            ? { ...c, quantity: Math.max(1, c.quantity + delta) }
            : c,
        )
        .filter((c) => c.quantity > 0),
    );
  };

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.product.price * i.quantity, 0),
    [cart],
  );
  const total = Math.max(0, subtotal - (discount || 0) + (shipping || 0));

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const onSubmit = async () => {
    if (!cart.length) {
      toast.error("Add at least one item to the order.");
      return;
    }
    if (!customer.name) {
      toast.error("Customer name is required.");
      return;
    }

    const payload = {
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
      paymentMethod,
      status,
      paymentStatus,
      discountAmount: discount || 0,
      shippingCost: shipping || 0,
      deliveryFee: shipping || 0,
      currency: "ETB",
      totalAmount: total,
      shippingAddress: { address: customer.address },
      billingAddress: { address: customer.address },
      notes,
      items: cart.map((c) => ({
        order: "", // server sets
        product: c.product.id,
        variant: "",
        name: c.product.name,
        sku: c.product.sku,
        quantity: c.quantity,
        price: c.product.price,
        totalPrice: c.product.price * c.quantity,
        snapshot: {
          id: c.product.id,
          name: c.product.name,
          price: c.product.price,
          sku: c.product.sku,
        },
        image: c.product.images?.[0] ?? "",
      })),
    } as const;

    try {
      await createOrder(payload).unwrap();
      console.log(payload);
      toast.success("Order created successfully");
      navigate("/orders");
    } catch (e) {
      console.error(e);
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <AdminDashboardNav
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Order
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Build a new order by selecting products and customer details.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/orders")}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onSubmit}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isLoading ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Product picker + cart */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Search by name, SKU, barcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {loadingProducts ? (
                  <div className="text-sm text-muted-foreground">
                    Loading products...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredProducts?.map((p) => (
                      <div
                        key={p.id}
                        className="border rounded-md p-3 flex items-center justify-between bg-white/70 dark:bg-gray-800/60"
                      >
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.sku} • {currency(p.price)}
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => addToCart(p)}
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                    {filteredProducts?.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        No products found.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No items yet. Add products above.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((c) => (
                        <TableRow key={c.product.id}>
                          <TableCell className="max-w-[220px] truncate">
                            {c.product.name}
                          </TableCell>
                          <TableCell>{currency(c.product.price)}</TableCell>
                          <TableCell>
                            <div className="inline-flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQty(c.product.id, -1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center">
                                {c.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQty(c.product.id, 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {currency(c.product.price * c.quantity)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(c.product.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>
                      Adjust quantities or remove items.
                    </TableCaption>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Customer + summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Full name"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer((s) => ({ ...s, name: e.target.value }))
                  }
                />
                <Input
                  type="email"
                  placeholder="Email (optional)"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer((s) => ({ ...s, email: e.target.value }))
                  }
                />
                <Input
                  placeholder="Phone (optional)"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer((s) => ({ ...s, phone: e.target.value }))
                  }
                />
                <Input
                  placeholder="Address (for shipping/billing)"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer((s) => ({ ...s, address: e.target.value }))
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground">
                    Payment Status
                  </label>
                  <div>
                    <Select
                      value={paymentStatus}
                      onValueChange={setPaymentStatus}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                        <SelectItem value="partially_paid">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">
                      Payment Method
                    </label>
                    <div>
                      <Select
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="mobile">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">
                      Order Status
                    </label>
                    <div>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivering">Delivering</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Notes</label>
                  <Input
                    className="mt-1"
                    placeholder="Internal or customer notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{currency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    Discount
                  </span>
                  <Input
                    type="number"
                    className="w-32 text-right"
                    value={discount}
                    min={0}
                    onChange={(e) =>
                      setDiscount(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    Shipping
                  </span>
                  <Input
                    type="number"
                    className="w-32 text-right"
                    value={shipping}
                    min={0}
                    onChange={(e) =>
                      setShipping(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="border-t my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>{currency(total)}</span>
                </div>

                <Button
                  className="w-full"
                  disabled={isLoading}
                  onClick={onSubmit}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isLoading ? "Creating..." : "Create Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
