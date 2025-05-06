src/
│
├── assets/                # Images, icons, logos
├── components/            # Reusable UI components
│   ├── Sidebar.jsx/
│   ├── Topbar.jsx/
│   ├── RouteCard.jsx/
│   ├── RouteMap.jsx/
│   ├── RouteDetails.jsx/
│   ├── DriverSuggestion.jsx/
│   ├── StatusTag.jsx/
│   ├── ParcelItem.jsx/
│   └── Buttons.jsx/
│
├── pages/                 # 
│   ├── Dashboard/
│       └── Dashboard.jsx
│   ├── PlanRoute/
│       └── PlanRoute.jsx
│   ├── Courier/
│       └── Courier.jsx
│   ├── Fleet/
│       └── Fleet.jsx
│   ├── Notification/
│       └── Notification.jsx
│   ├── Finance/
│       └── Finance.jsx
│   ├── Driver/
│       └── Driver.jsx
│   ├── Report/
│       └── Report.jsx
│   ├── Support/
│       └── Support.jsx
│   └── Auth/
│       ├── Login.jsx
│       └── ForgotPassword.jsx
│
├── routes/                # Route configuration (React Router)
│   └── AppRoutes.jsx
│
├── context/               # Context API (Auth, Theme, etc.)
│   └── AuthContext.jsx
│
├── hooks/                 # Custom React hooks
├── utils/                 # Helper functions and constants
├── styles/                # Global styles, themes, variables
├── App.jsx
└── main.jsx               # Entry point



🌐 Pages (Main Sections)
Dashboard

Overview of total orders, active routes, driver performance, parcel stats

Plan Route

Region selection (East, West, North, Central)

Route details (list of stops)

Route map with paths

Driver suggestions and assignment

Courier Management

Add/Edit Couriers

View courier routes and statuses

Fleet Management

Vehicle info

Capacity tracking

Maintenance logs

Notifications

System alerts

Route changes

Delivery updates

Finance

Delivery cost breakdown

Driver payment tracking

Fuel/logistics expenses

Driver Management

Driver profiles

Rating and reviews

Last service logs

Reports

Daily, Weekly, Monthly performance reports

Export/download functionality

Support Page

FAQ, live chat, contact form

Authentication Pages

Login / Logout

Forgot password

🧩 UI Components
Sidebar Navigation (with icons)

Top Bar

Profile dropdown

Notifications bell

Region selector

Route List Panel (left panel)

Collapsible route cards with status tags (Completed, Draft, Pending)

Parcel details inside each route

"Find Driver" button

Map Panel

Interactive route drawing

Labels for stops

Route Details Card

Item quantity, destination, total hour, distance, status

Buttons: "Reset", "Switch to Manual"

Driver Suggestion Card

Driver info: name, ID, capacity, rating, last service

Photo thumbnail

Pagination (Prev/Next)

"Schedule Job" button

Status Tags

Draft, Pending, Completed

Toggle Menus / Dropdowns

Region switcher

Route status dropdown

Buttons

Primary (e.g. “Schedule Job”)

Secondary (e.g. “Reset”, “Switch to Manual”)