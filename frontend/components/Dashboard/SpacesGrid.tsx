'use client'

import React, { useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useSpacesStore } from '@/store/spacesStore'
import { useSession } from 'next-auth/react'

export function SpacesGrid() {
  const { data : session } = useSession()

  const { 
    spaces, 
    isLoading, 
    error, 
    fetchSpaces, 
    // addSpace, 
    // updateExistingSpace, 
    // removeSpace 
  } = useSpacesStore()

  useEffect(() => {
    if (session?.user) {
      fetchSpaces({ 
        userId: session.user.userId ?? '', 
        email: session.user.email ?? '' ,
        accessToken : session.accessToken ?? ''
      })
    }
    // TODO : ADD REFETCH LOGIC AFTER EDITING / UPDATING / ADDING
  }, [session])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80%]">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-[#a58f8f]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 p-4 rounded-lg text-red-500">
        {error}
      </div>
    )
  }


  // Empty state
  if (!isLoading && spaces?.length === 0) {
    return (
      <div className="bg-[#1e1e1e] rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 mx-auto text-[#4a4a4a]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M4 6h16M4 10h16M4 14h16M4 18h16" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-[#FFFFFF] mb-2">
          No Zones Created Yet
        </h3>
        <p className="text-[#8a8a8a] mb-4">
          Start by creating your first zone to organize your work
        </p>
        <Button 
          variant="outline" 
          className="bg-transparent border-[#4a4a4a] text-[#FFFFFF] hover:bg-[#2e2e2e]"
        //   onClick={() => addSpace({
        //     // Provide necessary default values
        //     name: 'New Zone',
        //     slug: 'new-zone',
        //     description: 'Your new workspace',
        //     userId: session?.user.userId ?? 0
        //   })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Zone
        </Button>
      </div>
    )
  }

  // Spaces grid
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
      {spaces?.map((space) => (
        <div 
          key={space.spaceId} 
          className="bg-[#1e1e1e] hover:cursor-pointer rounded-lg p-4 border border-[#2e2e2e] hover:border-[#505050] transition-colors duration-300"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-[#FFFFFF] truncate">
              {space.name}
            </h3>
            <span className="text-xs text-[#8a8a8a] bg-[#2e2e2e] px-2 py-1 rounded-full">
              {new Date(space.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-[#8a8a8a] text-sm mb-3 line-clamp-2">
            {space.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#989898] underline">
              slug: {space.slug}
            </span>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#FFFFFF] text-sm hover:text-white hover:bg-[#2e2e2e]"
                // onClick={() => updateExistingSpace(space.spaceId, { 
                //   name: `${space.name} (Updated)` 
                // })}
              >
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 text-sm hover:text-red-500 hover:bg-red-500/10"
                // onClick={() => removeSpace(space.spaceId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div 
        className="bg-[#1e1e1e] rounded-lg p-4 border border-[#2e2e2e] border-dashed flex items-center justify-center hover:border-[#4a4a4a] transition-colors duration-300"
      >
        <Button 
          variant="ghost" 
          className="text-[#8a8a8a] hover:bg-transparent hover:scale-105 duration-150 hover:text-[#FFFFFF]"
        //   onClick={() => addSpace({
        //     name: 'New Zone',
        //     slug: 'new-zone',
        //     description: 'Your new workspace',
        //     userId: session?.user.userId ?? 0
        //   })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Zone
        </Button>
      </div>
    </div>
  )
}