import { Comment, getComments } from "@/actions/supplier-data-getters";
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

const TopComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const pathname = usePathname();
  const supplierSlug = pathname.substring(pathname.lastIndexOf("/") + 1);

  const { startDate, endDate } = useKnoStore((state) => ({
    startDate: state.supplierStartDate,
    endDate: state.supplierEndDate,
  }));

  useEffect(() => {
    const getData = async () => {
      const comments = await getComments(startDate, endDate, supplierSlug);
      setComments(comments);
    };

    getData();
  }, []);

  return (
    <Card className="h-[70%]">
      <ScrollArea className="h-full rounded-md border">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 shadow-sm bg-white">
            <TableRow>
              <TableHead className="w-[15%]">Concern</TableHead>
              <TableHead>Top Comments</TableHead>
              <TableHead className="w-[20%]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment, index) => (
              <TableRow key={index} className={`cursor-pointer group relative`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {comment.concern}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{comment.comment}</TableCell>
                <TableCell>{comment.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};

export default TopComments;
