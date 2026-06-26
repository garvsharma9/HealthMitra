export default async function handler(req, res) {
    const { range, type } = req.query;
    
    // Each page has its own Sheet ID and API Key
    // Variable naming: VERCEL_{TYPE}_SHEET_ID and VERCEL_{TYPE}_API_KEY
    let SHEET_ID, API_KEY;

    if (type === 'asha') {
        SHEET_ID = process.env.VERCEL_ASHA_SHEET_ID;
        API_KEY  = process.env.VERCEL_ASHA_API_KEY;
    } else if (type === 'vacci') {
        SHEET_ID = process.env.VERCEL_VACCI_SHEET_ID;
        API_KEY  = process.env.VERCEL_VACCI_API_KEY;
    } else if (type === 'outbreak') {
        SHEET_ID = process.env.VERCEL_OUTBREAK_SHEET_ID;
        API_KEY  = process.env.VERCEL_OUTBREAK_API_KEY;
    }

    if (!SHEET_ID || !API_KEY) {
        return res.status(200).json({ 
            error: `Missing env vars for "${type}". SHEET_ID found: ${!!SHEET_ID}, API_KEY found: ${!!API_KEY}. Set VERCEL_${(type || '').toUpperCase()}_SHEET_ID and VERCEL_${(type || '').toUpperCase()}_API_KEY.`,
            values: null
        });
    }

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
        const fetchResponse = await fetch(url);
        const data = await fetchResponse.json();

        // Google API returns { error: { code, message, status } } on failure
        if (data.error) {
            return res.status(200).json({
                error: `Google API: ${data.error.message || JSON.stringify(data.error)}`,
                values: null
            });
        }

        res.status(200).json(data);
    } catch (err) {
        res.status(200).json({ error: `Server error: ${err.message}`, values: null });
    }
}
