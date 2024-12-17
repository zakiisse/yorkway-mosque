document.addEventListener('DOMContentLoaded', () => {
    // 1. Format today's date as "YYYY-MM-DD"
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayDate = `${yyyy}-${mm}-${dd}`;
  
    // 2. Fetch data/prayerTimes.json
    fetch('data/prayerTimes.json')
      .then(response => response.json())
      .then(prayerData => {
        // 3. Check if today's date is in the JSON
        const todaysData = prayerData[todayDate];
        if (todaysData) {
          // 4. Update table cells
          document.getElementById('fajr-time').textContent = todaysData.Fajr;
          document.getElementById('dhuhr-time').textContent = todaysData.Dhuhr;
          document.getElementById('asr-time').textContent = todaysData.Asr;
          document.getElementById('maghrib-time').textContent = todaysData.Maghrib;
          document.getElementById('isha-time').textContent = todaysData.Esha || todaysData.Isha;
  
          document.getElementById('today-date').textContent = `Today's Date: ${todayDate}`;
        } else {
          document.getElementById('today-date').textContent = `No timetable for ${todayDate}. Please update prayerTimes.json.`;
        }
      })
      .catch(err => {
        console.error('Error fetching prayerTimes.json:', err);
        document.getElementById('today-date').textContent = 'Error loading prayer times.';
      });
  });
  
  