"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { registerUser } from "@/service/auth.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tempData = JSON.parse(localStorage.getItem("tempRegisterData"));
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: tempData.email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        await registerUser(tempData);
        toast.success("Xác thực email thành công!");

        localStorage.removeItem("tempRegisterData");
        router.push("/user-login");
      } else {
        toast.error(data.message || "Mã OTP không chính xác");
      }
    } catch (error) {
      console.error('verify OTP ERROR:', error.message);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#F9FDFF] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-xl dark:text-white border-[#0E42D2] p-12">
          <CardHeader>
            <CardTitle className="flex justify-center">
              <img src="/images/logo1.png" alt="Vibely" className="w-28" />
            </CardTitle>
            <CardDescription className="text-center text-[#1CA2C1] text-lg mb-4">
              Xác thực email của bạn
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[#086280]">
                    Mã OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Nhập mã OTP"
                    className="col-span-3 dark:border-gray-400 border-[#0E42D2] placeholder:text-gray-400"
                    required
                  />
                </div>
                <Button
                  className="w-full bg-[#23CAF1] text-white"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xác thực..." : "Xác thực"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;