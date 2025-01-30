import { CiLocationOn } from 'react-icons/ci';
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <main className="basis-full rounded p-8">
      <div className="max-w-[50rem]">
        <div className="border rounded">
          <div className="relative h-56">
            <Skeleton className="h-full w-full bg-gray-300" />
            <div className="absolute top-4 right-4">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-300" />
            </div>
  
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">
              <Skeleton className="h-40 w-40 rounded-full border-4 border-white bg-gray-300" />
            </div>
          </div>


          <div className="flex w-full mt-24 px-4 py-2 border">
            <div className="mt-2 p-2 flex-1">
              <div className="space-y-3">
                <Skeleton className="h-8 w-48 bg-gray-300" />
                <Skeleton className="h-6 w-36 bg-gray-300" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CiLocationOn className="text-gray-400" />
                  <Skeleton className="h-4 w-32 bg-gray-300" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24 bg-gray-300" />
                  <Skeleton className="h-4 w-24 bg-gray-300" />
                </div>
              </div>
              <div className="flex mt-4 gap-x-3">
                <Skeleton className="h-10 w-28 rounded-full bg-gray-300" />
              </div>
            </div>
            <div className="p-2">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
        <div className="mt-2 p-4 border rounded">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <Skeleton className="h-6 w-24 bg-gray-300" />
              <Skeleton className="h-4 w-48 bg-gray-300" />
              <div className="mt-4">
                <Skeleton className="h-20 w-full bg-gray-300" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-full bg-gray-300" />
          </div>
        </div>
        <div className="mt-2 p-4 border rounded">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <Skeleton className="h-6 w-32 bg-gray-300" />
                <Skeleton className="h-4 w-56 bg-gray-300" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full bg-gray-300" />
            </div>

            {[1, 2].map((item) => (
              <div key={item} className="mt-4 space-y-2">
                <Skeleton className="h-4 w-40 bg-gray-300" />
                <Skeleton className="h-3 w-32 bg-gray-300" />
                <Skeleton className="h-3 w-24 bg-gray-300" />
                <Skeleton className="h-16 w-full bg-gray-300" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 p-4 border rounded">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <Skeleton className="h-6 w-28 bg-gray-300" />
                <Skeleton className="h-4 w-64 bg-gray-300" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full bg-gray-300" />
            </div>
 
            {[1, 2].map((item) => (
              <div key={item} className="mt-4 space-y-2">
                <Skeleton className="h-4 w-36 bg-gray-300" />
                <Skeleton className="h-3 w-28 bg-gray-300" />
                <Skeleton className="h-3 w-24 bg-gray-300" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 p-4 border rounded">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <Skeleton className="h-6 w-20 bg-gray-300" />
                <Skeleton className="h-4 w-60 bg-gray-300" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full bg-gray-300" />
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-8 w-20 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSkeleton;