import { GoogleGenAI, Type } from "@google/genai";
import { FAQ, MarketingEmail, SocialMediaPost, FeedbackSummary } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getParsedJsonResponse = async <T,>(model: string, prompt: string, schema: any): Promise<T> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });
    
    const text = response.text.trim();
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get a valid response from the AI. Details: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};


export const generateFAQs = async (businessDescription: string): Promise<FAQ[]> => {
  const prompt = `Act as a customer support expert. Based on the following business description, generate a list of 10-15 frequently asked questions (FAQs) with clear and concise answers. 
  
  Business Description: "${businessDescription}"`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: 'The frequently asked question.' },
        answer: { type: Type.STRING, description: 'A clear and helpful answer to the question.' },
      },
      required: ['question', 'answer'],
    },
  };

  return getParsedJsonResponse<FAQ[]>("gemini-2.5-flash", prompt, schema);
};


export const composeMarketingEmail = async (customerSegment: string, emailGoal: string): Promise<MarketingEmail> => {
    const prompt = `You are an expert marketing copywriter. Draft a compelling and personalized marketing email for the following scenario. The email should have a catchy subject line and a clear call to action.
    
    Customer Segment: "${customerSegment}"
    Email Goal: "${emailGoal}"`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            subject: { type: Type.STRING, description: 'A catchy and engaging email subject line.' },
            body: { type: Type.STRING, description: 'The full body of the marketing email, including greeting, main content, and call to action.' },
        },
        required: ['subject', 'body'],
    };

    return getParsedJsonResponse<MarketingEmail>("gemini-2.5-flash", prompt, schema);
};

export const generateSocialMediaIdeas = async (topic: string): Promise<SocialMediaPost[]> => {
    const prompt = `You are a creative social media strategist. Generate 5 unique and engaging social media post ideas for the topic: "${topic}". For each idea, provide a platform suggestion (e.g., Instagram, Twitter, LinkedIn), the post copy, and a suggestion for a visual (e.g., 'image of...', 'short video showing...').`;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                platform: { type: Type.STRING, description: 'The recommended social media platform for the post.' },
                copy: { type: Type.STRING, description: 'The text content for the social media post.' },
                visual: { type: Type.STRING, description: 'A suggestion for a relevant visual element (image, video, graphic).' },
            },
            required: ['platform', 'copy', 'visual'],
        }
    };

    return getParsedJsonResponse<SocialMediaPost[]>("gemini-2.5-flash", prompt, schema);
};

export const summarizeFeedback = async (feedbackText: string): Promise<FeedbackSummary> => {
    const prompt = `Act as a product manager analyzing customer feedback. Read the following customer reviews and summarize the key information. Identify the main positive themes, the primary areas for improvement, and any actionable suggestions.
    
    Customer Feedback: "${feedbackText}"`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            positiveThemes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of recurring positive comments or themes.' },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of common complaints or areas needing improvement.' },
            actionableSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of concrete actions the business can take based on the feedback.' },
        },
        required: ['positiveThemes', 'areasForImprovement', 'actionableSuggestions'],
    };
    
    return getParsedJsonResponse<FeedbackSummary>("gemini-2.5-pro", prompt, schema);
};

export const generateImage = async (prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4', style: string): Promise<string> => {
  try {
    let finalPrompt = prompt;
    if (style && style !== 'none') {
        finalPrompt = `${prompt}, in the style of ${style}`;
    }

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed, no images were returned from the API.");
    }
    
    return response.generatedImages[0].image.imageBytes;
  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image. Details: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};