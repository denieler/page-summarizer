const apiUrl = 'https://api.openai.com/v1/completions'

async function makeCompletionQuery(
    prompt,
    openAIAPIKey,
    onChunkReady?: (chunk: string) => void
) {
    const controller = new AbortController()
    const signal = controller.signal
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIAPIKey}`
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: prompt,
          max_tokens: 100, // Number of tokens to generate in the completion
          temperature: 0.7, // Controls the randomness of the output (0.0 - deterministic, 1.0 - very random)
          n: 1, // Number of completions to generate
          stream: true
        }),
        signal: signal // Attach the signal to the request
      })
  
      // Read the response as a stream of data
    const reader = response.body.getReader()
    const decoder = new TextDecoder("utf-8")

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      // Massage and parse the chunk of data
      const chunk = decoder.decode(value)
      const lines = chunk.split("data:")

      const parsedLines = lines
        .filter((line) => line !== "" && line.indexOf("[DONE]") < 0) // Remove empty lines and "[DONE]"
        .map((line) => JSON.parse(line)) // Parse the JSON string

      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine
        const { text } = choices[0]
        // Update the UI with the new content
        if (text) {
          if(onChunkReady) {
            onChunkReady(text)
          }
        }
      }
    }
  
      return response
    } catch (error) {
      console.error('Error:', error)
      throw error
    } finally {
      controller.abort()
    }
}

export const summarizeByOpenAI = async (
  content: string,
  openAIAPIKey: string,
  onChunkReady?: (chunk: string) => void
) => {
    const prompt = `This is the innerText of the web page. Please detect the main text and summarize it in less than 1000 words
---
${content}
`
   return makeCompletionQuery(prompt, openAIAPIKey, onChunkReady)
}
