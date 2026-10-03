'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useSiteContent } from '@/lib/content/useSiteContent';

export const FAQSection: React.FC = () => {
  const { content } = useSiteContent();
  const faqs = content.faqs || [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-white">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="orange" size="md">
            Got Questions?
          </Badge>
          <h2 className="text-4xl sm:text-6xl font-black font-display text-brand-darkText tracking-tight">
            FREQUENTLY ASKED{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              QUESTIONS.
            </span>
          </h2>
          <p className="text-base text-slate-600">
            Everything you need to know about IdeaVerse 2.0 application and competition rules.
          </p>
        </div>

        {/* Dynamic Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Card
                key={faq.id || faq.question || idx}
                className={`p-0 overflow-hidden transition-all border-slate-200 bg-white ${
                  isOpen ? 'border-brand-blue shadow-lg' : 'hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-display font-bold text-base sm:text-lg text-brand-darkText">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-blue transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 text-sm text-slate-600 border-t border-slate-100 pt-4 leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
