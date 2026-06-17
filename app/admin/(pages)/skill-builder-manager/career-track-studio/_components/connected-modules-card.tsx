// import Link from "next/link";
// import { Plus } from "lucide-react";

// import Card from "@/components/UI/cards/card";
// import Button from "@/components/UI/buttons/button";

// import ModuleItem from "./module-item";

// export default function ConnectedModulesCard() {
//   return (
//     <Card padding="lg" rounded="3xl" shadow="sm" className="h-fit">
//       <div className="mb-6">
//         <h2 className="text-lg font-bold text-[#202420]">Connected Modules</h2>
//       </div>

//       <div className="space-y-3">
//         {connectedModules.map((module) => (
//           <ModuleItem key={module.id} module={module} />
//         ))}
//       </div>

//       <Link href="/admin/skill-builder-manager/module-sentence-bank-builder">
//         <Button
//           variant="outline"
//           size="lg"
//           rounded="xl"
//           className="mt-6 h-14 w-full border-dashed border-[#B7C5B8] bg-[#FCFDFC] text-[#5F675F]"
//         >
//           <Plus className="mr-2 size-5" />
//           ATTACH NEW MODULE
//         </Button>
//       </Link>
//     </Card>
//   );
// }
