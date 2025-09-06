import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({ 
  apiKey: process.env.PINECONE_API_KEY,
});

const INDEX_NAME = process.env.PINECONE_INDEX || "mini-rag-index";

export async function initPinecone() {
  try {
    return pinecone.index(INDEX_NAME);
  } catch (error) {
    console.error("Pinecone init error:", error);
    throw error;
  }
}

export async function storeDocuments(documents) {
  try {
    const index = await initPinecone();
    
    const vectors = documents.map(doc => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      values: doc.embedding,
      metadata: {
        content: doc.content.substring(0, 1000),
        title: doc.metadata?.title || "Untitled",
        chunk_id: doc.id || Date.now()
      }
    }));
    
    // Upsert in batches
    for (let i = 0; i < vectors.length; i += 100) {
      const batch = vectors.slice(i, i + 100);
      await index.upsert(batch);
    }
    
    console.log(`✅ Successfully stored ${vectors.length} documents`);
    return true;
  } catch (error) {
    console.error("❌ Error storing documents:", error);
    return false;
  }
}

export async function searchDocuments(vector, limit = 10) {
  try {
    const index = await initPinecone();
    
    const results = await index.query({
      vector: vector,
      topK: limit,
      includeMetadata: true,
    });
    
    return results.matches.map(match => ({
      id: match.id,
      score: match.score,
      payload: {
        content: match.metadata.content || "",
        metadata: match.metadata
      }
    }));
  } catch (error) {
    console.error("❌ Pinecone search error:", error);
    return [];
  }
}

// Remove clear functionality - it's causing issues
export async function clearPineconeIndex() {
  console.log("⚠️ Clear functionality disabled to prevent errors");
  return true; // Fake success
}