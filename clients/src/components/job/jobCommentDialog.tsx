import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  ThumbsUp,
  Reply,
  Send,
  Smile,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQuery } from "react-query";
import { JobApi } from "@/api";
import { FormControl, FormField, FormItem, Form } from "../ui/form";
import { useForm } from "react-hook-form";
import LoaderSubmitButton from "../common/spinner/LoaderSubmitButton";

const CommentDialog = ({
  comment,
  setComment,
  job,
  handleAddComment,
  handleAddReply,
  replyingTo,
  setReplyingTo,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState({});

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

 

  const commentMutation = useMutation({
    mutationFn: JobApi.addComment,
    onSuccess: (data) => {
      console.log("success");
    },
    onError: (err) => {
      console.log("errr", err);
    },
  });

  type Comment = {
    comment: undefined | unknown;
    id: string;
  };

  const form = useForm<Comment>({
    defaultValues: {
      jobId: "",
      comment: undefined,
    },
  });

  useEffect(() => {
    console.log(job);

    if(job) {
       form.reset({
        jobId: job?._id,
       })
    }

    
    
 },[job])

  const comments = useQuery({
     queryKey: ['comments'],
     queryFn: () => {
        if(job._id) {
           return JobApi.getComment({ jobId: job?._id });
        }
     },
     enabled: !!job?._id
  });

  function onSubmit(data: Comment) {
    commentMutation.mutate({ data });
  }

  return (
    <Dialog open={comment} onOpenChange={setComment}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl  top-[50%] rounded max-h-[90vh] overflow-hidden flex flex-col shadow-none border mx-auto">
        <DialogHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 md:p-6">
            <div className="flex items-center w-full md:w-auto">
              <div className="bg-green-100 p-2 rounded-lg mr-3 shrink-0">
                <svg
                  className="w-4 h-4 md:w-6 md:h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
                  {job && job?.jobTitle}
                </h2>
                <p className="text-xs md:text-sm text-gray-500">
                  Nomad • {job && job?.officeLocation}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* New Comment Input Section */}
        <div className="px-4 md:px-6 py-3 border-b">
          <div className="flex items-start space-x-2 md:space-x-3">
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarImage src="/api/placeholder/32/32" alt="Current User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Leave a comment..."
                              value={newComment}
                               {
                                ...field
                               }
                              className="min-h-[60px] md:min-h-[80px] resize-none text-sm md:text-base"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" type="button" className="text-xs md:text-sm">
                      <Smile className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Add emoji
                    </Button>
                    <LoaderSubmitButton state={commentMutation.isLoading}>
                    <Send size={20} className="" />
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
            { comments.data && comments?.data.data?.map((comment, index) => (
              <Card key={Date.now() + index} className="w-full">
                <CardContent className="p-3 md:p-4">
                  <div className="flex space-x-2 md:space-x-4">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src={"#"} alt={comment?.userId?.username[0]} />
                      <AvatarFallback>{comment?.userId?.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm md:text-base truncate">
                            {comment?.userId?.username}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {format(comment.createdAt, "MMM d, yyyy • h:mm a")}
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
                          // onClick={() => setReplyingTo(comment._id)}
                          className="text-xs md:text-sm h-7 md:h-8"
                        >
                          <Reply className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                          Reply
                        </Button>
                        {/* {comment.replies.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReplies(comment.id)}
                            className="text-xs md:text-sm text-gray-500 h-7 md:h-8"
                          >
                            {showReplies[comment.id] ? (
                              <>
                                <ChevronUp className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                Hide Replies
                              </>
                            ) : (
                              <>
                                <ChevronDown className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                Show Replies ({comment.replies.length})
                              </>
                            )}
                          </Button>
                        )} */}
                      </div>

                      {/* Reply Input */}
                      {/* {replyingTo === comment.id && (
                        <div className="mt-3 md:mt-4 bg-gray-50 p-2 md:p-3 rounded-lg">
                          <div className="flex items-start space-x-2 md:space-x-3">
                            <Avatar className="h-6 w-6 md:h-8 md:w-8">
                              <AvatarImage src="/api/placeholder/32/32" alt="Current User" />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <Textarea
                                placeholder={`Reply to ${comment.user.name}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-[50px] md:min-h-[60px] resize-none bg-white text-sm"
                              />
                              <div className="flex justify-end space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                  }}
                                  className="text-xs md:text-sm h-7 md:h-8"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm" 
                                  disabled={!replyText.trim()}
                                  className="text-xs md:text-sm h-7 md:h-8"
                                >
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )} */}

                      {/* Replies Section */}
                      {/* {showReplies[comment.id] && comment.replies.length > 0 && (
                        <div className="mt-3 md:mt-4 space-y-3 md:space-y-4 pl-4 md:pl-8 border-l-2 border-gray-100">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-2 md:space-x-4">
                              <Avatar className="h-6 w-6 md:h-8 md:w-8">
                                <AvatarImage src={reply.user.image} alt={reply.user.name} />
                                <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="min-w-0">
                                    <h4 className="font-semibold text-xs md:text-sm truncate">
                                      {reply.user.name}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                      {format(reply.createdAt, "MMM d, yyyy • h:mm a")}
                                    </span>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-6 ml-2">
                                    •••
                                  </Button>
                                </div>
                                <p className="mt-1 text-xs md:text-sm text-gray-700">
                                  {reply.commentText}
                                </p>
                                <Button variant="ghost" size="sm" className="mt-1 h-6 md:h-7 text-xs">
                                  <ThumbsUp className="mr-1 md:mr-2 h-3 w-3" />
                                  Like
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )} */}
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