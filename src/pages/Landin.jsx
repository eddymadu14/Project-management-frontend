import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownCircle, Timer } from "lucide-react";

const products = [
  {
    id: 1,
    type: "image",
    src: "https://via.placeholder.com/400x250.png?text=Product+1",
    title: "Non-toxic",
    desc: "Non‑peroxide gel formula, safe for home use and gentle on enamel.",
  },
  {
    id: 2,
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Easy to use",
    desc: "Twist‑pen design: precise application directly to the teeth for maximum whitening effect, minimal mess.",
  },
  {
    id: 3,
    type: "image",
    src: "https://via.placeholder.com/400x250.png?text=Product+3",
    title: "light and portable",
    desc: "Ideal for daily use, even on the go, slip into your handbag or travel kit.",
  },
];

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown

    const [formData, setFormData] = useState({
      name: "",
      phone: "",
      email: "",
      address: "",
      state: "",
    });
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState("");
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }, []);
  
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSending(true);
      setMessage("");
  
      try {
        const res = await fetch("http://localhost:5000/send-mail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setMessage("✅ Order received! Check your email for details.");
          setFormData({ name: "", phone: "", email: "", address: "", state: "" });
        } else {
          setMessage("❌ Failed to send email. Please try again.");
        }
      } catch (error) {
        console.error(error);
        setMessage("⚠️ Network error. Please try again later.");
      } finally {
        setIsSending(false);
      }
    };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-poppins overflow-hidden">
      {/* Hero Section */}
      <section
        id="hero"
        className="flex flex-col items-center justify-center min-h-screen text-center relative px-6"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 backdrop-blur-md bg-white/70 px-4 py-2 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Discover the Future of Oral-Care
        </motion.h1>

        <p className="text-lg md:text-xl max-w-2xl mb-6 text-gray-700">Unleash your brightest smile in just minutes — ditch stains, fear no flash, and walk into every 
            room with teeth that glow. Get ready to command attention: radiant, confident and be unmistakably you."
        </p>

        <motion.button
          onClick={() => scrollToSection("contact")}
          whileHover={{ scale: 1.1 }}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:opacity-90 transition"
        >
          Grab Offer Now
        </motion.button>

        {/* Countdown */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <span className="text-sm uppercase text-gray-600 tracking-wide">
            Limited Time Offer
          </span>
          <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Timer size={20} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Scroll Buttons */}
  
      </section>

      {/* Products Section */}
      <section id="products" className="py-10 px-6 flex flex-col items-center gap-10">
        
        <h2 className="text-4xl font-semibold mb-8 text-center text-gray-800">
          Our Featured Lineup
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
          {products.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/70 border border-gray-200"
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  className="w-full h-64 object-cover"
                />
              ) : (
                <img src={item.src} alt={item.title} className="w-full h-64 object-cover" />
              )}
              <div className="p-4 text-center bg-white/60">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-700">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => scrollToSection("contact")}
          className="mt-8 px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          Order Now
        </button>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 px-6 text-center bg-white border-t border-gray-200"
      >
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">The perfect teeth whitening solution</h2>
        <p className="max-w-3xl mx-auto text-gray-700">
         Meet the ultimate solution for whiter, healthier teeth: our Instant Tooth Whitening 
         Gel Pen is a gentle, effective at‑home treatment that delivers visible whitening without triggering
          sensitivity. Whether it's coffee stains, evening wine, or everyday wear, this travel‑friendly pen 
          works fast to restore brilliance and boost 
         your self‑confidence.
        </p>

        <button
          onClick={() => scrollToSection("contact")}
          className="mt-6 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
        >
          Get Yours Now
        </button>
      </section>

      {/* Contact / Form Section */}
     <section
            id="contact"
            className="py-20 px-6 text-center bg-gradient-to-b from-gray-100 to-white border-t border-gray-200"
          >
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Place Your Order</h2>
            <p className="text-gray-700 mb-8">
              Fill in your details below and receive confirmation via email.
            </p>
    
            <form
              className="max-w-lg mx-auto bg-white shadow-lg rounded-3xl p-8 flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-full border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-full border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-full border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                name="address"
                placeholder="Your Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-full border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                name="state"
                placeholder="Your Delivery State"
                value={formData.state}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-full border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
              />
    
              <motion.button
                whileHover={{ scale: 1.05 }}
                disabled={isSending}
                className="mt-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-60"
              >
                {isSending ? "Sending..." : "Send"}
              </motion.button>
    
              {message && <p className="text-sm mt-4 text-gray-700">{message}</p>}
            </form>
          </section>
    
    </div>
  );
}