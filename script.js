// Global Data
let appData = null;
let currentLang = 'en';

// DOM Elements
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Theme Preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.classList.add('dark');
    } else {
        htmlEl.classList.remove('dark');
    }

    // 2. Fetch Data
    try {
        const response = await fetch('data.json');
        appData = await response.json();
        
        // Initialize Components
        initLanguage();
        renderFAQs();
        initChatbot();
        
    } catch (err) {
        console.error("Failed to load data:", err);
    }
});

// ==========================================
// THEME & NAV & LANGUAGE TOGGLE
// ==========================================

themeToggle.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');
    if (htmlEl.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
});

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

langToggle.addEventListener('change', (e) => {
    currentLang = e.target.value;
    updateLanguage();
});

function initLanguage() {
    // Try to get saved language
    const savedLang = localStorage.getItem('appLang');
    if (savedLang && appData.translations[savedLang]) {
        currentLang = savedLang;
        langToggle.value = currentLang;
    }
    updateLanguage();
}

function updateLanguage() {
    localStorage.setItem('appLang', currentLang);
    const trans = appData.translations[currentLang];
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (trans[key]) {
            el.innerText = trans[key];
        }
    });
}

// ==========================================
// SCROLLING & FLOW AWARENESS
// ==========================================

// Global function used by HTML buttons
window.scrollToSection = function(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
        // Find the card inside the section to highlight, or highlight the section itself
        const targetHighlight = el.querySelector('.bg-white, .bg-gray-800') || el;
        
        el.scrollIntoView({ behavior: 'smooth' });
        
        // Flow Awareness Highlight
        setTimeout(() => {
            targetHighlight.classList.remove('highlight-pulse');
            // Trigger reflow
            void targetHighlight.offsetWidth;
            targetHighlight.classList.add('highlight-pulse');
            
            // Remove class after animation
            setTimeout(() => {
                targetHighlight.classList.remove('highlight-pulse');
            }, 1500);
        }, 500);
    }
};

// Navbar active state on scroll
window.addEventListener('scroll', () => {
    // Navbar styling
    if (window.scrollY > 20) {
        navbar.classList.add('shadow-md');
    } else {
        navbar.classList.remove('shadow-md');
    }

    // Active link highlighting
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
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

// ==========================================
// ELIGIBILITY CHECKER
// ==========================================
function checkEligibilityLogic(age) {
    return age >= 18;
}

const ageInput = document.getElementById('age-input');
const checkAgeBtn = document.getElementById('check-age-btn');
const eligResult = document.getElementById('eligibility-result');
const resIcon = document.getElementById('result-icon');
const resTitle = document.getElementById('result-title');
const resDesc = document.getElementById('result-desc');
const resActions = document.getElementById('result-actions');

checkAgeBtn.addEventListener('click', () => {
    const age = parseInt(ageInput.value);
    if (isNaN(age) || age < 0) {
        showToast("Please enter a valid age.");
        return;
    }

    eligResult.classList.remove('hidden');
    resActions.innerHTML = ''; // Clear old buttons

    if (!checkEligibilityLogic(age)) {
        eligResult.className = "mt-8 text-center p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 animate-fade-in";
        resIcon.innerHTML = '<i class="fa-solid fa-clock text-red-500"></i>';
        resTitle.innerText = "Not Eligible Yet";
        resTitle.className = "text-2xl font-bold mb-2 text-red-700 dark:text-red-400";
        resDesc.innerText = `You are ${age} years old. The voting age in India is 18. You will be eligible in ${18 - age} year(s). Stay informed!`;
        
        // Next Step
        resActions.innerHTML = `<button onclick="scrollToSection('why-vote')" class="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-200 transition-colors">Why Voting Matters</button>`;
    } else {
        eligResult.className = "mt-8 text-center p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 animate-fade-in";
        resIcon.innerHTML = '<i class="fa-solid fa-check-circle text-green-500"></i>';
        resTitle.innerText = "You Are Eligible!";
        resTitle.className = "text-2xl font-bold mb-2 text-green-700 dark:text-green-400";
        resDesc.innerText = "As an Indian citizen aged 18 or above, you have the right to vote. Make sure you are registered.";
        
        // Next Steps (Flow Awareness)
        resActions.innerHTML = `
            <button onclick="scrollToSection('registration')" class="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">Go to Registration</button>
            <button onclick="scrollToSection('voting-process')" class="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Learn Voting Process</button>
        `;
    }
});

// ==========================================
// POLLING STATION FINDER
// ==========================================
const locationInput = document.getElementById('location-input');
const findStationBtn = document.getElementById('find-station-btn');
const mapPlaceholder = document.getElementById('map-placeholder');
const mapIframe = document.getElementById('map-iframe');

findStationBtn.addEventListener('click', () => {
    const loc = locationInput.value.trim();
    if (!loc) {
        showToast("Please enter your area or polling station name.");
        return;
    }
    
    // Safely embed map using dataless google maps link
    const query = encodeURIComponent(`Polling stations near ${loc}`);
    const src = `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    
    mapPlaceholder.classList.add('hidden');
    mapIframe.src = src;
    mapIframe.classList.remove('hidden');
});

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') findStationBtn.click();
});

// ==========================================
// GOOGLE CALENDAR INTEGRATION
// ==========================================
const calendarBtn = document.getElementById('calendar-btn');
calendarBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const text = encodeURIComponent("Election Voting Reminder");
    const details = encodeURIComponent("It's election day! Don't forget to carry your Voter ID (or approved alternative ID) to the polling station. Your voice matters!");
    const startDate = "20260501T080000"; 
    const endDate = "20260501T180000";   
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startDate}/${endDate}&details=${details}`;
    window.open(url, '_blank');
});

// ==========================================
// SHARE FEATURE
// ==========================================
const shareBtn = document.getElementById('footer-share-btn');
shareBtn.addEventListener('click', async () => {
    const shareData = {
        title: 'Election Guide Assistant',
        text: 'Learn how elections work, check eligibility, and vote confidently.',
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log('Error sharing:', err);
        }
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast("Link copied to clipboard!");
        });
    }
});

// ==========================================
// TOAST NOTIFICATION
// ==========================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    
    // Reset classes
    toast.classList.remove('opacity-0', 'translate-y-24');
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-24');
    }, 3000);
}

// ==========================================
// FAQs
// ==========================================
function renderFAQs() {
    const container = document.getElementById('faq-container');
    container.innerHTML = '';
    
    if (!appData || !appData.faqs) return;
    
    appData.faqs.forEach((faq, index) => {
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
        
        container.appendChild(item);
    });

    // Add toggle logic
    document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            
            if (content.classList.contains('hidden')) {
                // Close others (optional accordion behavior)
                // document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
                // document.querySelectorAll('.faq-btn i').forEach(i => i.style.transform = 'rotate(0deg)');
                
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// ==========================================
// FLOATING CHATBOT
// ==========================================
const chatbotFab = document.getElementById('chatbot-fab');
const chatbotWindow = document.getElementById('chatbot-window');
const closeChatbot = document.getElementById('close-chatbot');
const chatMessages = document.getElementById('chatbot-messages');
const chatInput = document.getElementById('chatbot-input');
const chatSend = document.getElementById('chatbot-send');

chatbotFab.addEventListener('click', () => {
    chatbotWindow.classList.toggle('hidden');
    // small delay to allow display:block to apply before animating opacity/transform
    setTimeout(() => {
        chatbotWindow.classList.toggle('chatbot-visible');
        if (chatbotWindow.classList.contains('chatbot-visible') && chatMessages.children.length === 0) {
            addChatMessage(appData.chatbot.greeting, false);
        }
    }, 10);
});

closeChatbot.addEventListener('click', () => {
    chatbotWindow.classList.remove('chatbot-visible');
    setTimeout(() => {
        chatbotWindow.classList.add('hidden');
    }, 300); // match tailwind transition duration
});

function addChatMessage(text, isUser) {
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
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatLogic(text) {
    const lower = text.toLowerCase();
    let reply = appData.chatbot.fallback;
    
    if (lower.includes('eligibl') || lower.includes('age') || lower.includes('old')) {
        reply = appData.chatbot.responses.eligible;
        scrollToSection('eligibility');
    } else if (lower.includes('register') || lower.includes('form')) {
        reply = appData.chatbot.responses.register;
        scrollToSection('registration');
    } else if (lower.includes('vote') || lower.includes('process') || lower.includes('how')) {
        reply = appData.chatbot.responses.vote;
        scrollToSection('voting-process');
    } else if (lower.includes('where') || lower.includes('station') || lower.includes('location')) {
        reply = appData.chatbot.responses.where;
        scrollToSection('polling');
    }
    
    setTimeout(() => {
        addChatMessage(reply, false);
    }, 600);
}

chatSend.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
        addChatMessage(text, true);
        chatInput.value = '';
        handleChatLogic(text);
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') chatSend.click();
});

// Quick Buttons
document.querySelectorAll('.chat-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.innerText;
        addChatMessage(text, true);
        handleChatLogic(text);
    });
});

function initChatbot() {
    // Already handled in FAB click, but guarantees data is loaded
}

// Export for Node.js testing
if (typeof module !== "undefined") {
    module.exports = { checkEligibilityLogic };
}
