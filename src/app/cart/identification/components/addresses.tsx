"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useShippingAddresses } from "@/hooks/queries/use-shipping-addresses";

import NewAddressForm from "./new-address-form";

const Addresses = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const { data: addresses } = useShippingAddresses();

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
            {addresses?.map(address => (
              <Card key={address.id}>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={address.id} id={address.id} />
                    <Label
                      htmlFor={address.id}
                      className="text-sm leading-normal font-medium"
                    >
                      {address.recipientName}, {address.street},{" "}
                      {address.number}
                      {address.complement
                        ? `, ${address.complement}`
                        : ""}, {address.neighborhood}, {address.city} -{" "}
                      {address.state}, {address.zipCode}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="add_new" id="add_new" />
                  <Label htmlFor="add_new">Adicionar novo</Label>
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
