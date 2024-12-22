'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { PageTransition } from '@/components/PageTransition'

interface FormData {
  name: string;
  description: string;
  slug: string;
}

const CreatePage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    slug: ''
  });

  const handleSubmit = async () => {
    console.log('Form submitted:', formData);
    router.push('/dashboard/spaces/create/form');
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.length >= 3;
      case 2:
        return formData.description.length >= 10;
      case 3:
        return formData.slug.length >= 3;
      default:
        return false;
    }
  };

  const animateOptions =  {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
    transition: { 
      duration: 0.4,
      type: "spring",
      stiffness: 260,
      damping: 20 
    }
  };

  return (
    <PageTransition options={animateOptions}>
      <div className="min-h-screen text-white p-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-8 text-[#8a8a8a] hover:bg-transparent hover:text-white"
            onClick={() => router.push('/dashboard/spaces')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="bg-[#1e1e1e] rounded-lg p-8 border border-[#2e2e2e]">
            {/* Progress indicator */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center border-2 
                      ${i === step ? 'border-[#a58f8f] text-white' : 
                        i < step ? 'border-green-500 bg-green-500 text-white' : 
                        'border-[#4a4a4a] text-[#8a8a8a]'}`}
                  >
                    {i < step ? <Check className="h-5 w-5" /> : i}
                  </div>
                  {i < 3 && (
                    <div className={`w-24 h-0.5 mx-2 
                      ${i < step ? 'bg-green-500' : 'bg-[#4a4a4a]'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Form steps */}
            <div className="relative overflow-hidden" style={{ height: '300px' }}>
              <div className="absolute w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${(step - 1) * 100}%)` }}>
                <div className="flex" style={{ width: '300%' }}>
                  {/* Step 1: Name */}
                  <div className="w-full px-4">
                    <h2 className="text-2xl font-semibold mb-6">Name your testimonial space</h2>
                    <p className="text-[#8a8a8a] mb-4">Choose a memorable name for your new testimonial space.</p>
                    <Input
                      placeholder="Enter space name"
                      className="bg-[#2e2e2e] border-[#4a4a4a] text-white"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Step 2: Description */}
                  <div className="w-full px-4">
                    <h2 className="text-2xl font-semibold mb-6">Describe your testimonial zone</h2>
                    <p className="text-[#8a8a8a] mb-4">Help your users understand what kind of feedback you're looking for and how it will be used. This description will appear on your feedback collection page.</p>
                    <Textarea
                      placeholder="Enter space description"
                      className="bg-[#2e2e2e] border-[#4a4a4a] text-white"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Step 3: Slug */}
                  <div className="w-full px-4">
                    <h2 className="text-2xl font-semibold mb-6">Create your custom testimonial URL</h2>
                    <p className="text-[#8a8a8a] mb-4">Choose a memorable URL for sharing with your users. This will be the link where they can submit their feedback</p>
                    <Input
                      placeholder="enter-slug-here"
                      className="bg-[#2e2e2e] border-[#4a4a4a] text-white"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t border-[#2e2e2e]">
              <Button
                  variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="text-[#8a8a8a] hover:bg-transparent hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepValid()}
                  className="bg-[#a58f8f] hover:bg-[#8f7a7a] text-white"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className="bg-[#a58f8f] hover:bg-[#8f7a7a] text-white"
                >
                  Create Space
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CreatePage;