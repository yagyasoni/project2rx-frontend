import { MoreHorizontal, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  tags: string[];
  status: "Active" | "Inactive";
}

const UserCard = ({ user }: { user: User }) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <InfoRow
          label="EMAIL"
          value={user.email}
          onCopy={() => copyToClipboard(user.email, "Email")}
        />
        <InfoRow
          label="PHONE NUMBER"
          value={user.phone}
          onCopy={() => copyToClipboard(user.phone, "Phone")}
        />
        <InfoRow
          label="ROLE"
          value={user.role}
          onCopy={() => copyToClipboard(user.role, "Role")}
        />
      </div>

      {/* Footer tags */}
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
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
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) => (
  <div className="flex items-start justify-between">
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
    <button
      onClick={onCopy}
      className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Copy size={14} />
    </button>
  </div>
);

export default UserCard;
