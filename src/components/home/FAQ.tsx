
import React, { useState } from 'react';
import { Transition } from '@/components/ui/Transition';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  className?: string;
}

const FAQ: React.FC<FAQProps> = ({ className }) => {
  const faqs = [
    {
      question: "How secure is my content in TimeSeal?",
      answer: "TimeSeal uses end-to-end encryption to secure your content. Only you and your designated recipients can access the contents of your time capsule, and only after the scheduled unlock date."
    },
    {
      question: "What happens if I forget my password?",
      answer: "We have a secure password recovery process that involves email verification and security questions you set up during registration. For added security, we recommend keeping a backup of your password in a safe place."
    },
    {
      question: "How far in the future can I schedule my time capsule?",
      answer: "You can schedule your time capsule to unlock anytime from 24 hours to 100 years in the future. For legacy planning, we also offer special provisions to ensure your time capsules remain accessible."
    },
    {
      question: "What types of content can I include in my time capsule?",
      answer: "TimeSeal supports a wide range of content including photos, videos, audio recordings, text messages, documents, and more. We support most common file formats, with individual file size limits depending on your account tier."
    },
    {
      question: "Can I edit my time capsule after it's sealed?",
      answer: "Yes, you can edit the contents of your time capsule until the scheduled unlock date. Once the date has passed and the capsule is unlocked, its contents become read-only."
    },
    {
      question: "What if the recipient doesn't have a TimeSeal account?",
      answer: "Recipients will receive an email notification with instructions on how to create a free account to access your time capsule. They only need an email address to sign up."
    }
  ];

  return (
    <section id="faq" className={cn("py-20 relative", className)}>
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-time-blue/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <Transition type="fade">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center mb-3 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-time-blue to-time-purple"> Questions</span>
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about TimeSeal and how to preserve your digital memories for the future.
            </p>
          </div>
        </Transition>

        <Transition type="scale" delay={200}>
          <div className="max-w-3xl mx-auto bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-subtle">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Transition>
      </div>
    </section>
  );
};

export default FAQ;
