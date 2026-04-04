export const createCheckoutSession = async (userId: number, email: string) => {
  const res = await fetch(
    "https://api.auditprorx.com/pay/create-checkout-session",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, email }),
    },
  );

  return res.json();
};
