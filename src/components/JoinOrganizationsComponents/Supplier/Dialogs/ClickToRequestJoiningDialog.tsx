import { SupplierType } from "@/app/join/supplier/page";
import { Button } from "@/components/ui/button";
import { useAuth, useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";

const ClickToRequestJoiningDialog = ({
  isOpen,
  setIsOpen,
  selectedSupplier,
}: {
  isOpen: boolean;
  setIsOpen: (arg1: boolean) => void;
  selectedSupplier: SupplierType | undefined;
}) => {
  const { userId } = useAuth();
  const { organization } = useOrganization();

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request to join</DialogTitle>

          {selectedSupplier && (
            <div className="py-4 text-sm">
              <ul>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">Brand</span>
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
          )}

          <DialogDescription className="mt-4">
            Please ask the administrator
            <span
              className="underline font-semibold mx-1 text-black cursor-pointer"
              onClick={() => {
                if (selectedSupplier?.publicMetadata.adminEmail) {
                  navigator.clipboard.writeText(
                    selectedSupplier.publicMetadata.adminEmail
                  );
                  toast.success("Email address copied to clipboard!");
                }
              }}
            >
              {selectedSupplier?.publicMetadata.adminEmail}
            </span>
            to invite you to the organization.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {selectedSupplier && (
            <Button onClick={() => setIsOpen(false)}>Ok</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClickToRequestJoiningDialog;
