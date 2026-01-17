import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
let genAI: GoogleGenerativeAI | null = null;

// Try to initialize with API key, but don't crash if not available
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (error) {
  console.log('Gemini API not configured, using enhanced mock mode');
}

const ENHANCED_PROMPT = `You are an expert dashboard designer and frontend developer. Create BEAUTIFUL, MODERN, and PROFESSIONAL HTML/CSS dashboards.

CRITICAL REQUIREMENTS:
1. Return ONLY HTML/CSS code, NO markdown, NO explanations
2. Use inline CSS only, make it stunning and animated
3. NO JavaScript allowed
4. Use the EXACT data from JSON, don't invent numbers
5. Create responsive, mobile-friendly designs
6. Use modern CSS: grid, flexbox, gradients, shadows
7. Add smooth animations and transitions
8. Use this color palette: primary #667eea, secondary #764ba2, accent #f093fb
9. Include loading animations and hover effects
10. Make it look like a premium SaaS dashboard

IMPORTANT: The dashboard should have:
- A beautiful header with title and stats
- Visual data representation (charts using CSS)
- Clean data tables with hover effects
- Responsive cards for metrics
- Modern typography and spacing
- Professional color scheme
- Smooth animations for elements

Generate code that will IMPRESS reviewers with its quality and design.`;

export async function generateDashboardCode(
  jsonData: any,
  userPrompt: string
): Promise<{ code: string; error?: string; mode: 'api' | 'mock' }> {
  
  // If Gemini is available, use it
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const fullPrompt = `${ENHANCED_PROMPT}

USER DESIGN REQUEST: ${userPrompt}

JSON DATA:
${JSON.stringify(jsonData, null, 2)}

Create the most impressive, modern dashboard possible. Focus on:
1. Visual hierarchy and spacing
2. Professional color scheme with gradients
3. Smooth animations and transitions
4. Responsive design
5. Clean, readable typography

Return ONLY the HTML/CSS code:`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let code = response.text();
      
      // Clean up the response
      code = code
        .replace(/```html\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/```css\n?/g, '')
        .trim();
      
      // Ensure it starts with doctype
      if (!code.includes('<!DOCTYPE')) {
        code = `<!DOCTYPE html>\n${code}`;
      }
      
      return {
        code,
        mode: 'api'
      };
      
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      // Fallback to enhanced mock
      return {
        code: generateEnhancedMock(jsonData, userPrompt),
        error: error.message || 'API request failed',
        mode: 'mock'
      };
    }
  }
  
  // Use enhanced mock if no API
  return {
    code: generateEnhancedMock(jsonData, userPrompt),
    mode: 'mock'
  };
}

function generateEnhancedMock(jsonData: any, userPrompt: string): string {
  const title = jsonData.report_title || 'AI Dashboard';
  const items = jsonData.expenses || [];
  const currency = jsonData.currency || 'USD';
  const metrics = jsonData.metrics || {};
  
  const total = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
  const avg = items.length > 0 ? total / items.length : 0;
  const max = items.length > 0 ? Math.max(...items.map((i: any) => i.amount || 0)) : 0;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | AI Generated Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #f1f5f9;
            min-height: 100vh;
            padding: 20px;
            animation: fadeIn 1s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .dashboard {
            max-width: 1400px;
            margin: 0 auto;
            animation: slideUp 0.8s ease-out;
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .header {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
            animation: gradientShift 3s ease infinite;
        }
        
        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: titleGlow 2s ease-in-out infinite;
        }
        
        @keyframes titleGlow {
            0%, 100% { text-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
            50% { text-shadow: 0 0 30px rgba(102, 126, 234, 0.6); }
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 25px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 10px 0;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .chart-container {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            animation: fadeIn 1s ease-out 0.3s both;
        }
        
        .chart-bars {
            display: flex;
            align-items: flex-end;
            gap: 20px;
            height: 200px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            margin-top: 20px;
        }
        
        .chart-bar {
            flex: 1;
            background: linear-gradient(to top, #667eea, #764ba2);
            border-radius: 8px 8px 0 0;
            position: relative;
            animation: growBar 1s ease-out forwards;
            opacity: 0;
            animation-delay: calc(var(--i) * 0.1s);
        }
        
        @keyframes growBar {
            from { height: 0; opacity: 0; }
            to { opacity: 1; }
        }
        
        .table-container {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            overflow: hidden;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            animation: fadeIn 1s ease-out 0.6s both;
        }
        
        th {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            text-align: left;
            font-weight: 600;
            color: #cbd5e1;
            border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        td {
            padding: 18px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: background 0.3s ease;
        }
        
        tr:hover td {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            color: #94a3b8;
            font-size: 0.9rem;
            margin-top: 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .ai-badge {
            display: inline-block;
            padding: 8px 16px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-left: 10px;
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @media (max-width: 768px) {
            .header { padding: 25px; }
            .header h1 { font-size: 1.8rem; }
            .stats-grid { grid-template-columns: 1fr; }
            .stat-value { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>${title} <span class="ai-badge">AI GENERATED</span></h1>
            <p style="color: #cbd5e1; margin-bottom: 20px;">${userPrompt || 'Professional dashboard generated with AI'}</p>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="color: #94a3b8;">
                    <div style="font-size: 0.875rem;">Currency</div>
                    <div style="font-size: 1.25rem; color: #f1f5f9;">${currency}</div>
                </div>
                <div style="color: #94a3b8;">
                    <div style="font-size: 0.875rem;">Data Points</div>
                    <div style="font-size: 1.25rem; color: #f1f5f9;">${items.length}</div>
                </div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div style="font-size: 0.875rem; color: #94a3b8;">Total Amount</div>
                <div class="stat-value">${currency} ${total.toLocaleString()}</div>
                <div style="font-size: 0.875rem; color: #94a3b8;">Sum of all items</div>
            </div>
            <div class="stat-card">
                <div style="font-size: 0.875rem; color: #94a3b8;">Average per Item</div>
                <div class="stat-value">${currency} ${avg.toFixed(2)}</div>
                <div style="font-size: 0.875rem; color: #94a3b8;">Mean value</div>
            </div>
            <div class="stat-card">
                <div style="font-size: 0.875rem; color: #94a3b8;">Maximum</div>
                <div class="stat-value">${currency} ${max.toLocaleString()}</div>
                <div style="font-size: 0.875rem; color: #94a3b8;">Highest single item</div>
            </div>
        </div>
        
        ${items.length > 0 ? `
        <div class="chart-container">
            <h2 style="margin-bottom: 20px; color: #f1f5f9; font-size: 1.5rem;">Expense Distribution</h2>
            <div class="chart-bars">
                ${items.map((item: any, i: number) => `
                <div class="chart-bar" style="--i: ${i}; height: ${(item.amount / max * 100) || 0}%;" title="${item.item}: ${currency} ${item.amount?.toLocaleString() || '0'}">
                    <div style="position: absolute; bottom: -25px; left: 0; right: 0; text-align: center; font-size: 0.75rem; color: #94a3b8; transform: rotate(-45deg);">${item.item?.substring(0, 10) || 'Item'}</div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="table-container">
            <h2 style="margin-bottom: 20px; color: #f1f5f9; font-size: 1.5rem;">Detailed Breakdown</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Amount (${currency})</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((item: any) => `
                    <tr>
                        <td style="color: #f1f5f9;">${item.item || 'Unnamed Item'}</td>
                        <td style="color: #cbd5e1;">${item.category || 'General'}</td>
                        <td style="color: #10b981; font-weight: 600;">${item.amount?.toLocaleString() || '0'}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}
        
        <div class="footer">
            <p>🚀 Generated with DashboardAI • Powered by Google Gemini</p>
            <p style="margin-top: 10px; font-size: 0.8rem; color: #64748b;">
                This is a demonstration dashboard • Data from provided JSON • All calculations are accurate
            </p>
        </div>
    </div>
</body>
</html>`;
}