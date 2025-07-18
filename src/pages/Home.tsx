import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}

const Home: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const filtered = menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, menuItems]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/restaurant/menu');
      const data = await response.json();
      
      if (response.ok) {
        setMenuItems(data);
        setFilteredItems(data);
      } else {
        // Mock data for demo
        const mockData: MenuItem[] = [
          {
            id: '1',
            name: 'Margherita Pizza',
            description: 'Fresh tomatoes, mozzarella cheese, and basil on a crispy crust',
            price: 12.99,
            category: 'Pizza'
          },
          {
            id: '2',
            name: 'Chicken Burger',
            description: 'Grilled chicken breast with lettuce, tomato, and our special sauce',
            price: 8.99,
            category: 'Burgers'
          },
          {
            id: '3',
            name: 'Caesar Salad',
            description: 'Crisp romaine lettuce with parmesan cheese and croutons',
            price: 7.99,
            category: 'Salads'
          },
          {
            id: '4',
            name: 'Pasta Carbonara',
            description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
            price: 11.99,
            category: 'Pasta'
          },
          {
            id: '5',
            name: 'Fish Tacos',
            description: 'Fresh grilled fish with cabbage slaw and chipotle sauce',
            price: 9.99,
            category: 'Mexican'
          },
          {
            id: '6',
            name: 'Chocolate Cake',
            description: 'Rich chocolate cake with chocolate ganache',
            price: 5.99,
            category: 'Desserts'
          }
        ];
        setMenuItems(mockData);
        setFilteredItems(mockData);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast({
        title: "Error",
        description: "Failed to load menu items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (item: MenuItem) => {
    if (!token) {
      toast({
        title: "Login required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          menu_id: item.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        addToCart({
          menu_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
        });
        
        toast({
          title: "Added to cart",
          description: `${item.name} has been added to your cart.`,
        });
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      // Fallback to local cart
      addToCart({
        menu_id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      });
      
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Delicious Food Delivered
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Fresh, fast, and delivered right to your door
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-border focus:border-primary"
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1 animate-fade-in">
            <div className="h-48 bg-gradient-warm flex items-center justify-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl">🍽️</div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span className="text-lg font-bold text-primary">${item.price}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
              <Button 
                onClick={() => handleAddToCart(item)} 
                className="w-full" 
                variant="food"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No menu items found.</p>
        </div>
      )}
    </div>
  );
};

export default Home;