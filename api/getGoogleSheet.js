export default async function handler(req, res) {
    const { range, type } = req.query;
    
    // Each page can have its own Sheet ID and API Key
    let SHEET_ID, API_KEY;

    if (type === 'asha') {
        SHEET_ID = process.env.ASHA_SHEET_ID;
        API_KEY  = process.env.ASHA_API_KEY || process.env.GOOGLE_API_KEY;
    } else if (type === 'vacci') {
        SHEET_ID = process.env.VACCI_SHEET_ID;
        API_KEY  = process.env.VACCI_API_KEY || process.env.GOOGLE_API_KEY;
    } else if (type === 'outbreak') {
        SHEET_ID = process.env.OUTBREAK_SHEET_ID;
        API_KEY  = process.env.OUTBREAK_API_KEY || process.env.GOOGLE_API_KEY;
    }

    if (!SHEET_ID || !API_KEY) {
        return res.status(500).json({ 
            error: `Missing env vars for type="${type}". Need ${type.toUpperCase()}_SHEET_ID and either ${type.toUpperCase()}_API_KEY or GOOGLE_API_KEY.`,
            type: type
        });
    }

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
        const fetchResponse = await fetch(url);
        const data = await fetchResponse.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
