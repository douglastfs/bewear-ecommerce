import Image from "next/image";

import { Card } from "../ui/card";

const BRANDS = [
  { id: 1, name: "Nike", logo: "/brands/nike.svg" },
  { id: 2, name: "Adidas", logo: "/brands/adidas.svg" },
  { id: 3, name: "Puma", logo: "/brands/puma.svg" },
  { id: 4, name: "New Balance", logo: "/brands/new-balance.svg" },
  { id: 5, name: "Converse", logo: "/brands/converse.svg" },
  { id: 6, name: "Polo", logo: "/brands/polo.svg", className: "h-12" },
  { id: 7, name: "Zara", logo: "/brands/zara.svg" },
  { id: 8, name: "Nike", logo: "/brands/nike.svg" },
  { id: 9, name: "Adidas", logo: "/brands/adidas.svg" },
  { id: 10, name: "Puma", logo: "/brands/puma.svg" },
  { id: 11, name: "New Balance", logo: "/brands/new-balance.svg" },
  { id: 12, name: "Converse", logo: "/brands/converse.svg" },
  { id: 13, name: "Polo", logo: "/brands/polo.svg", className: "h-12" },
  { id: 14, name: "Zara", logo: "/brands/zara.svg" },
  { id: 15, name: "Nike", logo: "/brands/nike.svg" },
  { id: 16, name: "Adidas", logo: "/brands/adidas.svg" },
  { id: 17, name: "Puma", logo: "/brands/puma.svg" },
  { id: 18, name: "New Balance", logo: "/brands/new-balance.svg" },
  { id: 19, name: "Converse", logo: "/brands/converse.svg" },
  { id: 20, name: "Polo", logo: "/brands/polo.svg", className: "h-12" },
  { id: 21, name: "Zara", logo: "/brands/zara.svg" },
];

const PartnersBrands = () => {
  return (
    <section className="space-y-6">
      <h3 className="px-5 font-semibold">Marcas parceiras</h3>
      <div className="flex overflow-hidden">
        <ul className="animate-infinite-scroll flex gap-6 px-5">
          {BRANDS.map(brand => (
            <li key={brand.id} className="flex flex-col items-center gap-4">
              <Card className="flex size-20 items-center justify-center rounded-3xl border-[1.6px] border-[#f1f1f1] bg-white p-0 shadow-none">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={32}
                  height={32}
                  className={`${brand.className} object-contain`}
                />
              </Card>
              <span className="text-sm font-medium">{brand.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PartnersBrands;
