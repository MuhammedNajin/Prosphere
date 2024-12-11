import React, { useEffect } from "react";
import NotificationItem from "./NotificationItem";
import { useQuery } from "react-query";
import { NotificationApi } from "@/api/Notification.api";
import { useGetUser } from "@/hooks/useGetUser";
import { NotificationAttrs } from "@/types/notification";
import convertToIST from "@/lib/utilities/ConverttoIst";

const NotificationsFeed: React.FC = () => {
  const user = useGetUser();
  const { data } = useQuery({
    queryFn: () => NotificationApi.getNotification(user?._id),
  });

  useEffect(() => {
    console.log("user", user);
    console.log("notification", data);
  }, [data]);
  return (
    <div className="w-full mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {data &&
          data?.map((notification: NotificationAttrs) => (
            <NotificationItem
              tittle={notification?.title}
              type={notification.type}
              avatar="/api/placeholder/48/48"
              content={notification.message}
              time={convertToIST(notification.createdAt)}
              status={notification.status}
            />
          ))}
       
      </div>
    </div>
  );
};

export default NotificationsFeed;
