"use client"
import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { 
  Type, 
  MessageSquare, 
  Star, 
  SmilePlus,
  List, 
  Plus, 
  GripHorizontal,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import type { 
  Question, 
  FormData, 
  QuestionType, 
  QuestionTypeDefinition,
  DraggableQuestionProps,
  DroppableAreaProps, 
  FeedbackForm
} from '@/types/form';

const questionTypes: QuestionTypeDefinition[] = [
  { 
    id: 'text', 
    label: 'Short Text', 
    icon: Type, 
    helper: 'Best for brief responses like name or role' 
  },
  { 
    id: 'textarea', 
    label: 'Long Text', 
    icon: MessageSquare, 
    helper: 'Perfect for detailed testimonials' 
  },
  { 
    id: 'rating', 
    label: 'Rating', 
    icon: Star, 
    helper: 'Collect satisfaction scores' 
  },
  { 
    id: 'multiple_choice', 
    label: 'Multiple Choice', 
    icon: SmilePlus, 
    helper: 'Get specific feedback with options' 
  },
  { 
    id: 'dropdown', 
    label: 'Dropdown', 
    icon: List, 
    helper: 'Organized selection of choices' 
  }
];

const DraggableQuestion: React.FC<DraggableQuestionProps> = ({ question, onUpdate, onDelete }) => {
  return (
    <div className="group touch-none">
      <Card className="bg-[#1e1e1e] border-[#2e2e2e] p-4 mb-4 transition-all duration-200 hover:border-[#3e3e3e]">
        <div className="flex items-start gap-4">
          <div className="mt-2 cursor-move opacity-30 group-hover:opacity-100 transition-opacity">
            <GripHorizontal className="h-5 w-5 text-[#666666]" />
          </div>
          <div className="flex-1">
            <Input
              value={question.questionText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                onUpdate({ ...question, questionText: e.target.value })}
              placeholder="Enter your question"
              className="bg-[#2e2e2e] border-[#3e3e3e] text-white mb-2 text-lg placeholder:text-[#666666]"
            />
            
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={question.isRequired}
                  onCheckedChange={(checked: boolean) => 
                    onUpdate({ ...question, isRequired: checked })}
                />
                <span className="text-sm text-[#888888]">Required field</span>
              </div>
              
              <div className="flex items-center gap-2">
                {(() => {
                  const type = questionTypes.find(t => t.id === question.questionType);
                  return type?.icon && <type.icon className="h-4 w-4 text-[#888888]" />;
                })()}
                <span className="text-sm text-[#888888]">
                  {questionTypes.find(t => t.id === question.questionType)?.label}
                </span>
              </div>
            </div>

            <p className="mt-2 text-xs text-[#666666]">
              {questionTypes.find(t => t.id === question.questionType)?.helper}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(question.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#888888] hover:text-white hover:bg-[#2e2e2e]"
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
};

const DroppableArea: React.FC<DroppableAreaProps> = ({ questions, onUpdate, onDelete }) => {
  return (
    <SortableContext 
      items={questions.map(q => q.id)} 
      strategy={verticalListSortingStrategy}
    >
      <div className="min-h-[300px] p-6 rounded-xl border-2 border-dashed border-[#2e2e2e] bg-[#1e1e1e]/50 backdrop-blur-sm">
        {questions.map((question) => (
          <Draggable key={question.id} id={question.id}>
            <DraggableQuestion
              question={question}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </Draggable>
        ))}
        
        {questions.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-[#2e2e2e]/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Plus className="h-8 w-8 text-[#666666]" />
            </div>
            <p className="text-[#888888] font-medium">Drag question types here to start building</p>
            <p className="text-[#666666] text-sm mt-2">Create your perfect testimonial collection form</p>
          </div>
        )}
      </div>
    </SortableContext>
  );
};

const TestimonialFormBuilder: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    questions: []
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
  );

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    if (questionTypes.find(t => t.id === active.id)) {
      // Adding new question
      const newQuestion: Question = {
        id: `question-${Date.now()}`,
        questionText: '',
        questionType: active.id as QuestionType,
        isRequired: false,
        orderIndex: formData.questions.length
      };
      
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    } else {
      // Reordering questions using arrayMove
      setFormData(prev => {
        const oldIndex = prev.questions.findIndex(q => q.id === active.id);
        const newIndex = prev.questions.findIndex(q => q.id === over.id);
        
        return {
          ...prev,
          questions: arrayMove(prev.questions, oldIndex, newIndex)
        };
      });
    }
  };

  const handleSaveForm = async (): Promise<void> => {
    try {
      // Map the form data to match your database schema
      const feedbackForm: Omit<FeedbackForm, 'formId' | 'createdAt' | 'updatedAt'> = {
        spaceId: 1, // You'll need to get this from your route params or context
        title: formData.title,
        description: formData.description,
        isActive: true
      };

      console.log('Ready to save:', {
        form: feedbackForm,
        questions: formData.questions.map((q, index) => ({
          questionText: q.questionText,
          questionType: q.questionType,
          isRequired: q.isRequired,
          orderIndex: index
        }))
      });
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/spaces/create" className="text-[#888888] hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Create Testimonial Form</h1>
              <p className="text-[#888888]">Design your testimonial collection form</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-8">
          {/* Form Details */}
          <div className="space-y-4">
            <Input
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter form title"
              className="bg-[#2e2e2e] border-[#3e3e3e] text-xl font-bold"
            />
            <Textarea
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this feedback form is for..."
              className="bg-[#2e2e2e] border-[#3e3e3e] min-h-[100px] resize-none"
            />
          </div>

          {/* Question Types Toolbar */}
          <div className="sticky top-4 z-10 bg-[#1e1e1e]/80 backdrop-blur-md rounded-lg border border-[#2e2e2e] p-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {questionTypes.map((type) => (
                <Draggable key={type.id} id={type.id}>
                  <Button
                    variant="outline"
                    className="bg-[#2e2e2e] border-[#3e3e3e] text-white hover:bg-[#3e3e3e] whitespace-nowrap cursor-move"
                  >
                    <type.icon className="h-4 w-4 mr-2" />
                    {type.label}
                  </Button>
                </Draggable>
              ))}
            </div>
          </div>

          {/* Questions Area */}
          <Droppable id="questions-area">
            <DroppableArea
              questions={formData.questions}
              onUpdate={(updated) => setFormData(prev => ({
                ...prev,
                questions: prev.questions.map(q => q.id === updated.id ? updated : q)
              }))}
              onDelete={(id) => setFormData(prev => ({
                ...prev,
                questions: prev.questions.filter(q => q.id !== id)
              }))}
            />
          </Droppable>

          {/* Save Button */}
          <div className="sticky bottom-4 bg-[#1e1e1e]/80 backdrop-blur-md rounded-lg border border-[#2e2e2e] p-4">
            <Button
              onClick={handleSaveForm}
              disabled={!formData.title || formData.questions.length === 0}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-[#2e2e2e] disabled:text-[#666666]"
            >
              Save Form
            </Button>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default TestimonialFormBuilder;