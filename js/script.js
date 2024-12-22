document.addEventListener('DOMContentLoaded', () => {
  // 1. Determine Today's Date as YYYY-MM-DD
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayDate = `${yyyy}-${mm}-${dd}`;
  const todayDateElem = document.getElementById('today-date');

  // Display today's date in the DOM
  if (todayDateElem) {
    todayDateElem.textContent = `Today's Date: ${todayDate}`;
  }

  // 2. Fetch AlAdhan API for Accurate Entry Times
  //    Adjust city/country/method to your preference
  const alAdhanURL = 'https://api.aladhan.com/v1/timingsByCity?city=London&country=UK&method=2';

  fetch(alAdhanURL)
    .then(response => response.json())
    .then(apiData => {
      if (!apiData || !apiData.data || !apiData.data.timings) {
        throw new Error('AlAdhan API returned invalid data');
      }
      
      // Extract entry times
      const entryTimes = {
        Fajr:    apiData.data.timings.Fajr,
        Dhuhr:   apiData.data.timings.Dhuhr,
        Asr:     apiData.data.timings.Asr,
        Maghrib: apiData.data.timings.Maghrib,
        Isha:    apiData.data.timings.Isha
      };

      // 3. Fetch Local JSON for Jama’ah Times
      return fetch('data/prayerTimes.json')
        .then(localRes => localRes.json())
        .then(localData => {
          return { entryTimes, localData };
        });
    })
    .then(({ entryTimes, localData }) => {
      // 4. Combine Both & Populate the Table
      const todaysData = localData[todayDate];
      if (!todaysData) {
        if (todayDateElem) {
          todayDateElem.textContent = `No timetable for ${todayDate} in local JSON.`;
        }
        return;
      }

      // Fajr
      document.getElementById('fajr-start').textContent  = entryTimes.Fajr  || '--:--';
      document.getElementById('fajr-jamaah').textContent = todaysData.Fajr  || '--:--';

      // Dhuhr
      document.getElementById('dhuhr-start').textContent  = entryTimes.Dhuhr || '--:--';
      document.getElementById('dhuhr-jamaah').textContent = todaysData.Dhuhr || '--:--';

      // Asr
      document.getElementById('asr-start').textContent  = entryTimes.Asr || '--:--';
      document.getElementById('asr-jamaah').textContent = todaysData.Asr || '--:--';

      // Maghrib
      document.getElementById('maghrib-start').textContent  = entryTimes.Maghrib || '--:--';
      document.getElementById('maghrib-jamaah').textContent = todaysData.Maghrib || '--:--';

      // Isha
      document.getElementById('isha-start').textContent  = entryTimes.Isha || '--:--';
      // If your JSON uses "Esha", optionally do: || todaysData.Esha
      document.getElementById('isha-jamaah').textContent = todaysData.Isha || '--:--';
    })
    .catch(error => {
      console.error('Error loading prayer times:', error);
      if (todayDateElem) {
        todayDateElem.textContent = 'Error loading prayer times.';
      }
    });

  // 5. Handle Jumu’ah DST Note
  const jumuahNoteElem = document.getElementById('jumuah-note');
  if (jumuahNoteElem) {
    function isDST(date) {
      const month = date.getMonth(); // 0=Jan, 1=Feb, ...
      // Quick check: assume April–September is DST in some places
      return (month >= 3 && month <= 8);
    }
    if (isDST(now)) {
      jumuahNoteElem.textContent = "Jumu’ah prayers (Summer DST): 1:20pm & 2:20pm";
    } else {
      jumuahNoteElem.textContent = "Jumu’ah prayers (Winter): 12:20pm & 1:20pm";
    }
  }

  // 6. Mobile Nav Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
});

  
