import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="my-1 px-6 py-6 text-red-500">
      <Button>
        <Link href="/authentication">SignIn</Link>
      </Button>
    </div>
  );
};

export default Home;
