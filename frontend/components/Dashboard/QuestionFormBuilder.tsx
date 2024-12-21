import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, GripVertical, Plus } from 'lucide-react';

interface Question {
  id: string;
  type: 'text' | 'rating' | 'choice';
  question: string;
  required: boolean;
  options?: string[];
}

interface QuestionBuilderProps {
  questions: Question[];
  onUpdate: (questions: Question[]) => void;
}

export default function QuestionBuilder({ questions, onUpdate }: QuestionBuilderProps) {
  const addQuestion = () => {
    onUpdate([
      ...questions,
      {
        id: String(questions.length + 1),
        type: 'text',
        question: '',
        required: false
      }
    ]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onUpdate(
      questions.map(q => q.id === id ? { ...q, ...updates } : q)
    );
  };

  const removeQuestion = (id: string) => {
    onUpdate(questions.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card p-4 rounded-lg border relative group"
          >
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Question {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => removeQuestion(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value: Question['type']) => 
                      updateQuestion(question.id, { type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Response</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="choice">Multiple Choice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Required</Label>
                    <Switch
                      checked={question.required}
                      onCheckedChange={(checked) => 
                        updateQuestion(question.id, { required: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Question Text</Label>
                <Input
                  value={question.question}
                  onChange={(e) => 
                    updateQuestion(question.id, { question: e.target.value })
                  }
                  placeholder="Enter your question"
                />
              </div>

              {question.type === 'choice' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label>Options</Label>
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])];
                          newOptions[optionIndex] = e.target.value;
                          updateQuestion(question.id, { options: newOptions });
                        }}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newOptions = question.options?.filter((_, i) => i !== optionIndex);
                          updateQuestion(question.id, { options: newOptions });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [...(question.options || []), ''];
                      updateQuestion(question.id, { options: newOptions });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Button
          variant="outline"
          onClick={addQuestion}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </motion.div>
    </div>
  );
}