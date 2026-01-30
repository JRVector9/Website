import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://192.168.139.3:11434';

// JSON body parser
app.use(express.json());

// Debug endpoint
app.get('/api/debug/ollama', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    res.json({
      status: 'connected',
      ollama_url: OLLAMA_URL,
      models: data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      ollama_url: OLLAMA_URL,
      error: error.message
    });
  }
});

// Proxy generate endpoint
app.post('/api/ollama/generate', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: 'Ollama connection failed', message: error.message });
  }
});

// Proxy chat endpoint
app.post('/api/ollama/chat', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: 'Ollama connection failed', message: error.message });
  }
});

// Proxy tags endpoint
app.get('/api/ollama/tags', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: 'Ollama connection failed', message: error.message });
  }
});

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Ollama URL: ${OLLAMA_URL}`);
});
