import fs from 'fs/promises';

/**
 * Periodically simulates the discharging of smart benches.
 * Each bench decreases its battery level by 1 on an independent random interval (0-20 seconds).
 * When battery level reaches 0, it resets to 100.
 * @param {string} dataPath - Absolute path to benches.json
 */
export function startTelemetrySimulator(dataPath) {
  console.log('[Simulator] Otomatik simülasyon başlatıldı. Banklar 0-20 saniye arası rastgele sürelerde 1-1 azalacak.');

  // Store countdown timers (in seconds) for each bench index
  let timers = [];

  setInterval(async () => {
    try {
      const data = await fs.readFile(dataPath, 'utf8');
      const benches = JSON.parse(data);

      // Initialize timers array on first run or if length changed
      if (timers.length !== benches.length) {
        timers = benches.map(() => Math.floor(Math.random() * 21));
      }

      let fileNeedsUpdate = false;

      // Tick all timers
      for (let i = 0; i < benches.length; i++) {
        timers[i] = timers[i] - 1;
        
        // If countdown expires, decrease battery and reset timer
        if (timers[i] <= 0) {
          let newLevel = benches[i].batteryLevel - 1;
          if (newLevel <= 0) {
            newLevel = 100;
          }
          benches[i].batteryLevel = newLevel;
          
          // Reset this bench's timer to a random value between 0 and 20 seconds
          timers[i] = Math.floor(Math.random() * 21);
          fileNeedsUpdate = true;
        }
      }

      // Write back only if at least one bench's battery level changed on this tick
      if (fileNeedsUpdate) {
        await fs.writeFile(dataPath, JSON.stringify(benches, null, 2), 'utf8');
      }
    } catch (error) {
      console.error('[Simulator] Güncelleme hatası:', error.message);
    }
  }, 1000); // Check and tick every 1 second
}
