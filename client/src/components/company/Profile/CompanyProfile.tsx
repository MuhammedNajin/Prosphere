import React, { useEffect, useRef, useState } from "react";
import { Settings, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { CompanyApi } from "@/api/Company.api";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import NavigationLink from "../Application/NavigationLink";
import { Avatar } from "@/types/formData";

const CompanyProfile: React.FC = () => {
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [, setSave] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const fromJob = location.state?.fromJob || false;

  const form = useForm<Avatar>({
    defaultValues: {
      file: undefined,
    },
  });

  useEffect(() => {
    console.log("fromJob state:", fromJob);
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
    queryFn: () => fromJob ? CompanyApi.getCompanyProfile(id as string) : CompanyApi.getCompany(id as string),
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

  const { data } = useQuery({
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
    console.log("company.data", company, data?.data?.url);
    setAvatarUrl(data?.data?.url)
  }, [data]);

  return (
    <div className="h-screen">
      <div className="flex p-8">
        <div className="flex-1 max-w-4xl border rounded-lg p-1">
          <div className="py-6 px-8 bg-white border-b">
            <div className="flex flex-col md:flex-row items-start justify-between mb-6">
              <div className="flex flex-1 gap-x-5 items-center mb-4 md:mb-0">
                <div className="relative flex flex-col w-20 h-20 rounded-lg">
                  {data?.data?.url || avatarUrl ? (
                    <img
                      src={`${avatarUrl}`}
                      alt="Avatar"
                      className={`w-full h-full object-fill rounded-full ${
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

                  {fromJob && (
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

                  {fromJob && (
                    <input
                      ref={avatarRef}
                      type="file"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  )}

                  {fromJob && avatar && (
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
        
                  {fromJob && (
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
            <NavigationLink to="job">Jobs</NavigationLink>
            <NavigationLink to="team">People</NavigationLink>
          </div>

          <Outlet context={{ companyProfile: company.data }} />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;