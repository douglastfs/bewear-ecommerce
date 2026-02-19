"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useUserAddresses } from "@/hooks/queries/use-user-addresses";

import NewAddressForm from "./new-address-form";

interface AddressesProps {
  shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
  selectedShippingAddressId?: string | null;
}

const Addresses = ({
  shippingAddresses,
  selectedShippingAddressId,
}: AddressesProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    selectedShippingAddressId ?? null
  );
  const { data: addresses, isFetched } = useUserAddresses({
    initialData: shippingAddresses,
  });

  // Usa os dados do servidor no primeiro render (hydration-safe),
  // depois usa os dados do React Query (atualizados dinamicamente)
  const addressList = isFetched ? addresses : shippingAddresses;
  const { mutateAsync: updateCartAddress, isPending } =
    useUpdateCartShippingAddress();

  // Vincula o endereço ao carrinho
  const handleContinueWithPayment = async (addressId: string) => {
    await updateCartAddress({ shippingAddressId: addressId });
  };

  // Callback chamado quando um novo endereço é criado pelo formulário
  const handleAddressCreated = async (addressId: string) => {
    // Seleciona o novo endereço e fecha o formulário
    setSelectedAddress(addressId);
    await handleContinueWithPayment(addressId);
  };

  const isExistingAddressSelected =
    selectedAddress !== null && selectedAddress !== "add_new";

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
            {addressList?.map(address => (
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

          {isExistingAddressSelected && (
            <Button
              className="w-full rounded-full py-6"
              disabled={isPending}
              onClick={() => handleContinueWithPayment(selectedAddress)}
            >
              {isPending ? "Processando..." : "Continuar com o pagamento"}
            </Button>
          )}

          {selectedAddress === "add_new" && (
            <NewAddressForm onAddressCreated={handleAddressCreated} />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Addresses;
