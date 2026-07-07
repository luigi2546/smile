"use client";

import { useState } from "react";
import { Button, Input, Label, Badge } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import type { Service } from "@/lib/types";

export default function ServiceItem({ service }: { service: Service }) {
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: any = {};
    fd.forEach((v, k) => (body[k] = v));
    // checkbox value
    body.is_active = fd.get("is_active") === "on";

    const res = await fetch("/api/admin/services/update", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setToast(`Error: ${data?.error ?? res.statusText}`);
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setToast("Saved");
    setTimeout(() => setToast(null), 2000);
    setEditing(false);
    // trigger a full refresh to update server-rendered list
    location.reload();
  }

  async function handleDelete(e: React.FormEvent | any) {
    e?.preventDefault?.();
    // caller should have opened confirmation modal; proceed
    const res = await fetch("/api/admin/services/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: service.id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setToast(`Error: ${data?.error ?? res.statusText}`);
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setToast("Deleted");
    setTimeout(() => setToast(null), 1200);
    location.reload();
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setEditing(true)}>Edit</Button>
        <Button type="button" size="sm" variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete
        </Button>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl px-4 py-2.5 text-sm bg-emerald-50 text-emerald-700 shadow-lg border border-emerald-100">
          {toast}
        </div>
      )}

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Service">
        <form onSubmit={handleUpdate} className="space-y-3">
          <input type="hidden" name="id" value={service.id} />
          <div>
            <Label>Service name</Label>
            <Input name="name" defaultValue={service.name} required />
          </div>
          <div>
            <Label>Category</Label>
            <Input name="category" defaultValue={service.category} required />
          </div>
          <div>
            <Label>Description</Label>
            <Input name="description" defaultValue={service.description ?? ""} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Price (GHS)</Label>
              <Input name="price_ghs" type="number" step="0.01" defaultValue={String(service.price_ghs)} required />
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input name="duration_minutes" type="number" defaultValue={String(service.duration_minutes)} required />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" name="is_active" defaultChecked={service.is_active} className="h-4 w-4" />
              Active
            </label>
          </div>
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(confirmOpen)} onClose={() => setConfirmOpen(false)} title="Confirm delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete <strong>{service.name}</strong>?</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={(e:any) => handleDelete(e)} className="bg-red-600 text-white">Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
