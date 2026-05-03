"use strict";

// ==============================
// INITIALIZATION
// ==============================

// Global Data
let appData = null;
let currentLang = 'en';

// Constants
const MIN_VOTING_AGE = 18;
const MAX_AGE = 120;
const GEMINI_API_KEY = "AIzaSyBuyVbWYhPK4KS-PhnON4EEtAGiaPHi1Y8";
const contextPrompt = `
You are an Election Guide Assistant for Indian voters.
Help users understand:
- voter eligibility
- registration process
- voting steps
- polling stations

Keep answers simple, short, and beginner-friendly.
If the user asks in Hindi or Bengali, reply in that language. Otherwise, reply in English.
`;

// DOM Elements
const domElements = {
    html: document.documentElement,
    themeToggle: document.getElementById('theme-toggle'),
    langToggle: document.getElementById('lang-toggle'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    mobileMenu: document.getElementById('mobile-menu'),
    navbar: document.getElementById('navbar'),
    ageInput: document.getElementById('age-input'),
    checkAgeBtn: document.getElementById('check-age-btn'),
    eligResult: document.getElementById('eligibility-result'),
    resultIcon: document.getElementById('result-icon'),
    resultTitle: document.getElementById('result-title'),
    resultDesc: document.getElementById('result-desc'),
    resultActions: document.getElementById('result-actions'),
    locationInput: document.getElementById('location-input'),
    findStationBtn: document.getElementById('find-station-btn'),
    mapPlaceholder: document.getElementById('map-placeholder'),
    mapIframe: document.getElementById('map-iframe'),
    calendarBtn: document.getElementById('calendar-btn'),
    shareBtn: document.getElementById('footer-share-btn'),
    toast: document.getElementById('toast'),
    toastMsg: document.getElementById('toast-msg'),
    faqContainer: document.getElementById('faq-container'),
    chatbotFab: document.getElementById('chatbot-fab'),
    chatbotWindow: document.getElementById('chatbot-window'),
    closeChatbot: document.getElementById('close-chatbot'),
    chatMessages: document.getElementById('chatbot-messages'),
    chatInput: document.getElementById('chatbot-input'),
    chatSend: document.getElementById('chatbot-send'),
    chatMic: document.getElementById('chatbot-mic')
};

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    try {
        const response = await fetch('data.json');
        appData = await response.json();

        initLanguage();
        renderFAQs();
        initChatbot();
    } catch (err) {
        console.error("Failed to load data:", err);
        showError("Failed to load application data. Please refresh.");
    }
});

function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && prefersDark)) {
        domElements.html.classList.add('dark');
    } else {
        domElements.html.classList.remove('dark');
    }
}

// ==============================
// ELIGIBILITY LOGIC
// ==============================

function validateAge(age) {
    return Number.isInteger(age) && age >= 0 && age <= MAX_AGE;
}

/**
 * Checks if user age meets voting eligibility
 * @param {number} age
 * @returns {boolean}
 */
function checkEligibilityLogic(age) {
    return age >= MIN_VOTING_AGE;
}

function isEligibleUser(age) {
    return validateAge(age) && checkEligibilityLogic(age);
}

function updateEligibilityUI(isEligible, age) {
    domElements.eligResult.classList.remove('hidden');
    domElements.resultActions.innerHTML = '';

    if (!isEligible) {
        domElements.eligResult.className = "mt-8 text-center p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 animate-fade-in";
        domElements.resultIcon.innerHTML = '<i class="fa-solid fa-clock text-red-500"></i>';
        domElements.resultTitle.innerText = "Not Eligible Yet";
        domElements.resultTitle.className = "text-2xl font-bold mb-2 text-red-700 dark:text-red-400";
        domElements.resultDesc.innerText = `You are ${age} years old. The voting age in India is ${MIN_VOTING_AGE}. You will be eligible in ${MIN_VOTING_AGE - age} year(s). Stay informed!`;

        domElements.resultActions.innerHTML = `<button onclick="scrollToSection('why-vote')" class="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-200 transition-colors">Why Voting Matters</button>`;
    } else {
        domElements.eligResult.className = "mt-8 text-center p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 animate-fade-in";
        domElements.resultIcon.innerHTML = '<i class="fa-solid fa-check-circle text-green-500"></i>';
        domElements.resultTitle.innerText = "You Are Eligible!";
        domElements.resultTitle.className = "text-2xl font-bold mb-2 text-green-700 dark:text-green-400";
        domElements.resultDesc.innerText = `As an Indian citizen aged ${MIN_VOTING_AGE} or above, you have the right to vote. Make sure you are registered.`;

        domElements.resultActions.innerHTML = `
            <button onclick="scrollToSection('registration')" class="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">Go to Registration</button>
            <button onclick="scrollToSection('voting-process')" class="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Learn Voting Process</button>
        `;
    }
}

// ==============================
// UI HANDLERS
// ==============================

if (domElements.themeToggle) {
    domElements.themeToggle.addEventListener('click', () => {
        domElements.html.classList.toggle('dark');
        localStorage.theme = domElements.html.classList.contains('dark') ? 'dark' : 'light';
    });
}

if (domElements.mobileMenuBtn) {
    domElements.mobileMenuBtn.addEventListener('click', () => {
        domElements.mobileMenu.classList.toggle('hidden');
    });
}

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        domElements.mobileMenu.classList.add('hidden');
    });
});

if (domElements.langToggle) {
    domElements.langToggle.addEventListener('change', (e) => {
        currentLang = e.target.value;
        updateLanguage();
    });
}

function initLanguage() {
    const savedLang = localStorage.getItem('appLang');
    if (savedLang && appData?.translations[savedLang]) {
        currentLang = savedLang;
        if (domElements.langToggle) domElements.langToggle.value = currentLang;
    }
    updateLanguage();
}

function updateLanguage() {
    localStorage.setItem('appLang', currentLang);
    if (!appData || !appData.translations) return;
    const trans = appData.translations[currentLang];

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (trans[key]) {
            el.innerText = trans[key];
        }
    });
}

// Scrolling & Flow Awareness
window.scrollToSection = function (sectionId) {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const targetHighlight = el.querySelector('.bg-white, .bg-gray-800') || el;
    el.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
        targetHighlight.classList.remove('highlight-pulse');
        void targetHighlight.offsetWidth;
        targetHighlight.classList.add('highlight-pulse');

        setTimeout(() => {
            targetHighlight.classList.remove('highlight-pulse');
        }, 1500);
    }, 500);
};

window.addEventListener('scroll', () => {
    if (domElements.navbar) {
        if (window.scrollY > 20) {
            domElements.navbar.classList.add('shadow-md');
        } else {
            domElements.navbar.classList.remove('shadow-md');
        }
    }

    let current = '';
    document.querySelectorAll('section').forEach(section => {
        if (window.scrollY >= section.offsetTop - 100) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

if (domElements.checkAgeBtn) {
    domElements.checkAgeBtn.addEventListener('click', async () => {
        const age = Number(domElements.ageInput.value);

        if (!validateAge(age)) {
            showError("Please enter a valid age.");
            return;
        }

        const isEligible = checkEligibilityLogic(age);
        updateEligibilityUI(isEligible, age);
        await saveUserInteraction(age, isEligible);
    });
}

if (domElements.findStationBtn) {
    domElements.findStationBtn.addEventListener('click', () => {
        const loc = domElements.locationInput.value.trim();
        if (!loc) {
            showError("Please enter your area or polling station name.");
            return;
        }

        const query = encodeURIComponent(`Polling stations near ${loc}`);
        const src = `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

        domElements.mapPlaceholder.classList.add('hidden');
        domElements.mapIframe.src = src;
        domElements.mapIframe.classList.remove('hidden');
    });
}

if (domElements.locationInput) {
    domElements.locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') domElements.findStationBtn.click();
    });
}

if (domElements.calendarBtn) {
    domElements.calendarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const text = encodeURIComponent("Election Voting Reminder");
        const details = encodeURIComponent("It's election day! Don't forget to carry your Voter ID (or approved alternative ID) to the polling station. Your voice matters!");
        const startDate = "20260501T080000";
        const endDate = "20260501T180000";

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startDate}/${endDate}&details=${details}`;
        window.open(url, '_blank');
    });
}

if (domElements.shareBtn) {
    domElements.shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: 'Election Guide Assistant',
            text: 'Learn how elections work, check eligibility, and vote confidently.',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard!");
            } catch (err) {
                showError("Failed to copy link.");
            }
        }
    });
}

function renderFAQs() {
    if (!appData || !appData.faqs || !domElements.faqContainer) return;

    domElements.faqContainer.innerHTML = '';

    appData.faqs.forEach(faq => {
        const item = document.createElement('div');
        item.className = "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200";

        item.innerHTML = `
            <button class="faq-btn w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none" aria-expanded="false">
                <span class="font-medium text-gray-900 dark:text-gray-100">${faq.question}</span>
                <i class="fa-solid fa-chevron-down text-gray-400 transition-transform duration-300"></i>
            </button>
            <div class="faq-content px-6 pb-4 text-gray-600 dark:text-gray-400 text-sm hidden">
                ${faq.answer}
            </div>
        `;

        domElements.faqContainer.appendChild(item);
    });

    document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');

            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

if (domElements.chatbotFab) {
    domElements.chatbotFab.addEventListener('click', () => {
        domElements.chatbotWindow.classList.toggle('hidden');
        setTimeout(() => {
            domElements.chatbotWindow.classList.toggle('chatbot-visible');
            if (domElements.chatbotWindow.classList.contains('chatbot-visible') && domElements.chatMessages.children.length === 0) {
                if (appData?.chatbot?.greeting) {
                    addChatMessage(appData.chatbot.greeting, false);
                }
            }
        }, 10);
    });
}

if (domElements.closeChatbot) {
    domElements.closeChatbot.addEventListener('click', () => {
        domElements.chatbotWindow.classList.remove('chatbot-visible');
        setTimeout(() => {
            domElements.chatbotWindow.classList.add('hidden');
        }, 300);
    });
}

function addChatMessage(text, isUser) {
    if (!domElements.chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex w-full mb-3 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`;

    if (isUser) {
        msgDiv.innerHTML = `<div class="bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100 px-3 py-2 rounded-2xl rounded-br-sm text-sm max-w-[80%]">${text}</div>`;
    } else {
        msgDiv.innerHTML = `
            <div class="flex items-end gap-2 max-w-[85%]">
                <div class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] flex-shrink-0"><i class="fa-solid fa-robot"></i></div>
                <div class="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-2xl rounded-bl-sm text-sm">${text}</div>
            </div>
        `;
    }
    domElements.chatMessages.appendChild(msgDiv);
    domElements.chatMessages.scrollTop = domElements.chatMessages.scrollHeight;
}

function getBestResponse(input) {
    if (!appData?.chatbot) return "I'm sorry, I'm not ready yet.";
    const lower = input.toLowerCase();

    const intents = [
        { keywords: ['eligible', 'age', '18'], response: appData.chatbot.responses.eligible, section: 'eligibility' },
        { keywords: ['register', 'form'], response: appData.chatbot.responses.register, section: 'registration' },
        { keywords: ['vote', 'process'], response: appData.chatbot.responses.vote, section: 'voting-process' },
        { keywords: ['where', 'location', 'station'], response: appData.chatbot.responses.where, section: 'polling' }
    ];

    for (let intent of intents) {
        if (intent.keywords.some(k => lower.includes(k))) {
            scrollToSection(intent.section);
            return intent.response;
        }
    }

    return appData.chatbot.fallback;
}

async function getAIResponse(userInput) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: contextPrompt + "\nUser: " + userInput }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200
                }
            })
        });

        const data = await response.json();
        console.log("Gemini response:", data);

        if (!response.ok) {
            console.error("API ERROR:", data);
            return null;
        }

        return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (error) {
        console.error("Gemini error:", error);
        return null;
    }
}

async function handleChatLogic(text) {
    addChatMessage("Typing...", false);

    let reply = await getAIResponse(text);

    // Fallback to existing logic if AI fails
    if (!reply) {
        reply = getBestResponse(text);
    }

    setTimeout(() => {
        // Remove typing indicator (which is the last message added)
        if (domElements.chatMessages.lastChild) {
            domElements.chatMessages.lastChild.remove();
        }

        addChatMessage(reply, false);
    }, 400);
}

if (domElements.chatSend) {
    domElements.chatSend.addEventListener('click', () => {
        const text = domElements.chatInput.value.trim();
        if (text) {
            addChatMessage(text, true);
            domElements.chatInput.value = '';
            handleChatLogic(text);
        }
    });
}

if (domElements.chatInput) {
    domElements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') domElements.chatSend.click();
    });
}

// Voice Input Logic
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition && domElements.chatMic) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    domElements.chatMic.addEventListener('click', () => {
        recognition.start();
        domElements.chatMic.classList.add('text-red-500', 'animate-pulse');
        domElements.chatMic.classList.remove('text-gray-500');
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        domElements.chatInput.value = transcript;
        domElements.chatMic.classList.remove('text-red-500', 'animate-pulse');
        domElements.chatMic.classList.add('text-gray-500');
        domElements.chatSend.click();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        domElements.chatMic.classList.remove('text-red-500', 'animate-pulse');
        domElements.chatMic.classList.add('text-gray-500');
        showToast("Voice input failed. Please try again.");
    };

    recognition.onend = () => {
        domElements.chatMic.classList.remove('text-red-500', 'animate-pulse');
        domElements.chatMic.classList.add('text-gray-500');
    }
} else if (domElements.chatMic) {
    domElements.chatMic.style.display = 'none';
}

document.querySelectorAll('.chat-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.innerText;
        addChatMessage(text, true);
        handleChatLogic(text);
    });
});

function initChatbot() {
    // Initialized on FAB click
}

// ==============================
// FIREBASE / DATA HANDLING
// ==============================

async function saveUserInteraction(age, isEligible) {
    try {
        if (window.db && window.addDoc && window.collection) {
            await window.addDoc(window.collection(window.db, "user_checks"), {
                age,
                isEligible,
                timestamp: new Date()
            });
        }
    } catch (error) {
        console.error("Firestore error:", error);
    }
}

async function fetchUserChecks() {
    try {
        if (!window.db || !window.getDocs) return;

        const snapshot = await window.getDocs(window.collection(window.db, "user_checks"));
        const total = snapshot.size;

        let eligibleCount = 0;
        let notEligibleCount = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.isEligible) eligibleCount++;
            else notEligibleCount++;
        });

        const statsEl = document.getElementById('stats-text');
        if (statsEl) {
            statsEl.innerText = `Total Checks: ${total}\nEligible: ${eligibleCount}\nNot Eligible: ${notEligibleCount}`;
        }
    } catch (err) {
        console.error("Read error:", err);
    }
}

fetchUserChecks();

// ==============================
// UTILITIES
// ==============================

function showToast(msg) {
    if (!domElements.toast || !domElements.toastMsg) return;
    domElements.toastMsg.innerText = msg;
    domElements.toast.classList.remove('opacity-0', 'translate-y-24');

    setTimeout(() => {
        domElements.toast.classList.add('opacity-0', 'translate-y-24');
    }, 3000);
}

function showError(message) {
    showToast(message);
}

if (typeof module !== "undefined") {
    module.exports = { checkEligibilityLogic, validateAge, isEligibleUser };
}
