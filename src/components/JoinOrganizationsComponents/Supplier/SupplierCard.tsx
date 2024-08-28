import { SupplierType } from "@/app/join/supplier/page";
import { Ban, Check } from "lucide-react";

const SupplierCard = ({ supplier }: { supplier: SupplierType }) => {
  return (
    <>
      <div className="w-full flex items-center justify-center h-[100px]">
        <div className="w-[200px] h-[200px] flex items-center justify-center  font-light text-black/[0.4] rounded-md">
          <>{supplier.name}</>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-full bg-gradient-to-t from-white to-transparent flex items-end pb-4 opacity-0 group-hover:opacity-100 transform translate-y-0 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
        {supplier.publicMetadata && (
          <>
            {supplier.publicMetadata.verified ? (
              <div className="bg-orange-500 py-1 px-2 pr-3 pb-[3px] flex items-center gap-2 rounded-full absolute top-2 left-2 group-hover:pr-3 group-hover:w-fit transition-all duration-300 ease-in-out">
                <Check className="text-white" size={13} />
                <p className="text-white text-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  Verified
                </p>
              </div>
            ) : (
              <div className="bg-gray-200 py-1 px-2 pr-3 pb-[3px] flex items-center gap-2 rounded-full absolute top-2 left-2 group-hover:pr-3 group-hover:w-fit transition-all duration-300 ease-in-out">
                <Ban className="text-black" size={13} />
                <p className="text-black text-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  Unverified
                </p>
              </div>
            )}
          </>
        )}

        <div className="text-black px-4">
          <h3 className="text-md font-semibold">{supplier.name}</h3>
          <p className="text-xs text-black/[0.4] font-light">
            {supplier.publicMetadata.description}
          </p>
        </div>
      </div>
    </>
  );
};

export default SupplierCard;