"use client";

import Link from "next/link";
import { TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const OverviewAndSupplierTabs = () => {
  return (
    <>
      <TabsContent defaultValue={"overview"} value="overview">
        <h1 className="font-semibold text-2xl">Overview</h1>
      </TabsContent>
      <TabsContent value="supplier_catalog">
        <h1 className="font-semibold text-2xl">Supplier catalog</h1>
      </TabsContent>
      <TabsList>
        <Link href={"/dashboard/overview"}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </Link>

        <Link href={"/dashboard/overview/suppliers"}>
          <TabsTrigger value="supplier_catalog">Suppliers catalog</TabsTrigger>
        </Link>
      </TabsList>
    </>
  );
};

export default OverviewAndSupplierTabs;
