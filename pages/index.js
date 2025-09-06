import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import QueryInput from '../components/QueryInput';
import ResultsDisplay from '../components/ResultsDisplay';
import Head from 'next/head';

export default function Home() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async (query) => {
    setLoading(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      setResults({
        answer: "Sorry, I encountered an error while processing your query.",
        sources: [],
        timing: { total: 0, retrieval: 0, reranking: 0, generation: 0 },
        tokenUsage: { estimated: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Head>
        <title>Mini RAG System</title>
        <meta name="description" content="A simple RAG system for document question answering" />
      </Head>

      <h1>Mini RAG System</h1>
      <p>Upload text and ask questions about it!</p>

      <FileUpload />
      <QueryInput onQuerySubmit={handleQuerySubmit} disabled={loading} />
      <ResultsDisplay results={results} loading={loading} />

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Sample Questions to Try:</h3>
        <ul>
          <li>What is this document about?</li>
          <li>Summarize the main points</li>
          <li>What are the key findings?</li>
        </ul>
      </div>
    </div>
  );
}