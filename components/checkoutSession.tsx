"use client";

import axios from "axios";
import { getGA4ClientId } from "@/lib/gtm";

// =========================================
// CREATE CHECKOUT SESSION
// =========================================

export const createCheckoutSession = async ({
  userId,
  email,
  plan,
  referralCode,
}: {
  userId: string;
  email: string;
  plan: string;
  referralCode?: string;
}) => {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/create-checkout-session`,
    {
      userId,
      email,
      plan,
      referralCode: referralCode || null,
      ga4ClientId: getGA4ClientId(),
    },
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  );

  return res.data;
};

// =========================================
// UPDATE SUBSCRIPTION
// =========================================

export const updateSubscription = async ({
  userId,
  plans,
}: {
  userId: string;
  plans: string[];
}) => {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/update-subscription`,
    {
      userId,
      plans,
    },
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  );

  return res.data;
};

// =========================================
// CANCEL SUBSCRIPTION
// =========================================

export const cancelSubscription = async (userId: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/cancel-subscription`,
    {
      userId,
    },
  );

  return res.data;
};

