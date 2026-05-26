"use client";

import axios from "axios";

// =========================================
// CREATE CHECKOUT SESSION
// =========================================

export const createCheckoutSession = async ({
  userId,
  email,
  plans,
  referralCode,
}: {
  userId: string;
  email: string;
  plans: string[];
  referralCode?: string;
}) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/create-checkout-session`,
    {
      userId,
      email,
      plans,
      referralCode: referralCode || null,
    },
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
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/update-subscription`,
    {
      userId,
      plans,
    },
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

// =========================================
// RENEW SUBSCRIPTION
// =========================================

export const renewSubscription = async (userId: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/renew-subscription`,
    {
      userId,
    },
  );

  return res.data;
};
