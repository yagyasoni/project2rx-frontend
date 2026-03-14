"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Mail, MoreHorizontal, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserCard from "./UserCard";
import axios from "axios";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([
    {
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "",
      tags: ["Admin"],
      status: "Active" as const,
    },
  ]);

  useEffect(() => {
    const user = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get("http://localhost:5000/auth/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setUsers([
          {
            id: res?.data?.user?.id,
            name: res?.data?.user?.name,
            email: res?.data?.user?.email,
            phone: res?.data?.user?.phone,
            role: res?.data?.user?.role,
            tags: ["Admin"],
            status: "Active" as const,
          },
        ]);
      } catch (err) {
        console.log("error");
        alert("Failed to fetch user info");
      }
    };
    user();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Users</h1>

      {/* Actions bar */}
      {/* <div className="flex items-center gap-3 mb-6">
        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-background border-border"
          />
        </div>
        <Button className="h-10 bg-foreground text-background hover:bg-foreground/90 gap-2">
          <Plus size={16} />
          Create User
        </Button>
        <Button
          variant="outline"
          className="h-10 gap-2 border-border text-foreground hover:bg-accent"
        >
          <Mail size={16} />
          Invite User
        </Button>
      </div> */}

      {/* User cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
