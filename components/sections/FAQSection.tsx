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
    <section id="faq" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 relative bg-white">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center space-y-2.5 sm:space-y-4 px-2">
          <Badge variant="orange" size="md">
            Got Questions?
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-darkText tracking-tight leading-tight break-words">
            FREQUENTLY ASKED{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              QUESTIONS.
            </span>
          </h2>
          <p className="text-xs xs:text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about IdeaVerse 2.0 application, eligibility, and competition rules.
          </p>
        </div>

        {/* Dynamic Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Card
                key={faq.id || faq.question || idx}
                className={`p-0 overflow-hidden transition-all border-slate-200 bg-white ${
                  isOpen ? 'border-brand-blue shadow-md sm:shadow-lg' : 'hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-3.5 xs:p-4 sm:p-6 text-left flex items-start sm:items-center justify-between gap-3 focus:outline-none"
                >
                  <span className="font-display font-bold text-sm sm:text-base md:text-lg text-brand-darkText leading-snug break-words flex-1">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-brand-blue transition-transform duration-300 shrink-0 mt-0.5 sm:mt-0 ${
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
                      <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-3 sm:pt-4 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed font-medium">
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
