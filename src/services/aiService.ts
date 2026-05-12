import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeUrl(sourceCode: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `You are an expert Cyber Security Researcher and Ethical Hacker. 
Analyze the following website source code for vulnerabilities (such as XSS, SQL injection, insecure headers, outdated libraries, exposed secrets, etc.).
If the source code is empty or just basic HTML, explain what common vulnerabilities a site like this might have.
Provide a detailed report in a structured format:
1. Vulnerability Name
2. Severity (High/Medium/Low)
3. Description
4. Proof of Concept / Explanation
5. Remediation (How to fix it)
Provide your output in Markdown format.

Source Code:
${sourceCode.substring(0, 30000)} // Limiting to prevent token overflow
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "No response from AI.";
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return `Error during AI analysis: ${error.message}`;
  }
}

export async function analyzeFiles(files: { name: string; content: string }[]) {
  const model = "gemini-3-flash-preview";
  const filesContext = files.map(f => `File: ${f.name}\nContent:\n${f.content}`).join("\n\n---\n\n");
  
  const prompt = `You are a Senior Security Engineer. 
I have uploaded ${files.length} files that are part of a project. 
Analyze these files for vulnerabilities, logical errors, insecure coding practices, or potential bugs before the code is deployed.
Provide a detailed report in a structured format:
1. Identified Issue
2. Severity
3. File/Line references
4. Recommendation
Provide your output in Markdown format.

Files:
${filesContext.substring(0, 30000)}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "No response from AI.";
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return `Error during AI analysis: ${error.message}`;
  }
}
