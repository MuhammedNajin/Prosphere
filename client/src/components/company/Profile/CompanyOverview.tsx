import { useState } from "react";
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  Pencil,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyApi } from "@/api/Company.api";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation } from "react-query";
import { Spinner } from "@/components/common/spinner/Loader";
import { format } from "date-fns";
import { useCurrentCompany } from "@/hooks/useSelectedCompany";

// Updated interface to match API response structure
interface CompanyProfile {
  id: string;
  name: string;
  website?: string;
  locations?: Array<{
    placename: string;
    type: string;
    coordinates: [number, number];
    _id: string;
  }>;
  size?: string;
  type?: string;
  description?: string;
  foundedDate?: string;
  headquarters?: {
    placename: string;
  };
  owner: {
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
  verified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const CompanyOverview = () => {
  const [editOverview, setEditOverview] = useState(false);
  
  const company = useCurrentCompany();
  const { companyProfile } = useOutletContext<{ companyProfile: CompanyProfile }>();
  const navigate = useNavigate();
  
  const updateCompanyMutation = useMutation({
    mutationFn: CompanyApi.updateCompanyProfile,
    onSuccess: () => {
      setEditOverview(false);
      // You might want to refetch the company data here
    },
    onError: (error) => {
      console.error("Error updating company:", error);
    },
  });

  const isOwner = !!company; 


  const overviewSchema = z.object({
    description: z
      .string()
      .min(50, {
        message: "About Us section must be at least 50 characters long",
      })
      .max(1000, {
        message: "About Us section must not exceed 1000 characters",
      }),
  });

  type CompanyOverviewForm = z.infer<typeof overviewSchema>;

  const form = useForm<CompanyOverviewForm>({
    resolver: zodResolver(overviewSchema),
    defaultValues: {
      description: companyProfile?.description || "",
    },
  });

  async function handleSubmit(data: CompanyOverviewForm) {
    if (companyProfile && company) {
      const updatedProfile = { description: data.description };
      updateCompanyMutation.mutate({ id: company.id, data: updatedProfile });
    }
  }

  // Loading state
  if (!companyProfile) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-64">
          <Spinner size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm text-[#7C8493]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-950">Overview</h2>
        {company && companyProfile?.description && (
          <Button
            onClick={() => setEditOverview(!editOverview)}
            variant="ghost"
            className="rounded-full py-6"
          >
            <Pencil size={18} className="hover:bg-stone-100" />
          </Button>
        )}
      </div>

      <div>
        {editOverview && company ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Add an About Us with a brief overview of your product and service"
                        rows={10}
                        className="mb-4 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-x-4 pb-2">
                <Button
                  type="button"
                  onClick={() => setEditOverview(false)}
                  variant="outline"
                  className="border-blue-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-800 inline-flex items-center justify-center gap-x-2"
                  disabled={updateCompanyMutation.isLoading}
                >
                  {updateCompanyMutation.isLoading ? (
                    <>
                      <Spinner size={20} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            {companyProfile?.description ? (
              <div className="whitespace-pre-line my-2">
                {companyProfile.description}
              </div>
            ) : company ? (
              <div className="p-5 flex justify-between bg-[#f8f9fa] border my-4 rounded-lg items-center">
                <div>
                  <h1 className="text-lg font-clash font-bold">Description</h1>
                  <p className="text-sm">
                    Add a description about your company
                  </p>
                </div>
                <div>
                  <button 
                    onClick={() => setEditOverview(!editOverview)}
                    className="hover:bg-blue-50 p-2 rounded-full">
                    <Plus size={25} />
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className="space-y-4 text-gray-600">
        <div>
          {companyProfile?.website ? (
            <div>
              <div className="font-semibold text-base mt-4 text-blue-950">Website</div>
              <a 
                href={companyProfile.website} 
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {companyProfile.website}
              </a>
            </div>
          ) : isOwner ? (
            <div className="p-5 flex justify-between bg-[#f8f9fa] border my-4 rounded-lg items-center">
              <div>
                <h1 className="text-lg font-clash font-bold">Website</h1>
                <p className="text-sm">
                  Add a URL to drive more Page visitors to your website
                </p>
              </div>
              <div>
                <button 
                  onClick={() => {
                    if (companyProfile) {
                      navigate(`/company/profile/settings/${companyProfile.id}`);
                    }
                  }}
                  className="hover:bg-blue-50 p-2 rounded-full">
                  <Plus size={25} />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-semibold text-base mt-4 text-blue-950">Industry</div>
          <div className="flex items-center gap-2">
            <Building2 size={18} />
            <span className="text-[#7C8493]">Information Technology (IT)</span>
          </div>
        </div>

        <div>
          <div className="font-semibold text-base mt-4 text-blue-950">Company size</div>
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span className="text-[#7C8493]">
              {companyProfile?.size ? `${companyProfile.size} employees` : "Size not specified"}
            </span>
          </div>
        </div>

        <div>
          <div className="font-semibold text-base mt-4 text-blue-950">Company type</div>
          <div className="flex items-center gap-2">
            <Building2 size={18} />
            <span className="text-[#7C8493]">
              {companyProfile?.type || "Type not specified"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="font-semibold text-base mt-4 text-blue-950">Locations</div>
          {companyProfile?.locations && companyProfile.locations.length > 0 ? (
            <div>
              <ul className="space-y-2">
                {companyProfile.locations.map((location) => (
                  <li key={location._id} className="flex items-center gap-2 text-[#7C8493]">
                    <MapPin size={18} />
                    {location.placename}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#7C8493]">
              <MapPin size={18} />
              <span>No locations specified</span>
            </div>
          )}
        </div>

        <div>
          <div className="font-semibold text-base mt-4 text-blue-950">Founded</div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span className="text-[#7C8493]">
              {companyProfile?.foundedDate 
                ? format(new Date(companyProfile.foundedDate), 'PPP')
                : "Founded date not specified"}
            </span>
          </div>
        </div>

        <div>
          <div className="font-semibold text-base mt-4 text-blue-950">Status</div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${companyProfile.verified ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-[#7C8493]">
              {companyProfile.status}
            </span>
          </div>
        </div>

        <div>
          <div className="font-semibold text-base mt-4 text-blue-950">Owner</div>
          <div className="flex items-center gap-2 text-[#7C8493]">
            <Users size={18} />
            <span>{companyProfile.owner.username}</span>
            {companyProfile.owner.isVerified && (
              <span className="text-green-500 text-xs">✓ Verified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;