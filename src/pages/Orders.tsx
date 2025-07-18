import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  menu_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered';
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/order/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        // Mock data for demo
        const mockOrders: Order[] = [
          {
            id: '1',
            status: 'delivered',
            total_amount: 25.99,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              { id: '1', menu_id: '1', name: 'Margherita Pizza', price: 12.99, quantity: 1 },
              { id: '2', menu_id: '2', name: 'Chicken Burger', price: 8.99, quantity: 1 },
            ],
          },
          {
            id: '2',
            status: 'preparing',
            total_amount: 18.99,
            created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            items: [
              { id: '3', menu_id: '4', name: 'Pasta Carbonara', price: 11.99, quantity: 1 },
              { id: '4', menu_id: '6', name: 'Chocolate Cake', price: 5.99, quantity: 1 },
            ],
          },
        ];
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'delivering':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'delivering':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
          <p className="text-muted-foreground">
            When you place your first order, it will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr className="border-border" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;