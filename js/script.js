document.addEventListener('DOMContentLoaded', () => {
  // 1. Determine Today's Date as YYYY-MM-DD
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayDate = `${yyyy}-${mm}-${dd}`;
  const todayDateElem = document.getElementById('today-date');

  // Display today's date on the page
  if (todayDateElem) {
    todayDateElem.textContent = `Today's Date: ${todayDate}`;
  }

  // 2. Fetch *only* the local JSON (no more AlAdhan API)
  fetch('data/prayerTimes.json')
    .then(response => response.json())
    .then(localData => {
      // 3. Retrieve today's prayer times from the JSON
      const todaysData = localData[todayDate];

      if (!todaysData) {
        if (todayDateElem) {
          todayDateElem.textContent = `No timetable for ${todayDate} in local JSON.`;
        }
        return;
      }

      // 4. Populate the Table
      //    Assumes your JSON has: FajrBegin, Fajr, DhuhrBegin, Dhuhr, etc.
      //    If your keys differ, adjust accordingly.

      // Fajr
      document.getElementById('fajr-start').textContent  = todaysData.FajrBegin  || '--:--';
      document.getElementById('fajr-jamaah').textContent = todaysData.Fajr       || '--:--';

      // Dhuhr
      document.getElementById('dhuhr-start').textContent  = todaysData.DhuhrBegin  || '--:--';
      document.getElementById('dhuhr-jamaah').textContent = todaysData.Dhuhr       || '--:--';

      // Asr
      document.getElementById('asr-start').textContent  = todaysData.AsrBegin  || '--:--';
      document.getElementById('asr-jamaah').textContent = todaysData.Asr       || '--:--';

      // Maghrib
      document.getElementById('maghrib-start').textContent  = todaysData.MaghribBegin  || '--:--';
      document.getElementById('maghrib-jamaah').textContent = todaysData.Maghrib        || '--:--';

      // Isha
      document.getElementById('isha-start').textContent  = todaysData.IshaBegin  || '--:--';
      document.getElementById('isha-jamaah').textContent = todaysData.Isha       || '--:--';
    })
    .catch(error => {
      console.error('Error loading prayer times:', error);
      if (todayDateElem) {
        todayDateElem.textContent = 'Error loading prayer times.';
      }
    });

  // 5. Handle Jumu’ah DST Note (optional)
  const jumuahNoteElem = document.getElementById('jumuah-note');
  if (jumuahNoteElem) {
    function isDST(date) {
      const month = date.getMonth(); // 0=Jan, 1=Feb, etc.
      // Simple assumption: DST is from April (3) to September (8)
      return (month >= 3 && month <= 8);
    }
    if (isDST(now)) {
      jumuahNoteElem.textContent = "Jumu’ah prayers (DST) – 1st Khutba: 1:20pm, 2nd Khutba: 2:00pm";
    } else {
      jumuahNoteElem.textContent = "Jumu’ah prayers – 1st Khutba: 12:20pm, 2nd Khutba: 1:00pm";
    }
  }

  // 6. Mobile Nav Toggle (if your HTML has #menuToggle/#navLinks)
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
});
