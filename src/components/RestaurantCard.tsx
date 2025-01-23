import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceForTwo: string;
}

export function RestaurantCard({ id, name, image, cuisine, rating, deliveryTime, priceForTwo }: RestaurantCardProps) {
  return (
    <Link to={`/restaurant/${id}`}>
      <Card className="restaurant-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{name}</h3>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {rating}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{cuisine}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
          <span>{deliveryTime}</span>
          <span>₹{priceForTwo} for two</span>
        </CardContent>
      </Card>
    </Link>
  );
}