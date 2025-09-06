// Local embeddings without any API calls
export async function getEmbedding(text) {
  return generateLocalEmbedding(text);
}

export async function generateAnswer(query, context) {
  return generateLocalAnswer(query, context);
}

function generateLocalEmbedding(text) {
  const cleanText = text.replace(/\n/g, " ").substring(0, 500);
  const embedding = new Array(384).fill(0);
  
  for (let i = 0; i < Math.min(384, cleanText.length); i++) {
    embedding[i] = (cleanText.charCodeAt(i % cleanText.length) % 100) / 100;
  }
  
  return embedding;
}

function generateLocalAnswer(query, context) {
  const lowerQuery = query.toLowerCase();
  const contextParts = context.split('\n\n');
  
  // Find the most relevant part
  for (const part of contextParts) {
    const lowerPart = part.toLowerCase();
    
    if (lowerPart.includes(lowerQuery)) {
      return formatAnswer(part);
    }
    
    // Check for keyword matches
    const queryWords = lowerQuery.split(' ');
    let matchCount = 0;
    
    for (const word of queryWords) {
      if (word.length > 3 && lowerPart.includes(word)) {
        matchCount++;
      }
    }
    
    if (matchCount >= queryWords.length / 2) {
      return formatAnswer(part);
    }
  }
  
  // Fallback: return the first meaningful part
  for (const part of contextParts) {
    if (part.length > 50) {
      return formatAnswer(part);
    }
  }
  
  return "I found information in the text but couldn't find a specific answer to your question.";
}

function formatAnswer(text) {
  // Extract the first sentence or truncate
  const firstSentence = text.split(/[.!?]+/)[0];
  if (firstSentence && firstSentence.length > 20) {
    return firstSentence + '.';
  }
  
  return text.length > 150 ? text.substring(0, 147) + '...' : text;
}