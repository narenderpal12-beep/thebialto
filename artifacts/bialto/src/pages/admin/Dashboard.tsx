import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, CalendarCheck, DoorOpen, IndianRupee, MessageSquare, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif tracking-wide">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      description: "All time confirmed revenue",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarCheck,
      description: "Total reservations",
    },
    {
      title: "Today's Check-ins",
      value: stats.todayCheckIns,
      icon: DoorOpen,
      description: "Guests arriving today",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Clock,
      description: "Awaiting confirmation",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: MessageSquare,
      description: "Awaiting moderation",
    },
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      icon: BedDouble,
      description: "Across all floors",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif tracking-wide text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of estate performance and pending tasks.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card border-border/50 hover:border-primary/50 transition-colors shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Optional: Add recent bookings table snippet here later */}
    </div>
  );
}
