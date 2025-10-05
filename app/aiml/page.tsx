/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import * as XLSX from 'xlsx';
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
  Grid3X3,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import { saveAndStore, loadStored, clearSessionStorage } from "@/lib/storage";

// Feature columns from your backend
const FEATURE_COLUMNS = [
  "DispositionScore",
  "OrbitalPeriod_days",
  "OrbitalPeriodUpperUnc_days",
  "OrbitalPeriodLowerUnc_days",
  "TransitEpoch_BKJD",
  "TransitEpochUpperUnc_BKJD",
  "TransitEpochLowerUnc_BKJD",
  "ImpactParamete",
  "ImpactParameterUpperUnc",
  "ImpactParameterLowerUnc",
  "TransitDuration_hrs",
  "TransitDurationUpperUnc_hrs",
  "TransitDurationLowerUnc_hrs",
  "TransitDepth_ppm",
  "TransitDepthUpperUnc_ppm",
  "TransitDepthLowerUnc_ppm",
  "PlanetaryRadius_Earthradii",
  "PlanetaryRadiusUpperUnc_Earthradii",
  "PlanetaryRadiusLowerUnc_Earthradii",
  "EquilibriumTemperatureK",
  "InsolationFlux_Earthflux",
  "InsolationFluxUpperUnc_Earthflux",
  "InsolationFluxLowerUnc_Earthflux",
  "TransitSignal-to-Nois",
  "TCEPlanetNumbe",
  "StellarEffectiveTemperatureK",
  "StellarEffectiveTemperatureUpperUncK",
  "StellarEffectiveTemperatureLowerUncK",
  "StellarSurfaceGravity_log10(cm/s**2)",
  "StellarSurfaceGravityUpperUnc_log10(cm/s**2)",
  "StellarSurfaceGravityLowerUnc_log10(cm/s**2)",
  "StellarRadius_Solarradii",
  "StellarRadiusUpperUnc_Solarradii",
  "StellarRadiusLowerUnc_Solarradii",
  "RA_decimaldegrees",
  "Dec_decimaldegrees",
  "Kepler-band_mag"
];

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

interface DataRow {
  id: string;
  [key: string]: any;
}

const STORAGE_KEYS = {
  fileData: "aiml_fileData",
  fileStats: "aiml_fileStats",
  predictions: "aiml_predictions",
  manualData: "aiml_manualData"
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function AIMLPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileStats, setFileStats] = useState<FileStats | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [inputMode, setInputMode] = useState<'file' | 'manual'>('file');
  const [manualData, setManualData] = useState<DataRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();

  // Initialize with one empty row
  const createEmptyRow = useCallback((): DataRow => ({
    id: Date.now().toString() + Math.random(),
    ...FEATURE_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: '' }), {})
  }), []);

  // Load stored data on mount
  useEffect(() => {
    const storedFileStats = loadStored<FileStats>(STORAGE_KEYS.fileStats);
    const storedPredictions = loadStored<PredictionResult>(STORAGE_KEYS.predictions);
    const storedManualData = loadStored<DataRow[]>(STORAGE_KEYS.manualData);

    if (storedFileStats) setFileStats(storedFileStats);
    if (storedPredictions) setPredictions(storedPredictions);
    if (storedManualData && storedManualData.length > 0) {
      setManualData(storedManualData);
    } else {
      setManualData([createEmptyRow()]);
    }

    const timer = setTimeout(() => {
      if (!storedPredictions) setShowPopup(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [createEmptyRow]);

  // Handle Excel/CSV file upload
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setPredictions(null);

      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Handle Excel file
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            const stats = {
              name: selectedFile.name,
              size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
              rows: jsonData.length,
              columns: Array.isArray(jsonData[0]) ? (jsonData[0] as any[]).length : 0,
            };
            setFileStats(stats);
            saveAndStore(STORAGE_KEYS.fileStats, stats);
          } catch (error) {
            setError("Failed to parse Excel file");
          }
        };
        reader.readAsArrayBuffer(selectedFile);
      } else {
        // Handle CSV file (existing logic)
        Papa.parse(selectedFile, {
          header: false,
          preview: 1,
          skipEmptyLines: true,
          complete: (results) => {
            const stats = {
              name: selectedFile.name,
              size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
              rows: results.data.length,
              columns: Array.isArray(results.data[0]) ? results.data[0].length : 0,
            };
            setFileStats(stats);
            saveAndStore(STORAGE_KEYS.fileStats, stats);
          },
        });
      }
    }
  }, []);

  // Validate manual data
  const validateData = useCallback((data: DataRow[]): boolean => {
    const errors: {[key: string]: string} = {};
    
    data.forEach((row, rowIndex) => {
      FEATURE_COLUMNS.forEach(col => {
        const value = row[col];
        if (value === '' || value === null || value === undefined) {
          errors[`${rowIndex}-${col}`] = 'Required';
        } else if (isNaN(Number(value))) {
          errors[`${rowIndex}-${col}`] = 'Must be a number';
        }
      });
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  // Handle manual data input
  const updateCellValue = useCallback((rowId: string, column: string, value: string) => {
    setManualData(prev => {
      const updated = prev.map(row => 
        row.id === rowId ? { ...row, [column]: value } : row
      );
      saveAndStore(STORAGE_KEYS.manualData, updated);
      return updated;
    });
  }, []);

  // Add new row
  const addRow = useCallback(() => {
    const newRow = createEmptyRow();
    setManualData(prev => {
      const updated = [...prev, newRow];
      saveAndStore(STORAGE_KEYS.manualData, updated);
      return updated;
    });
  }, [createEmptyRow]);

  // Remove row
  const removeRow = useCallback((rowId: string) => {
    setManualData(prev => {
      const updated = prev.filter(row => row.id !== rowId);
      const final = updated.length === 0 ? [createEmptyRow()] : updated;
      saveAndStore(STORAGE_KEYS.manualData, final);
      return final;
    });
  }, [createEmptyRow]);

  // Handle upload/analysis
  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    clearSessionStorage(Object.values(STORAGE_KEYS));

    try {
      let data: any[][] = [];

      if (inputMode === 'manual') {
        // Validate manual data
        if (!validateData(manualData)) {
          throw new Error("Please fix validation errors before analyzing");
        }

        // Convert manual data to array format
        data = manualData.map(row => 
          FEATURE_COLUMNS.map(col => parseFloat(row[col]) || 0)
        );
      } else {
        // Handle file upload
        if (!file) {
          throw new Error("Please select a file");
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          // Parse Excel file
          const arrayBuffer = await file.arrayBuffer();
          const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        } else {
          // Parse CSV file
          const parseResults = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
            Papa.parse(file, {
              header: false,
              skipEmptyLines: true,
              complete: resolve,
              error: reject,
            });
          });
          data = parseResults.data;
        }
      }

      // Validate data format
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Data is empty or invalid");
      }

      const expectedFeatures = 37;
      const invalidRows = data.filter(row => !Array.isArray(row) || row.length !== expectedFeatures);
      
      if (invalidRows.length > 0) {
        throw new Error(`Invalid data format. Expected ${expectedFeatures} features per row, but found rows with different lengths.`);
      }

      // Send to backend
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

      // Save results
      saveAndStore(STORAGE_KEYS.fileData, data);
      saveAndStore(STORAGE_KEYS.predictions, result);
      if (fileStats) saveAndStore(STORAGE_KEYS.fileStats, fileStats);

      setPredictions(result);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze data");
    } finally {
      setLoading(false);
    }
  }, [file, fileStats, inputMode, manualData, validateData]);

  // Download template
  const downloadTemplate = useCallback(() => {
    const templateData = [FEATURE_COLUMNS];
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exoplanet_Template");
    XLSX.writeFile(workbook, "exoplanet_data_template.xlsx");
  }, []);

  // Download results
  const downloadResults = useCallback(() => {
    if (!predictions) return;
    const dataStr = JSON.stringify(predictions, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `predictions_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [predictions]);

  const goToData = () => {
    setShowPopup(false);
    router.push("/data");
  };

  const canAnalyze = useMemo(() => {
    if (inputMode === 'manual') {
      return manualData.some(row => 
        FEATURE_COLUMNS.some(col => row[col] !== '' && row[col] !== null && row[col] !== undefined)
      );
    }
    return file && fileStats && (fileStats.columns === 37);
  }, [inputMode, manualData, file, fileStats]);

  return (
    <PageWrapper
      title="AI/ML Exoplanet Detection"
      description="Input astronomical data manually or upload files for exoplanet classification using trained ML models."
    >
      {/* Popup */}
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
              Check out real-time model health monitoring, feature analysis, and prediction visualizations.
            </p>
            <div className="flex gap-2">
              <button onClick={goToData} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                <ArrowLeft className="h-4 w-4" /> Go to Data
              </button>
              <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90">
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button onClick={goToData} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90">
            <ArrowLeft className="h-4 w-4" /> Data Analysis
          </button>
          <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90">
            <Download className="h-4 w-4" /> Download Template
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
          <button
            onClick={() => setInputMode('file')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              inputMode === 'file' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            <Upload className="h-4 w-4" />
            File Upload
          </button>
          <button
            onClick={() => setInputMode('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              inputMode === 'manual' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            Manual Input
          </button>
        </div>

        {/* File Upload Mode */}
        {inputMode === 'file' && (
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-md ring-1 ring-primary/40 bg-primary/10">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">File Upload</h2>
                <p className="text-sm text-muted-foreground">
                  Upload CSV or Excel files with 37 astronomical features
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="data-file" className="relative flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 cursor-pointer hover:border-primary/50 hover:bg-muted transition-colors">
                <input
                  id="data-file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="sr-only"
                  disabled={loading}
                />
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {file ? file.name : "Click to select CSV or Excel file"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fileStats ? `${fileStats.size} • ${fileStats.rows} rows • ${fileStats.columns} columns` : "CSV, XLSX, XLS files • Max 10MB"}
                  </p>
                </div>
              </label>

              {fileStats && (
                <div className={`rounded-lg p-3 text-sm ${
                  fileStats.columns === 37 
                    ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200"
                    : "bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200"
                }`}>
                  <div className="flex items-center gap-2">
                    {fileStats.columns === 37 ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>
                      {fileStats.columns === 37 ? "✓ File format is correct (37 features)" : `⚠ Expected 37 features, found ${fileStats.columns}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Manual Input Mode */}
        {inputMode === 'manual' && (
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md ring-1 ring-primary/40 bg-primary/10">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Manual Data Input</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter astronomical data directly in the spreadsheet below
                  </p>
                </div>
              </div>
              <button onClick={addRow} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                <Plus className="h-4 w-4" /> Add Row
              </button>
            </div>

            {/* Excel-like Data Grid */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="w-12 p-2 border-r border-border">#</th>
                      {FEATURE_COLUMNS.map((col, idx) => (
                        <th key={col} className="min-w-32 p-2 border-r border-border text-left font-medium">
                          <div className="truncate" title={col}>
                            {idx + 1}. {col}
                          </div>
                        </th>
                      ))}
                      <th className="w-12 p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualData.map((row, rowIndex) => (
                      <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-2 border-r border-border text-center font-mono text-xs bg-muted/30">
                          {rowIndex + 1}
                        </td>
                        {FEATURE_COLUMNS.map(col => (
                          <td key={col} className="p-1 border-r border-border">
                            <input
                              type="number"
                              step="any"
                              value={row[col] || ''}
                              onChange={(e) => updateCellValue(row.id, col, e.target.value)}
                              className={`w-full p-1 text-xs border-0 bg-transparent focus:bg-background focus:ring-1 focus:ring-primary rounded ${
                                validationErrors[`${rowIndex}-${col}`] ? 'ring-1 ring-destructive' : ''
                              }`}
                              placeholder="0.0"
                            />
                          </td>
                        ))}
                        <td className="p-2 text-center">
                          <button
                            onClick={() => removeRow(row.id)}
                            disabled={manualData.length === 1}
                            className="text-destructive hover:bg-destructive/10 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {Object.keys(validationErrors).length > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive-foreground">
                  Please fix validation errors in the highlighted cells
                </p>
              </div>
            )}
          </section>
        )}

        {/* Analyze Button */}
        <section className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading || !canAnalyze}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-6 w-6" />
                Analyze Data
              </>
            )}
          </button>
        </section>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive-foreground">{error}</p>
            </div>
          </div>
        )}

        {/* Predictions Section */}
        {predictions && (
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md ring-1 ring-green-500/40 bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Analysis Results</h2>
                  <p className="text-sm text-muted-foreground">
                    {Object.keys(predictions.models).length} model predictions generated
                  </p>
                </div>
              </div>
              <button onClick={downloadResults} className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                <Download className="h-4 w-4" /> Download Results
              </button>
            </div>

            {/* Model Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {Object.entries(predictions.models).map(([model, result]) => (
                <div key={model} className="rounded-lg bg-muted/50 border border-border p-4">
                  <h3 className="font-medium text-sm uppercase tracking-wide mb-2">
                    {model === "rf" ? "Random Forest" : model === "xgb" ? "XGBoost" : "Logistic Regression"}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div>Candidates: {result.predictions.filter((p) => p === 1).length}</div>
                    <div>False Positives: {result.predictions.filter((p) => p === 0).length}</div>
                    <div>Avg. Confidence: {(result.probabilities.reduce((a, b) => a + b, 0) / result.probabilities.length).toFixed(3)}</div>
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

        {/* Instructions */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-3">Instructions</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>File Upload:</strong> Upload CSV or Excel files with exactly 37 numerical features per row</p>
            <p>• <strong>Manual Input:</strong> Enter data directly in the spreadsheet interface</p>
            <p>• <strong>Template:</strong> Download the Excel template to see the required format</p>
            <p>• <strong>Features:</strong> Include orbital parameters, stellar properties, and transit characteristics</p>
            <p>• <strong>Models:</strong> Random Forest, XGBoost, Logistic Regression</p>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
