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
import { useSelectedCompany } from "@/hooks/useSelectedCompany";
import { Company } from "@/types/company";

const CompanyOverview = () => {
  const [editOverview, setEditOverview] = useState(false);
  
  const company = useSelectedCompany();
  const { companyProfile } = useOutletContext<{ companyProfile: Company }>();
  const navigate = useNavigate();
  
  const updateCompanyMutation = useMutation({
    mutationFn: CompanyApi.updateCompanyProfile,
    onSuccess: () => {
      setEditOverview(false);
    },
  });

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

  type CompanyProfile = z.infer<typeof overviewSchema>;

  const form = useForm<CompanyProfile>({
    resolver: zodResolver(overviewSchema),
    defaultValues: {
      description: companyProfile?.description || "",
    },
  });

  async function handleSubmit(data: CompanyProfile) {
    if (companyProfile && company) {
      const updatedProfile = { ...companyProfile, description: data.description };
      updateCompanyMutation.mutate({ id: company._id, data: updatedProfile });
    }
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
              <a href={companyProfile.website} className="text-blue-600 hover:underline">
                {companyProfile.website}
              </a>
            </div>
          ) : company ? (
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
                    if (company) {
                      navigate(`/company/profile/settings/${company._id}`);
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
            <span className="text-[#7C8493]">{companyProfile?.size} employees</span>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="font-semibold text-base mt-4 text-blue-950">Headquarters</div>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span className="text-[#7C8493]">
              {companyProfile?.headquarters?.placename}
            </span>
          </div>
          <div className="font-semibold text-base text-blue-950 mt-2">Other Offices</div>
          <div>
            <ul>
              {companyProfile?.location?.map((el: any) => (
                <li key={el.placename} className="inline-flex items-center gap-2 text-[#7C8493]">
                  <MapPin size={18} />
                  {el.placename}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="font-semibold text-base mt-4 text-blue-950">Founded</div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span className="text-[#7C8493]">
              {companyProfile?.foundedDate && format(new Date(companyProfile.foundedDate), 'PPP')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;