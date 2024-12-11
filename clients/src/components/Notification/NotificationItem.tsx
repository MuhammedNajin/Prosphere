import { MonitorSmartphone, MoreHorizontal } from "lucide-react";

interface NotificationProps {
  type: "comment" | "suggestion" | "job";
  avatar?: string;
  content: React.ReactNode;
  time: string;
  tittle: string;
  status: string;
}

const NotificationItem = ({
  type,
  avatar,
  content,
  time,
  tittle,
  status
}: NotificationProps) => {
  return (
    <div className="flex items-start p-4 bg-orange-50 border-b border-gray-200 hover:bg-orange-100">
      <div className="flex items-center gap-x-3 flex-shrink-0 mr-3">
        { 
          status !== "read" && (
            <div>
              <div className="bg-orange-800 w-2 h-2 rounded-full"></div>
           </div>
          )
        }
        {avatar ? (
          <img src={avatar} alt="" className="w-12 h-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            {type === "suggestion" && (
              <MonitorSmartphone className="w-6 h-6 text-gray-600" />
            )}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-900">{tittle}</div>
        <div className="text-xs text-gray-900">{content}</div>
      </div>
      <div>
        <button className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
        <div className="mt-1 text-xs text-gray-500">{time}</div>
      </div>
    </div>
  );
};

export default NotificationItem;
