import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Cart: React.FC = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { token } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (menuId: string, newQuantity: number) => {
    updateQuantity(menuId, newQuantity);
  };

  const handleRemoveItem = (menuId: string) => {
    removeFromCart(menuId);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      toast({
        title: "Login required",
        description: "Please login to place an order.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      const response = await fetch('/api/order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            menu_id: item.menu_id,
            quantity: item.quantity,
          })),
          total_amount: totalPrice,
        }),
      });

      if (response.ok) {
        clearCart();
        toast({
          title: "Order placed successfully!",
          description: "Your order has been placed and is being prepared.",
        });
        navigate('/orders');
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      toast({
        title: "Order failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Add some delicious items to get started!
            </p>
          </div>
          <Link to="/">
            <Button variant="food" size="lg">
              Browse Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gradient-warm rounded-lg flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-2xl">🍽️</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-primary font-medium">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.menu_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.menu_id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.menu_id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>$2.99</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(totalPrice + 2.99 + (totalPrice * 0.08)).toFixed(2)}</span>
              </div>
              
              <Button 
                onClick={handlePlaceOrder} 
                className="w-full" 
                variant="cart" 
                size="lg"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
              
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;