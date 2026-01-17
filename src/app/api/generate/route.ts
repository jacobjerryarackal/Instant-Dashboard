import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';

// Schema validation - FIXED: Use z.any() instead of z.record(z.any())
const RequestSchema = z.object({
  jsonData: z.any(),
  userPrompt: z.string().min(1).max(500),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt - this is CRITICAL for controlling costs
const SYSTEM_PROMPT = `You are a frontend developer. Your task is to generate ONLY HTML and CSS code for a dashboard based on JSON data.

RULES:
1. Return ONLY valid HTML/CSS code, no markdown, no explanations
2. Use inline CSS only, no external stylesheets
3. DO NOT use JavaScript
4. Use the EXACT data from the JSON provided
5. Keep the code minimal and efficient
6. Make it responsive for different screen sizes
7. Structure: header with title, main content with visualizations, footer if needed
8. Use semantic HTML5 elements

Example structure:
<!DOCTYPE html>
<html>
<head><style>/* CSS here */</style></head>
<body>
  <div class="dashboard">...</div>
</body>
</html>`;

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request
    const body = await request.json();
    const { jsonData, userPrompt } = RequestSchema.parse(body);
    
    // 2. Create the user prompt with data context
    const userPromptWithData = `
USER PROMPT: ${userPrompt}

JSON DATA:
${JSON.stringify(jsonData, null, 2)}

Generate a clean, modern dashboard based on the above data and prompt.`;

    // 3. Call OpenAI with TOKEN LIMITS to control costs
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",  // Using cheaper model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPromptWithData }
      ],
      temperature: 0.3,  // Lower temperature for more consistent outputs
      max_tokens: 2000,  // LIMIT tokens to control costs
      stream: false,
    });

    const generatedCode = completion.choices[0]?.message?.content || '';

    // 4. Validate the generated code is HTML
    if (!generatedCode.includes('<!DOCTYPE html>') && !generatedCode.includes('<html')) {
      throw new Error('Generated code is not valid HTML');
    }

    return NextResponse.json({ code: generatedCode });
  } catch (error) {
    console.error('Generation error:', error);
    
    // 5. Provide fallback for API failures
    const fallbackHtml = generateFallbackHtml();
    return NextResponse.json(
      { 
        code: fallbackHtml,
        error: error instanceof Error ? error.message : 'Generation failed',
        usingFallback: true
      },
      { status: error instanceof z.ZodError ? 400 : 500 }
    );
  }
}

// Fallback HTML generator for when API fails
function generateFallbackHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .dashboard { max-width: 1200px; margin: 0 auto; }
    .header { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
    .stat-card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .table-container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; }
    .error-banner { background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="dashboard">
    <div class="error-banner">
      ⚠️ API Limit Reached - Using Fallback Dashboard
    </div>
    <div class="header">
      <h1>Dashboard Preview</h1>
      <p>Add your JSON data and prompt to generate a custom dashboard</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Items</h3>
        <p class="stat-value">4</p>
      </div>
      <div class="stat-card">
        <h3>Total Amount</h3>
        <p class="stat-value">$2,200</p>
      </div>
    </div>
    <div class="table-container">
      <h2>Sample Data</h2>
      <table>
        <thead>
          <tr><th>Item</th><th>Amount</th></tr>
        </thead>
        <tbody>
          <tr><td>Sample Item 1</td><td>$500</td></tr>
          <tr><td>Sample Item 2</td><td>$700</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
}