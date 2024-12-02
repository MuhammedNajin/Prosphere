import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import JobApplicationForm from "./JobApplicationForm";
import { JobApplicationFormProps } from "@/types/application";
interface JobApplicationModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  applicationFormProps: Pick<JobApplicationFormProps, 'companyId' | 'jobId'>;
  job: {
    jobTitle: string;
    officeLocation: string;
    company: string;
  };
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  modal,
  setModal,
  applicationFormProps,
  job,
}) => {
  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogContent className="max-w-4xl bg-white p-4 top-[50%] rounded max-h-[90vh] overflow-hidden flex flex-col shadow-none border">
        <DialogHeader>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center">
              <div className="w-12 h-12 bg-orange-700 rounded flex items-center justify-center text-white text-2xl font-bold">
                {job?.company?.[0] || "C"}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{job && job.jobTitle}</h2>
                <p className="text-sm text-gray-500">
                 { job?.company || "Company" } • {job && job.officeLocation}
                </p>
              </div>
            </div>
          </div>
          <DialogDescription>
            <h3 className="text-lg font-semibold">Submit your application</h3>
            <p className="text-sm text-gray-500 mb-1">
              The following is required and will only be shared with Nomad
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto p-6 scrollbar-hide">
          <JobApplicationForm {...applicationFormProps} onClose={setModal} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;
