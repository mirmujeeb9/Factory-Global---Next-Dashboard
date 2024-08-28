"use client";

import debounce from "debounce";
import { ChevronsUpDown, CirclePlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { fetchBrand } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Brand, DetailedBrand } from "@/lib/types";
import Image from "next/image";

export function SearchBrand({
  selectedBrandDetails,
  setSelectedBrandDetails,
}: {
  selectedBrandDetails: DetailedBrand | null;
  setSelectedBrandDetails: (args1: DetailedBrand | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const fetchBrands = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.brandfetch.io/v2/search/${query}`,
        {
          method: "GET",
          headers: {
            Referer: "https://example.com/searchIntegrationPage",
            accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Brand[] = await response.json();

      console.log("Data: ", data);
      setBrands(data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  const debouncedFetchBrands = useCallback(debounce(fetchBrands, 300), []);

  useEffect(() => {
    // Fetch brands initially with query 'a'
    if (searchQuery === "") {
      fetchBrands("a");
    } else {
      console.log("Hitting debounce");
      debouncedFetchBrands(searchQuery);
    }
  }, [searchQuery, debouncedFetchBrands]);

  useEffect(() => {
    const getBrand = async () => {
      const brandDetails = (await fetchBrand(
        selectedBrandId as string
      )) as DetailedBrand;

      setSelectedBrandDetails(brandDetails);
    };
    if (selectedBrandId !== "") {
      getBrand();
    } else {
      console.log("Setting brand details to none -> ", selectedBrandId);
      setSelectedBrandDetails(null);
    }
  }, [selectedBrandId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          role="combobox"
          aria-expanded={open}
          aria-label="Select brand"
          className="w-full justify-between dark:text-white"
        >
          {value ? (
            <>
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full"
                  src={
                    brands.find((brand) => brand.brandId === value)?.icon ||
                    "/fallback-brand-image.svg"
                  }
                  alt={
                    brands.find((brand) => brand.brandId === value)?.name ||
                    "Fallback Image"
                  }
                  height={18}
                  width={18}
                  style={{
                    objectPosition: "contain",
                    objectFit: "fill",
                  }}
                />
                {brands.find((brand) => brand.brandId === value)?.name}
              </div>
            </>
          ) : (
            "Select brand name"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 hidden lg:block" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brand name..."
            className="flex h-11 w-full px-4 rounded-md bg-transparent py-3 text-sm !outline-none placeholder:text-defaultText border-none font-medium disabled:cursor-not-allowed disabled:opacity-50"
            value={searchQuery}
          />
          <CommandList>
            <CommandEmpty>No brands found.</CommandEmpty>
            <CommandGroup>
              <div className="py-2 mb-2 border-y-[1px] border-y-gray-100">
                <CommandItem
                  key={-20}
                  value={""}
                  className="flex items-center justify-between hover:bg-gray-100 cursor-pointer"
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setSelectedBrandDetails(null);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CirclePlus size={16} />
                    Custom brand
                  </div>
                </CommandItem>
              </div>

              {brands.map((brand) => (
                <CommandItem
                  key={brand.brandId}
                  value={brand.brandId}
                  className="flex items-center justify-between"
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setSelectedBrandId(brand.brandId);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      className="rounded-full"
                      src={brand?.icon || "/fallback-brand-image.svg"}
                      alt={brand?.name || "Fallback Image"}
                      height={18}
                      width={18}
                      style={{
                        objectPosition: "contain",
                        objectFit: "fill",
                      }}
                    />
                    {brand.name}
                  </div>

                  <span className="text-gray-400">{brand.domain}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
