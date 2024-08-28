"use client";

import { Supplier } from "@/actions/brand-data-getters";
import { TableCell } from "@/components/ui/table";
import { ArrowRight } from "lucide-react";

const Rows = ({ factory, index }: { factory: Supplier; index: number }) => {
  return (
    <>
      <TableCell>
        <div className="flex items-center gap-2">
          {factory.status === "purchased" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 text-green-600"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {factory.status === "not-purchased" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </TableCell>
      <TableCell className="font-medium">{factory.name}</TableCell>
      <TableCell>{factory.country}</TableCell>
      <TableCell>{factory.employees}</TableCell>
      <TableCell className="relative">
        <div className="absolute top-3 font-semibold right-5 w-[150px] flex items-center gap-1 text-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          {factory.status === "purchased" ? "View factory" : "Purchase"}
          <ArrowRight size={14} className="ml-2" />
        </div>
      </TableCell>
    </>
  );
};

export default Rows;
