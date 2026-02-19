"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import NewAddressForm from "./new-address-form";

const Addresses = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <RadioGroup
            value={selectedAddress}
            onValueChange={setSelectedAddress}
          >
            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="add_new" id="add_new" />
                  <Label htmlFor="add_new">Adicionar novo endereço</Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>

          {selectedAddress === "add_new" && <NewAddressForm />}
        </CardContent>
      </Card>
    </>
  );
};

export default Addresses;
