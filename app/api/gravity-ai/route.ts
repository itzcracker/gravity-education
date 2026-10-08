import { createOpenAI } from '@ai-sdk/openai'
import { streamText, convertToModelMessages } from 'ai'

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': 'https://gravity-nmq7.onrender.com/',
    'X-Title': 'GravityOS',
  },
})

export async function POST(request: Request) {
  const { messages, model = 'apodex/apodex-1.1-mini:free' } = await request.json()
  const result = streamText({
    model: openrouter(model),
    system: 'You are GravityAI, a concise, thoughtful assistant inside GravityOS. Be helpful, warm, and clear.',
    messages: await convertToModelMessages(messages),
  })
  return result.toUIMessageStreamResponse()
}
