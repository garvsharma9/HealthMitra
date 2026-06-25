export default async function handler(req, res) {
    const { range } = req.query;
    
    // These environment variables will be securely pulled from Vercel / your local .env
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const API_KEY = process.env.GOOGLE_API_KEY;

    if (!SHEET_ID || !API_KEY) {
        return res.status(500).json({ 
            error: 'Missing Environment Variables. Please set GOOGLE_SHEET_ID and GOOGLE_API_KEY in Vercel.' 
        });
    }

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
        const fetchResponse = await fetch(url);
        const data = await fetchResponse.json();
        
        // Return the Google Sheets data to our frontend
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
