"use client";

import { useState } from "react";
import Script from "next/script";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    place: "",
    date_of_birth: "",
    profession: "",
    mobile_no: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Execute reCAPTCHA v3
      const token = await (window as any).grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY!,
        { action: "signup" }
      );

      // Add token to payload
      const payload = { ...formData, recaptcha_token: token };

      const res = await fetch("https://django-backend-777268942678.asia-south1.run.app/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Signup failed");
      } else {
        setMessage(data.message || "Signup successful! Check your email to verify.");
        setFormData({
          username: "",
          email: "",
          password1: "",
          password2: "",
          place: "",
          date_of_birth: "",
          profession: "",
          mobile_no: "",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY}`}
      />
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password1"
          placeholder="Password"
          value={formData.password1}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="place"
          placeholder="Place"
          value={formData.place}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Profession</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="professional">Professional</option>
        </select>
        <input
          type="text"
          name="mobile_no"
          placeholder="Mobile Number"
          value={formData.mobile_no}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Submitting..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;