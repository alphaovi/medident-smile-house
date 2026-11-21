import { Boxes, PackagePlus, PackageSearch, PackageX } from "lucide-react";

const productMenu = [
 {
      name: "Manage Product",
      icon: <PackageSearch className="size-5 shrink-0" />,
      children: [
        {
          name: "Add Product",
          icon: <PackagePlus className="size-4 shrink-0" />,
          link: "/manage-product/add-product",
        },
        {
          name: "Store",
          icon: <Boxes className="size-4 shrink-0" />,
          link: "/manage-product/store",
        },
        {
          name: "Free Sample or Damage",
          icon: <PackageX className="size-4 shrink-0" />,
          link: "/manage-product/lost-items",
        },
      ],
    },
];
export default productMenu;