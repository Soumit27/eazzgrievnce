import { Badge } from "@/components/ui/badge";
import { Shield, Users, Settings, User, Crown, Eye } from "lucide-react";

export type AdminRole = "CM" | "AM" | "JE" | "Manager" | "SDO" | "GM";

interface AdminRoleBadgeProps {
  role?: AdminRole | string; // allow undefined or invalid roles
}

const roleConfig = {
  CM: { 
    label: "Complaint Manager", 
    icon: Shield, 
    variant: "default" as const,
    description: "Validates and assigns complaints"
  },
  AM: { 
    label: "Assistant Manager", 
    icon: Users, 
    variant: "secondary" as const,
    description: "Assigns tasks and verifies completion"
  },
  JE: { 
    label: "Junior Engineer", 
    icon: Settings, 
    variant: "outline" as const,
    description: "Reviews and reassigns work"
  },
  Manager: { 
    label: "Manager", 
    icon: User, 
    variant: "default" as const,
    description: "Final approval authority"
  },
  SDO: { 
    label: "Sub-Divisional Officer", 
    icon: Crown, 
    variant: "default" as const,
    description: "Reviews and approves resolutions"
  },
  GM: { 
    label: "Grievance Manager", 
    icon: Eye, 
    variant: "outline" as const,
    description: "Oversight and monitoring only"
  }
};

export const AdminRoleBadge = ({ role }: AdminRoleBadgeProps) => {
  const config = roleConfig[role as AdminRole];

  if (!config) {
    // Fallback for unknown roles
    return <Badge variant="secondary">Unknown Role</Badge>;
  }

  const Icon = config.icon;

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    </div>
  );
};

export const getRolePermissions = (role: AdminRole | string) => {
  const permissions = {
    CM: ["validate", "assign", "register", "view"],
    AM: ["assign", "verify", "escalate", "view"],
    JE: ["review", "reassign", "supervise", "view"],
    Manager: ["approve", "reject", "oversee", "view"],
    SDO: ["approve", "reject", "final_review", "view"],
    GM: ["monitor", "view", "reports", "oversight"]
  };
  
  return permissions[role as AdminRole] || [];
};
