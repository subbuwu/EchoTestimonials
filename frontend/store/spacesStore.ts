// stores/spacesStore.ts
import { create } from 'zustand'
import { Space } from '@/types/space'
import { getUserDashboradSpaces } from '@/actions/getUserDashboradSpaces'
// import { createSpace, updateSpace, deleteSpace } from '@/actions/spaceActions' // Assume these exist

type SpacesStoreState = {
  spaces: Space[] | null
  isLoading: boolean
  error: string | null
  fetchSpaces: (params: { userId: string, email: string, accessToken: string }) => Promise<void>
//   addSpace: (spaceData: Omit<Space, 'spaceId' | 'createdAt' | 'updatedAt'>) => Promise<void>
//   updateExistingSpace: (spaceId: number, updates: Partial<Space>) => Promise<void>
//   removeSpace: (spaceId: number) => Promise<void>
}

export const useSpacesStore = create<SpacesStoreState>((set, get) => ({
  spaces: null,
  isLoading: false,
  error: null,

  fetchSpaces: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const data = await getUserDashboradSpaces(params)
      set({ spaces: data.userSpace, isLoading: false })
    } catch (error) {
      console.log(error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch spaces', 
        isLoading: false 
      })
    }
  }

}))