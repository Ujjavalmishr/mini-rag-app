export function chunkText(text, chunkSize = 600, overlap = 0.1) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;
  
  for (const sentence of sentences) {
    const sentenceLength = sentence.split(/\s+/).length;
    
    if (currentLength + sentenceLength > chunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push({
        id: chunks.length + 1,
        content: currentChunk.join(' ').trim(),
        metadata: {
          chunk_id: chunks.length + 1,
          sentence_count: currentChunk.length
        }
      });
      
      // Start new chunk with overlap
      const overlapCount = Math.floor(currentChunk.length * overlap);
      currentChunk = currentChunk.slice(-overlapCount);
      currentLength = currentChunk.reduce((sum, sent) => sum + sent.split(/\s+/).length, 0);
    }
    
    currentChunk.push(sentence.trim());
    currentLength += sentenceLength;
  }
  
  // Add the last chunk
  if (currentChunk.length > 0) {
    chunks.push({
      id: chunks.length + 1,
      content: currentChunk.join(' ').trim(),
      metadata: {
        chunk_id: chunks.length + 1,
        sentence_count: currentChunk.length
      }
    });
  }
  
  return chunks;
}