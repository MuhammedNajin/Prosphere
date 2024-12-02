import React, { useEffect, useRef, useState } from "react";
import { Settings, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CompanyApi } from "@/api/Company.api";
import { Link, Outlet, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import NavigationLink from "../Application/NavigationLink";
import { useSelectedCompany } from "@/hooks/useSelectedCompany";

const CompanyProfile: React.FC = () => {
  const avatarRef = useRef(null);
  const [avatar, setAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [save, setSave] = useState(false);
  const { id } = useParams();
  const isSelected = useSelectedCompany();

  const fileSchema = z.object({
    file: z.instanceof(File),
  });

  type Avatar = z.infer<typeof fileSchema>;

  const form = useForm<Avatar>({
    defaultValues: {
      file: undefined,
    },
  });

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    console.log("files", files);
    if (files) {
      form.setValue("file", files[0]);
      setAvatar(true);
      const url = URL.createObjectURL(files[0]);
      setAvatarUrl(url);
    }
  }

  function handleAvatarSave() {
    form.handleSubmit(onSubmit)();
    setAvatar(false);
    setSave(true);
  }

  const company = useQuery({
    queryKey: ["company"],
    queryFn: () => isSelected ? CompanyApi.getCompany(id as string) : CompanyApi.getCompanyProfile(id as string),
  });

  const companyLogoMutation = useMutation({
    mutationFn: CompanyApi.upLoadCompanyLogo,
    onSuccess: (data) => {
      console.log("data", data);
    },
    onError: (err: unknown) => {
      console.log("err", err);
    },
  });

  const logoUrl = useQuery({
    queryKey: ["logoUrl"],
    queryFn: () => CompanyApi.getUploadedFIle(company.data.logo),
    enabled: !!company?.data?.logo,
  });

  async function onSubmit(data: Avatar) {
    console.log("data", data);
    if (id) {
      companyLogoMutation.mutate({ data, id });
    }
  }

  useEffect(() => {
    console.log("company.data", company);
    console.log(logoUrl.data?.data?.url);
  });

  return (
    <div className="h-screen">
      <div className="flex p-8">
        <div className="flex-1 max-w-4xl border rounded-lg p-1">
          <div className="py-6 px-8 bg-white border-b">
            <div className="flex flex-col md:flex-row items-start justify-between mb-6">
              <div className="flex flex-1 gap-x-5 items-center mb-4 md:mb-0">
                <div className="relative flex flex-col w-20 h-20 rounded-lg">
                  {logoUrl.data?.data?.url || avatarUrl ? (
                    <img
                      src={`${logoUrl.data?.data?.url || avatarUrl}`}
                      alt="Avatar"
                      className={`w-full h-full object-fill ${
                        avatar ? "opacity-50" : ""
                      } ${companyLogoMutation.isLoading ? "animate-pulse" : ""}`}
                    />
                  ) : (
                    <div className="flex flex-1 h-full items-center justify-center bg-orange-700 rounded-full">
                      <span className="font-bold text-white text-2xl capitalize">
                        {(company.data && company.data.name[0]) || "C"}
                      </span>
                    </div>
                  )}

                  {/* Only show edit button if isSelected is true */}
                  {isSelected && (
                    <button
                      onClick={() => {
                        if (avatarRef.current) {
                          avatarRef.current.click();
                        }
                      }}
                      className="absolute -top-2 -left-2 bg-accent-purple font-semibold hover:bg-orange-800 rounded-full p-2 shadow-md"
                    >
                      <Edit size={12} className="text-white" />
                    </button>
                  )}

                  {/* Only show file input if isSelected is true */}
                  {isSelected && (
                    <input
                      ref={avatarRef}
                      type="file"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  )}

                  {/* Only show save button if isSelected is true and avatar is being changed */}
                  {isSelected && avatar && (
                    <button
                      onClick={handleAvatarSave}
                      className="items-center mt-2 text-base justify-center px-4 py-[2px] rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:shadow-xl transition duration-200"
                    >
                      Save
                    </button>
                  )}
                </div>

                <div className="flex flex-1 gap-y-7">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 capitalize">
                      {company.data && company.data.name}
                    </h1>
                    <a
                      href={(company.data && company.data.website) || "#"}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {(company.data && company.data.website) ||
                        "https://example.com"}
                    </a>
                  </div>
                  {/* Only show settings button if isSelected is true */}
                  {isSelected && (
                    <div className="flex flex-1 space-x-2 self-start justify-end">
                      <Link
                        to={`/company/profile/settings/${id}`}
                        className="flex items-center px-4 py-2 text-sm font-medium text-orange-700 border border-orange-700 bg-white rounded-md hover:bg-orange-700 hover:text-white"
                      >
                        <Settings size={16} className="mr-2" />
                        Profile Settings
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex border-b py-3 px-8 gap-x-16 text-base font-bold">
            <NavigationLink to="home">Home</NavigationLink>
            <NavigationLink to="about">About</NavigationLink>
            <NavigationLink>Jobs</NavigationLink>
            <NavigationLink>People</NavigationLink>
          </div>

          <Outlet context={{ companyProfile: company.data }} />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
