"use client";
import { useQuery } from "@tanstack/react-query";
import { getOrgs } from "@/services/orgsServices";
import { useAuth } from "@clerk/nextjs";
import { useState, useMemo } from "react";
import { OrgSummary } from "@/types/Orgs";
import { CreateOrganizationModal } from "@/components/Dashboard/CreateOrganizationModal";
import { 
  Building2, 
  Users, 
  Crown, 
  Shield, 
  User,
  Plus,
  Search,
  Filter,
  Folder,
  Grid3X3,
  List,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'owned' | 'member';

export default function DashboardPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [selectedOrg] = useState<OrgSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [createOrgModal, setCreateOrgModal] = useState(false);

  const { data: orgs, isLoading, error } = useQuery({
    queryKey: ["orgs"],
    queryFn: async () => {
      const token = await getToken();
      const orgData = await getOrgs(token!);
      return orgData;
    }
  });

  // Enhanced filtering and statistics
  const statistics = useMemo(() => {
    if (!orgs) return null;
    
    const owned = orgs.filter(org => org.role === 'owner').length;
    const admin = orgs.filter(org => org.role === 'admin').length;
    const member = orgs.filter(org => org.role === 'member').length;
    const totalMembers = orgs.reduce((sum, org) => sum + (org.memberCount || 0), 0);
    const totalProjects = orgs.reduce((sum, org) => sum + (org.projectCount || 0), 0);

    return { owned, admin, member, totalMembers, totalProjects };
  }, [orgs]);

  const filterItems = useMemo(() => {
    if (!orgs) return [];
    
    return [
      { 
        id: "all" as FilterType, 
        label: "All Organizations", 
        icon: Folder, 
        count: orgs.length,
        color: "text-blue-400"
      },
      { 
        id: "owned" as FilterType, 
        label: "Owned by Me", 
        icon: Crown, 
        count: orgs.filter(org => org.role === 'owner').length,
        color: "text-yellow-400"
      },
      { 
        id: "member" as FilterType, 
        label: "Member", 
        icon: User, 
        count: orgs.filter(org => org.role === 'member').length,
        color: "text-gray-400"
      },
    ];
  }, [orgs]);

  const filteredOrgs = useMemo(() => {
    if (!orgs) return [];
    
    return orgs.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeFilter === "all") return matchesSearch;
      if (activeFilter === "owned") return matchesSearch && org.role === 'owner';
      if (activeFilter === "member") return matchesSearch && org.role === 'member';
      
      return matchesSearch;
    });
  }, [orgs, searchTerm, activeFilter]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-400" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'admin':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-950">
        {/* Left Panel Skeleton */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-800 rounded w-32"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-48"></div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <div className="text-red-400 text-xl font-semibold mb-2">Error fetching organizations</div>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <CreateOrganizationModal open={createOrgModal} setOpen={setCreateOrgModal} />
      {/* Enhanced Left Navigation Panel */}
      <div className="w-80 bg-eerie  border-r border-gray-800 flex flex-col">
        {/* Panel Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Organizations</h2>
            <button 
              onClick={() => setCreateOrgModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {/* Search with enhanced styling */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 p-3 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">{statistics.totalProjects}</div>
                <div className="text-xs text-gray-400">Projects</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl">
                <div className="text-2xl font-bold text-green-400">{statistics.totalMembers}</div>
                <div className="text-xs text-gray-400">Members</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400">{statistics.owned}</div>
                <div className="text-xs text-gray-400">Owned</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl">
                <div className="text-2xl font-bold text-purple-400">{statistics.admin}</div>
                <div className="text-xs text-gray-400">Admin</div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Filter Categories */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {filterItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                  activeFilter === item.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg'
                    : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-4 w-4 ${activeFilter === item.id ? item.color : ''} group-hover:scale-110 transition-transform`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  activeFilter === item.id 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <div className="p-6 bg-eerie border-b border-gray-800">
          <div className="flex items-center justify-between">
            {/* <div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <span className="text-base">Organizations</span>
                {activeFilter !== 'all' && (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span className="capitalize text-blue-400 text">{filterItems.find(f => f.id === activeFilter)?.label}</span>
                  </>
                )}
              </div>
            </div> */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <button 
                onClick={() => setCreateOrgModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                New Organization
              </button>
            </div>
          </div>
        </div>

        {/* Organizations Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-eerie">
          {filteredOrgs.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "space-y-3"
            }>
              {filteredOrgs.map((org) => (
                <div
                  key={org.id}
                  onClick={() => router.push(`/dashboard/orgs/${org.slug}`)}
                  className={`
                    group relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-5 cursor-pointer 
                    transition-all duration-200 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5
                    ${selectedOrg?.id === org.id 
                      ? 'border-blue-500/50 ring-1 ring-blue-500/20' 
                      : ''
                    }
                    ${viewMode === 'list' ? 'flex items-center gap-4' : ''}
                  `}
                >
                  {/* Organization Icon */}
                  <div className={`flex items-start ${viewMode === 'list' ? 'gap-4' : 'gap-3 mb-3'}`}>
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      {org.role === 'owner' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Crown className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Organization Info */}
                    <div className={`flex-1 min-w-0 ${viewMode === 'list' ? '' : ''}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-semibold text-white truncate">
                          {org.name}
                        </h3>
                        {viewMode === 'grid' && (
                          <div className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 flex-shrink-0 ${getRoleColor(org.role)}`}>
                            {getRoleIcon(org.role)}
                            <span className="capitalize">{org.role}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span>@{org.slug}</span>
                        {org.createdAt && (
                          <span className="text-gray-600">•</span>
                        )}
                        {org.createdAt && (
                          <span className="text-gray-500">{formatDate(org.createdAt)}</span>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className={`flex items-center gap-4 text-xs text-gray-400 ${viewMode === 'list' ? '' : 'mt-2'}`}>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          <span>{org.memberCount ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Folder className="h-3.5 w-3.5" />
                          <span>{org.projectCount ?? 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* List view role badge */}
                    {viewMode === 'list' && (
                      <div className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 flex-shrink-0 ${getRoleColor(org.role)}`}>
                        {getRoleIcon(org.role)}
                        <span className="capitalize">{org.role}</span>
                      </div>
                    )}
                  </div>

                  {/* Hover arrow indicator */}
                  {viewMode === 'grid' && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto">
                  <Building2 className="h-12 w-12 text-gray-600" />
                </div>
                <div className="absolute top-0 right-8 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Plus className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {searchTerm ? 'No organizations found' : 'No organizations yet'}
              </h3>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.' 
                  : 'Create your first organization to start collaborating with your team and managing projects.'
                }
              </p>
              {!searchTerm && (
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg">
                  Create Organization
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}