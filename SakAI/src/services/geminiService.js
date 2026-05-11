import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseJSON } from '../utils/helpers.js';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * Generate commute instructions using Gemini AI
 * @param {object} routeData - Route plan computed by JavaScript
 * @param {string} passengerType - Type of passenger
 * @returns {Promise<object>} AI-generated instructions in JSON format
 */
export async function generateCommuteInstructions(routeData, passengerType) {
  try {
    const prompt = buildPrompt(routeData, passengerType);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response');
    }
    
    const parsedResponse = parseJSON(jsonMatch[0]);
    
    if (!parsedResponse) {
      throw new Error('Failed to parse Gemini JSON response');
    }
    
    return {
      success: true,
      data: parsedResponse,
      rawResponse: text,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: error.message,
      fallback: generateFallbackInstructions(routeData, passengerType),
    };
  }
}

/**
 * Build prompt for Gemini AI
 * @param {object} routeData - Route plan
 * @param {string} passengerType - Passenger type
 * @returns {string} Prompt text
 */
function buildPrompt(routeData, passengerType) {
  const routeType = routeData.type === 'direct' ? 'direct' : 'transfer';
  
  let routeDescription = '';
  
  if (routeType === 'direct') {
    const route = routeData.route;
    routeDescription = `
Route: ${route.routeName} (${route.routeCode})
Board at: ${route.boardAt}
Alight at: ${route.alightAt}
Distance: ${route.distance.toFixed(2)} km
    `.trim();
  } else {
    const legs = routeData.route.legs;
    routeDescription = `
Multiple legs required:
${legs
  .map(
    (leg, i) => `
Leg ${i + 1}: ${leg.routeName} (${leg.routeCode})
Board at: ${leg.boardAt}
Alight at: ${leg.alightAt}
Distance: ${leg.distance.toFixed(2)} km
    `
  )
  .join('\n')}
    `.trim();
  }
  
  const prompt = `
You are a helpful commuting guide for Iloilo City, Philippines. 
Given a jeepney route plan, provide human-readable commute instructions in JSON format ONLY.

Route Information:
${routeDescription}

Passenger Type: ${passengerType}
Origin: ${routeData.origin.lat}, ${routeData.origin.lng}
Destination: ${routeData.destination.lat}, ${routeData.destination.lng}

Please analyze this route and generate commute instructions. You are NOT determining the route - the route is already computed.
Your role is to:
1. Explain how to board and alight
2. Provide walking instructions if needed
3. Mention fare information if applicable
4. Warn about transfers if needed
5. Estimate travel time (use ~2-3 minutes per km as average)

IMPORTANT: Return ONLY valid JSON in this format, no other text:
{
  "summary": "Brief summary of the route",
  "totalFare": "₱XX.XX",
  "estimatedTime": "XX minutes",
  "trafficWarning": "Any traffic or timing warnings",
  "steps": [
    {
      "stepNumber": 1,
      "type": "walk|jeepney|transfer",
      "instruction": "What to do",
      "route": "Route name if applicable",
      "boardAt": "Board point if applicable",
      "alightAt": "Alight point if applicable",
      "fare": "Fare for this step if applicable"
    }
  ]
}
  `.trim();
  
  return prompt;
}

/**
 * Generate fallback instructions when Gemini fails
 * @param {object} routeData - Route plan
 * @param {string} passengerType - Passenger type
 * @returns {object} Fallback instructions
 */
function generateFallbackInstructions(routeData, passengerType) {
  const steps = [];
  let stepNumber = 1;
  
  if (routeData.type === 'direct') {
    const route = routeData.route;
    
    steps.push({
      stepNumber: stepNumber++,
      type: 'walk',
      instruction: `Walk to ${route.boardAt}`,
      fare: '',
    });
    
    steps.push({
      stepNumber: stepNumber++,
      type: 'jeepney',
      instruction: `Board ${route.routeName}`,
      route: route.routeName,
      boardAt: route.boardAt,
      alightAt: route.alightAt,
      fare: 'See fare breakdown',
    });
    
    steps.push({
      stepNumber: stepNumber++,
      type: 'walk',
      instruction: `Walk to your destination`,
      fare: '',
    });
  } else {
    const legs = routeData.route.legs;
    
    legs.forEach((leg, index) => {
      if (index === 0) {
        steps.push({
          stepNumber: stepNumber++,
          type: 'walk',
          instruction: `Walk to ${leg.boardAt}`,
          fare: '',
        });
      }
      
      steps.push({
        stepNumber: stepNumber++,
        type: 'jeepney',
        instruction: `Board ${leg.routeName}`,
        route: leg.routeName,
        boardAt: leg.boardAt,
        alightAt: leg.alightAt,
        fare: 'See fare breakdown',
      });
      
      if (index < legs.length - 1) {
        steps.push({
          stepNumber: stepNumber++,
          type: 'transfer',
          instruction: `Transfer to next jeepney`,
          fare: '',
        });
      }
    });
    
    steps.push({
      stepNumber: stepNumber++,
      type: 'walk',
      instruction: `Walk to your destination`,
      fare: '',
    });
  }
  
  return {
    summary: `${routeData.type === 'direct' ? 'Direct' : 'Transfer'} route available`,
    totalFare: 'See fare breakdown',
    estimatedTime: `${Math.round(routeData.route.distance * 3)} minutes`,
    trafficWarning: 'Actual travel time may vary',
    steps: steps,
  };
}
