// Simple web server for testing email campaign tool

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT_DIR = path.resolve(__dirname, '.'); // Current directory

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    });
    res.end();
    return;
  }
    // Handle Mailtrap email API proxy (simulate success for testing)
  if (req.url.includes('/api/send') && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      console.log('Email send request received:');
      
      try {
        // Parse JSON body to display email details
        const emailData = JSON.parse(body);
        console.log('- From:', emailData.from?.email || emailData.from);
        console.log('- To:', Array.isArray(emailData.to) 
          ? emailData.to.map(t => t.email || t).join(', ') 
          : emailData.to);
        console.log('- Subject:', emailData.subject);
        console.log('- Content length:', (emailData.html || '').length, 'characters');
      } catch (e) {
        console.log('Could not parse email data:', e.message);
        console.log('Raw body:', body);
      }
      
      // Send successful response
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully (simulated)',
        id: 'email_' + Date.now()
      }));
    });
    
    return;
  }
  
  // Handle any Mailtrap API requests
  if (req.url.includes('mailtrap.io') || req.url.includes('api.mailtrap')) {
    console.log('Intercepting Mailtrap API request:', req.url);
    
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      // Always respond with success
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Mailtrap API request successful (simulated)',
        id: 'mt_' + Date.now()
      }));
    });
    
    return;
  }
  
  // Handle static file requests
  let filePath;
  
  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(ROOT_DIR, 'index.html');
  } else {
    filePath = path.join(ROOT_DIR, req.url);
  }
  
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        console.log(`File not found: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        // Server error
        console.log(`Server error: ${err.code}`);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1>');
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop`);
});
