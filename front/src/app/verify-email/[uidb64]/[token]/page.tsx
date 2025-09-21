'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your email, please wait...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const { uidb64, token } = params;

    if (!uidb64 || !token) {
      setMessage('Invalid verification link.');
      return;
    }

    const verify = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/verify-email/${uidb64}/${token}`;
        const response = await axios.get(apiUrl);
        setMessage(response.data.message);
        setIsSuccess(true);
        setTimeout(() => router.push('/login'), 3000); // Redirect to login on success
      } catch (err: any) {
        setMessage(err.response?.data?.error || 'Verification failed. The link may be invalid or expired.');
        setIsSuccess(false);
      }
    };

    verify();
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className={isSuccess ? 'text-green-600' : 'text-red-600'}>
          {message}
        </p>
        {isSuccess && <p className="mt-2 text-gray-600">Redirecting to login...</p>}
      </div>
    </div>
  );
}