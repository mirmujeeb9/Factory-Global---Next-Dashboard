import { useClerk } from "@clerk/nextjs";

const SupplierTag = () => {
  const { organization } = useClerk();

  return (
    <>
      {organization && (
        <div className=" border-b-[1px] mb-1">
          <div className="w-full p-2 rounded-md shadow-sm border-[1px] mb-1 bg-gradient-to-br from-blue-200/[0.15] to-blue-200/[0.05] border-blue-500 shadow-blue-300">
            <h1 className="text-[14px] font-semibold text-blue-500">Supplier</h1>
            <p className="text-[14px] text-gray-400">{organization?.name}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SupplierTag;
