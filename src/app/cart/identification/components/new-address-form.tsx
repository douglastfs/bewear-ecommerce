"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";

import {
  CreateShippingAddressSchema,
  createShippingAddressSchema,
} from "@/actions/create-shipping-address/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useViaCep } from "@/hooks/queries/use-viacep";

interface NewAddressFormProps {
  onAddressCreated?: (addressId: string) => void;
}

const NewAddressForm = ({ onAddressCreated }: NewAddressFormProps) => {
  const { mutateAsync, isPending } = useCreateShippingAddress();

  const form = useForm<CreateShippingAddressSchema>({
    resolver: zodResolver(createShippingAddressSchema),
    defaultValues: {
      email: "",
      fullName: "",
      cpf: "",
      phone: "",
      cep: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const watchedCep = form.watch("cep");
  const { setValue } = form;
  const { data: addressData } = useViaCep(watchedCep || "");

  useEffect(() => {
    if (addressData) {
      setValue("address", addressData.logradouro || "", {
        shouldValidate: true,
      });
      setValue("neighborhood", addressData.bairro || "", {
        shouldValidate: true,
      });
      setValue("city", addressData.localidade || "", {
        shouldValidate: true,
      });
      setValue("state", addressData.uf || "", { shouldValidate: true });

      // Focando no campo número silenciosamente após achar o CEP
      setTimeout(() => {
        document.getElementsByName("number")[0]?.focus();
      }, 100);
    }
  }, [addressData, setValue]);

  async function onSubmit(values: CreateShippingAddressSchema) {
    const shippingAddress = await mutateAsync(values);
    form.reset();
    // Limpa erros que campos com máscara (PatternFormat) podem re-disparar ao resetar
    setTimeout(() => form.clearErrors(), 0);
    // Notifica o componente pai do ID do endereço criado
    onAddressCreated?.(shippingAddress.id);
  }

  return (
    <>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <h3 className="text-sm font-semibold">Adicionar novo</h3>

          {/* Email - Linha inteira */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" className="h-12 px-4" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nome completo - Linha inteira */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nome completo"
                    className="h-12 px-4"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CPF + Celular - 2 colunas */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PatternFormat
                      format="###.###.###-##"
                      mask="_"
                      customInput={Input}
                      placeholder="CPF"
                      className="h-12 px-4"
                      value={field.value}
                      onValueChange={values => {
                        field.onChange(values.formattedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PatternFormat
                      format="(##) #####-####"
                      mask="_"
                      customInput={Input}
                      placeholder="Celular"
                      className="h-12 px-4"
                      value={field.value}
                      onValueChange={values => {
                        field.onChange(values.formattedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* CEP - Linha inteira */}
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PatternFormat
                    format="#####-###"
                    mask="_"
                    customInput={Input}
                    placeholder="CEP"
                    className="h-12 px-4"
                    value={field.value}
                    onValueChange={values => {
                      field.onChange(values.formattedValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Endereço - Linha inteira */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Endereço"
                    className="h-12 px-4"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Número + Complemento - 2 colunas */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Número"
                      className="h-12 px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complement"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Complemento"
                      className="h-12 px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bairro + Cidade + Estado - 3 colunas */}
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Bairro"
                      className="h-12 px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Cidade"
                      className="h-12 px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Estado"
                      className="h-12 px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full py-6"
            disabled={isPending}
          >
            {isPending ? "Cadastrando..." : "Continuar com o pagamento"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default NewAddressForm;
