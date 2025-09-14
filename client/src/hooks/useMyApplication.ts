import { useQuery } from "react-query";
import { ApplicationApi } from "@/api/application.api";
import { useEffect, useState } from "react";
import { useCurrentUser } from "./useSelectors";

export function useMyApplications() {
    const user = useCurrentUser();
   const [response, setResponse] = useState<any>();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['myApplication', user?.id],
        queryFn: () => ApplicationApi.getMyApplicatons('All', ''),
        enabled: !!user?.id,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
      console.log("updated",data, error)
      setResponse({data, isLoading, error})
    }, [isLoading, data])


   return response?.data?.data;
}