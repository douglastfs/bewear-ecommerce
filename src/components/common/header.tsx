"use client";

import {
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useCategories } from "@/hooks/queries/use-categories";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
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
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsMenuOpen(false));
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white transition-shadow duration-200 ease-in-out ${isScrolled ? "shadow-md" : "shadow-none"}`}
    >
      {/* ===== MOBILE HEADER ===== */}
      <div className="mx-auto flex max-w-[1440px] items-center justify-between p-5 lg:hidden">
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
                          onClick={() =>
                            authClient.signOut({
                              fetchOptions: {
                                onSuccess: () => router.push("/"),
                              },
                            })
                          }
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
      </div>

      {/* ===== DESKTOP HEADER ===== */}
      <div className="mx-auto hidden max-w-[1440px] flex-col lg:flex">
        {/* Linha superior: Usuário | Logo | Ações */}
        <div className="flex items-center justify-center px-11 py-4">
          {/* Esquerda — Saudação do usuário com dropdown */}
          <div className="flex flex-1 items-center gap-3">
            {session?.user ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex cursor-pointer items-center gap-3 rounded-full">
                      <Avatar className="size-8">
                        <AvatarImage
                          src={session.user.image as string | undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {session.user.name?.split(" ")?.[0]?.[0]}
                          {session.user.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-base font-semibold">
                        Olá, {session.user.name?.split(" ")[0]}!
                      </span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="flex w-48 flex-col gap-1">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/my-orders"
                              className="w-full cursor-pointer flex-row items-center gap-3"
                            >
                              <TruckIcon size={16} />
                              Meus Pedidos
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/cart"
                              className="w-full cursor-pointer flex-row items-center gap-3"
                            >
                              <ShoppingBagIcon size={16} />
                              Sacola
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <Separator className="my-1" />
                        <li>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() =>
                                authClient.signOut({
                                  fetchOptions: {
                                    onSuccess: () => router.push("/"),
                                  },
                                })
                              }
                              className="text-muted-foreground w-full cursor-pointer flex-row items-center gap-3"
                            >
                              <LogOutIcon size={16} />
                              Sair da conta
                            </button>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Link
                href="/authentication"
                className="flex items-center gap-3 hover:opacity-80"
              >
                <UserIcon size={24} className="text-muted-foreground" />
                <span className="text-base font-semibold">
                  Olá. Faça seu login!
                </span>
              </Link>
            )}
          </div>

          {/* Centro — Logo */}
          <Link href="/">
            <Image src="/logo.svg" alt="BEWEAR" width={140} height={36.6} />
          </Link>

          {/* Direita — Busca + Sacola */}
          <div className="flex flex-1 items-center justify-end gap-4">
            <Button variant="ghost" size="icon" aria-label="Buscar">
              <SearchIcon size={20} />
            </Button>
            <Separator orientation="vertical" className="h-3.5" />
            <Cart />
          </div>
        </div>

        {/* Linha inferior — Navegação por categorias */}
        <nav className="flex items-center justify-center gap-16 px-11 py-4">
          {categories?.map(category => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="text-muted-foreground hover:text-foreground text-base font-medium transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
