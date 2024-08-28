import { BrandType } from "@/app/join/brand/page";
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
  selectedBrand,
}: {
  isOpen: boolean;
  setIsOpen: (arg1: boolean) => void;
  selectedBrand: BrandType | undefined;
}) => {
  const { userId } = useAuth();
  const { organization } = useOrganization();

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request to join</DialogTitle>

          {selectedBrand && (
            <div className="py-4 text-sm">
              <ul>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">Brand</span>
                  <span className="text-gray-500">{selectedBrand.name}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">Website</span>
                  <Link href={selectedBrand.publicMetadata.website || "/"}>
                    <span className="text-gray-500 underline">
                      {selectedBrand.publicMetadata.website}
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
                if (selectedBrand?.publicMetadata.adminEmail) {
                  navigator.clipboard.writeText(
                    selectedBrand.publicMetadata.adminEmail
                  );
                  toast.success("Email address copied to clipboard!");
                }
              }}
            >
              {selectedBrand?.publicMetadata.adminEmail}
            </span>
            of the brand to invite you to the organization.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {selectedBrand && (
            <Button onClick={() => setIsOpen(false)}>Ok</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClickToRequestJoiningDialog;
