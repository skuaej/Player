export default async function handler(req, res) {
  // 1. Get the target URL from the query string (e.g., ?url=...)
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing target URL parameter' });
  }

  try {
    // 2. Fetch the data from the target server
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Accept': '*/*'
      }
    });

    // 3. Read the response as text (ideal for .mpd manifest files)
    const data = await response.text();

    // 4. Set CORS headers so your browser allows the frontend to read this
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    // 5. Pass along the correct content type and send the data to the browser
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/dash+xml');
    res.status(response.status).send(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch the target resource' });
  }
}
