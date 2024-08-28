"use client";

import {
  WorkerComment,
  getWorkerComments,
} from "@/actions/supplier-data-getters";
import { Card } from "@/components/ui/card";
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
import { FaBookmark } from "react-icons/fa";
import { Button } from "../ui/button";

const WorkerComments = () => {
  const [grievances, setGrievances] = useState<WorkerComment[]>([]);
  const pathname = usePathname();
  const supplierSlug = pathname.substring(pathname.lastIndexOf("/") + 1);

  const { startDate, endDate } = useKnoStore((state) => ({
    startDate: state.supplierStartDate,
    endDate: state.supplierEndDate,
  }));

  useEffect(() => {
    const getData = async () => {
      const grievances = await getWorkerComments(
        startDate,
        endDate,
        supplierSlug
      );
      setGrievances(grievances);
    };

    getData();
  }, [startDate, endDate, supplierSlug]);

  const toggleBookmark = (index: number) => {
    setGrievances((prevGrievances) =>
      prevGrievances.map((comment, i) =>
        i === index ? { ...comment, bookmark: !comment.bookmark } : comment
      )
    );
  };

  return (
    <div className="flex flex-col mt-10">
      <h1 className="font-semibold text-lg mb-5">Worker comments</h1>
      <Card className="h-[70%]">
        <ScrollArea className="h-full rounded-md border">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 shadow-sm bg-white">
              <TableRow>
                <TableHead className="w-[15%]">Concern</TableHead>
                <TableHead>Grievance</TableHead>
                <TableHead className="w-[10%]">Bookmark</TableHead>
                <TableHead className="w-[20%]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grievances.map((comment, index) => (
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
                  <TableCell className="py-0">
                    <Button
                      onClick={() => toggleBookmark(index)}
                      size={"icon"}
                      variant={"outline"}
                    >
                      <FaBookmark
                        size={12}
                        className={`cursor-pointer ${
                          comment.bookmark ? "text-yellow-500" : "text-gray-400"
                        }`}
                      />
                    </Button>
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

export default WorkerComments;
