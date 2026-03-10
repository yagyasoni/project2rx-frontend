// "use client";

// import React, { useState, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// interface OtpProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (otp: string) => void;
//   title?: string;
// }

// export const Otp: React.FC<OtpProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   title = "Enter OTP",
// }) => {
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//   ]);

//   const handleInputChange = (index: number, value: string) => {
//     if (value.length > 1) return; // Only allow single digit

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (
//     index: number,
//     e: React.KeyboardEvent<HTMLInputElement>,
//   ) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleSubmit = () => {
//     const otpString = otp.join("");
//     if (otpString.length === 6) {
//       onSubmit(otpString);
//       setOtp(["", "", "", "", "", ""]);
//       onClose();
//     }
//   };

//   const handleClose = () => {
//     setOtp(["", "", "", "", "", ""]);
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//         </DialogHeader>
//         <div className="flex justify-center space-x-2 py-4">
//           {otp.map((digit, index) => (
//             <Input
//               key={index}
//               ref={(el) => (inputRefs.current[index] = el)}
//               type="text"
//               inputMode="numeric"
//               pattern="[0-9]*"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleInputChange(index, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               className="w-12 h-12 text-center text-lg font-semibold"
//             />
//           ))}
//         </div>
//         <div className="flex justify-end space-x-2">
//           <Button variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={otp.some((d) => d === "")}>
//             Submit
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default Otp;
