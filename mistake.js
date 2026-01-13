Perfect 🔥 — you want the form submission on your React landing page to:

1. 📧 Send you (the owner) an email containing the user’s details.


2. 📦 Send the user a confirmation email with their purchase info.



Let’s implement it cleanly and production-ready, using a React frontend + Node.js (Express + Nodemailer) backend setup.


---

🧱 Project Structure

/project
 ├── /client        # React app (your landing page)
 └── /server        # Node.js backend
      ├── index.js
      └── .env


---

🧩 1. FRONTEND (React)

Here’s your updated LandingPage.jsx file — now the form will send data via a POST request to your backend’s /send-mail route.

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownCircle, Timer } from "lucide-react";

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState(3600);
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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-poppins overflow-hidden">
      {/* HERO */}
      <section
        id="hero"
        className="flex flex-col items-center justify-center min-h-screen text-center relative px-6"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 bg-white/70 px-4 py-2 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Discover the Future of Self-Care
        </motion.h1>

        <p className="text-lg md:text-xl max-w-2xl mb-6 text-gray-700">
          Premium products that help you shine from head to toe — crafted for confidence.
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
        <div className="absolute bottom-10 flex flex-col items-center gap-4">
          {[1, 2, 3].map((n) => (
            <ArrowDownCircle
              key={n}
              onClick={() => scrollToSection("contact")}
              className="cursor-pointer animate-bounce text-gray-600"
              size={32}
            />
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
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


---

⚙️ 2. BACKEND (Node.js + Express + Nodemailer)

Create a simple Node backend inside /server/index.js:

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail", // or use custom SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to handle form submission
app.post("/send-mail", async (req, res) => {
  const { name, phone, email, address, state } = req.body;

  if (!name || !phone || !email || !address || !state) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // 1️⃣ Send email to you (admin)
    await transporter.sendMail({
      from: `"Order Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL, // your email
      subject: `New Order from ${name}`,
      html: `
        <h2>New Purchase Details</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Address:</b> ${address}</p>
        <p><b>Delivery State:</b> ${state}</p>
      `,
    });

    // 2️⃣ Send confirmation to the user
    await transporter.sendMail({
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Order Has Been Received!",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thanks for placing your order! Here’s your order summary:</p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Phone:</b> ${phone}</li>
          <li><b>Address:</b> ${address}</li>
          <li><b>Delivery State:</b> ${state}</li>
        </ul>
        <p>We’ll contact you shortly for delivery confirmation.</p>
        <p><b>Thank you for shopping with us!</b></p>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ message: "Email sending failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


---

🔐 3. .env file (in /server)

EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourapppassword
RECEIVER_EMAIL=youremail@gmail.com
PORT=5000

> ⚠️ For Gmail:

Go to Google Account → Security → App Passwords

Generate one for “Mail” → “Other” → name it “React Order App”

Use that App Password for EMAIL_PASS





---

🚀 4. Run it

In two terminals:

# Terminal 1 (backend)
cd server
npm install express nodemailer cors dotenv
node index.js

# Terminal 2 (frontend)
cd client
npm start


---

✅ Result

The Send button sends details to your backend.

You (the admin) receive an email with user info.

The user receives an email confirmation of their purchase.



---

Would you like me to extend this so the email includes product selection and total cost summary next?


//pen

https://res.cloudinary.com/dwjlbzxdy/image/upload/v1763007476/WhatsApp_Image_2025-11-13_at_05.06.52_a6lhwy.jpg

https://res.cloudinary.com/dwjlbzxdy/image/upload/v1763007475/WhatsApp_Image_2025-11-13_at_05.06.52_1_domcdf.jpg


https://res.cloudinary.com/dwjlbzxdy/image/upload/v1763007475/WhatsApp_Image_2025-11-13_at_05.06.52_2_fwmree.jpg

bat

https://res.cloudinary.com/dwjlbzxdy/image/upload/v1763007476/WhatsApp_Image_2025-11-13_at_05.10.51_1_xknqtj.jpg

https://res.cloudinary.com/dwjlbzxdy/image/upload/v1763007476/WhatsApp_Image_2025-11-13_at_05.10.51_getsum.jpg

https://res.cloudinary.com/dwjlbzxdy/image/upload/v1763007476/WhatsApp_Image_2025-11-13_at_05.10.52_ewir67.jpg

pen video
https://res.cloudinary.com/dwjlbzxdy/video/upload/v1763008040/pen.mp4_hr94aa.mp4