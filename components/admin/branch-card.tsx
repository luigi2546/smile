"use client";

import { useState } from "react";
import { Card, Badge, Button, Input, Label } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import {
  editBranch,
  deleteBranch,
  toggleBranchActive,
} from "@/app/admin/(protected)/branches/actions";
import type { Branch } from "@/lib/types";

export function BranchCard({ branch }: { branch: Branch }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [optimisticActive, setOptimisticActive] = useState(branch.is_active);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await editBranch(branch.id, fd);
      setEditing(false);
      showToast("Branch updated");
    } catch {
      showToast("Failed to save — please try again");
    }
  }

  async function handleDelete() {
    try {
      await deleteBranch(branch.id);
      setConfirmDelete(false);
      showToast("Branch deleted");
    } catch {
      setConfirmDelete(false);
      showToast("Cannot delete — this branch may have appointments");
    }
  }

  async function handleToggle() {
    setOptimisticActive((prev) => !prev);
    try {
      await toggleBranchActive(branch.id, optimisticActive);
      showToast(optimisticActive ? "Branch deactivated" : "Branch activated");
    } catch {
      setOptimisticActive((prev) => !prev); // revert on error
      showToast("Failed to update status");
    }
  }

  return (
    <>
      <Card className="relative p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-ink">{branch.name}</p>
          <Badge tone={optimisticActive ? "success" : "danger"}>
            {optimisticActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted">{branch.address}</p>
        {branch.phone && (
          <p className="mt-2 text-sm font-medium text-teal-darker">{branch.phone}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={handleToggle}>
            {optimisticActive ? "Deactivate" : "Activate"}
          </Button>
          <Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        </div>

        {toast && (
          <div className="absolute right-3 top-3 rounded-xl px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 shadow-sm">
            {toast}
          </div>
        )}
      </Card>

      {/* Edit modal */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Branch">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <Label htmlFor={`name-${branch.id}`}>Branch name</Label>
            <Input
              id={`name-${branch.id}`}
              name="name"
              defaultValue={branch.name}
              required
              placeholder="e.g. Spintex"
            />
          </div>
          <div>
            <Label htmlFor={`address-${branch.id}`}>Address</Label>
            <Input
              id={`address-${branch.id}`}
              name="address"
              defaultValue={branch.address}
              required
              placeholder="Street, area, city"
            />
          </div>
          <div>
            <Label htmlFor={`phone-${branch.id}`}>Phone</Label>
            <Input
              id={`phone-${branch.id}`}
              name="phone"
              defaultValue={branch.phone ?? ""}
              placeholder="+233 24 000 0000"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete branch?"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-ink">{branch.name}</span>? This cannot be
            undone. Branches with existing appointments cannot be deleted.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete branch
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
