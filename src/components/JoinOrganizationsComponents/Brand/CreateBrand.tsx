"use client";
import { useState } from "react";
import { Button } from "../../ui/button";

import { createBrand } from "@/actions/actions";
import { BrandPublicMetadata } from "@/app/join/brand/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DetailedBrand } from "@/lib/types";
import { SearchBrand } from "../SearchBrand";

const CreateBrand = ({
  getAllBrands,
  brands_count,
}: {
  getAllBrands: () => void;
  brands_count: number;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrandDetails, setSelectedBrandDetails] =
    useState<DetailedBrand | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");
  const [brandDescription, setBrandDescription] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddBrand = async (newBrand: BrandPublicMetadata) => {
    // Brand creation and saving logic goes here.
    createBrand({
      name: newBrand.name as string,
      slug: newBrand.name?.toLowerCase().replace(/\s+/g, "-"),
      publicMetadata: {
        website: newBrand.website,
        description: newBrand.description,
        verified: false,
        type: "brand",
        brandFetch: selectedBrandDetails,
      },
    });

    setIsModalOpen(false);
    getAllBrands();
  };

  const handleCreateBrand = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button onClick={handleCreateBrand}>Create Brand</Button>
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a New Brand</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new brand to the list.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const newBrand: BrandPublicMetadata = {
                name: formData.get("name") as string,
                website: formData.get("website") as string,
                description: formData.get("description") as string,
              };
              handleAddBrand(newBrand);
            }}
          >
            <div className="grid gap-4">
              <SearchBrand
                selectedBrandDetails={selectedBrandDetails}
                setSelectedBrandDetails={(details) => {
                  if (details) {
                    setSelectedBrandDetails(details);
                    setBrandName(details.name);
                    setBrandWebsite(`https://${details.domain}`);
                    setBrandDescription(details.description);
                  } else {
                    setBrandName("");
                    setBrandWebsite("");
                    setBrandDescription("");
                  }
                }}
              />
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Brand name"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="website"
                  placeholder="Brand website (https://nike.com)"
                  className="duration-200"
                  value={brandWebsite}
                  onChange={(e) => setBrandWebsite(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="description"
                  placeholder="Brand description"
                  className="duration-200"
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Add Brand</Button>
              <div>
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateBrand;
