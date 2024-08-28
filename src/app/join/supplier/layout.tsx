import NavBar from "@/components/NavBar/NavBar";
import { auth } from "@clerk/nextjs/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="">
      <NavBar />
      {children}
    </div>
  );
}
