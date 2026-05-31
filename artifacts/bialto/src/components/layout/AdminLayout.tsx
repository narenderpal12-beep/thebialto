import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BedDouble, 
  Layers, 
  CalendarCheck, 
  MapPin, 
  Star, 
  Image as ImageIcon, 
  Coffee, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import logoGold from "@assets/d6456c74-df9e-4207-9c0b-528151a4c565_1780252264411.png";

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { name: "Floors", href: "/admin/floors", icon: Layers },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Attractions", href: "/admin/attractions", icon: MapPin },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Amenities", href: "/admin/amenities", icon: Coffee },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();
  const logout = useAdminLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/admin/login");
      }
    });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="p-6">
        <img src={logoGold} alt="The Bialto Admin" className="h-8 object-contain mb-8" />
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:pl-64 min-w-0">
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-background border-b border-border md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <img src={logoGold} alt="The Bialto" className="h-6 object-contain" />
        </header>
        <div className="p-6 md:p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
