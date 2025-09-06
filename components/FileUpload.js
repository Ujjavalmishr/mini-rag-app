import { useState } from 'react';

export default function FileUpload({ onUpload }) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleTextUpload = async () => {
    if (!text.trim()) return;
    
    setIsUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          title: title || "Untitled Document" 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`Upload successful! Processed ${data.message}`);
        setText('');
        setTitle('');
        if (onUpload) onUpload();
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      alert('Upload error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '1rem' }}>
      <h3>Upload Text</h3>
      <div>
        <input
          type="text"
          placeholder="Document Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <textarea
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <button 
        onClick={handleTextUpload} 
        disabled={isUploading || !text.trim()}
        style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}
      >
        {isUploading ? 'Uploading...' : 'Upload Text'}
      </button>
    </div>
  );
}