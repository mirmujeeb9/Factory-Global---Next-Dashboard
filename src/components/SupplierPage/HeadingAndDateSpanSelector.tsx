"use client";

import { getOrganizationName } from "@/actions/supplier-data-getters";
import { useKnoStore } from "@/store/zustand";
import { useOrganization } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateBracketSelector } from "../BrandPage/DateBracketSelector";
import { Button } from "../ui/button";

const HeadingAndDateSpanSelector = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supplierSlug = pathname.substring(pathname.lastIndexOf("/") + 1);

  const {
    supplierStartDate,
    supplierEndDate,
    setSupplierStartDate,
    setSupplierEndDate,
  } = useKnoStore((state) => ({
    supplierStartDate: state.supplierStartDate,
    supplierEndDate: state.supplierEndDate,
    setSupplierStartDate: state.setSupplierStartDate,
    setSupplierEndDate: state.setSupplierEndDate,
  }));
  const [name, setName] = useState("");
  const { organization } = useOrganization();

  useEffect(() => {
    const getData = async () => {
      const name = await getOrganizationName(supplierSlug);
      setName(name);
    };

    getData();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="w-full h-20 flex items-center justify-between">
      <div>
        {organization?.publicMetadata.type !== "supplier" && (
          <Button
            id="go-back"
            size={"icon"}
            variant={"outline"}
            className="mr-4"
            onClick={handleGoBack}
          >
            <ChevronLeft size={16} />
          </Button>
        )}

        <span className="font-semibold text-lg">{name}</span>
      </div>

      <div>
        <DateBracketSelector
          startDate={supplierStartDate}
          endDate={supplierEndDate}
          setStartDate={setSupplierStartDate}
          setEndDate={setSupplierEndDate}
        />
      </div>
    </div>
  );
};

export default HeadingAndDateSpanSelector;
