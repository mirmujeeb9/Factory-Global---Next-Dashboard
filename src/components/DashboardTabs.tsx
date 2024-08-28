"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Tabs } from "./ui/tabs";

const DashboardTabs = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const tabValue =
    pathname === "/dashboard/overview/suppliers"
      ? "supplier_catalog"
      : "overview";

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <Tabs value={tabValue} defaultValue="overview" className="w-full mt-14">
      {children}
    </Tabs>
  );
};

export default DashboardTabs;
