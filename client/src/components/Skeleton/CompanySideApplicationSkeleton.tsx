import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ApplicationSkeleton = () => {
  return (
    <div className="flex">
      <div className="flex-1">
        <div className="container mx-auto p-6">
    
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-64" /> 
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-48" /> 
            </div>
          </div>

          <div className="relative">
            <Table>
              <TableHeader className="border">
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Skeleton className="h-6 w-24" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-6 w-24" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-6 w-24" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-6 w-24" />
                  </TableHead>
                  <TableHead className="text-center">
                    <Skeleton className="h-6 w-24" />
                  </TableHead>
                </TableRow>
              </TableHeader>

              <div className="h-4" />

              <TableBody className="border">
                {[...Array(5)].map((_, index) => (
                  <TableRow
                    key={index}
                    className={`border-0 ${
                      index % 2 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-9">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-40" />
                    </TableCell>
                    <TableCell className="flex justify-between">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-10" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" /> 
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" /> 
              <Skeleton className="h-8 w-8" /> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSkeleton;