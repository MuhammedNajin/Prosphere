import React from 'react';
import { Download } from 'lucide-react';


interface FileItemProps {
  fileName: string;
  onDownload?: () => void;
  setResume?: any;
  active: boolean;
}

const ResumeFile = ({
  fileName,
  onDownload,
  setResume,
  active
}: FileItemProps) => {
  return (
    <div className="flex items-center w-full max-w-3xl rounded-lg border border-gray-200 bg-white mb-2">
      {/* PDF indicator */}
      <div className="flex items-center justify-center w-16 h-16 bg-red-600 rounded-l-lg">
        <span className="text-white font-bold text-sm">PDF</span>
      </div>
      
      {/* File information */}
      <div className="flex-1 px-4 py-2">
        <h3 className="text-sm font-medium text-gray-900">{fileName}</h3>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2 px-4">
        <button 
          onClick={onDownload}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Download file"
        >
          <Download className="w-5 h-5 text-gray-600" />
        </button>
        
        <button 
          type='button'
          onClick={setResume}
          className={`w-6 h-6 flex items-center ${active ? " bg-green-500 " : "border-2 border-zinc-500"} justify-center  rounded-full transition-colors`}
          aria-label="More options"
        >
          <div className="w-2 h-2 p-1 bg-white rounded-full" />
        </button>
      </div>
    </div>
  );
};

export default ResumeFile;
