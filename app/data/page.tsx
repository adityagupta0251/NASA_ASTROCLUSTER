"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { PageWrapper } from "../components/page-wrapper";
import {
  Activity,
  Database,
  Brain,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ArrowRight,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { saveAndStore, loadStored, clearSessionStorage } from "@/lib/storage";

// Dynamically import Plotly with SSR disabled
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface ModelStatus {
  status: string;
  file_size_bytes: number;
}

interface HealthData {
  status: string;
  models: {
    rf: ModelStatus;
    xgb: ModelStatus;
    lr: ModelStatus;
  };
}

interface ModelInfo {
  model: string;
  features_count: number;
  model_path: string;
  timestamp: string;
  file_size_bytes: number;
  model_exists: boolean;
}

interface PredictionResult {
  predictions: number[];
  probabilities: number[];
}

interface PredictData {
  models: {
    rf: PredictionResult;
    xgb: PredictionResult;
    lr: PredictionResult;
  };
}

const STORAGE_KEYS = {
  health: "data_health",
  features: "data_features", 
  modelInfo: "data_modelInfo",
  predictions: "data_predictions"
};

// AI/ML storage keys to access user's actual predictions
const AIML_STORAGE_KEYS = {
  predictions: "aiml_predictions"
};

export default function DataPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [features, setFeatures] = useState<{
    feature_names: string[];
    feature_count: number;
  } | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo[]>([]);
  const [predictions, setPredictions] = useState<PredictData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  // Load stored data on mount
  useEffect(() => {
    const storedHealth = loadStored<HealthData>(STORAGE_KEYS.health);
    const storedFeatures = loadStored<{feature_names: string[], feature_count: number}>(STORAGE_KEYS.features);
    const storedModelInfo = loadStored<ModelInfo[]>(STORAGE_KEYS.modelInfo);
    
    // Load user's actual predictions from AI/ML page instead of sample data
    const storedPredictions = loadStored<PredictData>(AIML_STORAGE_KEYS.predictions);

    if (storedHealth) setHealth(storedHealth);
    if (storedFeatures) setFeatures(storedFeatures);
    if (storedModelInfo) setModelInfo(storedModelInfo);
    if (storedPredictions) setPredictions(storedPredictions);

    // Show popup after 3 seconds if no recent activity
    const timer = setTimeout(() => setShowPopup(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Clear session storage on refresh (but keep AI/ML predictions)
    clearSessionStorage([STORAGE_KEYS.health, STORAGE_KEYS.features, STORAGE_KEYS.modelInfo]);
    
    try {
      const [healthRes, featuresRes, modelInfoRes] = await Promise.all([
        fetch("http://72.60.168.212:8000/health"),
        fetch("http://72.60.168.212:8000/features"),
        fetch("http://72.60.168.212:8000/model_info"),
      ]);

      if (!healthRes.ok || !featuresRes.ok || !modelInfoRes.ok) {
        throw new Error("Failed to fetch data from API");
      }

      const healthData: HealthData = await healthRes.json();
      const featuresData = await featuresRes.json();
      const modelInfoData: ModelInfo[] = await modelInfoRes.json();

      // Save to storage and update state
      saveAndStore(STORAGE_KEYS.health, healthData);
      saveAndStore(STORAGE_KEYS.features, featuresData);
      saveAndStore(STORAGE_KEYS.modelInfo, modelInfoData);

      setHealth(healthData);
      setFeatures(featuresData);
      setModelInfo(modelInfoData);

      // Load user's actual predictions from AI/ML page (no sample prediction call)
      const userPredictions = loadStored<PredictData>(AIML_STORAGE_KEYS.predictions);
      if (userPredictions) {
        setPredictions(userPredictions);
      }
      
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const formatBytes = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + " KB";
  };

  const modelNames = {
    rf: "Random Forest",
    xgb: "XGBoost",
    lr: "Logistic Regression",
  };

  const goToAIML = () => {
    setShowPopup(false);
    router.push("/aiml");
  };

  if (loading && !health) {
    return (
      <PageWrapper
        title="Data Analysis"
        description="Loading model data..."
      >
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Data Analysis"
      description="Real-time model health monitoring, feature analysis, and prediction visualizations for exoplanet detection."
    >
      {/* Popup for AI/ML Navigation */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Try AI/ML Predictions!</h3>
              <button onClick={() => setShowPopup(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-muted-foreground mb-4">
              Upload your own CSV data and get real-time exoplanet predictions from our trained models.
            </p>
            <div className="flex gap-2">
              <button
                onClick={goToAIML}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Go to AI/ML <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90"
              >
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Refresh Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={goToAIML}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90"
          >
            Try AI/ML <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 transition"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </button>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Health Status */}
        {health && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md ring-1 ring-primary/40 bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>
                    Model status and file sizes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="font-semibold">
                  Status: {health.status}
                </span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">
                      File Size
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(health.models).map(([key, model]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">
                        {modelNames[key as keyof typeof modelNames]}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-accent">
                          <CheckCircle2 className="h-4 w-4" />
                          {model.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatBytes(model.file_size_bytes)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Model Information */}
        {modelInfo.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md ring-1 ring-accent/40 bg-accent/10">
                  <Brain className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Model Information</CardTitle>
                  <CardDescription>
                    Detailed model metadata and configuration
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  All models use {modelInfo[0]?.features_count} features
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Exists</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelInfo.map((info) => (
                    <TableRow key={info.model}>
                      <TableCell className="font-medium">
                        {modelNames[info.model as keyof typeof modelNames]}
                      </TableCell>
                      <TableCell>{info.features_count}</TableCell>
                      <TableCell>
                        {info.model_exists ? (
                          <CheckCircle2 className="h-4 w-4 text-accent" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatBytes(info.file_size_bytes)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(info.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Features List */}
        {features && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md ring-1 ring-primary/40 bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Feature Set</CardTitle>
                  <CardDescription>
                    {features.feature_count} total features
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {features.feature_names.map((feature, idx) => (
                  <div
                    key={idx}
                    className="rounded-md bg-muted/50 px-3 py-2 text-sm border border-border hover:border-primary/40 transition"
                  >
                    <span className="text-muted-foreground mr-2">
                      {idx + 1}.
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prediction Results Visualization - Only show if user has made predictions */}
        {predictions ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Model Predictions</CardTitle>
              <CardDescription>
                Results from your uploaded CSV data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Plot
                data={[
                  {
                    x: Object.keys(predictions.models).map(
                      (k) => modelNames[k as keyof typeof modelNames]
                    ),
                    y: Object.values(predictions.models).map(
                      (m) => m.probabilities.reduce((a, b) => a + b, 0) / m.probabilities.length
                    ),
                    type: "bar" as const,
                    marker: {
                      color: ["#60a5fa", "#a78bfa", "#f472b6"],
                      line: {
                        color: "#ffffff20",
                        width: 1,
                      },
                    },
                    text: Object.values(predictions.models).map(
                      (m) => `${((m.probabilities.reduce((a, b) => a + b, 0) / m.probabilities.length) * 100).toFixed(2)}%`
                    ),
                    textposition: "auto" as const,
                  },
                ]}
                layout={{
                  title: "Average Prediction Confidence by Model",
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  font: { color: "#e5e7eb" },
                  xaxis: { title: "Model", gridcolor: "#374151" },
                  yaxis: {
                    title: "Average Probability",
                    gridcolor: "#374151",
                    range: [0, 1],
                  },
                  margin: { t: 40, b: 60, l: 60, r: 20 },
                }}
                config={{ responsive: true }}
                className="w-full h-80"
              />

              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {Object.entries(predictions.models).map(([model, result]) => (
                    <div key={model} className="rounded-lg bg-muted/50 border border-border p-4">
                      <h3 className="font-medium text-sm uppercase tracking-wide mb-2">
                        {model === 'rf' ? 'Random Forest' : model === 'xgb' ? 'XGBoost' : 'Logistic Regression'}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div>Candidates: {result.predictions.filter(p => p === 1).length}</div>
                        <div>False Positives: {result.predictions.filter(p => p === 0).length}</div>
                        <div>Total Samples: {result.predictions.length}</div>
                        <div>Avg. Confidence: {(result.probabilities.reduce((a, b) => a + b, 0) / result.probabilities.length).toFixed(3)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Predictions Yet</CardTitle>
              <CardDescription>
                Upload CSV data in the AI/ML page to see prediction results here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Go to the AI/ML page and upload your exoplanet data to see visualizations here.
                </p>
                <button
                  onClick={goToAIML}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 mx-auto"
                >
                  Upload Data <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}
