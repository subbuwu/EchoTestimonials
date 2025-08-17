"use client";
import { useQuery } from "@tanstack/react-query";
import { getOrgs } from "@/services/orgsServices";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { OrgSummary } from "@/types/Orgs";
import { 
  Building2, 
  Users, 
  Settings, 
  Crown, 
  Shield, 
  User,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Folder,
  Star,
  Clock,
  Archive
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [selectedOrg, setSelectedOrg] = useState<OrgSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: orgs, isLoading, error } = useQuery({
    queryKey: ["orgs"],
    queryFn: async () => {
      const token = await getToken();
      return getOrgs(token!);
    }
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-flavescent" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-flavescent/20 text-flavescent border-flavescent/30';
      case 'admin':
        return 'bg-blue/20 text-blue border-blue/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const filterItems = [
    { id: "all", label: "All Organizations", icon: Folder, count: orgs?.length || 0 },
  ];

  const filteredOrgs = orgs?.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === "all") return matchesSearch;
    // Add other filter logic here when implemented
    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex h-full">
        {/* Left Panel Skeleton */}
        <div className="w-80 bg-raisin border-r border-muted/30 p-6 min-h-screen">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-onyx rounded w-32"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-onyx rounded"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-raisin rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-raisin rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-pink mb-2">Error fetching organizations</div>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Navigation Panel */}
      <div className="w-80 bg-eerie border-r border-muted/30 flex flex-col min-h-screen">
        {/* Panel Header */}
        <div className="p-6 border-b border-muted/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Organizations</h2>
            <button className="bg-flavescent text-eerie p-2 rounded-lg hover:bg-flavescent/90 transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-eerie border border-muted/30 rounded-lg pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue/50"
            />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="p-6 flex-1">
          <div className="space-y-2 mb-6">
            {filterItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  activeFilter === item.id
                    ? 'bg-blue/20 text-blue border border-blue/30'
                    : 'hover:bg-eerie text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-xs bg-muted/30 px-2 py-1 rounded-full">
                  {item.count}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-3 bg-eerie border-b border-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>Organizations</span>
                {activeFilter && (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span className="capitalize">{activeFilter}</span>
                  </>
                )}
              </div>
            </div>
            {/* <div className="flex items-center gap-3">
              <button className="bg-eerie border border-muted/30 rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button className="bg-flavescent text-eerie px-4 py-2 rounded-lg font-medium hover:bg-flavescent/90 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Organization
              </button>
            </div> */}
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredOrgs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOrgs.map((org) => (
                <div
                  key={org.id}
                  onClick={() => router.push(`/dashboard/orgs/${org.slug}`)}
                  className={`
                    bg-card border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
                    ${selectedOrg?.id === org.id 
                      ? 'border-blue ring-2 ring-blue/20 shadow-lg' 
                      : 'border-muted/30 hover:border-muted/50'
                    }
                  `}
                >
                  {/* Organization Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue to-flavescent rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-eerie" />
                    </div>
                    <div className={`px-2 py-1 rounded-lg border text-xs font-medium flex items-center gap-1 ${getRoleColor(org.role)}`}>
                      {getRoleIcon(org.role)}
                      {org.role}
                    </div>
                  </div>

                  {/* Organization Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                      {org.name}
                    </h3>
                    <p className="text-muted-foreground text-sm truncate">
                      @{org.slug}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  {/* <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>12 members</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Folder className="h-4 w-4" />
                      <span>5 projects</span>
                    </div>
                  </div> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No organizations found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first organization to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

     
    </div>
  );
}