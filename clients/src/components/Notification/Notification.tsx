import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Bell, Briefcase, MessageSquare, Star, Trash2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { NotificationApi } from '@/api/Notification.api';
import { useGetUser } from '@/hooks/useGetUser';
import NotificationItem from './NotificationItem';
import { NotificationAttrs } from '@/types/notification';

// Filter tabs configuration
const FILTER_TABS = [
  { value: 'all', label: 'All', icon: Bell },
  { value: 'application', label: 'Applications', icon: Briefcase },
  { value: 'message', label: 'Messages', icon: MessageSquare },
  { value: 'job', label: 'Jobs', icon: Star },
] as const;

type FilterType = typeof FILTER_TABS[number]['value'];

const NotificationSkeleton = () => (
  <div className="p-4">
    <div className="flex items-start space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  </div>
);

const NotificationsFeed: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  
  const user = useGetUser();
  
  const { data, isLoading, isError, error, refetch } = useQuery<NotificationAttrs[], Error>({
    queryKey: ['notifications', activeFilter],
    queryFn: () => NotificationApi.getNotification(user?._id, activeFilter),
    refetchInterval: 30000,
  });

  // Reset selections when filter changes
  useEffect(() => {
    setSelectedNotifications(new Set());
  }, [activeFilter]);

  const filteredNotifications = React.useMemo(() => {
    if (!data) return [];
    return activeFilter === 'all' 
      ? data 
      : data.filter(notification => notification.type === activeFilter);
  }, [data, activeFilter]);

  const unreadCounts = React.useMemo(() => {
    if (!data) return {};
    return data.reduce((acc, notification) => {
      if (notification.status === 'unread') {
        acc[notification.type] = (acc[notification.type] || 0) + 1;
        acc.all = (acc.all || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  // Selection handling
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(filteredNotifications.map(n => n.id));
      setSelectedNotifications(newSelected);
    } else {
      setSelectedNotifications(new Set());
    }
  };

  const handleSelectOne = (checked: boolean, id: string) => {
    const newSelected = new Set(selectedNotifications);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedNotifications(newSelected);
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    try {
      setIsProcessing(true);
      // Convert Set to Array for processing
      const notificationIds = Array.from(selectedNotifications);
      
      // You'll need to implement this API method
      await NotificationApi.bulkDelete(notificationIds);
      
      toast({
        title: "Notifications deleted",
        description: `Successfully deleted ${notificationIds.length} notifications`,
      });
      
      setSelectedNotifications(new Set());
      refetch(); // Refresh the list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notifications. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      setIsProcessing(true);
      const notificationIds = Array.from(selectedNotifications);
      
      // You'll need to implement this API method
      await NotificationApi.bulkMarkAsRead(notificationIds);
      
      toast({
        title: "Notifications updated",
        description: `Marked ${notificationIds.length} notifications as read`,
      });
      
      setSelectedNotifications(new Set());
      refetch(); // Refresh the list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notifications. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <p>Error loading notifications: {error.message}</p>
      </Alert>
    );
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between mb-4">
          <Tabs
            defaultValue="all"
            value={activeFilter}
            onValueChange={(value) => setActiveFilter(value as FilterType)}
            className="w-full"
          >
            <TabsList className="w-full justify-start gap-2">
              {FILTER_TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  {unreadCounts[value] > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-1 bg-white px-2 text-orange-600"
                    >
                      {unreadCounts[value]}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Selection controls */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  filteredNotifications.length > 0 &&
                  selectedNotifications.size === filteredNotifications.length
                }
                onCheckedChange={handleSelectAll}
                className="h-5 w-5"
              />
              <span className="text-sm text-gray-600">
                {selectedNotifications.size} selected
              </span>
            </div>
            
            {selectedNotifications.size > 0 && (
              <div className="flex items-center gap-2 gap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAsRead}
                  disabled={isProcessing}
                  className="flex items-center gap-x-2"
                >
                  <Check className="h-2 w-2" />
                  Mark as Read
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isProcessing}
                  className="flex items-center gap-x-2"
                >
                  <Trash2 className="h-2 w-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="mt-4 rounded-lg">
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No {activeFilter === 'all' ? '' : activeFilter} notifications</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                isSelected={selectedNotifications.has(notification.id)}
                onSelect={handleSelectOne}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsFeed;