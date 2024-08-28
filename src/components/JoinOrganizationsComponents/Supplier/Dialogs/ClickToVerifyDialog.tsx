import { SupplierType } from "@/app/join/supplier/page";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";

const ClickToVerifyDialog = ({
  isOpen,
  setIsOpen,
  selectedSupplier,
}: {
  isOpen: boolean;
  setIsOpen: (arg1: boolean) => void;
  selectedSupplier: SupplierType | undefined;
}) => {
  const { userId } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pay and verify</DialogTitle>
          {selectedSupplier ? (
            <div className="py-4 text-sm">
              <ul>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">Supplier Name</span>
                  <span className="text-gray-500">{selectedSupplier.name}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">Website</span>
                  <Link href={selectedSupplier.publicMetadata.website || "/"}>
                    <span className="text-gray-500 underline">
                      {selectedSupplier.publicMetadata.website}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div className="py-4 text-sm text-red-500">
              No brand selected. Please select a brand to proceed.
            </div>
          )}
          <div className="mt-4 text-[14px] text-gray-500">
            Once you complete payment
            <ul className="list-disc pl-5 mt-2">
              <li>We&apos;ll verify the supplier.</li>
              <li>You can invite collaborators.</li>
              <li>Visualize data for this supplier.</li>
            </ul>
          </div>
        </DialogHeader>

        <DialogFooter>
          {selectedSupplier && (
            <form action="/api/checkout_sessions" method="POST">
              <input
                type="hidden"
                name="supplierId"
                value={selectedSupplier.id}
              />
              <input
                type="hidden"
                name="supplierName"
                value={selectedSupplier.name}
              />
              <input type="hidden" name="userId" value={userId as string} />

              <Button type="submit" role="link">
                Proceed to payment
              </Button>
            </form>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClickToVerifyDialog;
