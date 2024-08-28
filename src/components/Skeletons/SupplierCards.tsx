import { Card } from "../ui/card";

const SupplierCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card
          key={index}
          className="relative animate-pulse bg-gray-100/[0.2] border-black/[0.1] outline-none group w-full h-[200px] flex items-center justify-center overflow-hidden rounded-lg"
        ></Card>
      ))}
    </div>
  );
};

export default SupplierCards;
