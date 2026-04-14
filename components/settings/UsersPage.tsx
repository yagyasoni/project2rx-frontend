"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/api";
import axios from "axios";
import { Button } from "@/components/ui/button";

// const userId = localStorage.getItem("userId");

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([
    {
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "",
      tags: ["User"],
      status: "Active" as const,
    },
  ]);

  const [subscription, setSubscription] = useState<any>(null);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const user = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await api.get("/auth/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers([
          {
            id: res?.data?.user?.id,
            name: res?.data?.user?.name,
            email: res?.data?.user?.email,
            phone: res?.data?.user?.phone,
            role: res?.data?.user?.role,
            tags: ["User"],
            status: "Active" as const,
          },
        ]);
      } catch (err) {
        console.log("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    user();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );
  useEffect(() => {
    const handleSelectUser = async () => {
      const userId = localStorage.getItem("userId");
      setSubLoading(true);

      try {
        if (!userId) {
          throw new Error("Invalid user ID");
        }

        const res = await axios.get(
          `${process.env.API_BASE_URL}/pay/subscription/${userId}`,
        );

        console.log("Subscription API response:", res.data);

        // ✅ SAFE ACCESS
        const sub = res?.data?.subscription ?? null;

        setSubscription(sub);
      } catch (err: any) {
        console.error("❌ Failed to fetch subscription:", err);

        // ✅ Better UX instead of silent fail
        toast.error("Failed to fetch subscription");

        setSubscription(null);
      } finally {
        setSubLoading(false);
      }
    };

    handleSelectUser();
  }, []);

  // const handleSelectUser = async () => {
  //   setSubLoading(true);

  //   try {
  //     if (!userId) {
  //       throw new Error("Invalid user ID");
  //     }

  //     const res = await axios.get(
  //       `${process.env.API_BASE_URL}/pay/subscription/${userId}`,
  //     );

  //     console.log("Subscription API response:", res.data);

  //     // ✅ SAFE ACCESS
  //     const sub = res?.data?.subscription ?? null;

  //     setSubscription(sub);
  //   } catch (err: any) {
  //     console.error("❌ Failed to fetch subscription:", err);

  //     // ✅ Better UX instead of silent fail
  //     toast.error("Failed to fetch subscription");

  //     setSubscription(null);
  //   } finally {
  //     setSubLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-muted-foreground">
        Loading User Details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* SAME as Pharmacy */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          User Details
        </h2>

        {filtered.map((user) => (
          <div key={user.id} className="space-y-4">
            {/* Header */}
            {/* <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium text-foreground">
                {user.name}
              </h3>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal size={18} />
              </button>
            </div> */}

            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Name :</span>
              <div className="flex items-center gap-2 max-w-[60%]">
                <span className="text-foreground font-medium truncate">
                  {user.name}
                </span>
                <button
                  onClick={() => copyToClipboard(user.name, "Name")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            {/* Rows EXACT like Pharmacy */}
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Email :</span>
              <div className="flex items-center gap-2 max-w-[60%]">
                <span className="text-foreground font-medium truncate">
                  {user.email}
                </span>
                <button
                  onClick={() => copyToClipboard(user.email, "Email")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Phone :</span>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-medium">
                  {user.phone}
                </span>
                <button
                  onClick={() => copyToClipboard(user.phone, "Phone")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="flex justify-between border-b border-border pb-4">
              <span className="text-muted-foreground">
                Payment Information :
              </span>
              <div className="flex items-center gap-2">
                {/* <span className="text-foreground font-medium"> */}
                <div className="text-foreground font-medium">
                  {/* <h3 className="text-xs font-semibold text-foreground mb-3">
                      Payment Information
                    </h3> */}

                  {subLoading ? (
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  ) : subscription ? (
                    <div className="space-y-2">
                      {/* 🔥 CASE 1: SUBSCRIPTION NOT YET SYNCED (WEBHOOK DELAY) */}
                      {!subscription.stripe_subscription_id ? (
                        <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 space-y-2">
                          <p className="text-xs text-gray-700 font-medium">
                            Trial started successfully
                          </p>
                          <p className="text-[10px] text-gray-600">
                            Subscription is syncing with Stripe. You can still
                            cancel it.
                          </p>

                          {/* ✅ CANCEL BUTTON (AVAILABLE EVEN WITHOUT ID) */}
                          <Button
                            onClick={async () => {
                              const userId = localStorage.getItem("userId");
                              try {
                                await axios.post(
                                  `${process.env.API_BASE_URL}/pay/cancel-subscription`,
                                  {
                                    userId: userId,
                                  },
                                );

                                toast.success(
                                  "Subscription will be canceled after period ends",
                                );
                                window.location.reload();
                              } catch {
                                toast.error("Failed to cancel subscription");
                              }
                            }}
                            variant="destructive"
                            className="w-full text-xs"
                          >
                            Cancel Subscription
                          </Button>
                        </div>
                      ) : (
                        <>
                          {/* ✅ STATUS */}
                          <div className="flex-col-2 rounded-lg border border-border p-3">
                            <div className="text-[10px] text-muted-foreground">
                              Status :{" "}
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  subscription.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : subscription.status === "trialing"
                                      ? "bg-blue-100 text-blue-700"
                                      : subscription.status === "past_due"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                              >
                                {subscription.status}
                              </span>
                            </div>

                            {(subscription.status === "active" ||
                              subscription.status === "trialing" ||
                              subscription.status === "past_due") && (
                              <Button
                                onClick={async () => {
                                  const userId = localStorage.getItem("userId");
                                  try {
                                    await axios.post(
                                      `${process.env.API_BASE_URL}/pay/cancel-subscription`,
                                      {
                                        userId: userId,
                                      },
                                    );

                                    toast.success(
                                      "Subscription will be canceled",
                                    );
                                    window.location.reload();
                                  } catch {
                                    toast.error(
                                      "Failed to cancel subscription",
                                    );
                                  }
                                }}
                                variant="destructive"
                                className="w-full mt-2 text-xs"
                              >
                                Cancel Subscription
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 space-y-2">
                      <p className="text-xs text-gray-700 font-medium">
                        No subscription found
                      </p>
                      <p className="text-[10px] text-gray-600">
                        Please contact support for further assistance
                      </p>
                    </div>
                  )}
                </div>
                {/* </span> */}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 pt-2">
              {user.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs font-medium text-muted-foreground border-border"
                >
                  {tag}
                </Badge>
              ))}
              <Badge
                className={`text-xs font-medium ml-auto ${
                  user.status === "Active"
                    ? "bg-foreground/10 text-foreground border border-foreground/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {user.status}
              </Badge>
            </div>

            {/* Divider between users (like clean sections) */}
            {/* <div className="border-t border-border my-4"></div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
