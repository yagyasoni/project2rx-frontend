import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {/* <Toaster /> */}
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
