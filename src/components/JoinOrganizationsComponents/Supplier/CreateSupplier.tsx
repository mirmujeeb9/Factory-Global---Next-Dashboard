"use client";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";

import { createSupplier } from "@/actions/actions";
import { SupplierPublicMetadata } from "@/app/join/supplier/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DetailedBrand } from "@/lib/types";

const CreateSupplier = ({
  getAllSuppliers,
  suppliers_count,
}: {
  getAllSuppliers: () => void;
  suppliers_count: number;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplierDetails, setSelectedSupplierDetails] =
    useState<DetailedBrand | null>(null);
  const [supplierName, setSupplierName] = useState("");
  const [supplierWebsite, setSupplierWebsite] = useState("");
  const [supplierDescription, setSupplierDescription] = useState("");
  const [countryName, setCountryName] = useState("");
  const [employees, setEmployees] = useState<number>(0);
  const [countries, setCountries] = useState<{ name: string; flag: string }[]>(
    []
  );

  useEffect(() => {
    // Fetch the list of countries and their flags from a CDN
    const fetchCountries = async () => {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      const countryList = data.map((country: any) => ({
        name: country.name.common,
        flag: country.flags.svg,
      }));
      setCountries(countryList);
    };

    fetchCountries();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddSupplier = async (newSupplier: SupplierPublicMetadata) => {
    // Supplier creation and saving logic goes here.
    createSupplier({
      name: newSupplier.name as string,
      slug: newSupplier.name?.toLowerCase().replace(/\s+/g, "-"),

      publicMetadata: {
        website: newSupplier.website,
        description: newSupplier.description,
        verified: false,
        type: "supplier",
        country: countryName,
        employees: employees,
      },
    });

    setIsModalOpen(false);
    getAllSuppliers();
  };

  const handleCreateSupplier = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button onClick={handleCreateSupplier}>Create Supplier</Button>
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a New Supplier</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new supplier to the list.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const newSupplier: SupplierPublicMetadata = {
                name: formData.get("name") as string,
                website: formData.get("website") as string,
                description: formData.get("description") as string,
              };
              handleAddSupplier(newSupplier);
            }}
          >
            <div className="grid gap-4">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Supplier name"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="website"
                  placeholder="Supplier website (https://nike.com)"
                  className="duration-200"
                  value={supplierWebsite}
                  onChange={(e) => setSupplierWebsite(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="description"
                  placeholder="Supplier description"
                  className="duration-200"
                  value={supplierDescription}
                  onChange={(e) => setSupplierDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <Select
                  name="country"
                  value={countryName}
                  onValueChange={(value) => setCountryName(value)}
                  required
                >
                  <SelectTrigger className="w-full p-2 border rounded">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  type="text"
                  name="employees"
                  placeholder="Number of employees"
                  className="duration-200"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Add Supplier</Button>
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

export default CreateSupplier;
