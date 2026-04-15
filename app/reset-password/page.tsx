"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Mail, Lock, CheckCircle } from "lucide-react";
import axios from "axios";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  });

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(password);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Password reset:", { password, confirmPassword });

    // RESET ERRORS
    setErrors({
      password: "",
      confirmPassword: "",
      general: "",
    });

    let newErrors: any = {};

    // VALIDATION
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";

    if (password && !validatePassword(password)) {
      newErrors.password =
        "Min 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const token = new URLSearchParams(window.location.search).get("token");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`,
        {
          token,
          newPassword: confirmPassword,
        },
      );
      console.log(res?.data);

      setErrors((prev) => ({
        ...prev,
        general: res?.data?.message || "Password reset successful",
      }));
    } catch (err) {
      console.log("error");
      setErrors((prev) => ({
        ...prev,
        general: "Failed to reset password",
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background noise-bg relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/30 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4">
            <Lock className="text-primary-foreground" size={20} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Set new password
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5">
            Enter your new password below
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 auth-glow">
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="text-sm text-muted-foreground"
              >
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-sm text-muted-foreground"
              >
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-destructive">Passwords do not match</p>
            )}

            <Button
              type="submit"
              disabled={
                !password || !confirmPassword || password !== confirmPassword
              }
              className="w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 group"
            >
              Reset Password
              <ArrowRight
                size={16}
                className="ml-2 group-hover:translate-x-0.5 transition-transform"
              />
            </Button>
            {errors.general && (
              <p className="text-sm text-center text-green-500">
                {errors.general}
              </p>
            )}
          </form>
        </div>
        <a href="/auth">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 w-full mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </button>
        </a>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
