import { useState } from "react";
import { useGetBookings, useUpdateBooking, getGetBookingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CalendarCheck, Phone, Mail, Users, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUSES = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-900/40 text-yellow-300 border-yellow-800",
  confirmed: "bg-green-900/40 text-green-300 border-green-800",
  "checked-in": "bg-blue-900/40 text-blue-300 border-blue-800",
  "checked-out": "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: bookings = [], isLoading } = useGetBookings(
    statusFilter !== "all" ? { status: statusFilter } : {}
  );
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateBooking = useUpdateBooking();
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetBookingsQueryKey() });

  const openDetail = (b: any) => { setSelected(b); setNewStatus(b.status); };

  const handleStatusUpdate = () => {
    if (!selected) return;
    updateBooking.mutate(
      { id: selected.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          invalidate();
          setSelected(null);
          toast({ title: "Booking status updated" });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage guest reservations and check-ins.</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <div className="text-muted-foreground">Loading bookings...</div> : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Guest</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Room Type</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Dates</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Guests</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Amount</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(bookings as any[]).map(b => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.guestName}</div>
                    <div className="text-xs text-muted-foreground">{b.guestEmail}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{b.roomType}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {b.checkIn} → {b.checkOut}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{b.guests}</td>
                  <td className="px-4 py-3">
                    <Badge className={`capitalize border ${statusColors[b.status] ?? ""}`}>{b.status}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    ₹{b.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openDetail(b)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No bookings found.</div>
          )}
        </div>
      )}

      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Booking #{selected.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs">Guest Name</div>
                  <div className="font-medium">{selected.guestName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs">Room Type</div>
                  <div className="font-medium">{selected.roomType}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs flex items-center gap-1"><Mail className="w-3 h-3" /> Email</div>
                  <div className="font-medium text-xs break-all">{selected.guestEmail}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</div>
                  <div className="font-medium">{selected.guestPhone}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> Check-in</div>
                  <div className="font-medium">{selected.checkIn}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs">Check-out</div>
                  <div className="font-medium">{selected.checkOut}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs flex items-center gap-1"><Users className="w-3 h-3" /> Guests</div>
                  <div className="font-medium">{selected.guests}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs">Total Amount</div>
                  <div className="font-medium">₹{selected.totalAmount.toLocaleString("en-IN")}</div>
                </div>
              </div>
              {selected.specialRequests && (
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs">Special Requests</div>
                  <div className="text-sm bg-muted/30 rounded p-2">{selected.specialRequests}</div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              <Button onClick={handleStatusUpdate} className="bg-primary text-primary-foreground" disabled={updateBooking.isPending}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
