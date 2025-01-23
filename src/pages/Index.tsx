import { RestaurantCard } from "@/components/RestaurantCard";
import { MenuItem } from "@/components/MenuItem";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
const restaurants = [
  {
    id: "1",
    name: "Biryani House",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80",
    cuisine: "North Indian, Biryani",
    rating: 4.3,
    deliveryTime: "30-35 min",
    priceForTwo: "500"
  },
  {
    id: "2",
    name: "Pizza Paradise",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    cuisine: "Italian, Pizza",
    rating: 4.5,
    deliveryTime: "25-30 min",
    priceForTwo: "600"
  },
  {
    id: "3",
    name: "Sushi Express",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    cuisine: "Japanese, Sushi",
    rating: 4.4,
    deliveryTime: "35-40 min",
    priceForTwo: "800"
  },
  {
    id: "4",
    name: "Burger Joint",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    cuisine: "American, Burgers",
    rating: 4.2,
    deliveryTime: "20-25 min",
    priceForTwo: "400"
  }
];

const menuItems = [
  {
    id: "1",
    name: "Chicken Biryani",
    description: "Aromatic basmati rice cooked with tender chicken pieces and special spices",
    price: 250,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80",
  },
  {
    id: "2",
    name: "Butter Naan",
    description: "Soft and buttery Indian bread",
    price: 40,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80",
  },
  {
    id: "3",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in spices",
    price: 200,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80",
  },
  {
    id: "4",
    name: "Dal Makhani",
    description: "Creamy black lentils cooked overnight",
    price: 180,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80",
  }
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (item: typeof menuItems[0], quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      return [...prevCart, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity
      }];
    });
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <Input
          type="search"
          placeholder="Search for restaurants, cuisine or a dish..."
          className="w-full pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Popular Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                {...item}
                onAddToCart={(quantity) => handleAddToCart(item, quantity)}
              />
            ))}
          </div>

          <h2 className="text-2xl font-bold my-6">Popular Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                {...restaurant}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-card rounded-lg border p-4">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center font-bold">
                      <p>Total</p>
                      <p>₹{cartTotal}</p>
					  
					   <p className="mt-2 text-sm text-gray-600">
                        {" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary/90">
              CHECKOUT
            </Link>
          </p>
					  
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}