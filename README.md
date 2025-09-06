# Mini RAG App

A lightweight Retrieval Augmented Generation (RAG) application built with Next.js, Pinecone vector database, and OpenAI embeddings. This app allows you to upload text documents, process them into vector embeddings, and ask questions about the content using semantic search.

## 🚀 Features

- **Text Upload**: Upload and process text documents of any length
- **Smart Chunking**: Automatic text splitting with overlap for context preservation
- **Vector Embeddings**: OpenAI embeddings for semantic understanding
- **Vector Database**: Pinecone for efficient similarity search
- **Semantic Search**: Ask questions and get answers based on uploaded content
- **Real-time Processing**: Live progress tracking during upload and processing
- **Performance Metrics**: Detailed timing and token usage statistics
- **Responsive UI**: Clean, modern React interface

## 🏗️ Architecture
Frontend (Next.js) → API Routes → Processing → Vector DB → OpenAI

1. **Frontend**: React components for file upload and query interface
2. **API Routes**: Next.js serverless functions for upload and query processing
3. **Text Processing**: Chunking and embedding generation
4. **Vector Storage**: Pinecone for storing and retrieving embeddings
5. **LLM Integration**: OpenAI for embeddings and answer generation

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- Pinecone account
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ujjavalmishr/mini-rag-app.git
   cd mini-rag-app

2. Install Dependencies:
    npm install

3. Environment Configuration:

   Create a .env.local file in the root directory:

  - PINECONE_API_KEY=your_pinecone_api_key_here
  - PINECONE_INDEX_NAME=your_index_name_here
  - PINECONE_ENVIRONMENT=your_environment_here

4. Pinecone Setup

  - Create a Pinecone account at pinecone.io

  - Create a new index with:

  - Dimensions: 384

  - Metric: cosine

5. Run the development server

  - bash
  - npm run dev

# Project Structure
mini-rag-app/
├── components/          # React components
│   ├── FileUpload.js   # File upload interface
│   ├── QueryInput.js   # Question input component
│   └── ResultsDisplay.js # Results presentation
├── lib/                # Utility libraries
│   ├── chunking.js     # Text splitting logic
│   ├── embeddings.js   # OpenAI embedding functions
│   └── pinecone.js     # Pinecone database operations
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   │   ├── upload.js   # Text upload processing
│   │   └── query.js    # Question handling
│   └── index.js        # Main application page
├── public/             # Static assets
└── styles/             # CSS stylesheets 


# 🛠️ Development

npm install -g vercel
vercel --env OPENAI_API_KEY=your_key --env PINECONE_API_KEY=your_key


# 👨‍💻 Author
Ujjaval Mishra
BTECH CSE(AI) 
ABES Institue Of Technology, Ghaziabad
📧 ujjavalmishra439@gmail.com
🌐 https://github.com/Ujjavalmishr