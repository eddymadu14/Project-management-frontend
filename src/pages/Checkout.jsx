
import React, { useState } from "react";
import axios from "axios";

const Checkout = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // from login
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/checkout/create-session`,
        { plan },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.url) {
        window.location.href = res.data.url; // redirect to Stripe Checkout
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6">Choose Your Plan</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold mb-2">Pro</h3>
          <p className="text-gray-500 mb-4">$10 / month</p>
          <button
            onClick={() => handleCheckout("pro")}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            {loading ? "Loading..." : "Subscribe"}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold mb-2">Agency</h3>
          <p className="text-gray-500 mb-4">$25 / month</p>
          <button
            onClick={() => handleCheckout("agency")}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            {loading ? "Loading..." : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

