'use client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
// ... other imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY;

  return (
    <html lang="en">
      <body>
        {recaptchaKey ? (
          <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
            {children}
          </GoogleReCaptchaProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}