// "use client";
import axios from "axios";

export const createCheckoutSession = async (userId: any, email: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/create-checkout-session`,
    {
      userId,
      email,
    },
  );

  return res.data;
};
