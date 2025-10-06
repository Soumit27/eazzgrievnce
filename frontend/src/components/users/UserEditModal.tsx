// src/components/users/UserEditModal.tsx
import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
}

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (data: Partial<User>) => void;
}

export default function UserEditModal({
  open,
  onClose,
  user,
  onSave,
}: UserEditModalProps) {
  const { register, handleSubmit, reset } = useForm<Partial<User>>({
    defaultValues: user ?? {},
  });

  React.useEffect(() => {
    reset(user ?? {});
  }, [user, reset]);

  const handleSave = (data: Partial<User>) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <Input {...register("name")} placeholder="Name" />
          <Input {...register("email")} type="email" placeholder="Email" />

          <select
            {...register("status")}
            className="border p-2 rounded w-full text-sm"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
