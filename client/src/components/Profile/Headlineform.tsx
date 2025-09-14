import { UserApi } from "@/api/user.api";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import React, { useState } from "react";
import { Input } from "../ui/input";

interface HeadLineFormProps {
    onClose: (shouldRefetch?: boolean) => void
    currentHeadline: string;
}

const HeadlineForm: React.FC<HeadLineFormProps> = ({ onClose, currentHeadline = "" }) => {
  const [headline, setHeadline] = useState(currentHeadline);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await UserApi.updateProfile({ data: { headline } });
      console.log('Updating headline:', headline);
      onClose(true);
    } catch (error) {
      console.error('Failed to update headline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="headline" className="text-sm font-medium text-gray-700">
          Professional Headline
        </Label>
        <Input
          id="headline"
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g., Senior Software Engineer at Tech Company"
          maxLength={120}
          className="w-full"
        />
        <p className="text-xs text-gray-500">
          {headline.length}/120 characters
        </p>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onClose(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !headline.trim()}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {isLoading ? "Saving..." : "Save Headline"}
        </Button>
      </div>
    </form>
  );
};

export default HeadlineForm;