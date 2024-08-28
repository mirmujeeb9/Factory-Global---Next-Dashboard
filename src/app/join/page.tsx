import NavBar from "@/components/NavBar/NavBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <NavBar />
      <div className="w-full h-full flex items-center justify-center ">
        <div className="flex items-center gap-2">
          <Link href={"/join/brand"}>
            <Button className="w-[150px] h-[150px]" variant={"outline"}>
              <div className="">Brand</div>
            </Button>
          </Link>

          <Link href="/join/supplier">
            <Button className="w-[150px] h-[150px]" variant={"outline"}>
              <div className="">Supplier</div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
