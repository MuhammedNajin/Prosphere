import React, { useState } from "react";
import { UserApi } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapboxResult } from "@/types/company";
import LocationSearch from "../common/LocationField/LocationField";
import { useMutation } from "react-query";
import { useToast } from "@/hooks/use-toast";
import SuccessMessage from "../common/Message/SuccessMessage";
import ErrorMessage from "../common/Message/ErrorMessage";
import LoaderSubmitButton from "../common/spinner/LoaderSubmitButton";
import { queryClient } from "@/main";
import { AxiosError, HttpStatusCode } from "axios";
import { ApiErrorResponse } from "@/api";
import { useCurrentUser } from "@/hooks/useSelectors";
import { ILocation } from "@/types/user";

interface LocationFormProps {
  onClose: (shouldRefetch?: boolean) => void;
  currentLocation?: ILocation;
}

const LocationForm: React.FC<LocationFormProps> = ({ 
  onClose, 
  currentLocation = {} 
}) => {
  const [location, setLocation] = useState<ILocation>({
    city: currentLocation.city || "",
    state: currentLocation.state || "",
    country: currentLocation.country || "",
    postalCode: currentLocation.postalCode || "",
    placename: currentLocation.placename || "",
    coordinates: currentLocation.coordinates || undefined,
  });
  
  const user = useCurrentUser();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: UserApi.updateProfile,
    onSuccess: () => {
      toast({
        description: (
          <SuccessMessage message="Location updated successfully" />
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onClose(true);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Full error object:", error);

      if (error.response?.status === HttpStatusCode.BadRequest) {
        const errorMessage =
          error.response.data?.errors?.[0]?.message || "Invalid request";
        toast({
          description: <ErrorMessage message={errorMessage} />,
          className: "bg-red-500 text-white",
        });
        return;
      }

      toast({
        description: (
          <ErrorMessage message="Failed to update location. Please try again." />
        ),
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleLocationSelect = (mapboxResult: MapboxResult) => {
    const placeNameParts = mapboxResult.place_name.split(", ");
    setLocation({
      city: placeNameParts[0] || "",
      state: placeNameParts[1] || "",
      country: placeNameParts[placeNameParts.length - 1] || "",
      placename: mapboxResult.place_name,
      coordinates: {
        lat: mapboxResult.coordinates[1],
        lng: mapboxResult.coordinates[0],
      },
    });
  };

  const handleLocationChange = (field: string, value: string) => {
    setLocation(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        description: <ErrorMessage message="User not found. Please try again." />,
        className: "bg-red-500 text-white",
      });
      return;
    }

    mutation.mutate({ 
      data: { location }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="placename" className="text-sm font-medium text-gray-700">
            Display Name
          </Label>
          <LocationSearch
            onSelectLocation={handleLocationSelect}
            initialValue={location.placename}
            placeholder="Search for a location..."
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            This is how your location will appear on your profile
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium text-gray-700">
            City
          </Label>
          <Input
            id="city"
            type="text"
            value={location.city}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            placeholder="e.g., New York"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-medium text-gray-700">
            State/Province
          </Label>
          <Input
            id="state"
            type="text"
            value={location.state}
            onChange={(e) => handleLocationChange('state', e.target.value)}
            placeholder="e.g., New York"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium text-gray-700">
            Country
          </Label>
          <Input
            id="country"
            type="text"
            value={location.country}
            onChange={(e) => handleLocationChange('country', e.target.value)}
            placeholder="e.g., United States"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
            Postal Code
          </Label>
          <Input
            id="postalCode"
            type="text"
            value={location.postalCode || ""}
            onChange={(e) => handleLocationChange('postalCode', e.target.value)}
            placeholder="e.g., 10001"
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onClose(false)}
          disabled={mutation.isLoading}
        >
          Cancel
        </Button>
        <LoaderSubmitButton state={mutation.isLoading}>
          Save Location
        </LoaderSubmitButton>
      </div>
    </form>
  );
};

export default LocationForm;