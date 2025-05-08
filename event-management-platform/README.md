# Event Management Platform

This is a web-based event management platform that allows users to create, manage, and participate in events. The platform is designed for event organizers and attendees, offering features like event creation, real-time updates, and user authentication.

# Features

- User authentication (sign up, login, logout)
- Event creation and management
- Real-time updates for event changes
- User profiles and event history
- Search and filter events
- RSVP functionality for events
- Notifications for event updates
- Admin panel for event organizers
- User feedback and ratings for events
- Responsive design for mobile and desktop

# Technologies

- Frontend: React, Redux, Axios, Socket.io, Cloudinary
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt
- Documentation: Postman, Markdown
- Version Control: Git, GitHub

# Installation

- Clone the repository:

```bash
git clone https://github.com/sagar-1m/Event-Engage.git
cd Event-Engage
```

- Install dependencies:

```bash
npm install
```

- Create a `.env` file in the root directory and add the following environment variables:

```bash
# Frontend
REACT_APP_DEFAULT_IMAGE=/images/default-event.jpg

# Backend
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

- Start the frontend

```bash
npm start
```

- Start the backend

```bash
npm run dev
```

# Usage

- Open your browser and navigate to `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend.
- Create an account or log in to your existing account.
- Create a new event or browse existing events.
- RSVP to events and receive notifications for updates.
- Provide feedback and ratings for events you attend.
- Use the admin panel to manage your events and view user feedback.
- Explore user profiles and event history.
- Search and filter events based on your preferences.
