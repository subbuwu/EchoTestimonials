'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { getProjectById } from '@/services/projectServices';
import { Project } from '@/types/Orgs';
import { getTestimonialsByProjectId, deleteTestimonial, toggleTestimonialPublish } from '@/services/testimonialsServices';
import { Testimonial } from '@/types/Testimonials';
import { TestimonialFormModal } from '@/components/Dashboard/TestimonialFormModal';
import { FormPreviewModal } from '@/components/Dashboard/FormPreviewModal';
import { SubmissionsView } from '@/components/Dashboard/SubmissionsView';
import { FormConfig } from '@/types/FormConfig';
import { useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { formatDate, getEmbedUrl } from '@/lib/utils';
import {
  Folder,
  Globe,
  Calendar,
  Copy,
  ExternalLink,
  ChevronRight,
  Settings,
  CheckCircle2,
  Plus,
  MessageSquare,
  Trash2,
  Edit,
  FileText,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testimonialFormModal, setTestimonialFormModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | undefined>(undefined);
  const [previewConfig, setPreviewConfig] = useState<FormConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewEmbedKey, setPreviewEmbedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'forms' | 'submissions'>('forms');
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: async () => {
      const token = await getToken();
      return getProjectById(id, token!);
    },
    enabled: !!id,
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ['testimonials', id],
    queryFn: async () => {
      const token = await getToken();
      return getTestimonialsByProjectId(id, token!);
    },
    enabled: !!id,
  });

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial form? This action cannot be undone.')) {
      return;
    }

    try {
      const token = await getToken();
      await deleteTestimonial(testimonialId, token!);
      queryClient.invalidateQueries({ queryKey: ['testimonials', id] });
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      alert('Failed to delete testimonial. Please try again.');
    }
  };

  const handleTogglePublish = async (testimonial: Testimonial) => {
    setTogglingIds(prev => new Set(prev).add(testimonial.id));
    try {
      const token = await getToken();
      await toggleTestimonialPublish(testimonial.id, !testimonial.isPublished, token!);
      queryClient.invalidateQueries({ queryKey: ['testimonials', id] });
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      alert('Failed to update publish status. Please try again.');
    } finally {
      setTogglingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(testimonial.id);
        return newSet;
      });
    }
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialFormModal(true);
  };

  const handleCreateTestimonial = () => {
    setEditingTestimonial(undefined);
    setTestimonialFormModal(true);
  };

  const handleCloseModal = () => {
    setTestimonialFormModal(false);
    setEditingTestimonial(undefined);
  };


  const getEmbedCode = (embedKey: string) => {
    const url = getEmbedUrl(embedKey);
    return `<iframe src="${url}" width="100%" height="600" frameborder="0" style="border: none;"></iframe>`;
  };

  if (isLoading) {
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

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Project not found</h3>
        <p className="text-muted-foreground">
          The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <TestimonialFormModal
        open={testimonialFormModal}
        setOpen={handleCloseModal}
        projectId={id}
        testimonial={editingTestimonial}
      />
      {previewConfig && previewEmbedKey && (
        <FormPreviewModal
          open={showPreview}
          onClose={() => {
            setShowPreview(false);
            setPreviewConfig(null);
            setPreviewEmbedKey(null);
          }}
          config={previewConfig}
        />
      )}

      {/* Breadcrumb */}
      <div className="p-3 bg-eerie border-b border-muted/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className="cursor-pointer hover:text-foreground"
            onClick={() => router.push('/dashboard')}
          >
            Organizations
          </span>
          {project.orgSlug && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span
                className="cursor-pointer hover:text-foreground"
                onClick={() => router.push(`/dashboard/orgs/${project.orgSlug}`)}
              >
                {project.orgName || 'Organization'}
              </span>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{project.name}</span>
        </div>
      </div>

      {/* Project Header */}
      <div className="bg-raisin border border-muted/30 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue/20 rounded-xl flex items-center justify-center">
              <Folder className="h-8 w-8 text-blue" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                {project.domain && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>{project.domain}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          <button className="bg-eerie hover:bg-onyx border border-muted/30 rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-raisin border border-muted/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue" />
              <h2 className="text-xl font-semibold text-foreground">Testimonials</h2>
            </div>
            
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-eerie rounded-lg p-1">
              <button
                onClick={() => setActiveTab('forms')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'forms'
                    ? 'bg-raisin text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Forms ({testimonials?.length || 0})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'submissions'
                    ? 'bg-raisin text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Submissions ({testimonials?.filter(t => t.name && t.name !== 'Untitled Testimonial' && t.testimonial).length || 0})
                </div>
              </button>
            </div>
          </div>
          
          {activeTab === 'forms' && (
            <button
              onClick={handleCreateTestimonial}
              className="bg-flavescent text-eerie px-4 py-2 rounded-lg font-medium hover:bg-flavescent/90 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Testimonial Form
            </button>
          )}
        </div>

        {activeTab === 'submissions' ? (
          <SubmissionsView testimonials={testimonials || []} isLoading={testimonialsLoading} />
        ) : testimonialsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-eerie animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {testimonials.map((testimonial) => {
              const embedUrl = getEmbedUrl(testimonial.embedKey);
              const embedCode = getEmbedCode(testimonial.embedKey);
              
              return (
                <div
                  key={testimonial.id}
                  className="bg-eerie border border-muted/30 rounded-lg p-5 hover:border-blue/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">
                          {testimonial.formConfig?.title || 'Untitled Form'}
                        </h3>
                        {testimonial.isPublished ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                            Published
                          </span>
                        ) : (
                          <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded border border-muted/30">
                            Draft
                          </span>
                        )}
                      </div>
                      {testimonial.formConfig?.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {testimonial.formConfig.description}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground mb-3">
                        {testimonial.formConfig?.fields?.length || 0} fields • Created {formatDate(testimonial.createdAt)}
                      </div>
                      
                      {/* Submission indicator */}
                      {testimonial.name && testimonial.name !== 'Untitled Testimonial' && testimonial.testimonial && (
                        <div className="mt-3 pt-3 border-t border-muted/30">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Has submission • Updated {formatDate(testimonial.updatedAt)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(testimonial)}
                        disabled={togglingIds.has(testimonial.id)}
                        className={`p-2 rounded-lg border transition-colors ${
                          testimonial.isPublished
                            ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                            : 'bg-muted/20 border-muted/30 text-muted-foreground hover:bg-muted/30'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={testimonial.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {togglingIds.has(testimonial.id) ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : testimonial.isPublished ? (
                          <p className="text-green-400">Unpublish</p>
                        ) : (
                          <p className="text-muted-foreground">Publish</p>
                        )}
                      </button>
                      <button
                        onClick={() => handleEditTestimonial(testimonial)}
                        className="p-2 bg-raisin hover:bg-onyx border border-muted/30 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit Form"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        className="p-2 bg-raisin hover:bg-red-500/20 border border-muted/30 rounded-lg text-muted-foreground hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Embed Code Section */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Embed URL</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-raisin border border-muted/30 rounded px-3 py-2">
                          <code className="text-xs text-foreground font-mono break-all">{embedUrl}</code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(embedUrl, `url-${testimonial.id}`)}
                          className="p-2 bg-raisin hover:bg-onyx border border-muted/30 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          title="Copy URL"
                        >
                          {copiedId === `url-${testimonial.id}` ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Embed Code</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-raisin border border-muted/30 rounded px-3 py-2 max-h-20 overflow-y-auto">
                          <code className="text-xs text-foreground font-mono break-all">{embedCode}</code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(embedCode, `code-${testimonial.id}`)}
                          className="p-2 bg-raisin hover:bg-onyx border border-muted/30 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          title="Copy Code"
                        >
                          {copiedId === `code-${testimonial.id}` ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-muted/30">
                    <a
                      href={embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-raisin hover:bg-onyx border border-muted/30 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Preview
                    </a>
                    <button
                      onClick={() => handleEditTestimonial(testimonial)}
                      className="flex-1 bg-raisin hover:bg-onyx border border-muted/30 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Form
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No testimonial forms yet</h4>
            <p className="text-muted-foreground mb-4">
              Create your first testimonial form to start collecting customer feedback
            </p>
            <button
              onClick={handleCreateTestimonial}
              className="bg-flavescent text-eerie px-4 py-2 rounded-lg font-medium hover:bg-flavescent/90 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create Testimonial Form
            </button>
          </div>
        )}
      </div>

      {/* Project Info Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-raisin border border-muted/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Project Information</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Project ID</div>
                <div className="text-sm text-foreground font-mono bg-eerie rounded px-3 py-2">
                  {project.id}
                </div>
              </div>
              {project.domain && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Domain</div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-foreground bg-eerie rounded px-3 py-2 flex-1">
                      {project.domain}
                    </div>
                    <a
                      href={project.domain.startsWith('http') ? project.domain : `https://${project.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-eerie hover:bg-onyx border border-muted/30 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Created</div>
                <div className="text-sm text-foreground">{formatDate(project.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-raisin border border-muted/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-eerie rounded-lg">
                <div className="text-2xl font-bold text-flavescent">{testimonials?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Testimonial Forms</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-raisin border border-muted/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleCreateTestimonial}
                className="w-full bg-eerie hover:bg-onyx border border-muted/30 rounded-lg p-3 text-left transition-colors flex items-center gap-3"
              >
                <Plus className="h-5 w-5 text-blue" />
                <div>
                  <div className="font-medium text-foreground">Create Form</div>
                  <div className="text-sm text-muted-foreground">New testimonial form</div>
                </div>
              </button>
              <button
                onClick={() => router.push(`/dashboard/orgs/${project.orgSlug}`)}
                className="w-full bg-eerie hover:bg-onyx border border-muted/30 rounded-lg p-3 text-left transition-colors flex items-center gap-3"
              >
                <Folder className="h-5 w-5 text-flavescent" />
                <div>
                  <div className="font-medium text-foreground">View Organization</div>
                  <div className="text-sm text-muted-foreground">Go to {project.orgName}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
