import { Bell, Briefcase, MessageSquare, Star, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import {  useState } from "react";
// import { SocketContext } from "@/context/socketContext";
import { NotificationAttrs } from "@/types/notification";
import { NotificationApi } from "@/api/Notification.api";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface NotificationItemProps extends NotificationAttrs {
  isSelected?: boolean;
  onSelect?: (checked: boolean, id: string) => void;
}

const NotificationIcon: React.FC<{ type: NotificationAttrs['type'] }> = ({ type }) => {
  const iconProps = { size: 20, className: 'text-primary' };
  
  switch (type) {
    case 'application':
      return <Briefcase {...iconProps} />;
    case 'message':
      return <MessageSquare {...iconProps} />;
    case 'job':
      return <Star {...iconProps} />;
    default:
      return <Bell {...iconProps} />;
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  type,
  status,
  createdAt,
  actionUrl,
  id,
  isSelected = false,
  onSelect,
}) => {
  
  const navigation = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleNotificationRead = async () => {
    await NotificationApi.readNotification(id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await NotificationApi.deleteNotification(id);
      toast({
        title: "Notification deleted",
        description: "The notification has been successfully removed.",
      });
     
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the notification. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(!isSelected, id);
  };

  return (
    <>
      <div 
        className={`group p-4 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg relative ${
          status === 'unread' ? 'bg-orange-50' : ''
        } ${isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
        onClick={() => {
          if(status === 'unread') handleNotificationRead();
          if (actionUrl) navigation(actionUrl);
        }}
      >
        <div className="flex items-start space-x-4">
          {/* Add checkbox */}
          <div 
            className={`flex items-center h-full my-auto ${!isSelected ? "opacity-0 group-hover:opacity-100 transition-opacity" : ''}`} 
            onClick={handleCheckboxClick}
          >
            <Checkbox 
              checked={isSelected}
              className="h-5 w-5 rounded-sm"
              aria-label="Select notification"
            />
          </div>

          <div className="p-2 bg-gray-100 rounded-full">
            <NotificationIcon type={type} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              {status === 'unread' && (
                <Badge variant="default" className="bg-orange-600">New</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600">{message}</p>
            <p className="mt-1 text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NotificationItem;