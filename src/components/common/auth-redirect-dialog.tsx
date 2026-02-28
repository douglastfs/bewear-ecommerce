"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthRedirectDialogProps {
  isOpen: boolean;
  callbackURL: string;
}

const AuthRedirectDialog = ({
  isOpen,
  callbackURL,
}: AuthRedirectDialogProps) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isOpen) return;

    if (countdown === 0) {
      router.push(
        `/authentication?callbackURL=${encodeURIComponent(callbackURL)}`
      );
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown, callbackURL, router]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="flex flex-col items-center justify-center gap-4 p-8 text-center sm:max-w-md [&>button]:hidden"
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col items-center gap-2">
          <DialogTitle className="text-xl">
            Faça o login para continuar
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col items-center justify-center gap-4">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">
            Redirecionando para login em {countdown}...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRedirectDialog;
