import { useGetRooms } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Rooms() {
  const { data: rooms, isLoading } = useGetRooms({ published: true });

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-serif text-primary text-center mb-12">Our Rooms</h1>
        
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading rooms...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms?.map((room) => (
              <Card key={room.id} className="bg-card border-border/50 overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={room.featureImageUrl || "/images/about-interior.png"} 
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 text-primary font-serif">
                    ₹{room.pricePerNight} / night
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-serif mb-2">{room.name}</h3>
                  <p className="text-muted-foreground mb-6 line-clamp-2">{room.description}</p>
                  <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-serif tracking-wider">
                    <Link href={`/rooms/${room.id}`}>VIEW DETAILS</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
