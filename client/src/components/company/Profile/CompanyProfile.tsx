import React, { useEffect, useRef, useState } from "react";
import { Settings, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { CompanyApi } from "@/api/Company.api";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import NavigationLink from "../Application/NavigationLink";
import { Avatar } from "@/types/formData";
import { useCurrentCompany } from "@/hooks/useSelectedCompany";

const CompanyProfile: React.FC = () => {
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [, setSave] = useState(false);
  const company = useCurrentCompany();
  const location = useLocation();
  
  // Properly manage the fromJob state - determines if this is private (editable) or public view
  const fromJob = location.state?.fromJob || false;
  const isPrivateView = !fromJob;
  const isPublicView = fromJob;

  const form = useForm<Avatar>({
    defaultValues: {
      file: undefined,
    },
  });

  useEffect(() => {
    console.log("Profile view mode:", { fromJob, isPrivateView, isPublicView });
  }, [fromJob, isPrivateView, isPublicView]);

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    // Only allow upload in private view
    if (!isPrivateView) return;
    
    const files = e.target.files;
    console.log("files", files);
    if (files && files[0]) {
      form.setValue("file", files[0]);
      setAvatar(true);
      const url = URL.createObjectURL(files[0]);
      setAvatarUrl(url);
    }
  }

  function handleAvatarSave() {
    // Only allow save in private view
    if (!isPrivateView) return;
    
    form.handleSubmit(onSubmit)();
    setAvatar(false);
    setSave(true);
  }

  // Company data query - same API call regardless of view mode
  const companyData = useQuery({
    queryKey: ["company", company?.id],
    queryFn: () => CompanyApi.getCompanyById(company?.id as string),
    enabled: !!company?.id,
  });

  // Company logo mutation - only used in private view
  const companyLogoMutation = useMutation({
    mutationFn: CompanyApi.uploadCompanyLogo,
    onSuccess: (data) => {
      console.log("Company logo uploaded successfully:", data);
      // Invalidate and refetch company data
      // queryClient.invalidateQueries(["company", id]);
    },
    onError: (err: unknown) => {
      console.log("Error uploading company logo:", err);
    },
  });

  // Logo URL query
  const logoQuery = useQuery({
    queryKey: ["logoUrl", companyData.data?.logo],
    queryFn: () => CompanyApi.getCompanyAssetByKey(companyData.data.logo),
    enabled: !!companyData?.data?.logo,
  });
  
  async function onSubmit(data: Avatar) {
    // Only allow submission in private view
    if (!isPrivateView || !company?.id) return;
    
    console.log("Submitting avatar data:", data);
    companyLogoMutation.mutate({ data, id: company?.id });
  }

  useEffect(() => {
    // Set avatar URL from either the fetched logo or uploaded file

    console.log("Logo query data:", logoQuery.data);
    const logoUrl = logoQuery.data?.url;
    if (logoUrl && !avatar) {
      setAvatarUrl(logoUrl);
    }
  }, [logoQuery.data, avatar]);

  // Clean up object URL when component unmounts or avatar changes
  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const renderAvatar = () => {
    const hasAvatarUrl = logoQuery.data?.data?.url || avatarUrl;
    
    return (
      <div className="relative flex flex-col w-20 h-20 rounded-lg">
        {hasAvatarUrl ? (
          <img
            src={avatarUrl}
            alt="Company Logo"
            className={`w-full h-full object-cover rounded-full ${
              avatar ? "opacity-50" : ""
            } ${companyLogoMutation.isLoading ? "animate-pulse" : ""}`}
          />
        ) : (
          <div className="flex flex-1 h-full items-center justify-center bg-orange-700 rounded-full">
            <span className="font-bold text-white text-2xl capitalize">
              {(companyData.data?.name?.[0]) || "C"}
            </span>
          </div>
        )}

        {/* Edit button - only show in private view */}
        {isPrivateView && (
          <button
            onClick={() => avatarRef.current?.click()}
            className="absolute -top-2 -left-2 bg-accent-purple font-semibold hover:bg-orange-800 rounded-full p-2 shadow-md transition-colors duration-200"
            title="Upload company logo"
          >
            <Edit size={12} className="text-white" />
          </button>
        )}

        {/* File input - only render in private view */}
        {isPrivateView && (
          <input
            ref={avatarRef}
            type="file"
            onChange={handleAvatarUpload}
            className="hidden"
            accept="image/*"
          />
        )}

        {/* Save button - only show in private view when avatar is selected */}
        {isPrivateView && avatar && (
          <button
            onClick={handleAvatarSave}
            className="items-center mt-2 text-base justify-center px-4 py-[2px] rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:shadow-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={companyLogoMutation.isLoading}
          >
            {companyLogoMutation.isLoading ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    );
  };

  const renderCompanyInfo = () => (
    <div className="flex flex-1 gap-y-7">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 capitalize">
          {companyData.data?.name || "Loading..."}
        </h1>
        <a
          href={companyData.data?.website || "#"}
          className="text-blue-600 hover:underline text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          {companyData.data?.website || "https://example.com"}
        </a>
      </div>

      {/* Profile Settings button - only show in private view */}
      {isPrivateView && (
        <div className="flex flex-1 space-x-2 self-start justify-end">
          <Link
            to={`/company/profile/settings/${company?.id}`}
            state={{ fromJob: true }} // Maintain the private view state
            className="flex items-center px-4 py-2 text-sm font-medium text-orange-700 border border-orange-700 bg-white rounded-md hover:bg-orange-700 hover:text-white transition duration-200"
          >
            <Settings size={16} className="mr-2" />
            Profile Settings
          </Link>
        </div>
      )}
    </div>
  );

  if (companyData.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-700"></div>
      </div>
    );
  }

  if (companyData.error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-2">Error loading company</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="flex p-8">
        <div className="flex-1 max-w-4xl border rounded-lg p-1">
          <div className="py-6 px-8 bg-white border-b">
            <div className="flex flex-col md:flex-row items-start justify-between mb-6">
              <div className="flex flex-1 gap-x-5 items-center mb-4 md:mb-0">
                {renderAvatar()}
                {renderCompanyInfo()}
              </div>
            </div>
          </div>

          <div className="flex border-b py-3 px-8 gap-x-16 text-base font-bold">
            <NavigationLink to="home">Home</NavigationLink>
            <NavigationLink to="about">About</NavigationLink>
            <NavigationLink to="job">Jobs</NavigationLink>
            <NavigationLink to="team">People</NavigationLink>
          </div>

          {/* Pass view mode context to child routes */}
          <Outlet 
            context={{ 
              companyProfile: companyData.data,
              isPrivateView,
              isPublicView,
              fromJob
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;