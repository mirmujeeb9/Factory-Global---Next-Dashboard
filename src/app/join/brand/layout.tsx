import NavBar from "@/components/NavBar/NavBar";

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
