import { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

export const metadata = {
  title: "Entrar | BEWEAR",
  description:
    "Faça login ou crie sua conta para acompanhar pedidos e aproveitar ofertas exclusivas.",
};

const Authentication = async () => {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-5 sm:mt-10 sm:mb-20">
      <Tabs defaultValue="sign-in" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Entrar</TabsTrigger>
          <TabsTrigger value="sign-up">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in" className="mt-6">
          <Suspense fallback={<div>Carregando...</div>}>
            <SignInForm />
          </Suspense>
        </TabsContent>
        <TabsContent value="sign-up" className="mt-6">
          <Suspense fallback={<div>Carregando...</div>}>
            <SignUpForm />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Authentication;
