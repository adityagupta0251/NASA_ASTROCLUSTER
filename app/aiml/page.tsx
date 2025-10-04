/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { PageWrapper } from "../components/page-wrapper";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowLeft,
  X,
} from "lucide-react";
import { saveAndStore, loadStored, clearSessionStorage } from "@/lib/storage";

interface PredictionResult {
  models: {
    [key: string]: {
      predictions: number[];
      probabilities: number[];
    };
  };
}

interface FileStats {
  name: string;
  size: string;
  rows: number;
  columns: number;
}

const STORAGE_KEYS = {
  fileData: "aiml_fileData",
  fileStats: "aiml_fileStats",
  predictions: "aiml_predictions",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function AIMLPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileStats, setFileStats] = useState<FileStats | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  // Load stored data on mount
  useEffect(() => {
    const storedFileStats = loadStored<FileStats>(STORAGE_KEYS.fileStats);
    const storedPredictions = loadStored<PredictionResult>(
      STORAGE_KEYS.predictions
    );

    if (storedFileStats) setFileStats(storedFileStats);
    if (storedPredictions) setPredictions(storedPredictions);

    // Show popup after 3 seconds if no predictions
    const timer = setTimeout(() => {
      if (!storedPredictions) setShowPopup(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        setError(null);
        setPredictions(null);

        // Parse file to get stats
        Papa.parse(selectedFile, {
          header: false,
          preview: 1,
          skipEmptyLines: true,
          complete: (results) => {
            const stats = {
              name: selectedFile.name,
              size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
              rows: results.data.length,
              columns: Array.isArray(results.data[0])
                ? results.data[0].length
                : 0,
            };
            setFileStats(stats);
            saveAndStore(STORAGE_KEYS.fileStats, stats);
          },
        });
      }
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setLoading(true);
    setError(null);

    // Clear session storage on new upload
    clearSessionStorage(Object.values(STORAGE_KEYS));

    try {
      const parseResults = await new Promise<Papa.ParseResult<any>>(
        (resolve, reject) => {
          Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: resolve,
            error: reject,
          });
        }
      );

      const data = parseResults.data;

      // Validate data format
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("CSV file is empty or invalid");
      }

      // Check if all rows have the expected number of features (37)
      const expectedFeatures = 37;
      const invalidRows = data.filter(
        (row) => !Array.isArray(row) || row.length !== expectedFeatures
      );

      if (invalidRows.length > 0) {
        throw new Error(
          `Invalid data format. Expected ${expectedFeatures} features per row, but found rows with different lengths.`
        );
      }

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const result = await response.json();

      // Save to storage
      saveAndStore(STORAGE_KEYS.fileData, data);
      saveAndStore(STORAGE_KEYS.predictions, result);
      if (fileStats) saveAndStore(STORAGE_KEYS.fileStats, fileStats);

      setPredictions(result);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get predictions. Please check your CSV format."
      );
    } finally {
      setLoading(false);
    }
  }, [file, fileStats]);

  const downloadResults = useCallback(() => {
    if (!predictions) return;

    const dataStr = JSON.stringify(predictions, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `predictions_${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [predictions]);

  const goToData = () => {
    setShowPopup(false);
    router.push("/data");
  };

  return (
    <PageWrapper
      title="AI/ML Exoplanet Detection"
      description="Upload CSV datasets containing astronomical features to predict exoplanet candidates using trained ML models."
    >
      {/* Popup for Data Analysis Navigation */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Explore Data Analysis!</h3>
              <button onClick={() => setShowPopup(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-muted-foreground mb-4">
              Check out real-time model health monitoring, feature analysis, and
              prediction visualizations.
            </p>
            <div className="flex gap-2">
              <button
                onClick={goToData}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                <ArrowLeft className="h-4 w-4" /> Go to Data
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
        {/* Navigation */}
        <div className="flex justify-start">
          <button
            onClick={goToData}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" /> Data Analysis
          </button>
        </div>

        {/* Upload Section */}
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-md ring-1 ring-primary/40 bg-primary/10">
              <Upload className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">CSV Data Upload</h2>
              <p className="text-sm text-muted-foreground">
                Upload astronomical data with 37 features for exoplanet
                classification
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* File Input */}
            <div className="flex flex-col gap-3">
              <label
                htmlFor="csv-file"
                className="relative flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 cursor-pointer hover:border-primary/50 hover:bg-muted transition-colors"
              >
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="sr-only"
                  disabled={loading}
                />
                <FileText
                  className="h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {file ? file.name : "Click to select CSV file"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fileStats
                      ? `${fileStats.size} • ${fileStats.rows} rows • ${fileStats.columns} columns`
                      : "CSV files only • Max 10MB"}
                  </p>
                </div>
              </label>

              {/* File Validation Info */}
              {fileStats && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    fileStats.columns === 37
                      ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200"
                      : "bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {fileStats.columns === 37 ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span>
                      {fileStats.columns === 37
                        ? "✓ File format is correct (37 features)"
                        : `⚠ Expected 37 features, found ${fileStats.columns}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={loading || !file || fileStats?.columns !== 37}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" aria-hidden="true" />
                    Upload & Predict
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive-foreground">{error}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Predictions Section */}
        {predictions && (
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md ring-1 ring-green-500/40 bg-green-500/10">
                  <CheckCircle2
                    className="h-5 w-5 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Prediction Results</h2>
                  <p className="text-sm text-muted-foreground">
                    {Object.keys(predictions.models).length} model predictions
                    generated
                  </p>
                </div>
              </div>
              <button
                onClick={downloadResults}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                Download JSON
              </button>
            </div>

            {/* Model Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {Object.entries(predictions.models).map(([model, result]) => (
                <div
                  key={model}
                  className="rounded-lg bg-muted/50 border border-border p-4"
                >
                  <h3 className="font-medium text-sm uppercase tracking-wide mb-2">
                    {model === "rf"
                      ? "Random Forest"
                      : model === "xgb"
                      ? "XGBoost"
                      : "Logistic Regression"}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      Candidates:{" "}
                      {result.predictions.filter((p) => p === 1).length}
                    </div>
                    <div>
                      False Positives:{" "}
                      {result.predictions.filter((p) => p === 0).length}
                    </div>
                    <div>
                      Avg. Confidence:{" "}
                      {(
                        result.probabilities.reduce((a, b) => a + b, 0) /
                        result.probabilities.length
                      ).toFixed(3)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Raw JSON */}
            <details className="rounded-lg bg-muted/50 border border-border">
              <summary className="p-4 cursor-pointer font-medium text-sm hover:bg-muted/70 transition-colors">
                View Raw JSON Response
              </summary>
              <div className="px-4 pb-4 overflow-x-auto">
                <pre className="text-xs text-foreground/90 font-mono whitespace-pre-wrap">
                  {JSON.stringify(predictions, null, 2)}
                </pre>
              </div>
            </details>
          </section>
        )}

        {/* Instructions Section */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-3">
            Data Format Requirements
          </h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              • CSV file with exactly <strong>37 numerical features</strong> per
              row
            </p>
            <p>
              • Features should include orbital parameters, stellar properties,
              and transit characteristics
            </p>
            <p>
              • No headers required - data will be processed as numerical arrays
            </p>
            <p>
              • Supported models: Random Forest, XGBoost, Logistic Regression
            </p>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
