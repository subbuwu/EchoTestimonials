import { ReactNode } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';

export type QuestionType = 'text' | 'textarea' | 'rating' | 'multiple_choice' | 'dropdown';

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  orderIndex: number;
}

export interface FormData {
  title: string;
  description: string;
  questions: Question[];
}

export interface QuestionTypeDefinition {
  id: QuestionType;
  label: string;
  icon: React.FC<{ className?: string }>;
  helper: string;
}

export interface DraggableProps {
  id: UniqueIdentifier;
  children: ReactNode;
}

export interface DroppableProps {
  id: string;
  children: ReactNode;
}

export interface DraggableQuestionProps {
  question: Question;
  onUpdate: (updated: Question) => void;
  onDelete: (id: string) => void;
}

export interface DroppableAreaProps {
  questions: Question[];
  onUpdate: (updated: Question) => void;
  onDelete: (id: string) => void;
}

export interface FeedbackForm {
  formId: number;
  spaceId: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormQuestion {
  questionId: number;
  formId: number;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Choice {
  id: string;
  text: string;
}

interface BaseQuestion {
  id: string;
  questionText: string;
  isRequired: boolean;
  orderIndex: number;
}

interface TextQuestion extends BaseQuestion {
  questionType: 'text';
}

interface TextareaQuestion extends BaseQuestion {
  questionType: 'textarea';
}

interface RatingQuestion extends BaseQuestion {
  questionType: 'rating';
  maxRating: number;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  questionType: 'multiple_choice';
  choices: Choice[];
}


interface FinalFormData extends FormData {
  submittedAt: string;
}