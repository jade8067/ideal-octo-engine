import { GoogleGenAI, Type } from "@google/genai";
import type { Task } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  // The environment is expected to provide this variable.
  console.warn("API_KEY environment variable not set. Using mock data might be necessary.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateSampleTasks(): Promise<Task[]> {
  try {
    const prompt = `請為一個名為「鄰里幫」的社區互助平台生成 10 個多樣化的任務範例。任務應涵蓋以下類別：家務助理、簡易維修、陪伴關懷、跑腿代辦。每個任務都需要包含：標題、詳細描述、類別、獎勵金額（新台幣）、任務地點（台灣的隨機地址）、發布者姓名、發布者信任分數（1-5分的整數）、發布者是否為認證幫手（布林值）、是否需要社福認證、以及預計完成時間(從 '30分鐘', '1小時', '2小時', '半天' 中擇一)。如果發布者是認證幫手 (posterIsCertified is true)，請同時提供一個偽造的認證機構名稱 (posterCertificationOrg)，例如「台北市社會福利聯盟」。部分任務請隨機加入一個可選的任務截止時間 (deadline)，格式為 'YYYY-MM-DDTHH:mm'。請以繁體中文回答。`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: '任務的標題' },
                        description: { type: Type.STRING, description: '任務的詳細描述' },
                        category: { type: Type.STRING, description: '任務類別：家務助理、簡易維修、陪伴關懷、跑腿代辦' },
                        reward: { type: Type.INTEGER, description: '新台幣的獎勵金額' },
                        location: { type: Type.STRING, description: '任務地點，例如：台北市信義區' },
                        posterName: { type: Type.STRING, description: '發布任務者的隨機姓名' },
                        posterTrustScore: { type: Type.INTEGER, description: '發布者的信任分數，1到5' },
                        requiresCertification: { type: Type.BOOLEAN, description: '此任務是否需要社福認證' },
                        posterIsCertified: { type: Type.BOOLEAN, description: '發布者是否為認證幫手' },
                        posterCertificationOrg: { type: Type.STRING, description: '如果發布者是認證幫手，其認證機構的名稱' },
                        estimatedDuration: { type: Type.STRING, description: '預計完成時間，例如：30分鐘、1小時、2小時、半天' },
                        deadline: { type: Type.STRING, description: "任務的截止時間，格式為 'YYYY-MM-DDTHH:mm'，此為選填欄位" },
                    },
                    required: ["title", "description", "category", "reward", "location", "posterName", "posterTrustScore", "requiresCertification", "posterIsCertified", "estimatedDuration"],
                },
            },
        },
    });

    const jsonString = response.text.trim();
    const generatedTasks = JSON.parse(jsonString);
    
    // Add a unique ID and status to each task
    return generatedTasks.map((task: Omit<Task, 'id' | 'status'>, index: number) => ({
        ...task,
        id: `${new Date().getTime()}-${index}`,
        status: 'Open',
    }));

  } catch (error) {
    console.error("Error generating tasks with Gemini:", error);
    throw new Error("Failed to fetch tasks from Gemini API.");
  }
}