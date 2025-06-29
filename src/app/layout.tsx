import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Explain It - Your Personal Learning Companion",
  description: "Master any subject with AI-powered explanations, interactive quizzes, and personalized learning paths. From exam prep to language learning.",
  keywords: ["education", "learning", "AI tutor", "exam prep", "language learning", "study companion"],
  authors: [{ name: "Explain It Team" }],
  creator: "Explain It",
  publisher: "Explain It",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              {children}
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>

        {/* OmniDimension Web Widget */}
        <Script
          id="omnidimension-web-widget"
          src="https://backend.omnidim.io/web_widget.js?secret_key=bd4b1db6f61ac7fe590638feb708917e"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
