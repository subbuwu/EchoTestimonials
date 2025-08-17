'use client'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { 
  getOrganizationBySlug, 
  getOrgMembers, 
  getOrgProjects 
} from "@/services/orgsServices";
import { 
  Organization,
  OrganizationMember,
  Project,
  OrgRole
} from "@/types/Orgs";

import { 
  Building2, 
  Users, 
  Folder, 
  Settings, 
  Crown, 
  Shield, 
  User,
  Plus,
  Search,
  MoreHorizontal,
  Calendar,
  Globe,
  Lock,
  ChevronRight,
  Activity,
  UserPlus,
  Copy,
  ExternalLink
} from "lucide-react";

const OrgIdPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Queries
  const { data: org, isLoading: orgLoading, error: orgError } = useQuery<Organization>({
    queryKey: ["org", slug],
    queryFn: async () => {
      const token = await getToken();
      return getOrganizationBySlug(slug, token!);
    },
    enabled: !!slug
  });

  const { data: members, isLoading: membersLoading } = useQuery<OrganizationMember[]>({
    queryKey: ["org-members", slug],
    queryFn: async () => {
      const token = await getToken();
      return getOrgMembers(slug, token!);
    },
    enabled: !!slug && (activeTab === 'members' || activeTab === 'overview')
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["org-projects", slug],
    queryFn: async () => {
      const token = await getToken();
      return getOrgProjects(slug, token!);
    },
    enabled: !!slug && (activeTab === 'projects' || activeTab === 'overview')
  });

  const getRoleIcon = (role: OrgRole) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-flavescent" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
  }
  };

  const getRoleColor = (role: OrgRole) => {
    switch (role) {
      case 'owner':
        return 'bg-flavescent/20 text-flavescent border-flavescent/30';
      case 'admin':
        return 'bg-blue/20 text-blue border-blue/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (orgLoading) {
    return (
      <div className="animate-pulse space-y-6 p-6">
        <div className="h-32 bg-raisin rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-raisin rounded-xl"></div>
          <div className="h-96 bg-raisin rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (orgError || !org) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Organization not found
        </h3>
        <p className="text-muted-foreground">
          The organization you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    );
  }

  // const copyToClipboard = async (text: string) => {
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     // You could add a toast notification here
  //   } catch (err) {
  //     console.error('Failed to copy text: ', err);
  //   }
  // };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-raisin border border-muted/30 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* <div className="w-16 h-16 bg-gradient-to-br from-blue to-flavescent rounded-xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-eerie" />
            </div> */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{org.name}</h1>
                <div className={`px-2 py-1 rounded-lg border text-xs font-medium flex items-center gap-1 ${getRoleColor(org.role)}`}>
                  {getRoleIcon(org.role)}
                  {org.role}
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                {/* <div className="flex items-center gap-1">
                  <span>@{org.slug}</span>
                  <button 
                    onClick={() => copyToClipboard(org.slug)}
                    className="ml-0.5 hover:text-foreground"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div> */}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDate(org.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            <button className="bg-eerie hover:bg-onyx border border-muted/30 rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {(org.role === 'owner' || org.role === 'admin') && (
              <button className="bg-flavescent text-eerie px-4 py-2 rounded-lg font-medium hover:bg-flavescent/90 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Invite Members
              </button>
            )}
          </div> */}
        </div>

        {/* Stats
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-muted/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-flavescent">{org.projectCount}</div>
            <div className="text-muted-foreground text-sm">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue">{org.memberCount}</div>
            <div className="text-muted-foreground text-sm">Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-peach">24</div>
            <div className="text-muted-foreground text-sm">Active Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink">3</div>
            <div className="text-muted-foreground text-sm">Issues</div>
          </div>
        </div> */}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-muted/30">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue text-blue'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Projects */}
              <div className="bg-raisin border border-muted/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Recent Projects</h3>
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className="text-blue hover:text-blue/80 text-sm flex items-center gap-1"
                  >
                    View all <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                {projectsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-eerie animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects && projects.length > 0 ? (
                      projects.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex items-center gap-3 p-3 bg-eerie rounded-lg hover:bg-onyx transition-colors cursor-pointer">
                          <div className="w-10 h-10 bg-blue/20 rounded-lg flex items-center justify-center">
                            <Folder className="h-5 w-5 text-blue" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{project.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {project.domain && (
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {project.domain}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(project.createdAt)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-foreground mb-2">No projects yet</h4>
                        <p className="text-muted-foreground mb-4">Create your first project to get started</p>
                        {(org.role === 'owner' || org.role === 'admin') && (
                          <button className="bg-flavescent text-eerie px-4 py-2 rounded-lg font-medium hover:bg-flavescent/90 transition-colors flex items-center gap-2 mx-auto">
                            <Plus className="h-4 w-4" />
                            Create Project
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-raisin border border-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {members && members.slice(0, 3).map((member, index) => (
                    <div key={member.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                        <UserPlus className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="text-foreground">
                          {member.firstName && member.lastName 
                            ? `${member.firstName} ${member.lastName}` 
                            : member.email
                          } joined the organization
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(member.joinedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {projects && projects.slice(0, 2).map((project) => (
                    <div key={project.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue/20 rounded-full flex items-center justify-center mt-1">
                        <Folder className="h-4 w-4 text-blue" />
                      </div>
                      <div>
                        <div className="text-foreground">New project "{project.name}" created</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(project.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!members || members.length === 0) && (!projects || projects.length === 0) && (
                    <div className="text-center py-8">
                      <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-raisin border border-muted/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Projects</h3>
                {(org.role === 'owner' || org.role === 'admin') && (
                  <button className="bg-flavescent text-eerie px-4 py-2 rounded-lg font-medium hover:bg-flavescent/90 transition-colors flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Project
                  </button>
                )}
              </div>
              
              {projectsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-eerie animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects && projects.length > 0 ? (
                    projects.map((project) => (
                      <div key={project.id} className="bg-eerie border border-muted/30 rounded-lg p-4 hover:bg-onyx transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-blue/20 rounded-lg flex items-center justify-center">
                            <Folder className="h-5 w-5 text-blue" />
                          </div>
                          <button className="text-muted-foreground hover:text-foreground">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">{project.name}</h4>
                        {project.domain && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <Globe className="h-3 w-3" />
                            {project.domain}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Created {formatDate(project.createdAt)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-foreground mb-2">No projects yet</h4>
                      <p className="text-muted-foreground mb-4">Create your first project to get started</p>
                      {(org.role === 'owner' || org.role === 'admin') && (
                        <button className="bg-flavescent text-eerie px-4 py-2 rounded-lg font-medium hover:bg-flavescent/90 transition-colors flex items-center gap-2 mx-auto">
                          <Plus className="h-4 w-4" />
                          Create Project
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="bg-raisin border border-muted/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Members</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="bg-eerie border border-muted/30 rounded-lg pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue/50"
                    />
                  </div>
                  {(org.role === 'owner' || org.role === 'admin') && (
                    <button className="bg-flavescent text-eerie px-4 py-2 rounded-lg font-medium hover:bg-flavescent/90 transition-colors flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Invite
                    </button>
                  )}
                </div>
              </div>

              {membersLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-eerie animate-pulse rounded-lg">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-muted rounded w-32"></div>
                        <div className="h-3 bg-muted rounded w-48"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {members && members.length > 0 ? (
                    members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-eerie hover:bg-onyx rounded-lg transition-colors">
                        <div className="relative">
                          {member.imageUrl ? (
                            <img 
                              src={member.imageUrl} 
                              alt={`${member.firstName} ${member.lastName}`}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue to-flavescent rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-eerie" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {member.firstName && member.lastName 
                              ? `${member.firstName} ${member.lastName}` 
                              : member.email
                            }
                          </div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-lg border text-xs font-medium flex items-center gap-1 ${getRoleColor(member.role)}`}>
                            {getRoleIcon(member.role)}
                            {member.role}
                          </div>
                          {(org.role === 'owner' || (org.role === 'admin' && member.role !== 'owner')) && (
                            <button className="text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-foreground mb-2">No members found</h4>
                      <p className="text-muted-foreground">Invite team members to collaborate</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* General Settings */}
              <div className="bg-raisin border border-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      defaultValue={org.name}
                      className="w-full bg-eerie border border-muted/30 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50"
                      disabled={org.role !== 'owner'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      defaultValue={org.slug}
                      className="w-full bg-eerie border border-muted/30 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50"
                      disabled={org.role !== 'owner'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add a description for your organization..."
                      className="w-full bg-eerie border border-muted/30 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50 resize-none"
                      disabled={org.role !== 'owner'}
                    />
                  </div>
                  {org.role === 'owner' && (
                    <button className="bg-flavescent text-eerie px-4 py-2 rounded-lg font-medium hover:bg-flavescent/90 transition-colors">
                      Save Changes
                    </button>
                  )}
                </div>
              </div>

              {/* Access & Permissions */}
              <div className="bg-raisin border border-muted/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Access & Permissions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Public Organization</div>
                      <div className="text-sm text-muted-foreground">Allow anyone to view this organization</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" disabled={org.role !== 'owner'} />
                      <div className="w-11 h-6 bg-muted/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Allow Member Invites</div>
                      <div className="text-sm text-muted-foreground">Let members invite others to the organization</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" disabled={org.role !== 'owner'} />
                      <div className="w-11 h-6 bg-muted/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              {org.role === 'owner' && (
                <div className="bg-raisin border border-pink/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-pink mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-pink/10 border border-pink/30 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">Delete Organization</div>
                        <div className="text-sm text-muted-foreground">This action cannot be undone</div>
                      </div>
                      <button className="bg-pink text-white px-4 py-2 rounded-lg font-medium hover:bg-pink/90 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-raisin border border-muted/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {(org.role === 'owner' || org.role === 'admin') && (
                <>
                  <button className="w-full bg-eerie hover:bg-onyx border border-muted/30 rounded-lg p-3 text-left transition-colors flex items-center gap-3">
                    <Folder className="h-5 w-5 text-blue" />
                    <div>
                      <div className="font-medium text-foreground">New Project</div>
                      <div className="text-sm text-muted-foreground">Create a new project</div>
                    </div>
                  </button>
                  <button className="w-full bg-eerie hover:bg-onyx border border-muted/30 rounded-lg p-3 text-left transition-colors flex items-center gap-3">
                    <UserPlus className="h-5 w-5 text-peach" />
                    <div>
                      <div className="font-medium text-foreground">Invite Member</div>
                      <div className="text-sm text-muted-foreground">Add team members</div>
                    </div>
                  </button>
                </>
              )}
              <button 
                onClick={() => setActiveTab('settings')}
                className="w-full bg-eerie hover:bg-onyx border border-muted/30 rounded-lg p-3 text-left transition-colors flex items-center gap-3"
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Organization Settings</div>
                  <div className="text-sm text-muted-foreground">Manage preferences</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Members */}
          <div className="bg-raisin border border-muted/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Members</h3>
              <button 
                onClick={() => setActiveTab('members')}
                className="text-blue hover:text-blue/80 text-sm"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {members && members.length > 0 ? (
                members.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    {member.imageUrl ? (
                      <img 
                        src={member.imageUrl} 
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue to-flavescent rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-eerie" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {member.firstName && member.lastName 
                          ? `${member.firstName} ${member.lastName}` 
                          : member.email
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Users className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No members yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Organization Info */}
          <div className="bg-raisin border border-muted/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Organization Info</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Organization ID</div>
                <div className="text-sm text-foreground font-mono bg-eerie rounded px-2 py-1 mt-1">
                  {org.id}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created</div>
                <div className="text-sm text-foreground">
                  {formatDate(org.createdAt)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Your Role</div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getRoleColor(org.role)}`}>
                  {getRoleIcon(org.role)}
                  {org.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgIdPage;