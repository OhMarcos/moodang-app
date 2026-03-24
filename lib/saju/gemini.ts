import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_AI_API_KEY ?? "";

export const ai = new GoogleGenAI({ apiKey });

export const GEMINI_MODEL = "gemini-2.5-flash";
