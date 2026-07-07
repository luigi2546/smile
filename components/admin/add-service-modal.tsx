"use client";

import { useState } from "react";
import { Button, Input, Label } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { addService } from "@/app/admin/(protected)/services/actions";

export function AddServiceModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add service
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Service">
        <form action={addService} className="space-y-4">
          <div>
            <Label htmlFor="name">Service name</Label>
            <Input id="name" name="name" required placeholder="e.g. Invisalign Consultation" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" required placeholder="Cosmetic, Preventive, General…" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" placeholder="Short description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price_ghs">Price (GHS)</Label>
              <Input id="price_ghs" name="price_ghs" type="number" step="0.01" required />
            </div>
            <div>
              <Label htmlFor="duration_minutes">Duration (min)</Label>
              <Input id="duration_minutes" name="duration_minutes" type="number" required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
