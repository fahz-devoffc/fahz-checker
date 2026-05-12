export type Tab = "main" | "web" | "file" | "developer";

export interface ScanResult {
  id: string;
  type: "web" | "file";
  target: string; // URL or File names
  vulnerabilities: string;
  timestamp: number;
}
