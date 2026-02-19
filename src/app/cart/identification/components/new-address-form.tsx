"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import z from "zod";

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

const formSchema = z.object({
  email: z.email("E-mail inválido."),
  fullName: z
    .string("Nome completo inválido.")
    .trim()
    .min(2, "Nome completo deve ter pelo menos 2 caracteres."),
  cpf: z.string("CPF inválido.").min(14, "CPF deve ter 11 dígitos."),
  phone: z.string("Celular inválido.").trim().min(1, "Celular é obrigatório."),
  cep: z.string("CEP inválido.").min(9, "CEP deve ter 8 dígitos."),
  address: z
    .string("Endereço inválido.")
    .trim()
    .min(1, "Endereço é obrigatório."),
  number: z.string("Número inválido.").trim().min(1, "Número é obrigatório."),
  complement: z.string().optional(),
  neighborhood: z
    .string("Bairro inválido.")
    .trim()
    .min(1, "Bairro é obrigatório."),
  city: z.string("Cidade inválida.").trim().min(1, "Cidade é obrigatória."),
  state: z.string("Estado inválido.").trim().min(2, "Estado é obrigatório."),
});

type FormValues = z.infer<typeof formSchema>;

const NewAddressForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  async function onSubmit(values: FormValues) {
    // TODO: implementar a lógica de salvar o endereço
    console.log(values);
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

          <Button type="submit" className="w-full rounded-full py-6">
            Continuar com o pagamento
          </Button>
        </form>
      </Form>
    </>
  );
};

export default NewAddressForm;
