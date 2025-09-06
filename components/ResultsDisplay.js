export default function ResultsDisplay({ results, loading }) {
  if (loading) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <p>Processing your query...</p>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Safe access to nested properties with fallbacks
  const timing = results.timing || {};
  const tokenUsage = results.tokenUsage || {};
  const sources = results.sources || [];

  const estimatedTokens = tokenUsage.estimated || 0;
  const estimatedCost = (estimatedTokens * 0.002 / 1000).toFixed(4);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Answer:</h3>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '4px',
        marginBottom: '1rem'
      }}>
        <p>{results.answer || 'No answer available'}</p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h4>Performance Metrics:</h4>
        <p>Total time: {timing.total || 0}ms</p>
        <p>Retrieval: {timing.retrieval || 0}ms</p>
        <p>Reranking: {timing.reranking || 0}ms</p>
        <p>Generation: {timing.generation || 0}ms</p>
        <p>Estimated tokens: {formatNumber(estimatedTokens)}</p>
        <p>Estimated cost: ${estimatedCost}</p>
      </div>

      {sources.length > 0 && (
        <>
          <h4>Sources:</h4>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {sources.map((source, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '0.5rem', 
                  marginBottom: '0.5rem', 
                  border: '1px solid #eee',
                  borderRadius: '4px'
                }}
              >
                <p><strong>[{source.id || index + 1}]</strong> 
                  {source.score !== undefined && (
                    <> (Relevance: {(source.score || 0).toFixed(3)})</>
                  )}
                </p>
                <p style={{ fontSize: '0.9rem' }}>{source.content || 'No content available'}</p>
                {source.metadata && source.metadata.title && (
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>
                    Source: {source.metadata.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}