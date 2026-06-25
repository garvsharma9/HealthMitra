export default async function handler(req, res) {
    const { range, type } = req.query;
    
    // Pull the shared API Key
    const API_KEY = process.env.GOOGLE_API_KEY;
    
    // Determine the correct Sheet ID based on the page requesting it
    let SHEET_ID;
    if (type === 'asha') SHEET_ID = process.env.ASHA_SHEET_ID;
    else if (type === 'vacci') SHEET_ID = process.env.VACCI_SHEET_ID;
    else if (type === 'outbreak') SHEET_ID = process.env.OUTBREAK_SHEET_ID;

    if (!SHEET_ID || !API_KEY) {
        return res.status(500).json({ 
            error: `Missing Environment Variables. Please set GOOGLE_API_KEY and the corresponding SHEET_ID for ${type} in Vercel.` 
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
