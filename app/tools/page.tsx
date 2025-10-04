"use client";
import React, { useState } from 'react';
import { Code, Cpu, Globe, Database, Layers, Terminal, ChevronDown, ChevronUp, TrendingUp, BarChart3 } from 'lucide-react';

export default function ToolsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('ml');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const modelPerformance = [
    {
      name: 'Random Forest',
      auc: 0.9883,
      recall: 0.9467,
      params: 'n_estimators=150, max_depth=5, max_features=0.8'
    },
    {
      name: 'XGBoost',
      auc: 0.9901,
      recall: 0.9592,
      params: 'max_depth=5, learning_rate=0.01, subsample=0.7'
    },
    {
      name: 'Logistic Regression',
      auc: 0.9940,
      recall: 0.9593,
      params: 'C=1, max_iter=400, class_weight=balanced'
    }
  ];

  const datasetStats = [
    { label: 'Total Records', value: '9,564' },
    { label: 'Training Set', value: '6,632' },
    { label: 'Test Set', value: '1,171' },
    { label: 'Features Used', value: '37' }
  ];

  const mlTools = [
    { name: 'XGBoost', description: 'Gradient boosting framework for classification', category: 'ML Library' },
    { name: 'LightGBM', description: 'Fast gradient boosting on decision trees', category: 'ML Library' },
    { name: 'scikit-learn', description: 'Machine learning library with various algorithms', category: 'ML Library' },
    { name: 'Pandas', description: 'Data manipulation and analysis', category: 'Data Processing' },
    { name: 'NumPy', description: 'Numerical computing with arrays', category: 'Data Processing' },
    { name: 'Matplotlib', description: 'Data visualization library', category: 'Visualization' },
    { name: 'Seaborn', description: 'Statistical data visualization', category: 'Visualization' }
  ];

  const backendTools = [
    { name: 'FastAPI', description: 'Modern, fast web framework for building APIs', category: 'Framework' },
    { name: 'Pydantic', description: 'Data validation using Python type annotations', category: 'Validation' },
    { name: 'Requests', description: 'HTTP library for API calls', category: 'Networking' },
    { name: 'JSON', description: 'Data interchange format', category: 'Data Format' }
  ];

  const frontendTools = [
    { name: 'Next.js 15.5.4', description: 'React framework with server-side rendering', category: 'Framework' },
    { name: 'React 19.1.0', description: 'JavaScript library for building user interfaces', category: 'Library' },
    { name: 'TypeScript 5', description: 'Typed superset of JavaScript', category: 'Language' },
    { name: 'Tailwind CSS 4', description: 'Utility-first CSS framework', category: 'Styling' },
    { name: 'Lucide React', description: 'Beautiful icon library', category: 'Icons' },
    { name: 'Plotly.js', description: 'Interactive data visualization', category: 'Visualization' },
    { name: 'PapaParse', description: 'CSV parsing library', category: 'Data Processing' },
    { name: 'Vercel Analytics', description: 'Web analytics platform', category: 'Analytics' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Starfield Effect */}
      <div className="fixed inset-0 opacity-20 dark:opacity-30 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-black dark:bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <Terminal className="w-10 h-10 md:w-12 md:h-12" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Software & Tools
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Technologies and frameworks powering the AstroCluster exoplanet detection system
          </p>
        </div>

        {/* Dataset Statistics */}
        <div className="mb-12 md:mb-16">
          <div className="bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 md:w-8 md:h-8" />
              <h2 className="text-2xl md:text-3xl font-bold">Dataset Overview</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {datasetStats.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Data source: Kaggle Exoplanets Dataset (arashnic/exoplanets) • Binary classification task predicting exoplanet candidates
            </p>
          </div>
        </div>

        {/* Model Performance */}
        <div className="mb-12 md:mb-16">
          <div className="bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
              <h2 className="text-2xl md:text-3xl font-bold">Model Performance Metrics</h2>
            </div>

            <div className="space-y-6">
              {modelPerformance.map((model, idx) => (
                <div key={idx} className="bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className="text-xl font-bold mb-2 md:mb-0">{model.name}</h3>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">AUC Score</div>
                        <div className="text-lg font-bold">{(model.auc * 100).toFixed(2)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Recall</div>
                        <div className="text-lg font-bold">{(model.recall * 100).toFixed(2)}%</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visual Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">AUC Score</span>
                        <span className="font-semibold">{(model.auc * 100).toFixed(2)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black dark:bg-white transition-all duration-500"
                          style={{ width: `${model.auc * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Recall</span>
                        <span className="font-semibold">{(model.recall * 100).toFixed(2)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black dark:bg-white transition-all duration-500"
                          style={{ width: `${model.recall * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Parameters:</span> {model.params}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Cross-Validation:</strong> All models trained using Stratified K-Fold cross-validation 
                  (3-5 folds) to ensure robust performance estimates and prevent overfitting.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Sections */}
        <div className="space-y-6">
          {/* Machine Learning Stack */}
          <div className="bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('ml')}
              className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-6 h-6 md:w-8 md:h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">Machine Learning & Data Science</h2>
              </div>
              {expandedSection === 'ml' ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            
            {expandedSection === 'ml' && (
              <div className="p-6 md:p-8 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mlTools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-black dark:hover:border-white transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{tool.name}</h3>
                      <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">{tool.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Backend Stack */}
          <div className="bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('backend')}
              className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 md:w-8 md:h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">Backend & API</h2>
              </div>
              {expandedSection === 'backend' ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            
            {expandedSection === 'backend' && (
              <div className="p-6 md:p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                {backendTools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-black dark:hover:border-white transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{tool.name}</h3>
                      <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">{tool.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Frontend Stack */}
          <div className="bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('frontend')}
              className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 md:w-8 md:h-8" />
                <h2 className="text-2xl md:text-3xl font-bold">Frontend & Web Interface</h2>
              </div>
              {expandedSection === 'frontend' ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            
            {expandedSection === 'frontend' && (
              <div className="p-6 md:p-8 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {frontendTools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-black dark:hover:border-white transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{tool.name}</h3>
                      <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">{tool.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="mt-12 md:mt-16 bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-6 h-6 md:w-8 md:h-8" />
            <h2 className="text-2xl md:text-3xl font-bold">System Architecture</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
              <Code className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Data Layer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kaggle exoplanet dataset processing with Pandas, NumPy, and feature engineering pipelines
              </p>
            </div>
            
            <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
              <Cpu className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">ML Models</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ensemble approach using Random Forest, XGBoost, and Logistic Regression with cross-validation
              </p>
            </div>
            
            <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
              <Globe className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Web Interface</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Next.js 15 with React 19, TypeScript, and Tailwind CSS for responsive, modern UI
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 md:mt-12 text-center text-gray-500 dark:text-gray-600 text-xs md:text-sm">
          <p>Built with modern technologies for NASA Space Apps Challenge 2025</p>
        </div>
      </div>
    </div>
  );
}