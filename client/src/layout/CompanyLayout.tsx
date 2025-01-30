
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarNavigation from "@/components/common/sidebar/SideBar";
import {
  CompanySideBarItems,
  CompanySettingsItems,
} from "../constants/SidebarItems";
import CreateJobModal from "@/components/job/CreateJobModal";
import Header from "@/components/company/Header/CompanyHeader";
import SubscriptionWrapper from "@/context/SubscriptionContext";
import { SocketContext } from "@/context/socketContext";
import { useSelectedCompany } from "@/hooks/useSelectedCompany";

const CompanyLayout: React.FC = () => {
  const [sideBar, ] = useState(false);
  const [isOpen, setClose] = useState(false);
  const { chatSocket } = useContext(SocketContext);
  const company = useSelectedCompany()
  useEffect(() => {
    if(company?._id) {
      console.log("heloo from company layout", company?._id)
      chatSocket?.emit('join_room', { receiver: company._id});
    }
  }, [company, chatSocket?.connected]);

  const jobModalToggle = useCallback(() => {
    setClose((prev) => !prev);
  }, []);
  return (
    <>
      <SubscriptionWrapper>
        <div className="md:flex px-1">
          {isOpen && <CreateJobModal isOpen={isOpen} onClose={setClose} />}

          <div
            className={`fixed z-50 h-screen bg-gray-100 md:relative md:h-auto md:translate-x-0 transition-transform duration-300 ease-in-out ${
              sideBar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <SidebarNavigation
              userImage="/company.png"
              settingsNavItems={CompanySettingsItems()}
              userType="company"
              userName="Brototype"
              mainNavItems={CompanySideBarItems()}
            />
          </div>
          <div className="flex-1 bg-white h-screen overflow-y-auto">
            <Header onClose={jobModalToggle} />
            <div className="p-4 mt-16">
              <Outlet />
            </div>
          </div>
        </div>
      </SubscriptionWrapper>
    </>
  );
};

export default CompanyLayout;
