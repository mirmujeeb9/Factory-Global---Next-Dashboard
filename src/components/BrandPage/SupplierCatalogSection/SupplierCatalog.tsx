"use client";

import { Supplier } from "@/actions/brand-data-getters";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Rows from "./Rows";

const SupplierCatalog = ({
  sortedFactories,
}: {
  sortedFactories: Supplier[];
}) => {
  const router = useRouter();
  const { userId, orgId } = useAuth();

  const handleClick = (factory: Supplier) => {
    if (factory.status === "purchased") {
      router.push(`/dashboard/supplier/${factory.slug}`);
    }

    if (factory.status === "not-purchased") {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/purchase_supplier_checkout_session";

      const supplierIdField = document.createElement("input");
      supplierIdField.type = "hidden";
      supplierIdField.name = "supplierId";
      supplierIdField.value = factory.id;
      form.appendChild(supplierIdField);

      const userIdField = document.createElement("input");
      userIdField.type = "hidden";
      userIdField.name = "userId";
      userIdField.value = userId as string; // Assuming userId is available in the scope
      form.appendChild(userIdField);

      const currentOrganizationField = document.createElement("input");
      currentOrganizationField.type = "hidden";
      currentOrganizationField.name = "currentOrganization";
      currentOrganizationField.value = orgId as string; // Replace with actual current organization value
      form.appendChild(currentOrganizationField);

      document.body.appendChild(form);
      form.submit();
    }
  };

  if (sortedFactories.length === 0) {
    toast.info("Please create a supplier first.");
  }

  return (
    <TabsContent className="w-full" value="supplier_catalog">
      <div className="border-black/[0.1] border-[1px] rounded-md mt-10 max-h-[500px] overflow-y-auto">
        <ScrollArea className="h-[400px] rounded-md border">
          <Table className="w-full 0">
            <TableHeader className="sticky top-0 z-10 shadow-sm bg-white">
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Factory Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFactories.length > 0 ? (
                sortedFactories.map((factory, index) => (
                  <TableRow
                    key={index}
                    className={`cursor-pointer group relative ${
                      factory.status === "not-purchased"
                        ? "opacity-50 hover:opacity-100 transition-opacity"
                        : ""
                    }`}
                    onClick={() => handleClick(factory)}
                  >
                    <Rows factory={factory} index={index} />
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400">
                    No factories are available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </TabsContent>
  );
};

export default SupplierCatalog;
