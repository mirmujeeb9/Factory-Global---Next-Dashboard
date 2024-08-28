import { Supplier, getSuppliers } from "@/actions/brand-data-getters";
import SupplierCatalog from "@/components/BrandPage/SupplierCatalogSection/SupplierCatalog";

const page = async ({ params }: { params: { slug: string } }) => {
  const sortedFactories: Supplier[] = (await getSuppliers()).sort((a, b) => {
    if (a.status === "purchased" && b.status !== "purchased") {
      return -1;
    }
    if (a.status !== "purchased" && b.status === "purchased") {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      <SupplierCatalog sortedFactories={sortedFactories} />
    </div>
  );
};

export default page;
