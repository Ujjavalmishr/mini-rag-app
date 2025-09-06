import { getEmbedding, generateAnswer } from '../../lib/embeddings';
import { searchDocuments } from '../../lib/pinecone';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  let retrievalTime, generationTime;

  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Valid query is required (minimum 2 characters)',
        answer: "Please provide a valid question to search the uploaded text."
      });
    }

    const cleanQuery = query.trim();
    console.log("Processing query:", cleanQuery);

    // Get query embedding
    const queryEmbedding = await getEmbedding(cleanQuery);
    retrievalTime = Date.now();

    // Search for similar documents
    const searchResults = await searchDocuments(queryEmbedding, 15);
    
    if (searchResults.length === 0) {
      return res.status(200).json({
        answer: "I couldn't find any relevant information in the uploaded text to answer your question. The text might not contain information about this topic, or you may need to ask a different question.",
        sources: [],
        timing: {
          total: Date.now() - startTime,
          retrieval: retrievalTime - startTime,
          reranking: 0,
          generation: 0
        },
        tokenUsage: {
          estimated: 0
        }
      });
    }

    // Use search results directly (no reranking)
    const finalDocs = searchResults;
    generationTime = Date.now();

    // Prepare context for answer generation
    const context = finalDocs
      .map((doc, idx) => `[${idx + 1}] ${doc.payload.content}`)
      .join('\n\n');

    // Generate answer
    const answer = await generateAnswer(cleanQuery, context);
    
    const endTime = Date.now();

    // Prepare sources for response
    const sources = finalDocs.map((doc, idx) => ({
      id: idx + 1,
      content: doc.payload.content.length > 200 
        ? doc.payload.content.substring(0, 197) + '...' 
        : doc.payload.content,
      metadata: doc.payload.metadata || {},
      score: doc.score || 0
    }));

    res.status(200).json({
      answer,
      sources,
      timing: {
        total: endTime - startTime,
        retrieval: retrievalTime - startTime,
        reranking: 0, // Set to 0 since reranking is removed
        generation: endTime - generationTime
      },
      tokenUsage: {
        estimated: Math.round(context.length / 4) + Math.round(answer.length / 4)
      }
    });
    
  } catch (error) {
    console.error('Query processing error:', error);
    
    const errorAnswer = "I encountered an error while processing your query. This might be due to the text content or a temporary issue. Please try again with a different question or reupload the text.";
    
    res.status(500).json({ 
      error: 'Internal server error',
      answer: errorAnswer,
      sources: [],
      timing: {
        total: Date.now() - startTime,
        retrieval: 0,
        reranking: 0,
        generation: 0
      },
      tokenUsage: {
        estimated: 0
      }
    });
  }
}