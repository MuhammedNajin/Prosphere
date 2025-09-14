import { AxiosInstance } from 'axios';
import axiosInstance from './config';
import { IUser, IUserUpdateInput } from '@/types/user';

interface ApiResponse<T> {
  data: T;
  status: number;
}

export class UserApi {
  private static axios: AxiosInstance = axiosInstance;

  static uploadProfilePhoto = async ({ 
    data, 
    key, 
    existingKey 
  }: { 
    data: unknown; 
    key: string; 
    existingKey?: string 
  }): Promise<ApiResponse<string>> => {
    try {
      const response = await this.axios.post(
        `/api/v1/users/avatar?key=${key}${existingKey ? `&existingKey=${existingKey}` : ''}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return { data: response.data.data, status: response.status };
    } catch (error: any) {
      throw new Error(`Failed to upload profile photo: ${error.message}`);
    }
  };

  static uploadResume = async ({ data }: { data: FormData }): Promise<ApiResponse<string>> => {
    try {
      const response = await this.axios.post('/api/v1/users/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { data: response.data.data, status: response.status };
    } catch (error: any) {
      throw new Error(`Failed to upload resume: ${error.message}`);
    }
  };

  static updateAbout = async (description: string): Promise<ApiResponse<IUser>> => {
    try {
      const endpoint = '/api/v1/users/me/about';
      const response = await this.axios.put(endpoint, { description });
      return { data: response.data.data, status: response.status };
    } catch (error: any) {
      throw new Error(`Failed to update about section: ${error.message}`);
    }
  };

  static updateProfile = async ({ 
    data, 
    array 
  }: { 
    data: Partial<IUserUpdateInput>;
    array?: boolean 
  }): Promise<ApiResponse<IUser>> => {
    try {
      const endpoint = '/api/v1/users';
      const response = await this.axios.put(`${endpoint}?array=${array || false}`, data);
      return { data: response.data.data, status: response.status };
    } catch (error: any) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  };

  static getProfile =  async (): Promise<IUser> => {
    try {
      const response = await this.axios.get(`/api/v1/users`);
      return response.data?.data?.payload;
    } catch (error: any) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  };

  static getUploadedFile = async (key: string): Promise<{url: string}> => {
    if (!key) throw new Error('File key is required');
    try {
      const response = await this.axios.get(`/api/v1/users/files/${key}`);
      return response.data.data?.payload;
    } catch (error: any) {
      throw new Error(`Failed to fetch uploaded file: ${error.message}`);
    }
  };

  static deleteResume = async (key: string): Promise<ApiResponse<void>> => {
    if (!key) throw new Error('Resume key is required');
    try {
      const response = await this.axios.delete(`/api/v1/users/resume/${key}`);
      return { data: undefined, status: response.status };
    } catch (error: any) {
      throw new Error(`Failed to delete resume: ${error.message}`);
    }
  };

  static getFiles = async (keys: string[]) => {
    if (!keys?.length) throw new Error('At least one file key is required');
    try {
      const response = await this.axios.post('/api/v1/users/files', { keys });
      return { data: response.data.data.data, status: response.status };
    } catch (error: any) {
      throw new Error(`Failed to fetch files: ${error.message}`);
    }
  };

  static searchUser = async (search: string): Promise<IUser[]> => {
    if (!search?.trim()) throw new Error('Search query is required');
    try {
      const response = await this.axios.get(`/api/v1/users?search=${encodeURIComponent(search)}`);
      return response.data.data.data;
    } catch (error: any) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  };

  static getCurrentProfile = async (): Promise<IUser> => {
    try {
      const response = await this.axios.get('/api/v1/users/me');
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch current user profile: ${error.message}`);
    }
  };

  static updateCurrentUserAbout = async (description: string): Promise<ApiResponse<IUser>> => {
    try {
      const response = await this.axios.put('/api/v1/users/me/about', { description });
      return { data: response.data.data, status: response.status };
    } catch (error: any) {
      throw new Error(`Failed to update about section: ${error.message}`);
    }
  };

  static updateCurrentUserProfile = async ({ 
    data, 
    array 
  }: { 
    data: Partial<IUserUpdateInput>; 
    array?: boolean 
  }): Promise<ApiResponse<IUser>> => {
    try {
      const response = await this.axios.put(`/api/v1/users/me/profile?array=${array || false}`, data);
      return { data: response.data.data, status: response.status };
    } catch (error: any) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  };

  static updateMultipleFields = async ({
    about,
    profile,
  }: {
    about?: string;
    profile?: Partial<IUserUpdateInput>;
    id?: string;
  }): Promise<ApiResponse<IUser>> => {
    try {
      const updates: Promise<any>[] = [];
      
      if (about) {
        updates.push(this.updateAbout(about));
      }
      
      if (profile) {
        updates.push(this.updateProfile({ data: profile }));
      }

      const results = await Promise.all(updates);
      return results[results.length - 1];
    } catch (error: any) {
      throw new Error(`Failed to update multiple fields: ${error.message}`);
    }
  };

  static searchUsers = async (searchQuery: string, page: number = 1, limit: number = 10) => {
    try {
      const response = await this.axios.get("/api/v1/users", {
        params: { search: searchQuery, page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  };

  static getCurrentUser = async () => {
    try {
      const response = await this.axios.get("/api/v1/users/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  };

  static getUserById = async (id: string) => {
    try {
      const response = await this.axios.get(`/api/v1/users/${id}`);
      return response.data.data.payload;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };
}
