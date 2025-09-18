import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if we have a real Google AI API key
    const hasRealApiKey = process.env.GOOGLE_AI_API_KEY && 
      process.env.GOOGLE_AI_API_KEY !== 'AIzaSyDummy_Key_For_Development_Testing_Only' &&
      process.env.GOOGLE_AI_API_KEY.startsWith('AIzaSy');

    if (!hasRealApiKey) {
      // Return a mock response for development
      const mockHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .hero { text-align: center; padding: 4rem 0; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; opacity: 0.9; }
        .section { margin: 3rem 0; padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 10px; }
        .btn { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #ff6b6b; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin-top: 1rem;
            transition: transform 0.3s;
        }
        .btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>Welcome to Your Generated Website</h1>
            <p>This is a demo website generated based on your prompt: "${prompt}"</p>
            <a href="#" class="btn">Get Started</a>
        </div>
        <div class="section">
            <h2>About</h2>
            <p>This website was generated using AI technology. In production, you would need to configure a real Google AI API key to generate custom websites based on your specific requirements.</p>
        </div>
        <div class="section">
            <h2>Features</h2>
            <ul>
                <li>Responsive Design</li>
                <li>Modern CSS</li>
                <li>Interactive Elements</li>
                <li>SEO Optimized</li>
            </ul>
        </div>
    </div>
</body>
</html>`;
      
      return NextResponse.json({ code: mockHtml });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const enhancedPrompt = `
You are an expert web developer. Create a complete, modern, and responsive HTML website based on the following description. 

Requirements:
- Generate a single HTML file with embedded CSS and JavaScript
- Use modern CSS features like flexbox, grid, and CSS variables
- Include responsive design for mobile devices
- Add smooth animations and transitions
- Use semantic HTML elements
- Include proper meta tags and SEO optimization
- Make it visually appealing with a modern design
- Add interactive elements where appropriate
- Use a cohesive color scheme and typography
- Include placeholder content that matches the theme

User's request: ${prompt}

Please generate only the HTML code without any explanations or markdown formatting. The code should be production-ready and complete.
`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let generatedCode = response.text();

    // Clean up the response to ensure it's valid HTML
    generatedCode = generatedCode.replace(/```html/g, '').replace(/```/g, '').trim();

    // Ensure the code starts with <!DOCTYPE html>
    if (!generatedCode.toLowerCase().startsWith('<!doctype html>')) {
      generatedCode = `<!DOCTYPE html>\n${generatedCode}`;
    }

    return NextResponse.json({ code: generatedCode });
  } catch (error) {
    console.error('Error generating website:', error);
    return NextResponse.json(
      { error: 'Failed to generate website' },
      { status: 500 }
    );
  }
}