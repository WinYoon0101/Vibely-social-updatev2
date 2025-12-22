import { Geist_Mono, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Vibely",
  description: "Mạng xã hội học tập kết nối các bạn học sinh, sinh viên",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} ${robotoCondensed.variable} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}