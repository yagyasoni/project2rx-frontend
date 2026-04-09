// "use client";
import axios from "axios";

export const createCheckoutSession = async (userId: any, email: string) => {
  const res = await axios.post(
    "https://api.auditprorx.com/pay/create-checkout-session",
    {
      userId,
      email,
    },
  );

  return res.data;
};
