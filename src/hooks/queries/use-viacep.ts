import { useQuery } from "@tanstack/react-query";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const useViaCep = (cep: string) => {
  const cleanCep = cep.replace(/\D/g, "");

  return useQuery<ViaCepResponse>({
    queryKey: ["viacep", cleanCep],
    queryFn: async () => {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data = await response.json();

      if (data && data.erro) {
        throw new Error("CEP não encontrado");
      }

      return data;
    },
    enabled: cleanCep.length === 8,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
