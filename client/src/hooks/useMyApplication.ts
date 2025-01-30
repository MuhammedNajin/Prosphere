import { useQuery } from "react-query";
import { useGetUser } from "./useGetUser";
import { ApplicationApi } from "@/api/application.api";
import { useEffect, useState } from "react";

export function useMyApplications() {
    const user = useGetUser();
   const [response, setResponse] = useState<any>();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['myApplication', user?._id],
        queryFn: () => ApplicationApi.getMyApplicatons('All', ''),
        enabled: !!user?._id,
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