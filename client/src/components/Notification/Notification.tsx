import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Bell, Trash2, Check, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { NotificationApi } from '@/api/Notification.api';
import { useGetUser } from '@/hooks/useGetUser';
import NotificationItem from './NotificationItem';
import { FILTER_TABS, FilterType, NotificationAttrs } from '@/types/notification';
import { NotificationSkeleton } from '../Skeleton/Notification.skeleton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const NotificationsFeed: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  
  const user = useGetUser();
  
  const { data, isLoading, isError, error, refetch } = useQuery<NotificationAttrs[], Error>({
    queryKey: ['notifications', activeFilter],
    queryFn: () => {
      if (!user?._id) throw new Error('User not found');
      return NotificationApi.getNotification(user._id, activeFilter);
    },
    enabled: !!user?._id,
    refetchInterval: 30000,
  });

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

  const handleBulkDelete = async () => {
    try {
      setIsProcessing(true);
     
      const notificationIds = Array.from(selectedNotifications);
      
      await NotificationApi.bulkDeleteNotification(notificationIds);
      
      toast({
        title: "Notifications deleted",
        description: `Successfully deleted ${notificationIds.length} notifications`,
      });
      
      setSelectedNotifications(new Set());
      refetch(); 
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
      
      await NotificationApi.readAllNotification(notificationIds);
      
      toast({
        title: "Notifications updated",
        description: `Marked ${notificationIds.length} notifications as read`,
      });
      
      setSelectedNotifications(new Set());
      refetch(); 
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
      <CardHeader className="pb-0 px-2 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 w-full">
          {/* Desktop Tabs */}
          <div className="hidden sm:block w-full">
            <Tabs
              defaultValue="all"
              value={activeFilter}
              onValueChange={(value) => setActiveFilter(value as FilterType)}
              className="w-full"
            >
              <TabsList className="w-full justify-start gap-2 overflow-x-auto flex-nowrap">
                {FILTER_TABS.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="flex items-center gap-2 px-3 py-1.5 whitespace-nowrap data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                    {unreadCounts[value] > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="ml-1 bg-white px-1.5 text-orange-600 text-xs"
                      >
                        {unreadCounts[value]}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile Dropdown Filter */}
          <div className="flex items-center justify-between w-full sm:hidden mb-3">
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter size={16} />
                    <span>{FILTER_TABS.find(tab => tab.value === activeFilter)?.label || 'All'}</span>
                    {unreadCounts[activeFilter] > 0 && (
                      <Badge className="ml-1 bg-orange-600 text-white px-1.5 text-xs">
                        {unreadCounts[activeFilter]}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {FILTER_TABS.map(({ value, label, icon: Icon }) => (
                    <DropdownMenuItem 
                      key={value}
                      onClick={() => setActiveFilter(value as FilterType)}
                      className="flex items-center gap-2"
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                      {unreadCounts[value] > 0 && (
                        <Badge className="ml-1 bg-orange-600 text-white px-1.5 text-xs">
                          {unreadCounts[value]}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {selectedNotifications.size > 0 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAsRead}
                  disabled={isProcessing}
                  className="p-1 h-8 sm:p-2"
                  title="Mark as Read"
                >
                  <Check className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-1.5">Read</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isProcessing}
                  className="p-1 h-8 sm:p-2"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-1.5">Delete</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Selection controls */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center justify-between py-2 px-3 sm:px-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  filteredNotifications.length > 0 &&
                  selectedNotifications.size === filteredNotifications.length
                }
                onCheckedChange={handleSelectAll}
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
              <span className="text-xs sm:text-sm text-gray-600">
                {selectedNotifications.size} selected
              </span>
            </div>
            
            {/* Desktop action buttons */}
            {selectedNotifications.size > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAsRead}
                  disabled={isProcessing}
                  className="flex items-center gap-x-1.5 text-sm"
                >
                  <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                  Mark as Read
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isProcessing}
                  className="flex items-center gap-x-1.5 text-sm"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="mt-2 sm:mt-4 px-2 sm:px-6">
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-4 sm:p-8 text-center text-gray-500">
              <Bell className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              <p className="mt-2 text-sm sm:text-base">No {activeFilter === 'all' ? '' : activeFilter} notifications</p>
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