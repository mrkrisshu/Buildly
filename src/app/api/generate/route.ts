import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey, isMultiPage = false, customizationSettings } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // First try with user's API key, then fallback to environment variable
    let geminiApiKey = apiKey;
    let usingFallbackKey = false;

    // If user provided a key, validate and use it
    if (geminiApiKey && geminiApiKey.trim().startsWith('AIzaSy') && geminiApiKey.trim().length >= 35) {
      geminiApiKey = geminiApiKey.trim();
      console.log('Using user-provided API key');
    } else {
      // No user key provided or invalid format, use environment key
      geminiApiKey = process.env.GOOGLE_AI_API_KEY;
      usingFallbackKey = true;
      console.log('Using environment API key');
    }

    // Check if we have any valid API key
    const hasValidApiKey = geminiApiKey && 
      geminiApiKey !== 'AIzaSyDummy_Key_For_Development_Testing_Only' &&
      geminiApiKey.startsWith('AIzaSy') &&
      geminiApiKey.length >= 35;

    if (!hasValidApiKey) {
      console.log('API key validation failed:', {
        hasKey: !!geminiApiKey,
        startsCorrectly: geminiApiKey?.startsWith('AIzaSy'),
        length: geminiApiKey?.length,
        isDummy: geminiApiKey === 'AIzaSyDummy_Key_For_Development_Testing_Only'
      });
      return NextResponse.json(
        { error: 'No valid Gemini API key available. Please provide a valid API key or configure one in environment variables.' },
        { status: 400 }
      );
    }

    console.log('Attempting to generate content with Gemini API...');
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build customization instructions
    let customizationInstructions = '';
    if (customizationSettings) {
      customizationInstructions = `
Additional customization requirements:
- Color scheme: ${customizationSettings.colorScheme}
- Font family: ${customizationSettings.fontFamily}
- Layout style: ${customizationSettings.layoutStyle}
- Primary color: ${customizationSettings.primaryColor}
- Secondary color: ${customizationSettings.secondaryColor}
- Accent color: ${customizationSettings.accentColor}
`;
    }

    let enhancedPrompt;
    
    if (isMultiPage) {
      enhancedPrompt = `
You are an expert web developer. Create a complete, modern, and responsive multi-page website based on the following description.

Requirements:
- Generate a complete multi-page website structure
- Create separate HTML files for different pages (index.html, about.html, contact.html, etc.)
- Include a shared CSS file (styles.css) for consistent styling
- Add a shared JavaScript file (script.js) for interactive functionality
- Use modern CSS features like flexbox, grid, and CSS variables
- Include responsive design for mobile devices
- Add smooth animations and transitions
- Use semantic HTML elements
- Include proper meta tags and SEO optimization
- Make it visually appealing with a modern design
- Add navigation between pages
- Include interactive elements where appropriate
- Use a cohesive color scheme and typography
- Include placeholder content that matches the theme
- Create at least 3-5 pages based on the website type

${customizationInstructions}

User's request: ${prompt}

Please generate the complete website structure as a JSON object with the following format:
{
  "files": {
    "index.html": "HTML content for home page",
    "about.html": "HTML content for about page",
    "contact.html": "HTML content for contact page",
    "styles.css": "CSS content for styling",
    "script.js": "JavaScript content for functionality"
  },
  "structure": {
    "pages": ["Home", "About", "Contact", ...],
    "description": "Brief description of the website structure"
  }
}

Generate only the JSON response without any explanations or markdown formatting.
`;
    } else {
      enhancedPrompt = `
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

${customizationInstructions}

User's request: ${prompt}

Please generate only the HTML code without any explanations or markdown formatting. The code should be production-ready and complete.
`;
    }

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let generatedCode = response.text();

    if (isMultiPage) {
      // Handle multi-page response
      try {
        // Clean up the response to ensure it's valid JSON
        generatedCode = generatedCode.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Parse the JSON response
        const websiteData = JSON.parse(generatedCode);
        
        console.log('Multi-page website generated successfully');
        return NextResponse.json({ 
          multiPageData: {
            pages: websiteData.files || websiteData,
            structure: websiteData.structure || { pages: Object.keys(websiteData.files || websiteData), description: "Multi-page website" }
          },
          isMultiPage: true,
          usingFallbackKey: usingFallbackKey,
          message: usingFallbackKey ? 'Generated using fallback API key' : 'Generated using your API key'
        });
      } catch (parseError) {
        console.error('Error parsing multi-page JSON:', parseError);
        // Fallback to single page if JSON parsing fails
        return NextResponse.json(
          { error: 'Failed to generate multi-page website. Please try again.' },
          { status: 500 }
        );
      }
    } else {
      // Handle single page response
      // Clean up the response to ensure it's valid HTML
      generatedCode = generatedCode.replace(/```html/g, '').replace(/```/g, '').trim();

      // Ensure the code starts with <!DOCTYPE html>
      if (!generatedCode.toLowerCase().startsWith('<!doctype html>')) {
        generatedCode = `<!DOCTYPE html>\n${generatedCode}`;
      }

      console.log('Single-page website generated successfully');
      return NextResponse.json({ 
        code: generatedCode,
        isMultiPage: false,
        usingFallbackKey: usingFallbackKey,
        message: usingFallbackKey ? 'Generated using fallback API key' : 'Generated using your API key'
      });
    }
  } catch (error: any) {
    console.error('Error generating website:', error);
    
    // If there was an error and we were using user key, try fallback
    if (apiKey && process.env.GOOGLE_AI_API_KEY && process.env.GOOGLE_AI_API_KEY !== apiKey) {
      try {
        console.log('Retrying with fallback API key due to error');
        const fallbackGenAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        const fallbackModel = fallbackGenAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
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

        const result = await fallbackModel.generateContent(enhancedPrompt);
        const response = await result.response;
        let generatedCode = response.text();

        // Clean up the response to ensure it's valid HTML
        generatedCode = generatedCode.replace(/```html/g, '').replace(/```/g, '').trim();

        // Ensure the code starts with <!DOCTYPE html>
        if (!generatedCode.toLowerCase().startsWith('<!doctype html>')) {
          generatedCode = `<!DOCTYPE html>\n${generatedCode}`;
        }

        return NextResponse.json({ 
          code: generatedCode,
          usingFallbackKey: true,
          message: 'Generated using fallback API key after error'
        });
      } catch (fallbackError) {
        console.error('Fallback API key also failed:', fallbackError);
      }
    }
    
    // Provide more specific error message
    let errorMessage = 'Failed to generate website. ';
    if (error.message?.includes('API_KEY_INVALID')) {
      errorMessage += 'Invalid API key provided.';
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      errorMessage += 'API quota exceeded.';
    } else if (error.message?.includes('PERMISSION_DENIED')) {
      errorMessage += 'Permission denied. Check your API key permissions.';
    } else if (error.message?.includes('models/gemini-pro is not found')) {
      errorMessage += 'Model not available. Please try again.';
    } else {
      errorMessage += 'Please check your API key and try again.';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}