import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  onAddToCart: (quantity: number) => void;
}

export function MenuItem({ id, name, description, price, image, onAddToCart }: MenuItemProps) {
  const [quantity, setQuantity] = useState(0);
  const { toast } = useToast();

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(0, prev - 1));
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToCart(quantity);
      setQuantity(0);
      toast({
        title: "Added to cart",
        description: `${quantity}x ${name} added to your cart`,
      });
    }
  };

  return (
    <Card className="menu-item">
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="font-semibold">₹{price}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={quantity === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={quantity === 0}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}