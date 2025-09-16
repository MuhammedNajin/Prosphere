import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Reply, Send, Smile } from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQuery } from "react-query";
import { JobApi } from "@/api/Job.api";
import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LoaderSubmitButton from "@/components/common/spinner/LoaderSubmitButton";

interface User {
  _id: string;
  username: string;
}

interface CommentType {
  _id: string;
  comment: string;
  userId: User;
  createdAt: string;
  jobId: string;
}

interface Job {
  _id: string;
  jobTitle: string;
  officeLocation: string;
}

export interface CommentFormData {
  jobId: string;
  comment: string;
}

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

const CommentDialog = ({ isOpen, onClose, job }: CommentDialogProps) => {
  // Form setup with proper typing
  const form = useForm<CommentFormData>({
    defaultValues: {
      jobId: "",
      comment: "",
    },
  });

  // Reset form when job changes
  useEffect(() => {
    if (job?._id) {
      form.reset({
        jobId: job._id,
        comment: "",
      });
    }
  }, [job, form]);

  // Mutations and Queries
  const commentMutation = useMutation({
    mutationFn: (data: CommentFormData) => JobApi.addComment({ data }),
    onSuccess: () => {
      form.reset();
      comments.refetch();
    },
    onError: (error) => {
      console.error("Failed to add comment:", error);
    },
  });

  const comments = useQuery({
    queryKey: ["comments", job?._id],
    queryFn: () => JobApi.getComment({ jobId: job._id }),
    enabled: !!job?._id,
  });

  // Form submission handler
  const onSubmit = (data: CommentFormData) => {
    commentMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl top-[50%] rounded max-h-[90vh] overflow-hidden flex flex-col shadow-none border mx-auto">
        <DialogHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 md:p-6">
            <div className="flex items-center w-full md:w-auto">
              <div className="bg-green-100 p-2 rounded-lg mr-3 shrink-0">
                <svg
                  className="w-4 h-4 md:w-6 md:h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-semibold truncate">
                  {job?.jobTitle}
                </h2>
                <p className="text-xs md:text-sm text-gray-500">
                  Nomad • {job?.officeLocation}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Comment Input Section */}
        <div className="px-4 md:px-6 py-3 border-b">
          <div className="flex items-start space-x-2 md:space-x-3">
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarImage src="/api/placeholder/32/32" alt="Current User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Leave a comment..."
                            className="min-h-[60px] md:min-h-[80px] resize-none text-sm md:text-base"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" type="button" className="text-xs md:text-sm">
                      <Smile className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Add emoji
                    </Button>
                    <LoaderSubmitButton state={commentMutation.isLoading}>
                      <Send size={20} className="mr-2" />
                      Post Comment
                    </LoaderSubmitButton>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="overflow-y-auto p-4 md:p-6 scrollbar-hide">
          <div className="space-y-3 md:space-y-4">
            {comments.data?.data?.map((comment: CommentType) => (
              <Card key={comment._id} className="w-full">
                <CardContent className="p-3 md:p-4">
                  <div className="flex space-x-2 md:space-x-4">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src="/api/placeholder/32/32" alt={comment.userId.username[0]} />
                      <AvatarFallback>{comment.userId.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm md:text-base truncate">
                            {comment.userId.username}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.createdAt), "MMM d, yyyy • h:mm a")}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 md:h-8 ml-2">
                          •••
                        </Button>
                      </div>
                      <p className="mt-2 text-sm md:text-base text-gray-700">
                        {comment.comment}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 md:gap-4">
                        <Button variant="ghost" size="sm" className="text-xs md:text-sm h-7 md:h-8">
                          <ThumbsUp className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                          Like
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs md:text-sm h-7 md:h-8"
                        >
                          <Reply className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;