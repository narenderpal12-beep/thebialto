import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminMe } from "@workspace/api-client-react";
import { useEffect } from "react";

// Public Pages
import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import Floors from "@/pages/public/Floors";
import FloorDetail from "@/pages/public/FloorDetail";
import Rooms from "@/pages/public/Rooms";
import RoomDetail from "@/pages/public/RoomDetail";
import Amenities from "@/pages/public/Amenities";
import Gallery from "@/pages/public/Gallery";
import Attractions from "@/pages/public/Attractions";
import Reviews from "@/pages/public/Reviews";
import Contact from "@/pages/public/Contact";
import Book from "@/pages/public/Book";

// Admin Pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminRooms from "@/pages/admin/Rooms";
import AdminFloors from "@/pages/admin/Floors";
import AdminBookings from "@/pages/admin/Bookings";
import AdminAttractions from "@/pages/admin/Attractions";
import AdminReviews from "@/pages/admin/Reviews";
import AdminGallery from "@/pages/admin/Gallery";
import AdminAmenities from "@/pages/admin/Amenities";
import AdminSettings from "@/pages/admin/Settings";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, ...rest }: any) {
  const [location, setLocation] = useLocation();
  const { data: admin, isLoading, error } = useGetAdminMe({
    query: {
      retry: false
    }
  });

  useEffect(() => {
    if (!isLoading && (error || !admin)) {
      setLocation("/admin/login");
    }
  }, [isLoading, error, admin, setLocation]);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-background text-primary">Loading...</div>;
  }

  if (error || !admin) {
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      {/* Admin Login - No Layout */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* Admin Routes */}
      <Route path="/admin" nest>
        <AdminLayout>
          <Switch>
            <Route path="/" component={() => <ProtectedRoute component={AdminDashboard} />} />
            <Route path="/rooms" component={() => <ProtectedRoute component={AdminRooms} />} />
            <Route path="/floors" component={() => <ProtectedRoute component={AdminFloors} />} />
            <Route path="/bookings" component={() => <ProtectedRoute component={AdminBookings} />} />
            <Route path="/attractions" component={() => <ProtectedRoute component={AdminAttractions} />} />
            <Route path="/reviews" component={() => <ProtectedRoute component={AdminReviews} />} />
            <Route path="/gallery" component={() => <ProtectedRoute component={AdminGallery} />} />
            <Route path="/amenities" component={() => <ProtectedRoute component={AdminAmenities} />} />
            <Route path="/settings" component={() => <ProtectedRoute component={AdminSettings} />} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>

      {/* Public Routes */}
      <Route path="/" nest>
        <PublicLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/floors" component={Floors} />
            <Route path="/floors/:id" component={FloorDetail} />
            <Route path="/rooms" component={Rooms} />
            <Route path="/rooms/:id" component={RoomDetail} />
            <Route path="/amenities" component={Amenities} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/attractions" component={Attractions} />
            <Route path="/reviews" component={Reviews} />
            <Route path="/contact" component={Contact} />
            <Route path="/book" component={Book} />
            <Route component={NotFound} />
          </Switch>
        </PublicLayout>
      </Route>
      
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
