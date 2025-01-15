import React, { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSelector } from "react-redux";
import { ProfileApi } from "@/api/Profile.api";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { popularSkills } from '../../constants/popularSkill';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useMutation } from 'react-query';
import SuccessMessage from '../common/Message/SuccessMessage';
import ErrorMessage from '../common/Message/ErrorMessage';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/main';
import { Axios, AxiosError, HttpStatusCode } from 'axios';

const skillSchema = z.object({
  skills: z.array(z.object({
    name: z.string().min(1, "Skill name is required"),
    proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"])
  })).min(1, "At least one skill is required")
});

interface SkillFormProps {
  skills?: string[];
  onClose: React.Dispatch<React.SetStateAction<boolean>>
}

function SkillForm({ skills, onClose }: SkillFormProps) {
  const { user } = useSelector((state) => state.auth);
  const [inputSkill, setInputSkill] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);


  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: skills || []
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills"
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputSkill(value);
    if (value.length > 0) {
      const filtered = popularSkills.filter(skill => 
        skill.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (skill) => {
    setInputSkill(skill);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddSkill = () => {
    if (inputSkill.trim() && !fields.some(field => field.name.toLowerCase() === inputSkill.trim().toLowerCase())) {
      append({ name: inputSkill.trim(), proficiency: "Beginner" });
      setInputSkill('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

 const { toast } = useToast()
  const updateSkillsMutation = useMutation({
    mutationFn: async (data: z.infer<typeof skillSchema>) => {
      const skills = { skills: data.skills }
      return await ProfileApi.updateProfile({data: skills, email: user.email, array: true});
    },
    onSuccess: () => {
      toast({
        title: <SuccessMessage message='Skills updated successfully'/>,
        
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      onClose(false)
    },
    onError: (error: AxiosError) => {
      console.error('Full error object:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    
      if (error.response?.status === HttpStatusCode.BadRequest) {
        const errorMessage = error.response.data?.errors?.[0]?.message || 'Invalid request';
        console.log('Error message being used:', errorMessage);
        toast({
          title: <ErrorMessage  message={errorMessage} />,
          className: 'bg-red-500 text-white',
        });
        return;
      }
      toast({
        title: <ErrorMessage message='Failed to update Skills. Please try again.' />
        
      });
    },
  });

  const onSubmit = async (data) => {
    updateSkillsMutation.mutate(data)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <div className="flex gap-2 mb-2 relative">
                  <Input
                    value={inputSkill}
                    onChange={handleInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Enter a skill"
                    className="flex-grow"
                    disabled={updateSkillsMutation.isLoading}
                  />
                  <Button 
                    className='bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white' 
                    type="button" 
                    onClick={handleAddSkill}
                    disabled={updateSkillsMutation.isLoading}
                  >
                    Add Skill
                  </Button>
                  {showSuggestions && suggestions.length > 0 && (
                    <div ref={suggestionsRef} className="absolute z-10 w-full bg-white border border-gray-300 mt-12 rounded-md shadow-lg">
                      {suggestions.map((skill, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSuggestionClick(skill)}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                { fields.map((field, index) => (
                  <Badge key={field.id} variant="secondary" className="text-sm text-orange-500 border border-orange-500 py-[5px]">
                    {field.name}
                    <select
                      value={field.proficiency}
                      onChange={(e) => {
                         console.log(e.target.value)
                         form.setValue(`skills.${index}.proficiency`, e.target.value)
                      }}
                      className="ml-2 bg-transparent border-none text-sm"
                      disabled={updateSkillsMutation.isLoading}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <X
                      className="ml-2 h-4 w-4 cursor-pointer"
                      onClick={() => remove(index)}
                    />
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end'>
          <Button 
            type="submit" 
            className="mt-4"
              disabled={updateSkillsMutation.isLoading}
          >
            {updateSkillsMutation.isLoading ? 'Saving...' : 'Save Skills'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SkillForm;