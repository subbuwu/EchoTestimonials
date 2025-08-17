export type OrgRole = "owner" | "admin" | "member";

export interface OrgSummary {
  id: string;
  name: string;
  slug: string;
  role: OrgRole;
}


export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  role: OrgRole; // Current user's role in this org
  memberCount: number;
  projectCount: number;
}

export interface OrganizationMember {
  id: string;
  userId: string; // This is actually clerkId from users table
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: OrgRole;
  joinedAt: string; // This maps to orgMembers.createdAt
}

export interface Project {
  id: string;
  orgId: string;
  name: string;
  domain: string | null;
  embedKey: string;
  createdAt: string;
}

// API Response Types
export interface GetOrganizationResponse extends Organization {}

export interface GetOrgMembersResponse extends Array<OrganizationMember> {}

export interface GetOrgProjectsResponse extends Array<Project> {}

// Create Organization Types
export interface CreateOrganizationRequest {
  name: string;
  slug: string;
}

export interface CreateOrganizationResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}