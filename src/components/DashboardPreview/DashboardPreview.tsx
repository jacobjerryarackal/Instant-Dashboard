'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sparkles } from 'lucide-react';
import styles from './DashboardPreview.module.css';

interface DashboardPreviewProps {
  htmlCode: string;
  isLoading: boolean;
  isVisible: boolean;
}

export default function DashboardPreview({ htmlCode, isLoading, isVisible }: DashboardPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && htmlCode && isVisible) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlCode);
        iframeDoc.close();
      }
    }
  }, [htmlCode, isVisible]);

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>
              <Sparkles size={20} />
              AI Dashboard Preview
            </h3>
            <div className={styles.badge}>
              <Cpu size={14} />
              <span>Powered by Gemini</span>
            </div>
          </div>
          
          {isLoading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.pulse}></div>
              <span>Generating...</span>
            </div>
          )}
        </div>
        
        <div className={styles.controls}>
          <div className={styles.control}>
            <span className={styles.controlLabel}>Status:</span>
            <span className={styles.controlValue}>
              {isLoading ? 'Processing' : isVisible ? 'Ready' : 'Awaiting Input'}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.previewArea}>
        {isVisible ? (
          <>
            <iframe
              ref={iframeRef}
              title="AI Generated Dashboard"
              className={styles.previewFrame}
              sandbox="allow-same-origin"
            />
            <div className={styles.watermark}>
              <span>✨ Generated with AI</span>
            </div>
          </>
        ) : (
          <motion.div 
            className={styles.placeholder}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.placeholderVisual}>
              <div className={styles.visualGrid}>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={styles.gridCell}></div>
                ))}
              </div>
              <div className={styles.visualCenter}>
                <div className={styles.centerGlow}></div>
                <Sparkles className={styles.centerIcon} size={40} />
              </div>
            </div>
            
            <div className={styles.placeholderContent}>
              <h3 className={styles.placeholderTitle}>Your Dashboard Awaits</h3>
              <p className={styles.placeholderText}>
                Enter your JSON data and describe the dashboard you want. 
                Our AI will generate a stunning, interactive dashboard in seconds.
              </p>
              
              <div className={styles.placeholderSteps}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepTitle}>Input Data</div>
                    <div className={styles.stepDesc}>Add structured JSON on the left</div>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepTitle}>Add Instructions</div>
                    <div className={styles.stepDesc}>Describe your ideal dashboard</div>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepTitle}>Generate</div>
                    <div className={styles.stepDesc}>Watch AI create your dashboard</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loader}>
              <div className={styles.loaderOrb}></div>
              <div className={styles.loaderOrb}></div>
              <div className={styles.loaderOrb}></div>
            </div>
            <div className={styles.loadingText}>
              <div className={styles.loadingTitle}>AI is designing your dashboard...</div>
              <div className={styles.loadingSubtitle}>This usually takes 3-5 seconds</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}