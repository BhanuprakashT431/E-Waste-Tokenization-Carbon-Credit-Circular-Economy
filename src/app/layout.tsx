import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "./context/AppContext";

export const metadata: Metadata = {
  title: "EcoChain Protocol | E-Waste Tokenization & Carbon Credit Platform",
  description:
    "A blockchain-powered ESG platform that tokenizes e-waste recycling into Carbon Credit Tokens (CCT). Register devices, track recycling, and earn rewards through smart contracts.",
  keywords: "e-waste, blockchain, carbon credits, sustainability, ESG, tokenization, recycling",
  authors: [{ name: "EcoChain Protocol" }],
  openGraph: {
    title: "EcoChain Protocol | E-Waste Tokenization",
    description: "Turn e-waste into Carbon Credit Tokens through blockchain-verified recycling",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#00FF66",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" style={{ colorScheme: "dark" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full antialiased" style={{ background: "#070b12" }}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
