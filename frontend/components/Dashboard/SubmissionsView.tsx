'use client';
import { Testimonial } from '@/types/Testimonials';
import { FormConfig } from '@/types/FormConfig';
import { Star, Calendar, Mail, Building2, Briefcase, MessageSquare, ChevronDown, ChevronUp, FileText, Eye, EyeOff } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useQueryClient } from '@tanstack/react-query';
import { toggleTestimonialPublish } from '@/services/testimonialsServices';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SubmissionsViewProps {
  testimonials: Testimonial[];
  isLoading?: boolean;
}

interface GroupedSubmissions {
  formId: string;
  formTitle: string;
  formConfig: { title?: string; description?: string; fields?: unknown[] } | null;
  submissions: Testimonial[];
}

export function SubmissionsView({ testimonials, isLoading }: SubmissionsViewProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Testimonial | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  
  // Auto-expand all groups by default
  const [initialized, setInitialized] = useState(false);
  
  // Extended type for API response that may include additional fields
  type TestimonialWithExtras = Testimonial & {
    testimonialId?: string; // May come from API for submissions
  };

  // Separate forms and submissions
  const forms = useMemo(() => {
    return testimonials.filter((t): t is Testimonial => t.isForm === true);
  }, [testimonials]);

  const submissions = useMemo(() => {
    // Simple filter: exclude ONLY items explicitly marked as isForm: true
    // Include everything else as submissions (no other filtering)
    const filtered = testimonials.filter((t): t is TestimonialWithExtras => t.isForm !== true);
    
    // Debug: Log to verify all submissions are included
    if (process.env.NODE_ENV === 'development') {
      console.log('Submissions filter:', {
        total: testimonials.length,
        filtered: filtered.length,
        items: filtered.map(s => ({
          id: s.id,
          name: s.name,
          testimonialFormId: s.testimonialFormId,
          testimonialId: s.testimonialId
        }))
      });
    }
    
    return filtered;
  }, [testimonials]);

  // Group submissions by testimonial form
  const groupedSubmissions = useMemo(() => {
    const groups: GroupedSubmissions[] = [];
    const formMap = new Map<string, TestimonialWithExtras[]>();
    const formConfigMap = new Map<string, FormConfig | null>(); // Store form configs by form ID

    // Create a map of form configs by form ID
    forms.forEach((form) => {
      formConfigMap.set(form.id, form.formConfig);
    });

    submissions.forEach((submission) => {
      // Get the form ID from testimonialFormId or testimonialId (database field name)
      // Both should point to the parent form
      let formId = submission.testimonialFormId || submission.testimonialId;
      
      // If no form ID, try to find the form by embedKey match
      if (!formId) {
        const matchingForm = forms.find(f => f.embedKey === submission.embedKey);
        if (matchingForm) {
          formId = matchingForm.id;
        } else {
          // If still no form ID, skip this submission (shouldn't happen in normal flow)
          console.warn('Submission without form ID or matching form:', submission.id);
          return;
        }
      }
      
      // Ensure the form ID exists in the map
      if (!formMap.has(formId)) {
        formMap.set(formId, []);
      }
      
      // Add submission to the group
      formMap.get(formId)!.push(submission);
    });

    // Convert map to array and create grouped structure
    formMap.forEach((subs, formId) => {
      const submission = subs[0];
      const formConfig = formConfigMap.get(formId) || submission.formConfig;
      
      groups.push({
        formId,
        formTitle: formConfig?.title || 'Untitled Form',
        formConfig: formConfig,
        submissions: subs,
      });
    });

    // Sort by most recent submission first
    groups.sort((a, b) => {
      const aLatest = Math.max(...a.submissions.map(s => new Date(s.updatedAt).getTime()));
      const bLatest = Math.max(...b.submissions.map(s => new Date(s.updatedAt).getTime()));
      return bLatest - aLatest;
    });

    return groups;
  }, [submissions, forms]);

  // Auto-expand all groups on first render
  useEffect(() => {
    if (!initialized && groupedSubmissions.length > 0) {
      const allFormIds = new Set(groupedSubmissions.map(g => g.formId));
      setExpandedGroups(allFormIds);
      setInitialized(true);
    }
  }, [groupedSubmissions, initialized]);

  const toggleGroup = (formId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(formId)) {
      newExpanded.delete(formId);
    } else {
      newExpanded.add(formId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleTogglePublish = async (e: React.MouseEvent, submission: Testimonial) => {
    e.stopPropagation(); // Prevent opening the detail modal
    setTogglingIds(prev => new Set(prev).add(submission.id));
    try {
      const token = await getToken();
      await toggleTestimonialPublish(submission.id, !submission.isPublished, token!);
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      // Update local state if this submission is selected
      if (selectedSubmission?.id === submission.id) {
        setSelectedSubmission({ ...selectedSubmission, isPublished: !submission.isPublished });
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      alert('Failed to update publish status. Please try again.');
    } finally {
      setTogglingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(submission.id);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-eerie animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h4 className="text-lg font-medium text-foreground mb-2">No Submissions Yet</h4>
        <p className="text-muted-foreground">
          Customer submissions will appear here once they start filling out your testimonial forms.
        </p>
      </div>
    );
  }

  if (groupedSubmissions.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h4 className="text-lg font-medium text-foreground mb-2">No Submissions Yet</h4>
        <p className="text-muted-foreground">
          Customer submissions will appear here once they start filling out your testimonial forms.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {groupedSubmissions.map((group) => {
          const isExpanded = expandedGroups.has(group.formId);
          const sortedSubmissions = [...group.submissions].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );

          return (
            <div
              key={group.formId}
              className="bg-eerie border border-muted/30 rounded-lg overflow-hidden"
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.formId)}
                className="w-full p-4 hover:bg-onyx transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div className="w-10 h-10 bg-blue/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{group.formTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {group.submissions.length} {group.submissions.length === 1 ? 'submission' : 'submissions'}
                      {group.formConfig?.description && (
                        <span className="ml-2">• {group.formConfig.description}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Grouped Submissions */}
              {isExpanded && (
                <div className="border-t border-muted/30 p-4 space-y-3">
                  {sortedSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className="bg-raisin border border-muted/30 rounded-lg p-5 hover:border-blue/50 hover:bg-onyx transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        {submission.imageUrl ? (
                          <img
                            src={submission.imageUrl}
                            alt={submission.name}
                            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue to-flavescent rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-eerie font-bold text-xl">
                              {submission.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {submission.name}
                                </h3>
                                {submission.rating && (
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                      <Star
                                        key={num}
                                        className={`h-4 w-4 ${
                                          num <= parseInt(submission.rating!)
                                            ? 'text-flavescent fill-flavescent'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                    <span className="text-sm text-muted-foreground ml-1">
                                      ({submission.rating}/5)
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Metadata */}
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                                {submission.email && (
                                  <div className="flex items-center gap-1.5">
                                    <Mail className="h-4 w-4" />
                                    <span>{submission.email}</span>
                                  </div>
                                )}
                                {submission.company && (
                                  <div className="flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4" />
                                    <span>{submission.company}</span>
                                  </div>
                                )}
                                {submission.role && (
                                  <div className="flex items-center gap-1.5">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{submission.role}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(submission.updatedAt)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge with Toggle */}
                            <div className="flex-shrink-0 flex items-center gap-2">
                              <button
                                onClick={(e) => handleTogglePublish(e, submission)}
                                disabled={togglingIds.has(submission.id)}
                                className={`p-2 rounded-lg border transition-colors text-muted-foreground hover:text-foreground`}
                                title={submission.isPublished ? 'Unpublish' : 'Publish'}
                              >
                                {togglingIds.has(submission.id) ? (
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : submission.isPublished ? (
                                  <p className="text-green-400">Unpublish</p>
                                ) : (
                                  <p className="text-muted-foreground">Publish</p>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Testimonial Text */}
                          <p className="text-foreground mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
                            {submission.testimonial}
                          </p>

                          {/* Custom Fields */}
                          {submission.customFields && Object.keys(submission.customFields).length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {Object.entries(submission.customFields).map(([key, field]: [string, { label?: string; value?: unknown }]) => (
                                <div
                                  key={key}
                                  className="text-xs bg-raisin px-3 py-1.5 rounded-lg border border-muted/30"
                                >
                                  <span className="text-muted-foreground font-medium">{field.label}:</span>{' '}
                                  <span className="text-foreground">{String(field.value)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Testimonial Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {/* Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-muted/30">
                {selectedSubmission.imageUrl ? (
                  <img
                    src={selectedSubmission.imageUrl}
                    alt={selectedSubmission.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue to-flavescent rounded-full flex items-center justify-center">
                    <span className="text-eerie font-bold text-2xl">
                      {selectedSubmission.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-foreground">
                      {selectedSubmission.name}
                    </h3>
                    {selectedSubmission.rating && (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <Star
                            key={num}
                            className={`h-5 w-5 ${
                              num <= parseInt(selectedSubmission.rating!)
                                ? 'text-flavescent fill-flavescent'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {selectedSubmission.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedSubmission.email}</span>
                      </div>
                    )}
                    {selectedSubmission.company && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{selectedSubmission.company}</span>
                      </div>
                    )}
                    {selectedSubmission.role && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{selectedSubmission.role}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!selectedSubmission) return;
                      setTogglingIds(prev => new Set(prev).add(selectedSubmission.id));
                      try {
                        const token = await getToken();
                        const updated = await toggleTestimonialPublish(
                          selectedSubmission.id,
                          !selectedSubmission.isPublished,
                          token!
                        );
                        setSelectedSubmission(updated);
                        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
                      } catch (error) {
                        console.error('Failed to toggle publish status:', error);
                        alert('Failed to update publish status. Please try again.');
                      } finally {
                        setTogglingIds(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(selectedSubmission.id);
                          return newSet;
                        });
                      }
                    }}
                    disabled={!selectedSubmission || togglingIds.has(selectedSubmission.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      selectedSubmission?.isPublished
                        ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={selectedSubmission?.isPublished ? 'Mark as draft (hide from public)' : 'Approve and publish (show publicly)'}
                  >
                    {selectedSubmission && togglingIds.has(selectedSubmission.id) ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : selectedSubmission?.isPublished ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Approved</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Draft</span>
                      </>
                    )}
                  </button>
                  {selectedSubmission.isPublished ? (
                    <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                      Published
                    </span>
                  ) : (
                    <span className="text-xs bg-muted/20 text-muted-foreground px-3 py-1 rounded-full border border-muted/30">
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Testimonial Text */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Testimonial
                </h4>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedSubmission.testimonial}
                </p>
              </div>

              {/* Custom Fields */}
              {selectedSubmission.customFields && Object.keys(selectedSubmission.customFields).length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(selectedSubmission.customFields).map(([key, field]: [string, { label?: string; value?: unknown }]) => (
                      <div
                        key={key}
                        className="bg-eerie border border-muted/30 rounded-lg p-3"
                      >
                        <div className="text-xs text-muted-foreground mb-1">{field.label}</div>
                        <div className="text-foreground font-medium">{String(field.value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t border-muted/30">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">Submitted</div>
                    <div className="text-foreground font-medium">
                      {formatDate(selectedSubmission.updatedAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Form</div>
                    <div className="text-foreground font-medium">
                      {selectedSubmission.formConfig?.title || 'Untitled Form'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

