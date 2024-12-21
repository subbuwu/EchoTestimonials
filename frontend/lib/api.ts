import axios from 'axios';
import { Space, CreateSpaceDTO, UpdateSpaceDTO } from '@/types/space';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
});

export const spacesApi = {
  getSpaces: async (accessToken: string,userId : string,email : string) => {
    const res = await api.get(`users/spaces?userId=${userId}&email=${email}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data.userSpace;
  },

  createSpace: async (space: CreateSpaceDTO, accessToken: string) => {
    const { data } = await api.post<Space>('/spaces', space, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  },

  updateSpace: async (spaceId: string, updates: UpdateSpaceDTO, accessToken: string) => {
    const { data } = await api.patch<Space>(`/spaces/${spaceId}`, updates, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  },

  deleteSpace: async (spaceId: string, accessToken: string) => {
    await api.delete(`/spaces/${spaceId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};