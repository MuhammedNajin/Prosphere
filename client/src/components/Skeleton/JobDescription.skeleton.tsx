import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const JobDescriptionSkeleton = () => {
  return (
    <div className="flex flex-1">
      <div className="flex-1">
        {/* Header Section */}
        <div className="mx-auto p-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Section */}
        <Card className="mx-auto p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-grow md:w-2/3 space-y-8">
              {/* Description */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Responsibilities */}
              <div className="space-y-4">
                <Skeleton className="h-7 w-40" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-4">
                <Skeleton className="h-7 w-36" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:w-1/3 space-y-8">
              {/* About Role Card */}
              <div className="space-y-6">
                <Skeleton className="h-7 w-40" />
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-2.5 w-full rounded-full" />
                  </CardContent>
                </Card>

                {/* Job Details */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <Skeleton className="h-7 w-32" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-6 w-24 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Benefits Section */}
        <Card className="mx-auto p-8 mt-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Company Section */}
        <Card className="mx-auto p-8 mt-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="grid grid-rows-2 gap-4">
                  <Skeleton className="h-[5.5rem] w-full rounded-lg" />
                  <Skeleton className="h-[5.5rem] w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JobDescriptionSkeleton;