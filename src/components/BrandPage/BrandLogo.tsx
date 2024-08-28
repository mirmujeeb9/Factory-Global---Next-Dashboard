"use client";

import { BrandFetchBrandSchema } from "@/lib/types";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const BrandLogo = () => {
  const { organization, isLoaded } = useOrganization();
  const [logo, setLogo] = useState("");

  // useEffect(() => {
  //   if (isLoaded)
  //     setLogo(
  //       (
  //         organization?.publicMetadata.brandFetch as BrandFetchBrandSchema
  //       ).logos.filter((each) => each.type === "icon")[0].formats[0].src
  //     );
  // }, [isLoaded]);

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-10 w-10 rounded-sm shadow-sm overflow-hidden">
        {!logo ? (
          <div className="animate-pulse bg-gray-300 h-full w-full"></div>
        ) : (
          <Image
            src={logo}
            alt=""
            fill
            style={{
              objectFit: "cover",
            }}
          />
        )}
      </div>
      <p className="s font-semibold text-[15px]">
        {isLoaded && organization && organization.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
      </p>
    </div>
  );
};

export default BrandLogo;
