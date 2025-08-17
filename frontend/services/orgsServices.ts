import { api } from "@/lib/api";
import { Organization, OrganizationMember, OrgSummary, Project } from "@/types/Orgs";


export const getOrgs = async (token: string) : Promise<OrgSummary[]> => {
    try {
        const response = await api.get("/orgs",{
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    });

    return response.data;
    } catch (error) {
        console.error("Error fetching organizations:", error);
        throw error;
    }
}


// Get organization by slug
export const getOrganizationBySlug = async (slug: string, token: string): Promise<Organization> => {
  try {
    const response = await api.get(`/orgs/${slug}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
};

// Get organization members
export const getOrgMembers = async (slug: string, token: string): Promise<OrganizationMember[]> => {
  try {
    const response = await api.get(`/orgs/${slug}/members`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching org members:", error);
    throw error;
  }
};

// Get organization projects
export const getOrgProjects = async (slug: string, token: string): Promise<Project[]> => {
  try {
    const response = await api.get(`/orgs/${slug}/projects`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching org projects:", error);
    throw error;
  }
};

// Create new organization
export const createOrganization = async (data: { name: string; slug: string }, token: string): Promise<Organization> => {
  try {
    const response = await api.post("/orgs", data, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
};