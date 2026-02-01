/* eslint-disable */

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "next/font/google";
const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
});
import {
  ShoppingCart,
  ShoppingBag,
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Send,
} from "lucide-react";

import axios from "axios";



type Category = "Pads"
  | "Tampons"
  | "Menstrual Cups"
  | "Pain Relief"
  | "Wellness"
  | "Accessories"
  | "Panties"
  | "Kits"
  | "Other";

function inferCategory(title: string): Category {
  const lowered = title.toLowerCase();

  if (lowered.includes("pad")) return "Pads";
  if (lowered.includes("tampon")) return "Tampons";
  if (lowered.includes("cup") || lowered.includes("menstrual cup"))
    return "Menstrual Cups";
  if (
    lowered.includes("pain") ||
    lowered.includes("relief") ||
    lowered.includes("cramp")
  )
    return "Pain Relief";
  if (
    lowered.includes("wellness") ||
    lowered.includes("hygiene") ||
    lowered.includes("care")
  )
    return "Wellness";
  if (
    lowered.includes("accessory") ||
    lowered.includes("pouch") ||
    lowered.includes("bag")
  )
    return "Accessories";

  // Existing ones:
  if (lowered.includes("panty")) return "Panties";
  if (lowered.includes("kit")) return "Kits";

  return "Other";
}

interface RawProduct {
  product_id: string | number;
  title: string;
  source?: string;
  extracted_price?: number;
  rating?: number;
  thumbnail?: string;
  product_link?: string;
}

interface NormalizedProduct {
  id: string | number;
  name: string;
  brand: string;
  price: number;
  rating: number;
  image: string;
  link?: string;
  category: Category;
  featured: boolean;
}

function normalizeProducts(rawProducts: RawProduct[]): NormalizedProduct[] {
  return rawProducts.map((item: RawProduct): NormalizedProduct => ({
    id: item.product_id,
    name: item.title,
    brand: item.source || "Unknown",
    price: item.extracted_price || 0,
    rating: item.rating || Math.floor(Math.random() * 5) + 1, // Random fallback rating 1-5
    image: item.thumbnail || "",
    link: item.product_link,
    category: inferCategory(item.title),
    featured: Math.random() < 0.3,
  }));
}
const categories = [
  "All",
  "Pads",
  "Tampons",
  "Menstrual Cups",
  "Pain Relief",
  "Wellness",
];

export default function Ecom() {

  const [selectedCategory, setSelectedCategory] = useState("All");
  interface CartItem {
    id: string | number;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    icon?: React.ReactNode;
  }
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchPeriodProducts = async () => {
      try {
        const res = await axios.get(
          "/api/products",
          {
            params: { q: "products for help in periods" },
          }
        );
        const normalized = normalizeProducts(res.data.products || []);
        setProducts(normalized);
        setLoading(false);
        console.log("Normalized products:", normalized);
      } catch (error) {
        console.error("Error fetching period products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodProducts();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      return (
        (selectedCategory === "All" ||
          product.category === selectedCategory) &&
        (searchQuery === "" ||
          product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.brand
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (sortBy === "priceLowToHigh") return a.price - b.price;
      if (sortBy === "priceHighToLow") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
   



  interface SubscribeEvent extends React.FormEvent<HTMLFormElement> { }

  const handleSubscribe = (e: SubscribeEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
    setEmail("");
  };

  const sendMailWithCartItems = async () => {
    const formspreeEndpoint = "https://formspree.io/f/mjkooylp";

    const emailBody = {
      subject: "SheSync Order Form - New Order",
      message: `
        New order details:

        ${cartItems
          .map(
            (item) =>
              `${item.name} (${item.quantity}) - $${(
                item.price * item.quantity
              ).toFixed(2)}`
          )
          .join("\n")}

        Total: $${total.toFixed(2)}
      `,
    };

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailBody),
      });

      if (response.ok) {
        alert("Order details sent successfully!");
        setIsCartOpen(false); // Close the cart after sending
        setCartItems([]); // Clear the cart
      } else {
        throw new Error("Failed to send order details");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send order details. Please try again.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );



  function updateCartItemQuantity(id: string | number, quantity: number): void {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return prevItems.filter((item) => item.id !== id);
      }
      return prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  }

  function removeCartItem(id: string | number): void {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  return (
    <div className={`flex min-h-screen  justify-center items-center mx-auto bg-gradient-to-br from-pink-50 via-white to-pink-100`}>

      <main
      className={`flex-1 p-6 overflow-auto  transition-all duration-300 ease-in-out
        }`}
      >
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col justify-start items-center mx-auto pt-12 pb-20"
        >
            <h2
            className={`${cookie.className} text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent p-2`}
            >
            Shop Wellness Products
            </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl">
            Discover curated period care essentials, wellness products, and exclusive offers. 
            Find everything you need for comfort, confidence, and care—all in one place.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
              Free shipping on orders over ₹499
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
              100% authentic brands
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-sm font-medium">
              Discreet packaging
            </span>
          </div>
        </motion.div>

        <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center"
        >
        {/* Search Input */}
        <div className="relative w-full md:w-auto flex-grow">
          <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Products"
          className="text-black w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:text-white hover:border-pink-400"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300 hover:scale-110 transition-transform duration-200 ease-in-out" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
            setSelectedCategory(category)
            }
            className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${selectedCategory === category
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-transparent"
              : "text-black border-gray-300 dark:text-white dark:border-gray-600 hover:border-pink-400"
            }`}
          >
            {category}{" "}
            {category === "All" ? products.length :
            products.filter(
              (p) => p.category === category
            ).length
            }{" "}
          </button>
          ))}
        </div>
        </motion.div>

        <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-pink-500 dark:text-pink-400">
          Featured Products
          </h2>
          <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors text-pink-600 hover:bg-gray-100 dark:text-pink-400"
          >
          View All <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {loading ? (
            <div className="w-full flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">
          Loading featured products...
              </p>
            </div>
          ) : (
            filteredProducts.length === 0 ? (
              <div className="text-center text-red-500 font-semibold my-8 w-full">
          No products found. Please check your API key
          or try again later.
              </div>
            ) : (
              <>
          {(filteredProducts.slice(0, showAll ? filteredProducts.length : 10)).map((product, index) => (
            <motion.div
              key={product.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, boxShadow: "0 16px 40px 0 rgba(236, 72, 153, 0.2)" }}
              className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 flex flex-col transition-all duration-300 hover:border-pink-400 dark:hover:border-pink-500 shadow-lg hover:shadow-2xl"
            >
              {/* Image Container - Fixed Aspect Ratio */}
              <div className="relative w-full h-48 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image || "/fallback.jpg"}
                  alt={product.name}
                  className="object-contain w-full h-full p-4 transition-transform duration-300 group-hover:scale-110"
                />
                {product.featured && (
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg"
                  >
                    Featured
                  </motion.span>
                )}
              </div>

              {/* Content Container */}
              <div className="flex-1 flex flex-col justify-between p-5 space-y-3">
                {/* Title */}
                <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug">
                  {product.name}
                </h3>

                {/* Brand */}
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {product.brand || "Available Online"}
                </p>

                {/* Rating & Price Section */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    ₹{product.price || "N/A"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-sm font-medium">
                      {"★".repeat(product.rating)}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                      ({product.rating})
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-auto"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    View Product
                  </motion.button>
                </a>
              </div>
            </motion.div>
          ))}
          {filteredProducts.length > 10 && !showAll && (
            <motion.div 
              className="w-full flex justify-center mt-8 col-span-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAll(true)}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                View All {filteredProducts.length} Products
              </motion.button>
            </motion.div>
          )}
              </>
            )
          )}
        </motion.div>
        </section>

        <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-10" />
        <div className="relative p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl text-pink-600 md:text-3xl font-bold">
            Stay Updated
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Subscribe to our newsletter for exclusive
            offers and period care tips.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex gap-4 flex-col md:flex-row max-w-md mx-auto"
          >
            <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:bg-gray-700 dark:text-white"
            required
            />
            <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg flex items-center gap-2"
            >
            Subscribe <Send className="h-4 w-4" />
            </motion.button>
          </form>
          </div>
        </div>
        </section>

        <AnimatePresence>
        {isCartOpen && (
          <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 h-full w-full max-w-md shadow-xl p-6 overflow-auto"
          >
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
              <ShoppingCart className="h-6 w-6 dark:text-white" />
              Your Cart
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6 dark:text-white" />
            </button>
            </div>

            {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4 dark:text-white">
              <motion.div
              initial={{
                scale: 0.5,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              className="p-4 rounded-full"
              >
              <ShoppingBag className="h-8 w-8 text-pink-500" />
              </motion.div>
              <p className="text-gray-500 dark:text-gray-400 text-center">
              Your cart is empty
              </p>
              <button
              onClick={() =>
                setIsCartOpen(false)
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
              Continue Shopping
              </button>
            </div>
            ) : (
            <>
              <div className="space-y-4 mb-6">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{
                  scale: 0.95,
                  opacity: 0,
                  }}
                  animate={{
                  scale: 1,
                  opacity: 1,
                  }}
                  exit={{
                  scale: 0.95,
                  opacity: 0,
                  }}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-pink-50 transition-colors"
                >
                  <div className="p-2 rounded-md">
                  {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate text-zinc-800 dark:text-zinc-100">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    {item.brand}
                  </p>
                  </div>
                  <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{
                    scale: 1.1,
                    }}
                    whileTap={{
                    scale: 0.9,
                    }}
                    onClick={() =>
                    updateCartItemQuantity(
                      item.id,
                      Math.max(
                      0,
                      item.quantity -
                      1
                      )
                    )
                    }
                    className="p-2 rounded-full border border-gray-200 dark:border-zinc-600 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
                  </motion.button>

                  <span className="w-8 text-center text-zinc-700 dark:text-zinc-100">
                    {
                    item.quantity
                    }
                  </span>
                  <motion.button
                    whileHover={{
                    scale: 1.1,
                    }}
                    whileTap={{
                    scale: 0.9,
                    }}
                    onClick={() =>
                    updateCartItemQuantity(
                      item.id,
                      item.quantity +
                      1
                    )
                    }
                    className="p-2 rounded-full border border-gray-200 dark:border-zinc-600 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
                  </motion.button>
                  </div>

                  {/* Price & Remove Button */}
                  <div className="flex items-center gap-4">
                  <p className="font-medium text-zinc-800 dark:text-zinc-100">
                    $
                    {(
                    item.price *
                    item.quantity
                    ).toFixed(
                    2
                    )}
                  </p>
                  <motion.button
                    whileHover={{
                    scale: 1.1,
                    }}
                    whileTap={{
                    scale: 0.9,
                    }}
                    onClick={() =>
                    removeCartItem(
                      item.id
                    )
                    }
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-100 dark:border-red-900/40 transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </motion.button>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                Total
                </span>
                <span className="font-bold text-lg">
                ${total.toFixed(2)}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg"
              >
                Proceed to Checkout
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={
                sendMailWithCartItems
                }
                className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg"
              >
                Send Order Details
              </motion.button>
              </div>
            </>
            )}
          </motion.div>
          </>
        )}
        </AnimatePresence>
      </div>
      </main>
    </div>
  );
}
