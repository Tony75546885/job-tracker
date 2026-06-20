import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

interface ParsedJob {
  company: string | null;
  position: string | null;
  techStack: string[];
  salary: string | null;
}

export const aiService = {
  async parseJobPosting(text: string): Promise<ParsedJob> {
    if (!env.ANTHROPIC_API_KEY) {
      throw ApiError.badRequest(
        "AI feature is not configured. Set ANTHROPIC_API_KEY in .env",
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Extract structured information from this job posting. Return ONLY valid JSON with these fields:
- company (string or null)
- position (string or null)
- techStack (array of strings - technologies/frameworks mentioned)
- salary (string or null - salary range if mentioned)

Job posting:
${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Claude API error:", err);
      throw ApiError.badRequest("Failed to parse job posting with AI");
    }

    const result = (await response.json()) as {
      content?: { text?: string }[];
    };
    const content = result.content?.[0]?.text ?? "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw ApiError.badRequest("AI returned unexpected format");
    }

    return JSON.parse(jsonMatch[0]) as ParsedJob;
  },
};
