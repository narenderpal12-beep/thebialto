import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon, getGetCouponsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Tag, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CouponForm {
  code: string;
  discountType: string;
  discountValue: number;
  isActive: boolean;
  maxUses: string;
  expiresAt: string;
}

const defaultForm: CouponForm = {
  code: "", discountType: "percentage", discountValue: 10,
  isActive: true, maxUses: "", expiresAt: "",
};

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: coupons = [], isLoading } = useGetCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CouponForm>(defaultForm);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetCouponsQueryKey() });

  const openCreate = () => { setEditId(null); setForm(defaultForm); setOpen(true); };
  const openEdit = (c: any) => {
    setEditId(c.id);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      isActive: c.isActive,
      maxUses: c.maxUses != null ? String(c.maxUses) : "",
      expiresAt: c.expiresAt ?? "",
    });
    setOpen(true);
  };

  const set = (field: keyof CouponForm, value: any) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    const data: any = {
      code: form.code.toUpperCase().trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      isActive: form.isActive,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
    };
    if (editId) {
      updateCoupon.mutate({ id: editId, data }, {
        onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Coupon updated" }); },
      });
    } else {
      createCoupon.mutate({ data }, {
        onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Coupon created" }); },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this coupon?")) return;
    deleteCoupon.mutate({ id }, {
      onSuccess: () => { invalidate(); toast({ title: "Coupon deleted" }); },
    });
  };

  const handleToggleActive = (c: any) => {
    updateCoupon.mutate({ id: c.id, data: { isActive: !c.isActive } }, {
      onSuccess: () => { invalidate(); },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Coupon Codes</h1>
          <p className="text-muted-foreground mt-1">Manage discount codes for guests.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Coupon
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading coupons...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Discount</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Usage</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Expires</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(coupons as any[]).map((c: any) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="font-mono font-bold tracking-wider">{c.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-primary">
                      {c.discountType === "percentage" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.usedCount}{c.maxUses != null ? ` / ${c.maxUses}` : ""} uses
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "No expiry"}
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => handleToggleActive(c)} title={c.isActive ? "Click to deactivate" : "Click to activate"}>
                      {c.isActive
                        ? <Badge className="bg-green-900/50 text-green-300 border-green-800 gap-1 cursor-pointer"><CheckCircle2 className="w-3 h-3" />Active</Badge>
                        : <Badge variant="secondary" className="gap-1 cursor-pointer"><XCircle className="w-3 h-3" />Inactive</Badge>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(coupons as any[]).length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No coupons yet. Create one to offer discounts to your guests.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editId ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Coupon Code *</Label>
              <Input
                value={form.code}
                onChange={e => set("code", e.target.value.toUpperCase())}
                placeholder="SUMMER20"
                className="font-mono tracking-widest"
              />
              <p className="text-xs text-muted-foreground">Guests enter this code at checkout. Will be stored in uppercase.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select value={form.discountType} onValueChange={v => set("discountType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    max={form.discountType === "percentage" ? 100 : undefined}
                    value={form.discountValue}
                    onChange={e => set("discountValue", Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                    {form.discountType === "percentage" ? "%" : "₹"}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Uses <span className="text-xs text-muted-foreground">(blank = unlimited)</span></Label>
                <Input
                  type="number"
                  min={1}
                  value={form.maxUses}
                  onChange={e => set("maxUses", e.target.value)}
                  placeholder="Unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label>Expires On <span className="text-xs text-muted-foreground">(optional)</span></Label>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={e => set("expiresAt", e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={v => set("isActive", v)} id="active" />
              <Label htmlFor="active">Active (guests can use this code)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground" disabled={createCoupon.isPending || updateCoupon.isPending}>
              {editId ? "Save Changes" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
