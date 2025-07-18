import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  menu_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem('cart_items');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever items change
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.menu_id === newItem.menu_id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.menu_id === newItem.menu_id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        const newCartItem: CartItem = {
          ...newItem,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        return [...prevItems, newCartItem];
      }
    });
  };

  const removeFromCart = (menuId: string) => {
    setItems(prevItems => prevItems.filter(item => item.menu_id !== menuId));
  };

  const updateQuantity = (menuId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.menu_id === menuId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};