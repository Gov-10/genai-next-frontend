'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!executeRecaptcha) {
      setError('reCAPTCHA not ready');
      return;
    }
    if (!executeRecaptcha) {
  console.error("reCAPTCHA not ready"); // for debugging
  setError("reCAPTCHA not ready");
  return;
}

const recaptchaToken = await executeRecaptcha('login');
console.log("reCAPTCHA token:", recaptchaToken);

    try {
      const recaptchaToken = await executeRecaptcha('login');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;
      
      const response = await axios.post(apiUrl, {
        username,
        password,
        recaptcha_token: recaptchaToken,
      });

      // Save tokens to localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      router.push('/chat'); // Redirect to a protected page
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}