export interface Space {
  spaceId: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
}

export interface CreateSpaceDTO {
  name: string;
  description: string;
  slug: string;
}

export interface UpdateSpaceDTO {
  name?: string;
  description?: string;
  slug?: string;
}