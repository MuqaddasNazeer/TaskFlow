
# 📋 Smart Task Manager

A minimal yet powerful productivity application that helps users manage tasks, track deadlines, and stay organized with categories and smart reminders. Built with a modular architecture using Node.js, SQLite, and vanilla JS, it offers core task management functionality and smart alerts.

---

## 🚀 How to Run the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-task-manager.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd smart-task-manager
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the backend server**
   ```bash
   node backend/server.js
   ```

5. **Open the frontend in browser**
   - Navigate to the `frontend` folder
   - Open `index.html` manually or use the Live Server extension in VS Code

---

## 🧠 Assumptions Made

- The app is intended for individual use on a single device (no cloud sync).
- Sessions are stored in `localStorage`; no token-based auth.
- SQLite is used for simplicity and fast setup.
- Unique emails are enforced during signup.
- Passwords must be at least 8 characters long and alphanumeric.
- Notification support depends on browser permission.
- App is designed for modern browsers with JavaScript enabled.

---

## ✅ Core Functionalities 

- Add / Edit / Delete tasks
- Set deadlines with smart multi-stage notifications:
  - ⏳ 1 hour before
  - ⏰ 10 minutes before
  - ⚠️ After task becomes overdue
- Categorize tasks (e.g., Personal, Work, Learning)
- Mark tasks as completed
- Filter tasks by category
- Display tasks grouped by status:
  - ✅ Completed
  - ⛔ Overdue
  - 🟠 In Progress
- Login and Signup with validation
- Prevent duplicate emails
- Enforce password strength (min 8 characters)
- Integrated frontend-backend architecture via REST API

---

## 🌟 Additional Features (Beyond Requirements)

- Dark mode toggle with saved state in `localStorage`
- Color-coded urgency indicators on task cards
- Task grouping into sections (Overdue, In Progress, Completed)
- Avatar display via [ui-avatars.com](https://ui-avatars.com)
- Smooth animations for task rendering
- Auto-refresh task list every 10 seconds
- Modular codebase with dedicated notification module
- Proper inline comments and separation of concerns

---

## 🗂️ Project Structure

```
smart-task-manager/
│
├── backend/
│   ├── db.js                  # SQLite DB initialization
│   ├── server.js              # Express server
│   └── routes/
│       ├── auth.js            # Login and Signup routes
│       └── tasks.js           # Task CRUD routes
│
├── frontend/
│   ├── index.html             # Login & Signup UI
│   ├── dashboard.html         # Main task UI
│   ├── style.css              # All styling
│   ├── script.js              # Auth scripts (tab switch, login/signup)
│   ├── dashboard.js           # Task creation, filters, UI logic
│   └── Notifications/
│       └── notifier.js        # Web notification logic
```

---

## 🎥 Demo Highlights

- **Authentication Flow**: Users register with a valid email and password. Duplicate emails are blocked. Passwords must meet strength rules.
- **Dashboard**: Shows personalized greeting and avatar.
- **Task Operations**: Users can create, edit, complete, or delete tasks. Tasks are grouped by urgency and completion status.
- **Notification System**: Smart reminders notify:
  - 1 hour before deadline
  - 10 minutes before deadline
  - When the task is overdue
- **Dark Mode**: Toggle between light and dark themes with persistent state.
- **Visual Feedback**: Task urgency is color-coded (e.g., red for overdue).
- **User-Friendly Design**: Responsive layout, clean UX, and auto-refresh for real-time updates.

---
## 🧪 Testing

To ensure the reliability and correctness of backend APIs, we implemented automated testing using **Jest** and **Supertest**.

The following core functionalities were tested:

- Task creation with valid inputs
- Retrieving tasks by user ID
- Updating existing tasks
- Verifying task filtering based on category

These tests help maintain code stability and ensure expected behavior during critical operations.


## 🧪 Improvements

- JWT-based secure authentication
- Password hashing with bcrypt
- Mobile responsiveness and PWA setup
- Real-time sync across devices
- Drag-and-drop task reordering
- Recurring tasks support
- Email-based notification system
- Search and sorting capabilities
- Kanban or calendar-based views
- Role-based user permissions
- Unit and integration testing (Jest)

---

## 👤 Author

**Muqaddas Nazeer**  
📧 Email: [muqaddasnazeer468@gmail.com](mailto:muqaddasnazeer468@gmail.com)  
🔗 LinkedIn: [linkedin.com/in/muqaddasnazeer](https://www.linkedin.com/in/muqaddasnazeer/)  
🌐 Portfolio: [muqaddas-nazeer-portfolio.netlify.app](https://muqaddas-nazeer-portfolio.netlify.app/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
