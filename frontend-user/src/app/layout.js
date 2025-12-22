import { Roboto_Condensed } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthWrapper from "./auth-wrapper";
import { ContextProvider } from "./context/QuizContext";
import "./globals.css";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${robotoCondensed.variable} antialiased`}>
        <Toaster />
        <AuthWrapper>
          <ContextProvider>
            {children}
          </ContextProvider>
        </AuthWrapper>
      </body>
    </html>
  );
}