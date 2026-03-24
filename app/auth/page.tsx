// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
// import { GoogleLogin } from "@react-oauth/google";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const AuthPage = () => {
//   const router = useRouter();
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [showOtp, setShowOtp] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [forgot, setForgot] = useState(false);
//   const [phone, setPhone] = useState("");

//   const validatePassword = (password: string) => {
//     const regex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     return regex.test(password);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password || (!isLogin && !name) || (!isLogin && !phone)) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     if (isLogin) {
//       try {
//         const res = await axios.post("https://api.auditprorx.com/auth/login", {
//           email,
//           password,
//         });
//         console.log(res?.data);
//         localStorage.setItem("accessToken", res?.data?.accessToken);
//         localStorage.setItem("refreshToken", res?.data?.refreshToken);
//         if (!localStorage.getItem("userId")) {
//           localStorage.setItem("userId", res?.data?.user?.id);
//         }
//         localStorage.setItem("userEmail", email); // ✅ ADD THIS
//         alert("successfully logged in");

//         router.push("/Mainpage");
//       } catch (err) {
//         console.error("Login failed:", err);
//       }
//     } else {
//       if (!validatePassword(password)) {
//         alert(
//           "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
//         );
//         return; // Stop the execution
//       }

//       try {
//         const res = await axios.post(
//           "https://api.auditprorx.com/auth/register",
//           {
//             name,
//             email,
//             phone,
//             password,
//           },
//         );
//         console.log(res?.data);
//         localStorage.setItem("userId", res?.data?.user?.id);
//         localStorage.setItem("userEmail", email); // ✅ ADD THIS LINE
//         alert(res?.data?.message);
//         setShowOtp(true);
//         setIsLogin(true);
//       } catch (err) {
//         console.error("Registration failed:", err);
//       }
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       const res = await axios.post(
//         "https://api.auditprorx.com/auth/verify-otp",
//         {
//           email,
//           otp,
//         },
//       );
//       console.log(res?.data);

//       alert(res?.data?.message);
//       router.push("/info-page");
//     } catch (err) {
//       console.error("OTP verification failed:", err);
//       alert("OTP verification failed. Please try again.");
//     }
//   };

//   const resendOtp = async () => {
//     try {
//       const res = await axios.post(
//         "https://api.auditprorx.com/auth/resend-otp",
//         {
//           email,
//         },
//       );
//       console.log(res?.data);
//       alert(res?.data?.message);
//     } catch (err) {
//       console.error("Failed to resend OTP:", err);
//     }
//   };

//   const handleForgot = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         "https://api.auditprorx.com/auth/forgot-password",
//         { email },
//       );
//       console.log(res?.data);
//       alert(res?.data?.message);
//       setForgot(false); // Close the modal on success
//     } catch (error: any) {
//       console.error("Forgot password failed:", error.response || error);
//       alert("Failed to send reset link. Please try again.");
//     }
//   };

//   if (showOtp) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background noise-bg relative overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage:
//               "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
//             backgroundSize: "60px 60px",
//           }}
//         />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/30 blur-[120px]" />

//         <div className="relative z-10 w-full max-w-md px-6">
//           <div className="text-center mb-10">
//             {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4"> */}
//             {/* <span className="text-primary-foreground font-bold text-lg">
//                 A
//               </span> */}
//             {/* </div> */}
//             <h1 className="text-2xl font-semibold tracking-tight text-foreground">
//               Verify your email
//             </h1>
//             <p className="text-muted-foreground text-sm mt-1.5">
//               We sent a 6-digit code to{" "}
//               <span className="text-foreground">{email}</span>
//             </p>
//           </div>

//           <div className="bg-card rounded-2xl border border-border p-8 auth-glow">
//             <div className="flex flex-col items-center space-y-6">
//               <InputOTP maxLength={6} value={otp} onChange={setOtp}>
//                 <InputOTPGroup>
//                   <InputOTPSlot
//                     index={0}
//                     className="w-12 h-14 text-lg bg-secondary border-border text-foreground"
//                   />
//                   <InputOTPSlot
//                     index={1}
//                     className="w-12 h-14 text-lg bg-secondary border-border text-foreground"
//                   />
//                   <InputOTPSlot
//                     index={2}
//                     className="w-12 h-14 text-lg bg-secondary border-border text-foreground"
//                   />
//                   <InputOTPSlot
//                     index={3}
//                     className="w-12 h-14 text-lg bg-secondary border-border text-foreground"
//                   />
//                   <InputOTPSlot
//                     index={4}
//                     className="w-12 h-14 text-lg bg-secondary border-border text-foreground"
//                   />
//                   <InputOTPSlot
//                     index={5}
//                     className="w-12 h-14 text-lg bg-secondary border-border text-foreground"
//                   />
//                 </InputOTPGroup>
//               </InputOTP>

//               <Button
//                 onClick={verifyOtp}
//                 disabled={otp.length < 6}
//                 className="w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 group"
//               >
//                 Verify Code
//                 <ArrowRight
//                   size={16}
//                   className="ml-2 group-hover:translate-x-0.5 transition-transform"
//                 />
//               </Button>

//               <div className="flex items-center justify-between w-full">
//                 {/* <button
//                   type="button"
//                   onClick={() => setShowOtp(false)}
//                   className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
//                 >
//                   <ArrowLeft size={14} />
//                   Back
//                 </button> */}
//                 <button
//                   type="button"
//                   className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//                   onClick={resendOtp}
//                 >
//                   Resend code
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background noise-bg relative overflow-hidden py-12">
//       {/* Subtle grid lines */}
//       <div
//         className="absolute inset-0 opacity-[0.03]"
//         style={{
//           backgroundImage:
//             "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
//           backgroundSize: "60px 60px",
//         }}
//       />

//       {/* Radial glow */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/30 blur-[120px]" />

//       <div className="relative z-10 w-full max-w-md px-6">
//         {/* Logo / Brand */}
//         <div className="text-center mb-10">
//           {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4">
//             <span className="text-primary-foreground font-bold text-lg">A</span>
//           </div> */}
//           <h1 className="text-2xl font-semibold tracking-tight text-foreground">
//             {isLogin ? "Welcome back" : "Create account"}
//           </h1>
//           <p className="text-muted-foreground text-sm mt-1.5">
//             {isLogin ? "Sign in to continue" : "Get started for free"}
//           </p>
//         </div>

//         {/* Card */}
//         <div className="bg-card rounded-2xl border border-border p-8 auth-glow">
//           {/* Toggle */}
//           <div className="flex bg-secondary rounded-lg p-1 mb-8">
//             <button
//               type="button"
//               onClick={() => setIsLogin(true)}
//               className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
//                 isLogin
//                   ? "bg-accent text-foreground shadow-sm"
//                   : "text-muted-foreground hover:text-foreground"
//               }`}
//             >
//               Sign In
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsLogin(false)}
//               className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
//                 !isLogin
//                   ? "bg-accent text-foreground shadow-sm"
//                   : "text-muted-foreground hover:text-foreground"
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {!isLogin && (
//               <div className="space-y-2">
//                 <Label htmlFor="name" className="text-sm text-muted-foreground">
//                   Full Name
//                 </Label>
//                 <Input
//                   id="name"
//                   type="text"
//                   placeholder="John Doe"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
//                 />
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm text-muted-foreground">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
//               />
//             </div>

//             {!isLogin && (
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="phone"
//                   className="text-sm text-muted-foreground"
//                 >
//                   Phone No.
//                 </Label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   placeholder="123-456-7890"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
//                 />
//               </div>
//             )}

//             <div className="space-y-0">
//               <div className="flex items-center justify-between">
//                 <Label
//                   htmlFor="password"
//                   className="text-sm text-muted-foreground"
//                 >
//                   Password
//                 </Label>
//                 {isLogin && (
//                   <button
//                     type="button"
//                     onClick={() => setForgot(true)}
//                     className="text-xs text-muted-foreground hover:text-foreground transition-colors"
//                   >
//                     Forgot password?
//                   </button>
//                 )}
//                 {/* {!isLogin && (
//                   <p className="text-[10px] text-blue-500 mt-1">
//                     At least 8 chars, 1 uppercase, 1 number, and 1 symbol.
//                   </p>
//                 )} */}
//               </div>

//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="new-password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring pr-14"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//               {!isLogin && (
//                 <p className="text-[10px] text-blue-500 mt-1">
//                   Password must be atleast 8 chars, 1 uppercase, 1 number, and 1
//                   symbol.
//                 </p>
//               )}
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 group"
//             >
//               {isLogin ? "Sign In" : "Create Account"}
//               <ArrowRight
//                 size={16}
//                 className="ml-2 group-hover:translate-x-0.5 transition-transform"
//               />
//             </Button>
//           </form>

//           {/* Divider */}
//           <div className="flex items-center gap-4 my-6">
//             <div className="flex-1 h-px bg-border" />
//             <span className="text-xs text-muted-foreground uppercase tracking-wider">
//               or
//             </span>
//             <div className="flex-1 h-px bg-border" />
//           </div>

//           {/* Social buttons */}
//           <div className="grid grid-cols-1 gap-3">
//             {/* <Button
//               type="button"
//               variant="outline"
//               className="h-12 bg-secondary border-border text-foreground hover:bg-accent transition-all"
//             >
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path
//                   fill="currentColor"
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 />
//               </svg>
//               Google
//             </Button> */}
//             {/* <Button
//               type="button"
//               variant="outline"
//               className="h-12 bg-secondary border-border text-foreground hover:bg-accent transition-all"
//             >
//               <svg
//                 className="w-5 h-5 mr-2"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//               >
//                 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//               </svg>
//               GitHub
//             </Button> */}
//             {/* <GoogleLogin
//               theme="outline"
//               size="large"
//               shape="rectangular"
//               width="100%"
//               onSuccess={async (credentialResponse) => {
//                 try {
//                   const res = await axios.post(
//                     "https://api.auditprorx.com/auth/google",
//                     {
//                       credential: credentialResponse.credential,
//                     },
//                   );
//                   console.log(res.data);
//                   alert("Google login successful");

//                   window.location.href = "/Mainpage";
//                 } catch (error) {
//                   console.error("Google login failed", error);
//                 }
//               }}
//               onError={() => {
//                 console.log("Google Login Failed");
//               }}
//             /> */}

//             {isLogin && (
//               <GoogleLogin
//                 theme="outline"
//                 size="large"
//                 shape="rectangular"
//                 width="100%"
//                 onSuccess={async (credentialResponse) => {
//                   try {
//                     const res = await axios.post(
//                       "https://api.auditprorx.com/auth/google",
//                       {
//                         credential: credentialResponse.credential,
//                       },
//                     );

//                     console.log(res.data);

//                     localStorage.setItem("accessToken", res?.data?.token);

//                     alert("Google login successful");

//                     window.location.href = "/Mainpage";
//                   } catch (error) {
//                     console.error("Google login failed", error);
//                     alert("Google login failed. Please register first.");
//                   }
//                 }}
//                 onError={() => {
//                   console.log("Google Login Failed");
//                 }}
//               />
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-center text-xs text-muted-foreground mt-8 space-x-1 gap-2">
//           <Checkbox className="m-0" />
//           <span>
//             By continuing, you agree to our{" "}
//             <a href="#" className="text-foreground hover:underline">
//               Terms
//             </a>{" "}
//             and{" "}
//             <a href="#" className="text-foreground hover:underline">
//               Privacy Policy
//             </a>
//           </span>
//         </div>
//       </div>

//       <Dialog open={forgot} onOpenChange={setForgot}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Reset Password</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleForgot} className="space-y-5">
//             <div className="space-y-2">
//               <Label
//                 htmlFor="reset-email"
//                 className="text-sm text-muted-foreground"
//               >
//                 Email
//               </Label>
//               <Input
//                 id="reset-email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
//               />
//             </div>
//             <Button
//               type="submit"
//               disabled={!email}
//               className="w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 group"
//             >
//               Send Reset Link
//               <ArrowRight
//                 size={16}
//                 className="ml-2 group-hover:translate-x-0.5 transition-transform"
//               />
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AuthPage;


"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

// ─────────────────────────────────────────────────────────────
// Inner component — reads search params
// ─────────────────────────────────────────────────────────────
const AuthPageInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Read prefill params from admin dashboard redirect ──
  const prefillEmail = searchParams.get("email") || "";
  const prefillPassword = searchParams.get("password") || "";
  const isPrefilled = searchParams.get("prefill") === "true";

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(isPrefilled); // show password if prefilled so admin can see it
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState(prefillPassword);
  const [name, setName] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [forgot, setForgot] = useState(false);
  const [phone, setPhone] = useState("");

  // Update fields if URL params change
  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
    if (prefillPassword) setPassword(prefillPassword);
    if (isPrefilled) setIsLogin(true); // always go to login tab when prefilled
  }, [prefillEmail, prefillPassword, isPrefilled]);

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name) || (!isLogin && !phone)) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isLogin) {
      try {
        const res = await axios.post("https://api.auditprorx.com/auth/login", {
          email,
          password,
        });
        console.log(res?.data);
        localStorage.setItem("accessToken", res?.data?.accessToken);
        localStorage.setItem("refreshToken", res?.data?.refreshToken);
        if (!localStorage.getItem("userId")) {
          localStorage.setItem("userId", res?.data?.user?.id);
        }
        localStorage.setItem("userEmail", email);
        alert("Successfully logged in");
        router.push("/Mainpage");
      } catch (err) {
        console.error("Login failed:", err);
      }
    } else {
      if (!validatePassword(password)) {
        alert(
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
        );
        return;
      }
      try {
        const res = await axios.post(
          "https://api.auditprorx.com/auth/register",
          { name, email, phone, password },
        );
        console.log(res?.data);
        localStorage.setItem("userId", res?.data?.user?.id);
        localStorage.setItem("userEmail", email);
        alert(res?.data?.message);
        setShowOtp(true);
        setIsLogin(true);
      } catch (err) {
        console.error("Registration failed:", err);
      }
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "https://api.auditprorx.com/auth/verify-otp",
        { email, otp },
      );
      console.log(res?.data);
      alert(res?.data?.message);
      router.push("/info-page");
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert("OTP verification failed. Please try again.");
    }
  };

  const resendOtp = async () => {
    try {
      const res = await axios.post(
        "https://api.auditprorx.com/auth/resend-otp",
        { email },
      );
      console.log(res?.data);
      alert(res?.data?.message);
    } catch (err) {
      console.error("Failed to resend OTP:", err);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://api.auditprorx.com/auth/forgot-password",
        { email },
      );
      console.log(res?.data);
      alert(res?.data?.message);
      setForgot(false);
    } catch (error: any) {
      console.error("Forgot password failed:", error.response || error);
      alert("Failed to send reset link. Please try again.");
    }
  };

  // ── OTP Screen ──
  if (showOtp) {
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
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Verify your email
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              We sent a 6-digit code to{" "}
              <span className="text-foreground">{email}</span>
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 auth-glow">
            <div className="flex flex-col items-center space-y-6">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-12 h-14 text-lg bg-secondary border-border text-foreground"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <Button
                onClick={verifyOtp}
                disabled={otp.length < 6}
                className="w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 group"
              >
                Verify Code
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>

              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={resendOtp}
              >
                Resend code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Auth Page ──
  return (
    <div className="min-h-screen flex items-center justify-center bg-background noise-bg relative overflow-hidden py-12">
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
        {/* ── Admin prefill notice banner ── */}
        {isPrefilled && (
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 16,
            fontSize: 13,
            color: "#15803d",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>
            🔓 <strong>Admin View:</strong> Credentials pre-filled. Click Sign In to continue.
          </div>
        )}

        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5">
            {isLogin ? "Sign in to continue" : "Get started for free"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border p-8 auth-glow">
          {/* Toggle */}
          <div className="flex bg-secondary rounded-lg p-1 mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                isLogin ? "bg-accent text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                !isLogin ? "bg-accent text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name</Label>
                <Input
                  id="name" type="text" placeholder="John Doe"
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
              <Input
                id="email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone No.</Label>
                <Input
                  id="phone" type="tel" placeholder="123-456-7890"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                />
              </div>
            )}

            <div className="space-y-0">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setForgot(true)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-[10px] text-blue-500 mt-1">
                  Password must be at least 8 chars, 1 uppercase, 1 number, and 1 symbol.
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 group"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Login */}
          <div className="grid grid-cols-1 gap-3">
            {isLogin && (
              <GoogleLogin
                theme="outline" size="large" shape="rectangular" width="100%"
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await axios.post(
                      "https://api.auditprorx.com/auth/google",
                      { credential: credentialResponse.credential },
                    );
                    localStorage.setItem("accessToken", res?.data?.token);
                    alert("Google login successful");
                    window.location.href = "/Mainpage";
                  } catch (error) {
                    console.error("Google login failed", error);
                    alert("Google login failed. Please register first.");
                  }
                }}
                onError={() => console.log("Google Login Failed")}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center text-xs text-muted-foreground mt-8 space-x-1 gap-2">
          <Checkbox className="m-0" />
          <span>
            By continuing, you agree to our{" "}
            <a href="#" className="text-foreground hover:underline">Terms</a>{" "}
            and{" "}
            <a href="#" className="text-foreground hover:underline">Privacy Policy</a>
          </span>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgot} onOpenChange={setForgot}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleForgot} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm text-muted-foreground">Email</Label>
              <Input
                id="reset-email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
              />
            </div>
            <Button
              type="submit" disabled={!email}
              className="w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 group"
            >
              Send Reset Link
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Wrap in Suspense — required for useSearchParams in Next.js
// ─────────────────────────────────────────────────────────────
const AuthPage = () => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
    <AuthPageInner />
  </Suspense>
);

export default AuthPage;