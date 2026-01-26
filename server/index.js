const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// --- Translation Logic ---
// We use a public, free translation interface as a reliable base.
// In production, you would replace this with a Google Cloud or Azure key.
app.post('/api/translate', async (req, res) => {
    const { text, targetLang } = req.body;
    
    try {
        // Using MyMemory API (Free/Public) as a robust starting point for Indic languages
        const response = await axios.get(`https://api.mymemory.translated.net/get`, {
            params: {
                q: text,
                langpair: `en|${targetLang}`
            }
        });
        
        res.json({ 
            translatedText: response.data.responseData.translatedText,
            source: 'MyMemory-Engine'
        });
    } catch (error) {
        console.error('Translation Error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// --- APMC Price Feed Simulation ---
// In a real app, this would fetch from data.gov.in or similar APMC APIs.
app.get('/api/prices', (req, res) => {
    const mockPrices = [
        { item: 'Wheat (Kanak)', price: 2450, change: '+20', location: 'Azadpur' },
        { item: 'Basmati Rice', price: 4200, change: '-15', location: 'Nagpur' },
        { item: 'Tomato', price: 1800, change: '+50', location: 'Nashik' },
        { item: 'Potato', price: 1250, change: '+5', location: 'Agra' }
    ];
    res.json(mockPrices);
});

app.listen(PORT, () => {
    console.log(`Multilingual Mandi Server running on port ${PORT}`);
});
