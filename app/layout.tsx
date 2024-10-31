import Providers from "./providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cursor Tutor",
  description:
    "Following the cursor tutor and building a full stack enterprise level app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className="antialiased">{children}</body>
      </html>
    </Providers>
  );
}
