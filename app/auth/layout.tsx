import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
