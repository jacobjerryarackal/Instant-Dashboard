'use client';

import { useState } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import styles from './PromptInput.module.css';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

const EXAMPLE_PROMPTS = [
  "Create a clean business dashboard. Show a total spending summary at the top and a simple table below for the items. Use a professional font and light grey background.",
  "Make it look modern and use blue charts with gradients.",
  "Design a minimalist dashboard with dark theme and neon accents.",
  "Create a colorful, engaging dashboard with pie charts and bar graphs.",
  "Show the data in cards with icons and progress indicators."
];

export default function PromptInput({ value, onChange }: PromptInputProps) {
  const [showExamples, setShowExamples] = useState(true);

  const handleExampleClick = (example: string) => {
    onChange(example);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            <span className={styles.icon}>💬</span>
            Prompt Instructions
          </h3>
          <p className={styles.subtitle}>Tell the AI how you want your dashboard to look</p>
        </div>
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          className={styles.examplesToggle}
        >
          <Lightbulb size={18} />
          {showExamples ? 'Hide Examples' : 'Show Examples'}
        </button>
      </div>
      
      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.textarea}
            value={value}
            onChange={handleChange}
            placeholder="Describe your dashboard (e.g., 'Create a modern dashboard with blue theme and charts')..."
            rows={4}
          />
          <div className={styles.inputFooter}>
            <span className={styles.charCount}>
              {value.length} / 500 characters
            </span>
          </div>
        </div>
        
        {showExamples && (
          <div className={styles.examples}>
            <div className={styles.examplesHeader}>
              <Sparkles size={16} />
              <span>Try these examples:</span>
            </div>
            <div className={styles.examplesGrid}>
              {EXAMPLE_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(prompt)}
                  className={styles.exampleButton}
                  title={prompt}
                >
                  {prompt.length > 80 ? prompt.substring(0, 80) + '...' : prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}