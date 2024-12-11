
export interface Space {
    spaceId: number;
    userId: number;
    name: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SpacesData {
    userSpaces: Space[];
  }