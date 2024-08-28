"use client";

import { Grievance, getGrievances } from "@/actions/supplier-data-getters";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useKnoStore } from "@/store/zustand";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Grievances = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const pathname = usePathname();
  const supplierSlug = pathname.substring(pathname.lastIndexOf("/") + 1);

  const { startDate, endDate } = useKnoStore((state) => ({
    startDate: state.supplierStartDate,
    endDate: state.supplierEndDate,
  }));

  useEffect(() => {
    const getData = async () => {
      const grievances = await getGrievances(startDate, endDate, supplierSlug);
      setGrievances(grievances);
    };

    getData();
  }, [startDate, endDate, supplierSlug]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const filteredComments = grievances.filter((comment) => {
    if (statusFilter === "All") return true;
    return comment.status === statusFilter;
  });

  return (
    <div className="flex flex-col">
      <h1 className="font-semibold text-lg mb-5">Grievances</h1>
      <Card className="h-[70%]">
        <ScrollArea className="h-full rounded-md border">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 shadow-sm bg-white">
              <TableRow>
                <TableHead className="w-[15%]">Concern</TableHead>
                <TableHead>Grievance</TableHead>
                <TableHead className="w-[10%] flex justify-between items-center">
                  Status
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border px-2 py-1 rounded ml-3">
                      {statusFilter}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className=""
                        onSelect={() => handleStatusFilterChange("All")}
                      >
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleStatusFilterChange("Resolved")}
                      >
                        Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleStatusFilterChange("Responded")}
                      >
                        Responded
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          handleStatusFilterChange("Not responded")
                        }
                      >
                        <span>Not responded</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
                <TableHead className="w-[20%]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.map((comment, index) => (
                <TableRow
                  key={index}
                  className={`cursor-pointer group relative`}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {comment.concern}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {comment.comment}
                  </TableCell>
                  <TableCell>
                    <Badge>{comment.status}</Badge>
                  </TableCell>
                  <TableCell>{comment.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Grievances;
