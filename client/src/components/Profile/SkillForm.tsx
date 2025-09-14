import React, { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useMutation } from 'react-query';
import { useToast } from '@/hooks/use-toast';
import { UserApi } from '@/api/user.api';
import { queryClient } from '@/main';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { AxiosError, HttpStatusCode } from 'axios';
import { ApiErrorResponse } from '@/api';
import { ISkill, SkillProficiency } from '@/types/user';
import SuccessMessage from '../common/Message/SuccessMessage';
import ErrorMessage from '../common/Message/ErrorMessage';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { popularSkills } from '../../constants/popularSkill';
import { useCurrentUser } from '@/hooks/useSelectors';

const skillSchema = z.object({
  skills: z
    .array(
      z.object({
        name: z.string().min(1, 'Skill name is required').trim(),
        proficiency:  z.nativeEnum(SkillProficiency),
      })
    )
    .min(1, 'At least one skill is required'),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillFormProps {
  skills?: ISkill[];
  onClose: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ skills = [], onClose }) => {
  const user = useCurrentUser()
  const { toast } = useToast();
  const [inputSkill, setInputSkill] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: skills.map((skill) => ({
        name: skill.name,
        proficiency: skill.proficiency,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputSkill(value);
    if (value.length > 0) {
      const filtered = popularSkills.filter((skill) =>
        skill.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (skill: string) => {
    setInputSkill(skill);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddSkill = () => {
    if (
      inputSkill.trim() &&
      !fields.some((field) => field.name.toLowerCase() === inputSkill.trim().toLowerCase())
    ) {
      append({
        name: inputSkill.trim(),
        proficiency: SkillProficiency.BEGINNER,
      });
      setInputSkill('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const { mutate: updateSkills, isLoading } = useMutation({
    mutationFn: ({ data }: { data: SkillFormValues; id: string }) =>
      UserApi.updateProfile({ data, array: true }),
    onSuccess: () => {
      toast({
        description: <SuccessMessage message="Skills updated successfully" />,
      });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      onClose();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.status === HttpStatusCode.BadRequest
          ? error.response?.data?.errors?.[0]?.message || 'Invalid request'
          : 'Failed to update skills. Please try again.';
      toast({
        description: <ErrorMessage message={errorMessage} />,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: SkillFormValues) => {
    if (!user?.id) {
      toast({
        description: <ErrorMessage message="User ID is missing" />,
        variant: 'destructive',
      });
      return;
    }
    updateSkills({ data, id: user.id });
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
                <div className="relative">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={inputSkill}
                      onChange={handleInputChange}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Enter a skill"
                      className="flex-grow"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddSkill}
                      disabled={isLoading || !inputSkill.trim()}
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      Add Skill
                    </Button>
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto"
                    >
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
                {fields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="text-sm text-orange-600 border border-orange-500 py-1 px-2"
                  >
                    {field.name}
                    <FormField
                      control={form.control}
                      name={`skills.${index}.proficiency`}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="ml-2 h-6 w-24 bg-transparent border-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(SkillProficiency).map((proficiency) => (
                              <SelectItem key={proficiency} value={proficiency}>
                                {proficiency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <X
                      className="ml-2 h-4 w-4 cursor-pointer text-red-500"
                      onClick={() => remove(index)}
                    />
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || fields.length === 0}>
            {isLoading ? 'Saving...' : 'Save Skills'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SkillForm;