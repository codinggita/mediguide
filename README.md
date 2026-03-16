# 🏥 MediGuide – AI Healthcare Navigator

MediGuide is a **full-stack healthcare navigation platform** that helps users understand possible health conditions based on symptoms and discover nearby hospitals with estimated treatment costs. The application simplifies healthcare decision-making by providing a centralized platform for symptom search, hospital discovery, and healthcare planning.

This project demonstrates a **modern full stack architecture** using React, Node.js, Express, and MongoDB while implementing essential features commonly used in real-world applications such as authentication, routing, state management, filtering, pagination, and CRUD operations.

---

# 📌 Problem Statement

Many people face confusion when they experience health symptoms and do not know:

- Which **doctor or specialist** they should consult  
- Which **hospital or clinic** is available nearby  
- The **approximate cost of tests or treatments**  
- How to quickly **plan their healthcare visits**

This issue becomes more serious for **travelers or people who are new to a city**, as they may not be familiar with nearby healthcare facilities.

As a result, patients often spend significant time searching for hospitals or medical guidance, which can lead to **delayed treatment and unnecessary stress**.

---

# 💡 Solution

MediGuide provides a **digital healthcare navigation platform** where users can:

- Enter symptoms and receive guidance on possible conditions  
- Discover nearby hospitals and clinics  
- Filter and sort hospitals based on cost or specialization  
- Save preferred hospitals for future reference  

The platform acts as a **healthcare guidance and planning tool**, enabling users to make informed healthcare decisions quickly.

⚠️ *Note: MediGuide does not provide medical diagnosis. It only assists users in navigating healthcare services.*

---

# 🚀 Features

## 🔐 Authentication System
- User signup and login
- Password validation
- LocalStorage-based authentication
- Protected routes for logged-in users

## 🧭 Routing & Navigation
- Client-side routing using **React Router**
- Pages include:
  - Home
  - Login
  - Signup
  - Dashboard
  - Profile
  - Settings

## ⚛️ React Hooks
The application demonstrates the use of important React Hooks:

- **useState** – Managing component state  
- **useEffect** – Handling API requests and side effects  
- **useRef** – Managing DOM references and input focus  
- **useContext** – Sharing global state across components  

## 🌍 Global State Management
Global state is managed using **Context API**, allowing shared application data such as:

- User authentication state
- Theme preferences
- Search results

## 🎨 Theme Support
- Dark Mode / Light Mode toggle
- Theme preference persistence using LocalStorage

## 🔍 Search, Filtering & Sorting
Users can:

- Search hospitals by symptoms or location  
- Filter hospitals by specialization or cost  
- Sort hospitals based on rating, cost, or distance  

## ⚡ Debouncing
Debouncing is implemented in search functionality to prevent excessive API calls while the user is typing.

## 📄 Pagination
Hospital results are displayed using pagination to efficiently handle large datasets.

## 🔄 CRUD Operations
The platform supports full database operations:

- **Create** – Register new users or save hospitals  
- **Read** – Retrieve hospital data and user profiles  
- **Update** – Update user profile information  
- **Delete** – Remove saved hospitals or search history  

## 🔗 API Integration
REST APIs built with **Node.js and Express.js** handle:

- User authentication  
- Hospital data retrieval  
- Profile updates  
- Search functionality  

## 🧾 Form Handling & Validation
Forms include:

- Input validation  
- Error messages  
- Controlled components in React  
- Proper user feedback  

## 📱 Responsive UI
The user interface is fully responsive using **Tailwind CSS**, ensuring compatibility across:

- Desktop  
- Tablet  
- Mobile devices  

## ⚠️ Error Handling
Error handling is implemented through:

- Backend try–catch blocks  
- API error responses  
- Frontend error messages  

---

# 🛠 Tech Stack

## Frontend
- ReactJS  
- Tailwind CSS  
- React Router  

## Backend
- Node.js  
- Express.js  

## Database
- MongoDB  

## State Management
- Context API  

## Other Tools
- REST APIs  
- LocalStorage Authentication  

---

# 🌍 Real-World Impact

MediGuide aims to improve healthcare accessibility by:

- Helping users quickly locate nearby hospitals  
- Reducing confusion when users experience health symptoms  
- Supporting healthcare planning with estimated treatment information  
- Assisting travelers and new residents in navigating local healthcare services  

---

# 🔮 Future Improvements

Possible future enhancements include:

- Online doctor appointment booking  
- Multi-language support  
- Health insurance integration  
- Telemedicine consultation  
- Real-time hospital availability tracking  

---

# 👩‍💻 Author

**Yashvi Kanani**

🌐 Live Project:
https://mediguide-project1.vercel.app/
