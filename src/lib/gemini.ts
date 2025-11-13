/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/server/gemini.ts
import {
  GoogleGenerativeAI,
  type SingleRequestOptions,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const PROMPT = `You are an expert programmer summarizing a git diff.  
Use **bullet points**.  
Include file paths in **[brackets]**.  
Be concise, max 3 lines per commit.  

Example:
* Fixed typo in README [README.md]
* Added rate-limit middleware [src/middleware.ts]
* Updated deps

Summarize this diff:`;

interface ExtendedSingleRequestOptions extends SingleRequestOptions {
  safetySettings?: {
    category: string;
    threshold: string;
  }[];
}

export const aiSummarizeCommit = async (diff: string): Promise<string> => {
  try {
    const result = await model.generateContent([PROMPT, diff], {
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
      ],
    } as ExtendedSingleRequestOptions);

    const text = result.response.text().trim();
    return text || "No summary generated.";
  } catch (err: any) {
    console.error("Gemini summarization error:", err?.message ?? err);
    return "Summary failed – Gemini error.";
  }
};
