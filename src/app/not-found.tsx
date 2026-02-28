import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <Image
        src="/logo.svg"
        alt="BEWEAR Logo"
        width={140}
        height={36.6}
        className="mb-8"
      />
      <h2 className="text-3xl font-bold uppercase md:text-5xl">
        Página não encontrada
      </h2>
      <p className="text-muted-foreground mt-4 max-w-[500px] text-lg">
        Desculpe, a rota que você tentou acessar não existe ou foi removida.
      </p>

      <div className="mt-8 flex gap-4">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}
