"use client";

import { ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const Cart = () => {
  return (
    <div className="">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <ShoppingBagIcon />
          </Button>
        </SheetTrigger>
        <SheetContent></SheetContent>
      </Sheet>
    </div>
  );
};

export default Cart;
