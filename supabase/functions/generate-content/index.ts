import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change to your Vercel domain for production: "https://your-app.vercel.app"
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const platformPrompts: Record<string, string> = {
  twitter:
    "Write a concise, engaging tweet (max 280 characters). Include 3-5 relevant hashtags. Make it punchy and shareable.",
  instagram:
    "Write an Instagram caption (150-300 words). Include a hook in the first line, use emojis naturally, and add 10-15 relevant hashtags at the end.",
  linkedin:
    "Write a professional LinkedIn post (200-400 words). Start with a compelling hook, include insights or a story, end with a question or CTA.",
  blog:
    "Write a blog post outline with introduction (100 words), 3-5 key sections with bullet points, and a conclusion. Total 400-600 words.",
  youtube:
    "Write a YouTube video script with: Hook (10 seconds), Intro (30 seconds), Main Content (3-5 key points with talking points), CTA, and Outro. Include [B-ROLL] suggestions.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, platforms, tone } = await req.json();

    if (!idea || !platforms || platforms.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing idea or platforms" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const content: Record<string, any> = {};

    for (const platform of platforms) {
      const systemPrompt = `You are a professional content creator. Generate content with a ${tone} tone. ${platformPrompts[platform] || "Write engaging content for this platform."}

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "text": "the generated content text",
  "hashtags": ["hashtag1", "hashtag2"],
  "wordCount": 42,
  "tone": "${tone}"
}

Do not include any text outside the JSON object.`;

      const response = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: systemPrompt },
              {
                role: "user",
                content: `Generate ${platform} content for this idea: "${idea}"`,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits exhausted. Please add credits in your workspace settings." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errText = await response.text();
        console.error(`AI gateway error for ${platform}:`, response.status, errText);
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const aiData = await response.json();
      const rawContent = aiData.choices?.[0]?.message?.content || "";

      try {
        // Try to parse JSON from the response
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content[platform] = JSON.parse(jsonMatch[0]);
        } else {
          content[platform] = {
            text: rawContent,
            hashtags: [],
            wordCount: rawContent.split(/\s+/).length,
            tone: tone,
          };
        }
      } catch {
        content[platform] = {
          text: rawContent,
          hashtags: [],
          wordCount: rawContent.split(/\s+/).length,
          tone: tone,
        };
      }
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-content error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
