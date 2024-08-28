import { getTotalSuppliers } from "@/actions/brand-data-getters";

const TotalSuppliers = async () => {
  const totalSuppliers = await getTotalSuppliers();

  return (
    <div className="h-full w-1/2 border-black/[0.1] border-[1px] rounded-sm flex flex-col p-3 justify-center">
      <span className="text-sm text-gray-400">Total suppliers</span>
      <h1 className="font-semibold text-4xl">{totalSuppliers}</h1>
    </div>
  );
};

export default TotalSuppliers;
