import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { startTelemetrySimulator } from './simulator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY || 'sundock-secret-key';

// Configurable path to benches.json file
const dataPath = process.env.DATA_FILE_PATH || path.join(__dirname, '../src/data/benches.json');

app.use(cors());
app.use(express.json());

// Helper function to read benches from JSON file
async function readBenches() {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Veri dosyası okuma hatası:', error.message);
    throw new Error('Veri okunamadı.');
  }
}

// Helper function to write benches back to JSON file
async function writeBenches(benches) {
  try {
    // Format JSON with 2-spaces for readability
    await fs.writeFile(dataPath, JSON.stringify(benches, null, 2), 'utf8');
  } catch (error) {
    console.error('Veri dosyası yazma hatası:', error.message);
    throw new Error('Veri kaydedilemedi.');
  }
}

// Endpoint: Get all benches
app.get('/api/benches', async (req, res) => {
  try {
    const benches = await readBenches();
    res.json(benches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Get a single bench by ID
app.get('/api/benches/:id', async (req, res) => {
  try {
    const benches = await readBenches();
    const benchId = parseInt(req.params.id);
    const bench = benches.find(b => b.id === benchId);
    
    if (!bench) {
      return res.status(404).json({ error: 'Bank bulunamadı.' });
    }
    res.json(bench);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Receive telemetry and update battery / status
app.post('/api/telemetry/report', async (req, res) => {
  try {
    const requestKey = req.headers['x-api-key'];
    if (requestKey !== API_KEY) {
      return res.status(401).json({ error: 'Yetkisiz erişim: Geçersiz API anahtarı.' });
    }

    const { id, batteryLevel, status } = req.body;
    
    if (id === undefined) {
      return res.status(400).json({ error: 'Eksik parametre: id gerekli.' });
    }

    const benches = await readBenches();
    const benchIndex = benches.findIndex(b => b.id === parseInt(id));

    if (benchIndex === -1) {
      return res.status(404).json({ error: 'Belirtilen ID\'ye sahip bank bulunamadı.' });
    }

    // Update batteryLevel if provided
    if (batteryLevel !== undefined) {
      const level = Math.min(100, Math.max(0, parseInt(batteryLevel)));
      benches[benchIndex].batteryLevel = level;
      
      // Auto status change if battery is empty and no explicit status is provided
      if (level === 0 && !status) {
        benches[benchIndex].status = 'offline';
      }
    }

    // Update status if provided
    if (status !== undefined) {
      const validStatuses = ['active', 'offline', 'maintenance'];
      if (validStatuses.includes(status)) {
        benches[benchIndex].status = status;
      }
    }

    // Save updated array to file
    await writeBenches(benches);

    console.log(`[Telemetry] Bank #${id} güncellendi: %${benches[benchIndex].batteryLevel} - ${benches[benchIndex].status}`);
    res.json(benches[benchIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
  console.log(`Veri dosyası hedefi: ${dataPath}`);
  
  // Start simulation loop
  startTelemetrySimulator(dataPath);
});
