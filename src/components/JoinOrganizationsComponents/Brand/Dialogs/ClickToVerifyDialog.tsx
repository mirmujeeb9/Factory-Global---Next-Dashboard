import { BrandType } from "@/app/join/brand/page";
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
  selectedBrand,
}: {
  isOpen: boolean;
  setIsOpen: (arg1: boolean) => void;
  selectedBrand: BrandType | undefined;
}) => {
  const { userId } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pay and verify</DialogTitle>
          {selectedBrand ? (
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
          ) : (
            <div className="py-4 text-sm text-red-500">
              No brand selected. Please select a brand to proceed.
            </div>
          )}
          <div className="mt-4 text-[14px] text-gray-500">
            Once you complete payment
            <ul className="list-disc pl-5 mt-2">
              <li>We&apos;ll verify the brand.</li>
              <li>You can invite collaborators.</li>
              <li>Visualize data for suppliers.</li>
            </ul>
          </div>
        </DialogHeader>

        <DialogFooter>
          {selectedBrand && (
            <form action="/api/checkout_sessions" method="POST">
              <input type="hidden" name="brandId" value={selectedBrand.id} />
              <input
                type="hidden"
                name="brandName"
                value={selectedBrand.name}
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
