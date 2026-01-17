'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Copy, Download } from 'lucide-react';
import Button from '../Button/Button';
import styles from './JsonInput.module.css';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SAMPLE_JSON = {
  report_title: "Monthly Office Spending",
  currency: "USD",
  expenses: [
    { item: "High-speed Internet", amount: 250 },
    { item: "Coffee & Snacks", amount: 400 },
    { item: "Software Subscriptions", amount: 1200 },
    { item: "Office Electricity", amount: 350 }
  ]
};

export default function JsonInput({ value, onChange }: JsonInputProps) {
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Validate JSON on change
  useEffect(() => {
    try {
      if (value.trim()) {
        JSON.parse(value);
        setIsValid(true);
        setError('');
      } else {
        setIsValid(true); // Empty is valid
      }
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  }, [value]);

  const handleLoadSample = () => {
    onChange(JSON.stringify(SAMPLE_JSON, null, 2));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(SAMPLE_JSON, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(SAMPLE_JSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-dashboard-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            <span className={styles.icon}>📊</span>
            JSON Data Input
          </h3>
          <p className={styles.subtitle}>Paste your JSON data or use sample data</p>
        </div>
        
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="small"
            onClick={handleLoadSample}
            className={styles.actionButton}
          >
            <Download size={16} />
            Load Sample
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={handleCopy}
            className={styles.actionButton}
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={handleDownload}
            className={styles.actionButton}
          >
            <Download size={16} />
            Download
          </Button>
        </div>
      </div>
      
      <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
          <span className={styles.editorLabel}>data.json</span>
          <Button
            variant="secondary"
            size="small"
            onClick={handleClear}
            className={styles.clearButton}
          >
            Clear
          </Button>
        </div>
        
        <textarea
          className={`${styles.textarea} ${!isValid && value.trim() ? styles.invalid : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='{
  "report_title": "Your Report Title",
  "data": [...]
}'
          spellCheck="false"
          rows={12}
        />
        
        <div className={styles.statusBar}>
          {!isValid && value.trim() ? (
            <div className={styles.error}>
              <AlertCircle size={16} />
              <span>Invalid JSON: {error}</span>
            </div>
          ) : value.trim() ? (
            <div className={styles.success}>
              <CheckCircle size={16} />
              <span>Valid JSON ✓</span>
              <span className={styles.charCount}>
                {value.length} characters, {value.split('\n').length} lines
              </span>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <span>Enter JSON data or load sample</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}