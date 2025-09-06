import { chunkText } from '../../lib/chunking';
import { getEmbedding } from '../../lib/embeddings';
import { storeDocuments } from '../../lib/pinecone';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, title = "Document" } = req.body;
    
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Valid text content is required (minimum 10 characters)' });
    }

    console.log("✂️ Splitting text into chunks...");
    const chunks = chunkText(text, 600, 0.1);
    console.log(`📦 Created ${chunks.length} chunks`);
    
    const documentsWithEmbeddings = [];
    
    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      try {
        const chunk = chunks[i];
        console.log(`🔍 Creating embedding for chunk ${i + 1}/${chunks.length}...`);
        
        const embedding = await getEmbedding(chunk.content);
        
        documentsWithEmbeddings.push({
          id: i + 1,
          content: chunk.content,
          embedding: embedding,
          metadata: {
            ...chunk.metadata,
            title: title,
            source: "uploaded-text"
          }
        });
        
      } catch (error) {
        console.error(`❌ Error processing chunk ${i + 1}:`, error.message);
        // Continue with other chunks
      }
    }
    
    if (documentsWithEmbeddings.length === 0) {
      return res.status(500).json({ error: 'No chunks were successfully processed' });
    }
    
    console.log(`✅ Processed ${documentsWithEmbeddings.length}/${chunks.length} chunks`);
    
    // Store in vector database
    const success = await storeDocuments(documentsWithEmbeddings);
    
    if (success) {
      res.status(200).json({ 
        success: true,
        message: `Successfully processed ${documentsWithEmbeddings.length} chunks`,
        chunks: documentsWithEmbeddings.length
      });
    } else {
      res.status(500).json({ error: 'Failed to store documents in database' });
    }
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      error: 'Internal server error: ' + error.message 
    });
  }
}