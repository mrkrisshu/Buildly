import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { PexelsAPI, PexelsPhoto } from '@/lib/pexels';

interface Slide {
  title: string;
  content: string[];
  notes?: string;
  image?: PexelsPhoto;
}

interface PPTData {
  title: string;
  slides: Slide[];
}

interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export async function POST(request: NextRequest) {
  let geminiApiKey: string | undefined;
  let usingFallbackKey = false;

  try {
    const { prompt, apiKey, colorTheme, isDarkMode, includeImages = true } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // If user provided a key, validate and use it
    if (apiKey && apiKey.trim().startsWith('AIzaSy') && apiKey.trim().length >= 35) {
      geminiApiKey = apiKey.trim();
      console.log('Using user-provided API key for PPT generation');
    } else {
      // No user key provided or invalid format, use environment key
      geminiApiKey = process.env.GOOGLE_AI_API_KEY;
      usingFallbackKey = true;
      console.log('Using environment API key for PPT generation');
    }

    // Check if we have any valid API key
    const hasValidApiKey = geminiApiKey && 
      geminiApiKey !== 'AIzaSyDummy_Key_For_Development_Testing_Only' &&
      geminiApiKey.startsWith('AIzaSy') &&
      geminiApiKey.length >= 35;

    if (!hasValidApiKey) {
      console.log('API key validation failed for PPT generation:', {
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

    console.log('Attempting to generate PPT content with Gemini API...');
    const genAI = new GoogleGenerativeAI(geminiApiKey!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const enhancedPrompt = `
You are an expert presentation designer and content creator. Create a comprehensive and engaging presentation based on the following topic.

Requirements:
- Generate a complete presentation with 5-8 slides
- Create compelling slide titles and well-structured content
- Include bullet points for each slide (3-5 points per slide)
- Add speaker notes for each slide when appropriate
- Make the content informative, engaging, and professional
- Ensure logical flow between slides
- Include an introduction slide and conclusion slide
- Use clear, concise language suitable for presentations

Topic: ${prompt}

Please generate the presentation as a JSON object with the following exact structure:
{
  "title": "Main presentation title",
  "slides": [
    {
      "title": "Slide title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "notes": "Optional speaker notes for this slide"
    }
  ]
}

Make sure the JSON is valid and properly formatted. Focus on creating valuable, actionable content that would be useful in a real presentation setting.
`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const generatedText = response.text();

    console.log('Raw AI response received for PPT generation');

    // Extract JSON from the response
    let jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Try to find JSON with markdown code blocks
      jsonMatch = generatedText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonMatch[0] = jsonMatch[1];
      }
    }

    if (!jsonMatch) {
      console.error('No JSON found in AI response for PPT generation');
      return NextResponse.json(
        { error: 'Failed to parse presentation data from AI response' },
        { status: 500 }
      );
    }

    let pptData: PPTData;
    try {
      pptData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parsing error for PPT generation:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse presentation data' },
        { status: 500 }
      );
    }

    // Validate the structure
    if (!pptData.title || !Array.isArray(pptData.slides) || pptData.slides.length === 0) {
      console.error('Invalid PPT data structure:', pptData);
      return NextResponse.json(
        { error: 'Invalid presentation structure received from AI' },
        { status: 500 }
      );
    }

    // Validate each slide
    for (const slide of pptData.slides) {
      if (!slide.title || !Array.isArray(slide.content) || slide.content.length === 0) {
        console.error('Invalid slide structure:', slide);
        return NextResponse.json(
          { error: 'Invalid slide structure in presentation' },
          { status: 500 }
        );
      }
    }

    // Fetch images for slides if requested
    if (includeImages) {
      const pexelsApiKey = process.env.PEXELS_API_KEY;
      if (pexelsApiKey) {
        console.log('Fetching images for slides...');
        const pexelsAPI = new PexelsAPI(pexelsApiKey);
        
        // Add images to slides (skip title slide if it's the first one)
        for (let i = 0; i < pptData.slides.length; i++) {
          const slide = pptData.slides[i];
          
          // Skip title/intro slides for images
          if (i === 0 && (slide.title.toLowerCase().includes('introduction') || 
                         slide.title.toLowerCase().includes('welcome') ||
                         slide.title.toLowerCase().includes('agenda'))) {
            continue;
          }
          
          try {
            const searchQuery = pexelsAPI.extractImageKeywords(slide.title, slide.content);
            console.log(`Searching for images with query: "${searchQuery}"`);
            
            const photos = await pexelsAPI.searchPhotos(searchQuery, 1);
            if (photos.length > 0) {
              slide.image = photos[0];
              console.log(`Found image for slide "${slide.title}": ${photos[0].alt}`);
            }
          } catch (error) {
            console.error(`Error fetching image for slide "${slide.title}":`, error);
            // Continue without image for this slide
          }
        }
      } else {
        console.log('Pexels API key not configured, skipping image fetching');
      }
    }

    console.log(`PPT generation successful: ${pptData.slides.length} slides created`);

    return NextResponse.json({
      pptData,
      colorTheme,
      isDarkMode,
      usingFallbackKey,
      message: 'Presentation generated successfully'
    });

  } catch (error: any) {
    console.error('Error in PPT generation:', error);
    
    // Provide more specific error message
    let errorMessage = 'Failed to generate presentation. ';
    if (error.message?.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid API key provided. Please check your Gemini API key.';
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      errorMessage = 'API quota exceeded. Please try again later or use your own API key.';
    } else if (error.message?.includes('PERMISSION_DENIED')) {
      errorMessage = 'Permission denied. Check your API key permissions.';
    } else if (error.message?.includes('models/gemini-1.5-flash is not found') || 
               error.message?.includes('models/gemini-pro is not found') ||
               error.message?.includes('is not found for API version')) {
      errorMessage = 'Model not available or deprecated. The API has been updated to use the latest model version.';
    } else if (error.status === 404) {
      errorMessage = 'Model endpoint not found. Please ensure you are using a valid API key and the latest model version.';
    } else if (error.message?.includes('SAFETY')) {
      errorMessage = 'Content was blocked by safety filters. Please try a different topic.';
    } else {
      errorMessage = 'An unexpected error occurred while generating the presentation. Please try again.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: error.status === 404 ? 404 : (error.status || 500) }
    );
  }
}