# 🗳️ Election Guide Assistant

## 🌍 Problem Statement

First-time voters in India often struggle with understanding eligibility, registration procedures, and the voting process. Information is scattered, complex, and not always accessible in regional languages, leading to confusion and reduced participation.

---

## 🎯 Chosen Vertical

**Civic Technology & Social Good** (Voter Education & Empowerment).

---

## 💡 Solution

**Election Guide Assistant** is an AI-powered civic-tech platform that simplifies voter education through an interactive, user-friendly interface. It provides step-by-step guidance, real-time assistance, and localized support to help users confidently participate in elections.

---

## 🧠 Approach & Logic / How It Works

1. **User Interaction**: Users interact via a clean, structured UI or through the floating AI chatbot.
2. **Logic Processing**: The system processes input using predefined logic and dynamic `JSON` data to determine the user's needs (e.g., age verification for eligibility).
3. **Contextual Guidance**: Relevant guidance is displayed instantly. Interactive elements automatically scroll and highlight subsequent relevant sections, creating a guided experience.
4. **Service Integration**: External services (Google Maps for polling stations, Google Calendar for reminders) seamlessly enhance the user's journey without leaving the platform.

---

## 🚀 Key Features

### 🤖 AI Assistant
* Floating chatbot for instant guidance
* Keyword-based navigation to relevant sections
* Helps users with queries like eligibility, documents, and voting steps

### ✅ Eligibility Checker
* Dynamically checks voter eligibility based on user age
* Guides users to the next logical step (e.g., registration or viewing candidate info)

### 🌐 Multi-Language Support
* Supports English, Hindi, and Bengali
* Improves accessibility for diverse users across different regions

### 🗺️ Polling Station Finder
* Uses Google Maps integration
* Displays nearby polling stations based on user location input

### ⏰ Voting Reminder
* One-click Google Calendar integration
* Helps users remember election day with automated event creation

### 📢 Share Feature
* Uses native Web Share API for easy awareness spreading among peers

---

## 🛠️ Tech Stack

* **Frontend Core**: HTML5, Vanilla JavaScript
* **Styling**: Tailwind CSS (via CDN)
* **Data Handling**: JSON (for storing translations, FAQs, and chatbot logic)
* **Icons**: FontAwesome

---

## ☁️ Google Services Used

1. **Google Maps**: Embedded iframe search (`https://maps.google.com/maps?q=...&output=embed`) to dynamically show nearby polling stations based on user input, ensuring safety without exposing an API key.
2. **Google Calendar**: Custom URL generation to create pre-filled events (Date, Title, Details) directly in the user's calendar.

---

## 🔮 Future Enhancements

* AI-based candidate comparison system
* Fake news detection module
* Constituency-level analytics
* Backend integration with real-time datasets

---

## ▶️ Live Demo

https://election-assistant-732648848318.us-central1.run.app/

---

## ⚙️ How to Run Locally

1. Clone or download this repository.
2. Ensure all files (`index.html`, `style.css`, `script.js`, `data.json`) are in the same folder.
3. Because the project fetches `data.json` using the Fetch API, opening `index.html` directly from the file system (e.g., `file://...`) may cause a CORS error in some browsers.
4. **Recommended Method**: Serve the files using a local web server.
   * If using VS Code, install the "Live Server" extension and click "Go Live".
   * Or use Python in your terminal:
     ```bash
     python -m http.server 8000
     ```
     Then open `http://localhost:8000` in your browser.

---

## ⚠️ Assumptions Made

* The Google Calendar reminder uses a placeholder fixed date.
* The Google Maps integration uses a dataless URL structure which safely provides a visual map without needing a paid API key for this frontend-only demonstration.
* Candidate lists are dynamic and sensitive; thus, the app safely redirects users to the official Election Commission of India (`eci.gov.in`) rather than hardcoding potentially inaccurate data.

---

## 👩‍💻 Author

**Anisha Majumdar**
