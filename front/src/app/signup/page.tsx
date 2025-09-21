'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password2: '',
    password1: '',
    place: '',
    date_of_birth: '',
    profession: '',
    mobile_no: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password1 !== formData.password2) {
      setError("Passwords don't match");
      return;
    }

    if (!executeRecaptcha) {
      setError('reCAPTCHA not ready');
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha('signup');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/signup`;
      
      await axios.post(apiUrl, { ...formData, recaptcha_token: recaptchaToken });

      setSuccessMessage('Registration successful! Please check your email to verify your account.');
      // Optionally redirect after a few seconds
      setTimeout(() => router.push('/login'), 5000);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data[0]?.msg || 'An unknown error occurred.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Inputs for username, email, etc. */}
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="password1" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="password2" placeholder="Confirm Password" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="text" name="place" placeholder="Place" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="date" name="date_of_birth" onChange={handleChange} className="w-full p-2 border rounded text-gray-500" />
          <input type="text" name="profession" placeholder="Profession" onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="tel" name="mobile_no" placeholder="Mobile Number" onChange={handleChange} className="w-full p-2 border rounded" />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}