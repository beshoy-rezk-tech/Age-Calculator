// Utility functions for DOM access
function $(id) {
    return document.getElementById(id);
}

const birthdateInput = $('birthdate');
const calculateBtn = $('calculate-btn');
const errorMsg = $('error-msg');
const resultDiv = $('result');

const yearsSpan = $('years');
const monthsSpan = $('months');
const daysSpan = $('days');

const totalMonthsSpan = $('total-months');
const totalWeeksSpan = $('total-weeks');
const totalDaysSpan = $('total-days');
const totalHoursSpan = $('total-hours');
const totalMinutesSpan = $('total-minutes');
const nextBirthdaySpan = $('next-birthday');
const savedBirthdaysDiv = document.getElementById('saved-birthdays');

// Fix: Move these to the top so they are initialized before use
let countdownInterval = null;
const shareBtn = document.getElementById('share-btn');
const saveBtn = document.getElementById('save-btn');

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    // Change icon
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️';
        darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        darkModeToggle.textContent = '🌙';
        darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
    // Persist preference
    localStorage.setItem('agecalc-darkmode', document.body.classList.contains('dark-mode'));
});
// On load, set dark mode if preferred
if (localStorage.getItem('agecalc-darkmode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
    darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
}

// Loading spinner control
const loadingSpinner = document.getElementById('loading-spinner');
function showLoading() {
    loadingSpinner.style.display = 'block';
    calculateBtn.disabled = true;
}
function hideLoading() {
    loadingSpinner.style.display = 'none';
    calculateBtn.disabled = false;
}

// Add event listener for calculation
calculateBtn.addEventListener('click', () => {
    showLoading();
    setTimeout(() => { // Simulate calculation delay for UX
        clearError();
        const birthdateString = birthdateInput.value;
        
        if (!birthdateString) {
            showError("Please enter your date of birth.");
            hideLoading();
            return;
        }

        const today = new Date();
        const birthDate = new Date(birthdateString);
        today.setHours(0, 0, 0, 0);

        if (birthDate > today) {
            showError("Birth date cannot be in the future.");
            hideLoading();
            return;
        }
        
        displayResults(today, birthDate);
        hideLoading();
    }, 400); // 400ms for smoothness
});

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    birthdateInput.classList.add('input-error');
    resultDiv.style.display = 'none';
}

function clearError() {
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
    birthdateInput.classList.remove('input-error');
}

// Helper: Get saved birthdays from localStorage
function getSavedBirthdays() {
    return JSON.parse(localStorage.getItem('agecalc-birthdays') || '[]');
}
// Helper: Save birthdays to localStorage
function setSavedBirthdays(list) {
    localStorage.setItem('agecalc-birthdays', JSON.stringify(list));
}

// Render saved birthdays list
function renderSavedBirthdays() {
    const list = getSavedBirthdays();
    if (list.length === 0) {
        savedBirthdaysDiv.style.display = 'none';
        savedBirthdaysDiv.innerHTML = '';
        return;
    }
    savedBirthdaysDiv.style.display = 'block';
    savedBirthdaysDiv.innerHTML = '<strong>Saved Birthdays:</strong>';
    list.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'saved-birthday-item';
        div.innerHTML = `<span style="cursor:pointer;" tabindex="0" data-idx="${idx}">${item.name} (${item.date})</span> <button class="feature-btn" data-remove="${idx}" aria-label="Remove">🗑️</button>`;
        savedBirthdaysDiv.appendChild(div);
    });
}

// Handle click on saved birthday (recalculate)
savedBirthdaysDiv.addEventListener('click', (e) => {
    if (e.target.dataset.idx !== undefined) {
        const idx = Number(e.target.dataset.idx);
        const list = getSavedBirthdays();
        if (list[idx]) {
            birthdateInput.value = list[idx].date;
            calculateBtn.click();
        }
    } else if (e.target.dataset.remove !== undefined) {
        const idx = Number(e.target.dataset.remove);
        let list = getSavedBirthdays();
        list.splice(idx, 1);
        setSavedBirthdays(list);
        renderSavedBirthdays();
    }
});

// Save button logic
saveBtn.addEventListener('click', () => {
    if (!birthdateInput.value) {
        alert('Please enter a date of birth first!');
        return;
    }
    const name = prompt('Enter a name for this birthday:');
    if (!name) return;
    const list = getSavedBirthdays();
    // Prevent duplicates
    if (list.some(item => item.date === birthdateInput.value && item.name === name)) {
        alert('This birthday is already saved!');
        return;
    }
    list.push({ name, date: birthdateInput.value });
    setSavedBirthdays(list);
    renderSavedBirthdays();
    alert('Birthday saved!');
});

// Render on load
renderSavedBirthdays();

// Zodiac and fun facts
function getZodiacSign(date) {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius';
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces';
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio';
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius';
    return 'Capricorn';
}
function getDayOfWeek(date) {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { weekday: 'long' });
}

// Fun facts for each zodiac sign
const zodiacFunFacts = {
    'Aries': 'Aries are known for their courage and determination.',
    'Taurus': 'Taurus are reliable and patient.',
    'Gemini': 'Geminis are adaptable and outgoing.',
    'Cancer': 'Cancers are deeply intuitive and sentimental.',
    'Leo': 'Leos are natural leaders and very creative.',
    'Virgo': 'Virgos are analytical and kind.',
    'Libra': 'Libras value harmony and fairness.',
    'Scorpio': 'Scorpios are passionate and resourceful.',
    'Sagittarius': 'Sagittarius are adventurous and optimistic.',
    'Capricorn': 'Capricorns are disciplined and responsible.',
    'Aquarius': 'Aquarius are independent and progressive.',
    'Pisces': 'Pisces are compassionate and artistic.'
};

// Add zodiac and fun facts to results
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('zodiac-fun')) {
        const details = document.querySelector('.age-details');
        const zodiacDiv = document.createElement('div');
        zodiacDiv.id = 'zodiac-fun';
        zodiacDiv.style.marginTop = '1.5rem';
        zodiacDiv.style.textAlign = 'center';
        details.appendChild(zodiacDiv);
    }
});

function updateZodiacAndFun(birthDate) {
    const zodiacDiv = document.getElementById('zodiac-fun');
    if (!zodiacDiv) return;
    const zodiac = getZodiacSign(birthDate);
    const dayOfWeek = getDayOfWeek(birthDate);
    const fact = zodiacFunFacts[zodiac] || '';
    zodiacDiv.innerHTML = `<strong>Zodiac Sign:</strong> <span id="zodiac-sign" tabindex="0" title="${fact}">${zodiac}</span><br><strong>Born on:</strong> ${dayOfWeek}`;
    // Custom tooltip for better UX
    const signSpan = document.getElementById('zodiac-sign');
    let tooltip;
    signSpan.addEventListener('mouseenter', () => {
        tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = fact;
        document.body.appendChild(tooltip);
        const rect = signSpan.getBoundingClientRect();
        tooltip.style.left = rect.left + window.scrollX + 'px';
        tooltip.style.top = (rect.bottom + window.scrollY + 6) + 'px';
    });
    signSpan.addEventListener('mouseleave', () => {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    });
}

// Add lunar years and live countdown timer
function calculateLunarYears(today, birthDate) {
    // Lunar year ≈ 354.37 days
    const diffTime = today.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays / 354.37).toFixed(2);
}

function updateLunarYears(today, birthDate) {
    let lunarSpan = document.getElementById('lunar-years');
    try {
        if (!lunarSpan) {
            const details = document.querySelector('.age-details');
            const p = document.createElement('p');
            p.innerHTML = '<strong>Lunar Years:</strong> <span id="lunar-years">-</span>';
            if (details.children.length > 1) {
                details.insertBefore(p, details.children[1]);
            } else {
                details.appendChild(p);
            }
            lunarSpan = document.getElementById('lunar-years');
        }
        lunarSpan.textContent = calculateLunarYears(today, birthDate);
        console.log('Lunar years updated:', lunarSpan.textContent);
    } catch (e) {
        if (lunarSpan) lunarSpan.textContent = '-';
        console.log('Error in updateLunarYears:', e);
    }
}

function startCountdown(nextBirthday) {
    const countdownSpan = document.getElementById('next-birthday-countdown');
    if (!countdownSpan) return;
    if (countdownInterval) clearInterval(countdownInterval);
    function update() {
        const now = new Date();
        let diff = nextBirthday.getTime() - now.getTime();
        if (diff < 0) diff = 0;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        countdownSpan.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    update();
    countdownInterval = setInterval(update, 1000);
}

// Update calculateNextBirthday to support countdown
function calculateNextBirthday(today, birthDate) {
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today.getTime() > nextBirthday.getTime()) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    if (today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()) {
        nextBirthdaySpan.textContent = "It's today! Happy Birthday!";
        if (document.getElementById('next-birthday-countdown')) {
            document.getElementById('next-birthday-countdown').textContent = '';
        }
        if (countdownInterval) clearInterval(countdownInterval);
        console.log('Today is birthday');
        return;
    }
    let tempDate = new Date(today);
    let months = 0;
    while(new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, tempDate.getDate()) <= nextBirthday) {
        months++;
        tempDate.setMonth(tempDate.getMonth() + 1);
    }
    const daysLeft = Math.ceil((nextBirthday.getTime() - tempDate.getTime()) / (1000 * 60 * 60 * 24));
    let result = "";
    if (months > 0) {
        result += `${months} month${months > 1 ? 's' : ''}`;
    }
    if (daysLeft > 0) {
        if(result) result += " and ";
        result += `${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
    }
    nextBirthdaySpan.textContent = result;
    let countdownSpan = document.getElementById('next-birthday-countdown');
    if (!countdownSpan) {
        const p = nextBirthdaySpan.parentElement;
        countdownSpan = document.createElement('span');
        countdownSpan.id = 'next-birthday-countdown';
        countdownSpan.style.display = 'block';
        countdownSpan.style.marginTop = '0.5rem';
        countdownSpan.style.fontWeight = 'bold';
        countdownSpan.style.color = 'var(--secondary-color)';
        p.appendChild(countdownSpan);
    }
    startCountdown(nextBirthday);
    console.log('Next birthday calculated:', result);
}

// Data for fun facts
const historicalEvents = {
    '01-01': 'The Euro became the official currency of 12 EU countries in 2002.',
    '07-20': 'Humans first landed on the Moon in 1969.',
    '12-25': 'Isaac Newton was born in 1642.',
    '08-08': 'The first ever color TV broadcast took place in 1950.',
    '03-14': 'Albert Einstein was born in 1879.',
    '10-01': 'Walt Disney World opened in Florida in 1971.',
    '04-12': 'The first human spaceflight by Yuri Gagarin in 1961.'
};
const celebrityBirthdays = {
    '01-01': 'Verne Troyer (Mini-Me in Austin Powers)',
    '07-20': 'Gisele Bündchen (Supermodel)',
    '12-25': 'Annie Lennox (Singer)',
    '08-08': 'Dustin Hoffman (Actor)',
    '03-14': 'Albert Einstein (Physicist)',
    '10-01': 'Julie Andrews (Actress)',
    '04-12': 'David Letterman (TV Host)'
};
const birthdayQuotes = [
    'Count your life by smiles, not tears. Count your age by friends, not years.',
    'The more you praise and celebrate your life, the more there is in life to celebrate. – Oprah Winfrey',
    'A birthday is not the end of another year, but the start of a new one.',
    'You are never too old to set another goal or to dream a new dream. – C.S. Lewis',
    'May your birthday be the start of a year filled with good luck, good health, and much happiness.'
];
const funAgeFacts = [
    { year: 1998, fact: 'You are older than Google!' },
    { year: 2007, fact: 'You were born before the first iPhone!' },
    { year: 2004, fact: 'You are older than Facebook!' },
    { year: 2010, fact: 'You are older than Instagram!' },
    { year: 3000, fact: 'You are living in the digital age!' } // fallback
];
const chineseZodiacAnimals = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

function getChineseZodiac(year) {
    return chineseZodiacAnimals[(year - 4) % 12];
}
function getLifePathNumber(date) {
    // date: YYYY-MM-DD
    const nums = date.replace(/-/g, '').split('').map(Number);
    let sum = nums.reduce((a, b) => a + b, 0);
    while (sum > 9 && sum !== 11 && sum !== 22) {
        sum = sum.toString().split('').reduce((a, b) => a + Number(b), 0);
    }
    return sum;
}
function getFutureBirthdays(birthDate, count = 5) {
    const d = new Date(birthDate);
    const today = new Date();
    let year = today.getFullYear();
    if (today.getMonth() > d.getMonth() || (today.getMonth() === d.getMonth() && today.getDate() > d.getDate())) {
        year++;
    }
    const results = [];
    for (let i = 0; i < count; i++) {
        const next = new Date(year + i, d.getMonth(), d.getDate());
        results.push(`${next.toLocaleDateString(undefined, { year: 'numeric', weekday: 'long' })}`);
    }
    return results;
}
function getNextMilestones(birthDate) {
    const d = new Date(birthDate);
    const now = new Date();
    const msLived = now - d;
    const milestones = [
        { label: '10,000 days', ms: 10000 * 24 * 60 * 60 * 1000 },
        { label: '1 billion seconds', ms: 1e9 * 1000 },
        { label: '100 million minutes', ms: 1e8 * 60 * 1000 }
    ];
    return milestones.map(m => {
        const milestoneDate = new Date(d.getTime() + m.ms);
        return { label: m.label, date: milestoneDate };
    }).filter(m => m.date > now);
}
function getHistoricalEvent(month, day) {
    return historicalEvents[`${month}-${day}`] || null;
}
function getCelebrityBirthday(month, day) {
    return celebrityBirthdays[`${month}-${day}`] || null;
}
function getRandomQuote() {
    return birthdayQuotes[Math.floor(Math.random() * birthdayQuotes.length)];
}
function getFunAgeFact(year) {
    for (const fact of funAgeFacts) {
        if (year < fact.year) return fact.fact;
    }
    return 'Every year you get even more awesome!';
}
function updateFunFactsSection(birthDate) {
    const section = document.getElementById('fun-facts-section');
    if (!section) return;
    section.className = 'fun-facts-section';
    section.innerHTML = '<h3 style="margin-top:0;">🎈 Fun Facts Zone!</h3><p style="margin-bottom:1.5em;">Discover cool, surprising, and personal facts about your birthday and age below:</p>';
    const d = new Date(birthDate);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    const now = new Date();
    const birthDateStr = (birthDate instanceof Date) ? birthDate.toISOString().slice(0, 10) : birthDate;
    // Historical event
    const event = getHistoricalEvent(month, day);
    section.innerHTML += `<div class='fun-fact-item'>📜 <b>On this day:</b> ${event ? event : 'No major historical event found for your birthday, but you make history every year!'}</div>`;
    // Celebrity
    const celeb = getCelebrityBirthday(month, day);
    section.innerHTML += `<div class='fun-fact-item'>🌟 <b>Celebrity birthday:</b> ${celeb ? celeb : 'No famous celebrity found for your birthday (yet!)'}</div>`;
    // Chinese zodiac
    section.innerHTML += `<div class='fun-fact-item'>🐲 <b>Chinese Zodiac:</b> ${getChineseZodiac(year)}</div>`;
    // Age in other units
    const diffMs = now - d;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);
    const heartbeats = Math.floor(diffMin * 70); // avg 70 bpm
    section.innerHTML += `<div class='fun-fact-item'>⏱️ <b>Age in seconds:</b> ${diffSec.toLocaleString()}</div>`;
    section.innerHTML += `<div class='fun-fact-item'>⚡ <b>Age in milliseconds:</b> ${diffMs.toLocaleString()}</div>`;
    section.innerHTML += `<div class='fun-fact-item'>❤️ <b>Estimated heartbeats:</b> ${heartbeats.toLocaleString()}</div>`;
    // Next major milestone
    const milestones = getNextMilestones(birthDate);
    milestones.forEach(m => {
        section.innerHTML += `<div class='fun-fact-item'>🎯 <b>Next milestone:</b> ${m.label} on ${m.date.toLocaleDateString()}</div>`;
    });
    // Birthday quote
    section.innerHTML += `<div class='fun-fact-item'>🎉 <b>Birthday quote:</b> "${getRandomQuote()}"</div>`;
    // Future birthdays
    const futureBdays = getFutureBirthdays(birthDate);
    section.innerHTML += `<div class='fun-fact-item'>📅 <b>Next 5 birthdays:</b> <ul style='margin:0 0 0 1.5em;padding:0;'>${futureBdays.map(b => `<li>${b}</li>`).join('')}</ul></div>`;
    // Life path number
    section.innerHTML += `<div class='fun-fact-item'>🔢 <b>Life Path Number:</b> ${getLifePathNumber(birthDateStr)}</div>`;
    // Fun age fact
    const funFact = getFunAgeFact(year);
    section.innerHTML += `<div class='fun-fact-item'>🤔 <b>Fun fact:</b> ${funFact}</div>`;
    // Shareable card (simple)
    section.innerHTML += `<div class='fun-fact-item'>💌 <b>Shareable Card:</b> <button id='copy-card-btn' class='feature-btn' aria-label='Copy Card'><span aria-hidden='true'>📋</span><span class='visually-hidden'>Copy Card</span></button></div>`;
    // Card content for copying
    section.innerHTML += `<textarea id='card-content' style='position:absolute;left:-9999px;top:-9999px;'>Happy Birthday!\n\nYou are ${yearsSpan.textContent} years, ${monthsSpan.textContent} months, and ${daysSpan.textContent} days old.\nChinese Zodiac: ${getChineseZodiac(year)}\nLife Path Number: ${getLifePathNumber(birthDateStr)}\n${getRandomQuote()}</textarea>`;
    // Copy card logic
    setTimeout(() => {
        const btn = document.getElementById('copy-card-btn');
        if (btn) {
            btn.onclick = () => {
                const card = document.getElementById('card-content');
                card.select();
                document.execCommand('copy');
                btn.innerHTML = 'Copied!';
                setTimeout(() => {
                    btn.innerHTML = "<span aria-hidden='true'>📋</span><span class='visually-hidden'>Copy Card</span>";
                    addCustomTooltip(btn);
                }, 1500);
            };
            addCustomTooltip(btn);
        }
    }, 100);
}

// Update displayResults to show fun facts
function displayResults(today, birthDate) {
    console.log('displayResults called', today, birthDate);
    calculateAge(today, birthDate);
    calculateDetails(today, birthDate);
    calculateNextBirthday(today, birthDate);
    updateLunarYears(today, birthDate);
    updateZodiacAndFun(birthDate);
    updateFunFactsSection(birthDate);
    resultDiv.style.display = 'block';
    console.log('displayResults finished');
}

// Calculate age in years, months, days
function calculateAge(today, birthDate) {
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    yearsSpan.textContent = years;
    monthsSpan.textContent = months;
    daysSpan.textContent = days;
}

// Calculate total months, weeks, days, hours, minutes
function calculateDetails(today, birthDate) {
    const diffTime = today.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    totalDaysSpan.textContent = diffDays.toLocaleString();
    totalWeeksSpan.textContent = Math.floor(diffDays / 7).toLocaleString();
    let totalMonths = (today.getFullYear() - birthDate.getFullYear()) * 12;
    totalMonths += today.getMonth() - birthDate.getMonth();
    if (today.getDate() < birthDate.getDate()) {
        totalMonths--;
    }
    totalMonthsSpan.textContent = totalMonths.toLocaleString();
    totalHoursSpan.textContent = (diffDays * 24).toLocaleString();
    totalMinutesSpan.textContent = (diffDays * 24 * 60).toLocaleString();
}

// Feature button event listeners (to be implemented)
shareBtn.addEventListener('click', () => {
    if (resultDiv.style.display === 'none') {
        alert('Please calculate your age first!');
        return;
    }
    const summary = generateShareSummary();
    if (navigator.share) {
        navigator.share({
            title: 'My Age Details',
            text: summary
        }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(summary).then(() => {
            alert('Age details copied to clipboard!');
        }, () => {
            alert('Could not copy to clipboard.');
        });
    } else {
        // Fallback: prompt
        window.prompt('Copy your age details:', summary);
    }
});

function generateShareSummary() {
    return `I am ${yearsSpan.textContent} years, ${monthsSpan.textContent} months, and ${daysSpan.textContent} days old.\n\n` +
        `Total Months: ${totalMonthsSpan.textContent}\n` +
        `Total Weeks: ${totalWeeksSpan.textContent}\n` +
        `Total Days: ${totalDaysSpan.textContent}\n` +
        `Total Hours: ${totalHoursSpan.textContent}\n` +
        `Total Minutes: ${totalMinutesSpan.textContent}\n` +
        `Next Birthday in: ${nextBirthdaySpan.textContent}`;
}

// Custom tooltip for feature buttons
function addCustomTooltip(btn) {
    let tooltip;
    const label = btn.getAttribute('aria-label');
    if (!label) return;
    btn.addEventListener('mouseenter', show);
    btn.addEventListener('focus', show);
    btn.addEventListener('mouseleave', hide);
    btn.addEventListener('blur', hide);
    function show() {
        tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = label;
        document.body.appendChild(tooltip);
        const rect = btn.getBoundingClientRect();
        tooltip.style.left = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = (rect.top + window.scrollY - 40) + 'px';
    }
    function hide() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }
}
['share-btn', 'save-btn', 'copy-card-btn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) addCustomTooltip(btn);
});

// ... more features and improvements will be added in the next steps ...
