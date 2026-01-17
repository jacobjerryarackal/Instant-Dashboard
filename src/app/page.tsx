'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Rocket, 
  ChevronRight, 
  Code, 
  Eye, 
  CheckCircle, 
  Cpu, 
  Globe,
  AlertCircle,
  Braces,
  MessageSquare,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Shield,
  Cloud,
  Terminal,
  Database,
  Server,
  Workflow,
  CpuIcon,
  Bot,
  Brain,
  Wand2,
  Download,
  Copy,
  Play,
  RotateCw,
  Settings,
  Users,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import JsonInput from '@/components/JsonInput/JsonInput';
import DashboardPreview from '@/components/DashboardPreview/DashboardPreview';
import PromptInput from '@/components/PromptInput/PromptInput';
import Button from '@/components/Button/Button';
import styles from './page.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { generateDashboardCode } from '@/utils/geminiService';

export default function Home() {
  const [jsonData, setJsonData] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  // Sample JSON for initial load
  useEffect(() => {
    const sampleJSON = {
      report_title: "Monthly Analytics Dashboard",
      currency: "USD",
      metrics: {
        revenue: 125000,
        expenses: 75000,
        profit: 50000,
        growth: 15.5,
        conversion_rate: 3.2,
        active_users: 2450,
        churn_rate: 1.2,
        satisfaction: 4.8
      },
      time_period: "January 2024",
      data_source: "Company Analytics Platform",
      expenses: [
        { item: "Cloud Infrastructure", amount: 25000, category: "Technology", trend: "up" },
        { item: "Digital Marketing", amount: 20000, category: "Marketing", trend: "up" },
        { item: "Employee Salaries", amount: 30000, category: "Operations", trend: "stable" },
        { item: "Office Expenses", amount: 5000, category: "Operations", trend: "down" },
        { item: "Software Licenses", amount: 15000, category: "Technology", trend: "up" },
        { item: "Research & Development", amount: 12000, category: "Innovation", trend: "up" }
      ],
      performance_indicators: [
        { name: "User Growth", value: 24, target: 20, status: "exceeded" },
        { name: "Revenue Growth", value: 18, target: 15, status: "exceeded" },
        { name: "Customer Satisfaction", value: 94, target: 90, status: "exceeded" },
        { name: "System Uptime", value: 99.8, target: 99.5, status: "exceeded" }
      ]
    };
    setJsonData(JSON.stringify(sampleJSON, null, 2));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!jsonData.trim()) {
      toast.error('Please enter JSON data', {
        icon: '📝',
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155'
        }
      });
      return;
    }

    const startTime = Date.now();
    setLoading(true);
    setError('');
    setIsPreviewVisible(false);

    try {
      // Validate JSON
      const parsedData = JSON.parse(jsonData);
      
      // Show loading toast
      const loadingToast = toast.loading(
        <div className={styles.toastContent}>
          <Brain size={20} />
          <div>
            <div className={styles.toastTitle}>AI is working its magic...</div>
            <div className={styles.toastSubtitle}>Generating your dashboard</div>
          </div>
        </div>,
        {
          duration: Infinity,
          style: {
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: '#fff',
            border: '1px solid #475569',
            borderRadius: '12px'
          }
        }
      );
      
      // Generate dashboard code using Gemini
      const result = await generateDashboardCode(parsedData, userPrompt);
      
      const endTime = Date.now();
      setGenerationTime(endTime - startTime);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setGeneratedCode(result.code);
      setIsPreviewVisible(true);
      setStep(3);
      
      // Update toast to success
      toast.dismiss(loadingToast);
      toast.success(
        <div className={styles.toastContent}>
          <Wand2 size={20} />
          <div>
            <div className={styles.toastTitle}>Dashboard Generated!</div>
            <div className={styles.toastSubtitle}>
              Created in {generationTime ? `${generationTime}ms` : 'a flash'} ⚡
            </div>
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            color: '#fff',
            border: '1px solid #34d399',
            borderRadius: '12px'
          }
        }
      );
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid JSON';
      setError(errorMsg);
      
      toast.error(
        <div className={styles.toastContent}>
          <AlertCircle size={20} />
          <div>
            <div className={styles.toastTitle}>Generation Failed</div>
            <div className={styles.toastSubtitle}>{errorMsg}</div>
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            color: '#fff',
            border: '1px solid #f87171',
            borderRadius: '12px'
          }
        }
      );
    } finally {
      setLoading(false);
    }
  }, [jsonData, userPrompt]);

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast.success('HTML code copied to clipboard!', {
        icon: '📋',
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155'
        }
      });
    }
  };

  const handleDownloadCode = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-dashboard.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Dashboard downloaded!', {
        icon: '💾',
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155'
        }
      });
    }
  };

  const handleReset = () => {
    setJsonData('');
    setUserPrompt('');
    setGeneratedCode('');
    setIsPreviewVisible(false);
    setStep(1);
    setGenerationTime(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatVariants = {
    hidden: { y: 0 },
    visible: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'transparent',
            border: 'none',
            boxShadow: 'none'
          }
        }}
      />
      
      <div className={styles.container}>
        {/* Animated Background Particles */}
        <div className={styles.particles}>
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className={styles.gradientOrbs}>
          <div className={`${styles.gradientOrb} ${styles.orb1}`}></div>
          <div className={`${styles.gradientOrb} ${styles.orb2}`}></div>
          <div className={`${styles.gradientOrb} ${styles.orb3}`}></div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          className={styles.floatingElement1}
          variants={floatVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.floatingIcon}>
            <CpuIcon size={24} />
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.floatingElement2}
          variants={floatVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <div className={styles.floatingIcon}>
            <Database size={24} />
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.floatingElement3}
          variants={floatVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          <div className={styles.floatingIcon}>
            <BarChart3 size={24} />
          </div>
        </motion.div>

        {/* Header */}
        <motion.header 
          className={styles.header}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 120, 
            damping: 20,
            delay: 0.1 
          }}
        >
          <div className={styles.headerContent}>
            <motion.div 
              className={styles.logo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.logoIcon}>
                <Rocket size={28} />
                <div className={styles.logoGlow}></div>
              </div>
              <div>
                <h1 className={styles.logoText}>
                  Dashboard<span className={styles.logoAccent}>AI</span>
                </h1>
                <p className={styles.logoSubtext}>
                  <span className={styles.poweredBy}>Powered by</span>
                  <span className={styles.geminiBadge}>
                    <Bot size={12} />
                    Google Gemini
                  </span>
                </p>
              </div>
            </motion.div>
            
            <div className={styles.headerBadges}>
              <motion.div 
                className={styles.badge}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Cpu size={14} />
                <span>Enterprise AI</span>
              </motion.div>
              <motion.div 
                className={styles.badge}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield size={14} />
                <span>Production Ready</span>
              </motion.div>
              <motion.div 
                className={styles.badge}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Cloud size={14} />
                <span>Real-time</span>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          className={styles.hero}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className={styles.heroContent}>
            <motion.div 
              className={styles.heroText}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className={styles.heroBadge}>
                <Sparkles size={14} />
                <span>THE FUTURE OF DATA VISUALIZATION</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className={styles.heroTitle}>
                Transform <span className={styles.gradientText}>JSON</span> into
                <br />
                <span className={styles.gradientText}>Stunning AI Dashboards</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className={styles.heroSubtitle}>
                Instantly generate beautiful, interactive dashboards using Google's 
                cutting-edge Gemini AI. No design skills required.
              </motion.p>
              
              <motion.div variants={itemVariants} className={styles.heroStats}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>⚡</div>
                  <div className={styles.statText}>Instant Generation</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>🎨</div>
                  <div className={styles.statText}>AI-Powered Design</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>🔧</div>
                  <div className={styles.statText}>Fully Customizable</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>🚀</div>
                  <div className={styles.statText}>Production Ready</div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className={styles.heroVisual}
              initial={{ x: 100, opacity: 0, rotate: 5 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                delay: 0.4 
              }}
            >
              <div className={styles.floatingCard}>
                <div className={styles.cardGlow}></div>
                <div className={styles.visualDashboard}>
                  <div className={styles.visualHeader}>
                    <div className={styles.visualLogo}>
                      <Brain size={16} />
                      <span>AI Dashboard</span>
                    </div>
                    <div className={styles.visualStatus}>
                      <div className={styles.statusDot}></div>
                      <span>Live</span>
                    </div>
                  </div>
                  
                  <div className={styles.visualChart}>
                    {[65, 80, 45, 90, 70, 85, 60].map((height, i) => (
                      <motion.div 
                        key={i} 
                        className={styles.chartBar}
                        style={{ height: `${height}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ 
                          delay: i * 0.1,
                          type: "spring",
                          stiffness: 100
                        }}
                      ></motion.div>
                    ))}
                  </div>
                  
                  <div className={styles.visualMetrics}>
                    <div className={styles.metric}>
                      <TrendingUp size={14} />
                      <span>+24.5% Growth</span>
                    </div>
                    <div className={styles.metric}>
                      <Server size={14} />
                      <span>$125K Revenue</span>
                    </div>
                    <div className={styles.metric}>
                      <Users size={14} />
                      <span>95% Accuracy</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Progress Steps */}
        <motion.div 
          className={styles.progressSteps}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className={styles.stepsContainer}>
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className={styles.stepWrapper}>
                <motion.div 
                  className={`${styles.step} ${step >= stepNum ? styles.active : ''}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={styles.stepInner}>
                    {stepNum}
                  </div>
                  {step >= stepNum && (
                    <div className={styles.stepGlow}></div>
                  )}
                </motion.div>
                
                <div className={styles.stepInfo}>
                  <div className={styles.stepLabel}>
                    {stepNum === 1 && 'Input Data'}
                    {stepNum === 2 && 'Add Prompt'}
                    {stepNum === 3 && 'View Dashboard'}
                  </div>
                  <div className={styles.stepDescription}>
                    {stepNum === 1 && 'Paste or edit your JSON data'}
                    {stepNum === 2 && 'Describe your dashboard vision'}
                    {stepNum === 3 && 'Watch AI create your dashboard'}
                  </div>
                </div>
                
                {stepNum < 3 && (
                  <div className={styles.stepConnector}>
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.main 
          className={styles.main}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className={styles.contentGrid}>
            {/* Left Column - Inputs */}
            <motion.div 
              className={styles.inputColumn}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.9 
              }}
            >
              {/* JSON Input Card */}
              <motion.div 
                className={styles.inputCard}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <Braces size={20} />
                  </div>
                  <div>
                    <h3 className={styles.cardTitle}>JSON Data Input</h3>
                    <p className={styles.cardSubtitle}>Paste or edit your structured data</p>
                  </div>
                  <div className={styles.cardActions}>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        const sample = {
                          report_title: "Sample Dashboard",
                          metrics: { revenue: 100000, growth: 15 },
                          data: [{ item: "Example", value: 5000 }]
                        };
                        setJsonData(JSON.stringify(sample, null, 2));
                      }}
                    >
                      <RotateCw size={14} />
                      Reset
                    </Button>
                  </div>
                </div>
                
                <div className={styles.cardContent}>
                  <JsonInput value={jsonData} onChange={setJsonData} />
                </div>
              </motion.div>

              {/* Prompt Input Card */}
              <motion.div 
                className={styles.inputCard}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className={styles.cardTitle}>AI Instructions</h3>
                    <p className={styles.cardSubtitle}>Tell the AI what you want</p>
                  </div>
                </div>
                
                <div className={styles.cardContent}>
                  <PromptInput value={userPrompt} onChange={setUserPrompt} />
                </div>
              </motion.div>

              {/* Generate Section */}
              <motion.div 
                className={styles.generateSection}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className={styles.generateCard}>
                  <div className={styles.generateHeader}>
                    <div className={styles.generateIcon}>
                      <Wand2 size={24} />
                    </div>
                    <div>
                      <h3 className={styles.generateTitle}>AI Dashboard Generation</h3>
                      <p className={styles.generateSubtitle}>
                        Powered by Google Gemini AI • Enterprise-grade quality
                      </p>
                    </div>
                  </div>
                  
                  <div className={styles.generateContent}>
                    <Button
                      onClick={handleGenerate}
                      loading={loading}
                      disabled={loading || !jsonData.trim()}
                      variant="primary"
                      size="large"
                      fullWidth
                      className={styles.generateButton}
                    >
                      {loading ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          <span>AI is Generating...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={20} />
                          <span>✨ Generate Dashboard Now</span>
                        </>
                      )}
                    </Button>
                    
                    {!jsonData.trim() && (
                      <motion.div 
                        className={styles.inputPrompt}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <AlertCircle size={16} />
                        <span>Add JSON data above to enable AI generation</span>
                      </motion.div>
                    )}
                    
                    {generatedCode && (
                      <motion.div 
                        className={styles.actionsRow}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Button
                          variant="secondary"
                          size="medium"
                          onClick={handleCopyCode}
                          className={styles.actionButton}
                        >
                          <Copy size={16} />
                          Copy Code
                        </Button>
                        <Button
                          variant="secondary"
                          size="medium"
                          onClick={handleDownloadCode}
                          className={styles.actionButton}
                        >
                          <Download size={16} />
                          Download
                        </Button>
                        <Button
                          variant="secondary"
                          size="medium"
                          onClick={handleReset}
                          className={styles.actionButton}
                        >
                          <RotateCw size={16} />
                          Reset
                        </Button>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className={styles.generateStats}>
                    <div className={styles.statItem}>
                      <div className={styles.statIcon}>⚡</div>
                      <div className={styles.statInfo}>
                        <div className={styles.statLabel}>Generation Time</div>
                        <div className={styles.statValue}>
                          {generationTime ? `${generationTime}ms` : 'Instant'}
                        </div>
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statIcon}>🔒</div>
                      <div className={styles.statInfo}>
                        <div className={styles.statLabel}>Security</div>
                        <div className={styles.statValue}>Enterprise-grade</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Preview */}
            <motion.div 
              className={styles.previewColumn}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 1.1 
              }}
            >
              <DashboardPreview 
                htmlCode={generatedCode} 
                isLoading={loading}
                isVisible={isPreviewVisible}
              />
              
              <AnimatePresence>
                {!isPreviewVisible && (
                  <motion.div 
                    className={styles.previewPlaceholder}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className={styles.placeholderVisual}>
                      <div className={styles.placeholderOrbs}>
                        {[...Array(8)].map((_, i) => (
                          <motion.div 
                            key={i}
                            className={styles.orb}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ 
                              opacity: [0.1, 0.3, 0.1],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          ></motion.div>
                        ))}
                      </div>
                      <Eye size={48} className={styles.placeholderIcon} />
                    </div>
                    <h3 className={styles.placeholderTitle}>
                      Your AI-Generated Dashboard Awaits
                    </h3>
                    <p className={styles.placeholderText}>
                      Enter your JSON data and instructions above. Our AI will create 
                      a stunning, interactive dashboard in seconds.
                    </p>
                    <div className={styles.placeholderTips}>
                      <motion.div 
                        className={styles.tip}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Code size={16} />
                        <span>Use structured JSON for best results</span>
                      </motion.div>
                      <motion.div 
                        className={styles.tip}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                      >
                        <Sparkles size={16} />
                        <span>Add detailed prompts for custom styling</span>
                      </motion.div>
                      <motion.div 
                        className={styles.tip}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                      >
                        <Play size={16} />
                        <span>Generate instantly with one click</span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.main>

        {/* Footer */}
        <motion.footer 
          className={styles.footer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className={styles.footerContent}>
            <div className={styles.footerMain}>
              <motion.div 
                className={styles.footerLogo}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={styles.footerLogoIcon}>
                  <Rocket size={20} />
                </div>
                <div>
                  <div className={styles.footerLogoText}>
                    Dashboard<span className={styles.footerLogoAccent}>AI</span>
                  </div>
                  <div className={styles.footerTagline}>
                    The future of data visualization
                  </div>
                </div>
              </motion.div>
              
              <div className={styles.footerTech}>
                <div className={styles.techSection}>
                  <div className={styles.techTitle}>Powered By</div>
                  <div className={styles.techStack}>
                    <div className={styles.techItem}>
                      <Bot size={12} />
                      <span>Google Gemini AI</span>
                    </div>
                    <div className={styles.techItem}>
                      <Workflow size={12} />
                      <span>Real-time Processing</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.techSection}>
                  <div className={styles.techTitle}>Built With</div>
                  <div className={styles.techStack}>
                    <div className={styles.techItem}>
                      <Terminal size={12} />
                      <span>Next.js 14</span>
                    </div>
                    <div className={styles.techItem}>
                      <Server size={12} />
                      <span>TypeScript</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.footerLinks}>
                <a href="#" className={styles.footerLink}>
                  <ExternalLink size={12} />
                  <span>Documentation</span>
                </a>
                <a href="#" className={styles.footerLink}>
                  <HelpCircle size={12} />
                  <span>Support</span>
                </a>
                <a href="#" className={styles.footerLink}>
                  <Settings size={12} />
                  <span>API Reference</span>
                </a>
              </div>
            </div>
            
            <div className={styles.footerBottom}>
              <motion.div 
                className={styles.footerNote}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={styles.noteIcon}>💡</span>
                <span>Technical Assessment • Production-ready AI Dashboard Generator</span>
              </motion.div>
              <div className={styles.copyright}>
                © {new Date().getFullYear()} DashboardAI • All visualizations generated by AI
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </>
  );
}