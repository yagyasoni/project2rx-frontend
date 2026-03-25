"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/api";

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

            {/* <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Role :</span>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-medium">{user.role}</span>
                <button
                  onClick={() => copyToClipboard(user.role, "Role")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div> */}

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
