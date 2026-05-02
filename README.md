# 🗳️ Election Guide Assistant

## 🚀 Live Demo

https://election-assistant-732648848318.us-central1.run.app/

---

## 🌍 Problem Statement

First-time voters in India often struggle with understanding eligibility, registration procedures, and the voting process. Information is scattered, complex, and not always accessible in regional languages, leading to confusion and reduced participation.

---

## 🎯 Chosen Vertical

**Civic Technology & Social Good** (Voter Education & Empowerment)

---

## 💡 Solution

**Election Guide Assistant** is an AI-assisted civic-tech platform that simplifies voter education through an interactive, user-friendly interface. It provides step-by-step guidance, real-time assistance, and localized support to help users confidently participate in elections.

---

## 🧠 Approach & Logic / How It Works

1. **User Interaction**
   Users interact via a clean, structured UI or through the floating assistant chatbot.

2. **Logic Processing**
   The system processes input using rule-based logic and dynamic `JSON` data to determine user needs (e.g., eligibility checking).

3. **Guided Experience**
   Interactive elements automatically scroll and highlight relevant sections, creating a seamless user journey.

4. **Service Integration**
   External Google services enhance functionality without requiring users to leave the platform.

---

## 🚀 Key Features

### 🤖 Smart Assistant

* Floating chatbot for instant guidance
* Keyword-based navigation to relevant sections
* Helps users with eligibility, registration, and voting queries

### ✅ Eligibility Checker

* Dynamically checks voter eligibility
* Guides users to the next step

### 🌐 Multi-Language Support

* English, Hindi, Bengali
* Improves accessibility across regions

### 🗺️ Polling Station Finder

* Google Maps integration
* Shows nearby polling stations

### ⏰ Voting Reminder

* Google Calendar integration
* One-click reminder setup

### 📢 Share Feature

* Uses Web Share API
* Promotes awareness easily

---

## 🛠️ Tech Stack

* **Frontend**: HTML5, Vanilla JavaScript
* **Styling**: Tailwind CSS
* **Data Handling**: JSON
* **Icons**: FontAwesome

---

## ☁️ Google Services Used

* **Google Cloud Run** → Deployment & hosting
* **Firebase Analytics** → User interaction tracking
* **Google Maps (Embed API)** → Polling station visualization
* **Google Calendar** → Voting reminder integration

---

## 🧪 Testing

✔ Unit testing implemented using Node.js
✔ Covers eligibility logic and edge cases

Run tests using:

```bash
npm test
```

---

## 🔮 Future Enhancements

* AI-based candidate comparison system
* Fake news detection
* Constituency-level analytics
* Backend integration with real-time datasets

---

## ⚙️ How to Run Locally

1. Clone the repository
2. Ensure all files are in the same folder
3. Run using a local server:

```bash
python -m http.server 8000
```

4. Open:

```
http://localhost:8000
```

---

## ⚠️ Assumptions

* Election date is a placeholder
* Google Maps uses iframe (no API key required)
* Candidate data redirects to official ECI website

---

## 👩‍💻 Author

**Anisha Majumdar**
