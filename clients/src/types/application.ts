export const STATUS_CONFIG = {
    Applied: {
      title: 'Application Status Update',
      buttonText: 'Mark as Applied',
      titlePlaceholder: 'Enter application status title',
      descriptionPlaceholder: 'Enter details about the application'
    },
    Inreview: {
      title: 'Application Review',
      buttonText: 'Move to Review',
      titlePlaceholder: 'Enter review status title',
      descriptionPlaceholder: 'Enter review details'
    },
    Shortlisted: {
      title: 'Application Shortlist',
      buttonText: 'Shortlist Candidate',
      titlePlaceholder: 'Enter shortlist title',
      descriptionPlaceholder: 'Enter shortlist details'
    },
    Interview: {
      title: 'Schedule Interview',
      buttonText: 'Move to Interview',
      titlePlaceholder: 'Enter interview title',
      descriptionPlaceholder: 'Enter interview details'
    },
    Selected: {
      title: 'Candidate Selection',
      buttonText: 'Select Candidate',
      titlePlaceholder: 'Enter selection title',
      descriptionPlaceholder: 'Enter selection details'
    },
    Rejected: {
      title: 'Candidate Rejection',
      buttonText: 'Reject Application',
      titlePlaceholder: 'Enter rejection title',
      descriptionPlaceholder: 'Enter rejection reason'
    }
  };


export  interface JobApplicationFormProps {
    companyId: string,
    jobId: string,
    onClose:React.Dispatch<React.SetStateAction<boolean>>
}

export interface Applicant {
   _id: string;
   username: string;
   email: string;
   phone: string;
   jobRole: string;
}