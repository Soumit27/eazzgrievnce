// src/components/users/UserRow.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import UserEditModal from "./UserEditModal";

interface User {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
}

interface UserRowProps {
  user: User;
  updateUserMutation: {
    mutate: (params: { id: string; payload: Partial<User> }) => void;
  };
  deleteUserMutation: {
    mutate: (id: string) => void;
  };
}

export default function UserRow({
  user,
  updateUserMutation,
  deleteUserMutation,
}: UserRowProps) {
  const [editOpen, setEditOpen] = React.useState(false);

  return (
    <div className="flex space-x-2">
      {/* Toggle Active/Inactive */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          updateUserMutation.mutate({
            id: user.id,
            payload: { status: user.status === "Active" ? "Inactive" : "Active" },
          })
        }
      >
        <Eye className="w-4 h-4" />
      </Button>

      {/* Open Modal */}
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <Edit className="w-4 h-4" />
      </Button>

      {/* Delete */}
      <Button
        variant="outline"
        size="sm"
        className="text-destructive"
        onClick={() => deleteUserMutation.mutate(user.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Modal */}
      <UserEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSave={(data) =>
          updateUserMutation.mutate({ id: user.id, payload: data })
        }
      />
    </div>
  );
}
