import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileCode, Upload, Send, Loader2, Bot, Trash2, RotateCcw, ShieldAlert, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { analyzeFiles } from "@/src/services/aiService";

interface LocalFile {
  name: string;
  content: string;
}

export default function FileScanner() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [scannedFiles, setScannedFiles] = useState<LocalFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<{timestamp: number, result: string, files: string[]}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const history = localStorage.getItem("brc7_file_history");
    if (history) {
      setScanHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    if (scanHistory.length > 0) {
      localStorage.setItem("brc7_file_history", JSON.stringify(scanHistory));
    }
  }, [scanHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).slice(0, 4);
      setSelectedFiles(filesArr);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const fileData: LocalFile[] = [];
    
    for (const file of selectedFiles) {
      const text = await file.text();
      fileData.push({ name: file.name, content: text });
    }

    setScannedFiles(fileData);

    try {
      const result = await analyzeFiles(fileData);
      setAnalysisResult(result);
      
      const newHistory = {
        timestamp: Date.now(),
        result,
        files: fileData.map(f => f.name)
      };
      
      setScanHistory(prev => [newHistory, ...prev]);
    } catch (error) {
      setAnalysisResult("❌ Failed to analyze files. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setSelectedFiles([]);
    setAnalysisResult(null);
    setScannedFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-2">File Vulnerability Scanner</h2>
        <p className="text-zinc-500">Secure your source code before deployment. Upload up to 4 files.</p>
      </div>

      <AnimatePresence mode="wait">
        {!analysisResult && !isAnalyzing ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-12 text-center cursor-pointer hover:border-red-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept=".js,.ts,.tsx,.py,.php,.java,.c,.cpp,.html,.css,.json" 
              />
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-red-500/10 transition-all">
                <Upload className="w-10 h-10 text-zinc-400 group-hover:text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Drop files here or click to browse</h3>
              <p className="text-zinc-500 text-sm">Supported: JS, TS, Python, PHP, Java, C++, HTML, and more</p>
            </div>

            {selectedFiles.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="relative group p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm">
                      <button 
                        onClick={() => removeFile(i)}
                        className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-full text-zinc-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <FileText className="w-8 h-8 text-blue-500 mb-3" />
                      <p className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-100">{file.name}</p>
                      <p className="text-[10px] text-zinc-400 uppercase font-black">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={startAnalysis}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-[0.98]"
                >
                  <Send className="w-5 h-5" />
                  <span>Sent to AI</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
              <Bot className="w-10 h-10 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h3 className="text-2xl font-black mb-2 animate-pulse">AI is Thinking...</h3>
            <p className="text-zinc-500">Our security expert is analyzing your files for vulnerabilities.</p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold">Security Analysis Results</h3>
                  <p className="text-xs text-zinc-500">Comprehensive report for {selectedFiles.length} files</p>
                </div>
              </div>
              <button 
                onClick={resetScanner}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-all text-sm font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                Upload Again
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm prose dark:prose-invert max-w-none">
              <ReactMarkdown>{analysisResult || ""}</ReactMarkdown>
            </div>
            
            <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-400 mb-1">Developer Note</h4>
                <p className="text-sm text-red-800/70 dark:text-red-400/70 leading-relaxed">
                  While our AI is highly advanced, it may miss some edge cases. Always perform manual peer reviews for critical production code.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Section */}
      {!isAnalyzing && scanHistory.length > 0 && !analysisResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-20">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-zinc-400" />
            Recent Scans
          </h3>
          <div className="grid gap-4">
            {scanHistory.slice(0, 5).map((scan, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setAnalysisResult(scan.result);
                  setSelectedFiles(scan.files.map(name => new File([], name))); // Mock files for UI
                }}
                className="group p-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl cursor-pointer hover:border-red-500/30 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">Scan: {scan.files.join(", ")}</p>
                    <span className="text-[10px] bg-green-500 text-white px-1.5 rounded uppercase font-black">Completed</span>
                  </div>
                  <p className="text-xs text-zinc-400">{new Date(scan.timestamp).toLocaleString()}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 text-white rounded-lg">
                   <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
