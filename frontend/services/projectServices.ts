import { api } from '@/lib/api';
import { Project } from '@/types/Orgs';
import { FormConfig } from '@/types/FormConfig';

export const createProject = async (
  data: { name: string; domain: string; orgId: string },
  token: string
): Promise<Project> => {
  try {
    const response = await api.post('/projects', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const getProjectById = async (id: string, token: string): Promise<Project> => {
  try {
    const response = await api.get(`/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const updateProjectFormConfig = async (
  id: string,
  formConfig: FormConfig,
  token: string
): Promise<Project> => {
  try {
    const response = await api.put(
      `/projects/${id}/form-config`,
      { formConfig },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating form config:', error);
    throw error;
  }
};
