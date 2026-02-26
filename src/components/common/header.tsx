"use client";

import {
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useCategories } from "@/hooks/queries/use-categories";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Cart from "./cart";

const Header = () => {
  const { data: session } = authClient.useSession();
  const { data: categories } = useCategories();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsMenuOpen(false));
  }, [pathname]);

  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>
      <div className="flex items-center gap-3">
        <Cart />
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col px-5 pb-8">
            <SheetHeader className="px-0">
              <SheetTitle className="text-left text-lg">Menu</SheetTitle>
            </SheetHeader>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-4">
                  {/* Seção do usuário */}
                  {session?.user ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-base font-semibold">
                          {session?.user?.name}
                        </h3>
                        <span className="text-muted-foreground block text-xs">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold">
                        Olá. Faça seu login!
                      </p>
                      <Button asChild className="rounded-full px-6 py-3">
                        <Link href="/authentication">
                          Login
                          <LogInIcon size={16} />
                        </Link>
                      </Button>
                    </div>
                  )}

                  <Separator />

                  {/* Navegação principal */}
                  <nav className="flex flex-col">
                    <Link
                      href="/"
                      className="hover:bg-accent flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                    >
                      <HomeIcon size={16} />
                      Início
                    </Link>
                    <Link
                      href="/my-orders"
                      className="hover:bg-accent flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                    >
                      <TruckIcon size={16} />
                      Meus Pedidos
                    </Link>
                    <Link
                      href="/cart"
                      className="hover:bg-accent flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                    >
                      <ShoppingBagIcon size={16} />
                      Sacola
                    </Link>
                  </nav>

                  <Separator />

                  {/* Categorias */}
                  <nav className="flex flex-col gap-1">
                    {categories?.map(category => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="hover:bg-accent flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Botão de sair */}
                  {session?.user && (
                    <>
                      <Separator />
                      <button
                        onClick={() => authClient.signOut()}
                        className="text-muted-foreground hover:bg-accent flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors"
                      >
                        <LogOutIcon size={16} />
                        Sair da conta
                      </button>
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
