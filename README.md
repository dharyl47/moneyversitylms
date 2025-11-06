# Moneyversity LMS - Estate Planning Admin Dashboard

An admin dashboard for managing and analyzing user estate planning journeys. This application provides comprehensive tools for tracking user progress through an estate planning flow, viewing analytics, and managing user profiles.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Main Pages](#main-pages)
- [Data Models](#data-models)
- [Stage System](#stage-system)
- [Filter System](#filter-system)
- [Dashboard Analytics](#dashboard-analytics)
- [API Routes](#api-routes)
- [Getting Started](#getting-started)

## 🎯 Overview

This is a Next.js admin dashboard application that allows administrators to:

- **View and manage user profiles** who are going through an estate planning journey
- **Track user progress** through multiple stages of estate planning
- **Analyze user data** with interactive charts and graphs
- **Export user data** to CSV format
- **Generate PDF reports** for individual users

The application focuses on two main pages:
1. **Dashboard** - Analytics and visualizations
2. **User Control** - User profile management and filtering

## 🛠 Tech Stack

- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript & JavaScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Charts**: Chart.js with react-chartjs-2
- **PDF Generation**: jsPDF, pdf-lib
- **CSV Export**: PapaParse

## 📁 Project Structure

```
src/app/
├── dashboard/          # Analytics dashboard page
├── user-control/       # User profile management page
├── components/         # Shared components (Layout, Sidebar, etc.)
├── models/            # Mongoose data models
├── api/               # API routes
│   ├── userprofiles/  # User profile CRUD operations
│   ├── downloadlogs/  # Download tracking
│   └── generatePdf/   # PDF generation
└── lib/               # Utility functions (MongoDB connection)
```

## 📄 Main Pages

### 1. Dashboard (`/dashboard`)

The Dashboard provides analytics and visualizations of user data.

**Features:**
- **Year Filter**: Filter all data by year (or view all years)
- **Completed Flow Chart**: Bar chart showing users who completed the journey per month
- **Users by Stage Chart**: Bar chart showing how many users are at each stage
- **User Growth Chart**: Line chart showing new users over time
- **Downloads Chart**: Bar chart tracking PDF report and template downloads per month
- **Template Breakdown Table**: Detailed breakdown of which templates were downloaded

**Key Logic:**
- A user is considered "completed" if they have **ANY** meaningful data in the `additionalConsideration` fields
- Statistics are recalculated when the year filter changes
- All charts are responsive and update dynamically

### 2. User Control (`/user-control`)

The User Control page allows administrators to view, filter, and manage user profiles.

**Features:**
- **Search**: Search users by name or email
- **Stage Filter**: Filter users by their current stage in the journey
- **Data Table**: Displays user information with pagination (10 items per page)
- **Actions**: View details, delete users, download PDF reports
- **CSV Export**: Export filtered results to CSV

**Key Components:**
- `DataTableV2`: Main table component with pagination and actions
- `ProfileModal`: Modal showing detailed user information
- `ConfirmationModal`: Confirmation dialog for deletions

## 🗄 Data Models

### UserProfile Model

The core data model that stores all user estate planning information.

**Location**: `src/app/models/UserProfile.js`

**Key Fields:**

#### Basic Information
- `firstName`, `sureName`, `name`, `age`
- `emailAddress`, `dateOfBirth`
- `maritalStatus`, `propertyRegime`
- `dateCreated` (timestamp)

#### Stage-Specific Data

**Personal Information:**
- `childrenOrDependents`, `adultDependents`
- `guardianNamed`, `estatePlanGoals`

**Net Worth Assessment:**
- `estateProfileV2`: Property, vehicle, business, valuables, debts
- `Assets`: Real estate, vehicles, valuables, investments, etc.
- `Liabilities`: Mortgages, loans, credit card debt, etc.
- `Policies`: Life insurance, health insurance, property insurance, etc.
- `InvestmentsPortfolio`: Stocks, bonds, mutual funds, retirement funds

**Estate Planning Goals:**
- `estateGoalsV2`: Asset distribution, care for dependents, tax minimization, etc.

**Estate Planning Tools:**
- `estateToolsV2`: Wills, trusts, donations, life insurance, digital assets
- `Trusts`: Trust-related information
- `InvestmentTrusts`: Investment trust details

**Tax Planning:**
- `estateTaxV2`: Estate duty, gains tax, income tax
- `EstateDuty`: Detailed estate duty information
- `ExecutorFees`: Executor fee policies
- `LiquidityPosition`: Liquidity sources and shortfall information

**Business Succession:**
- `businessV2`: Business plan, key person information
- `ownBusiness`: Boolean flag

**Living Will:**
- `livingWillV2`: Healthcare decisions, decision makers

**Additional Considerations:**
- `additionalConsideration`: The final stage fields
  - `contactLegalAdviser`
  - `legacyHeirlooms`, `legacyHeirloomsDetails`
  - `beneficiaryDesignations`
  - `executorRemuneration`
  - `informedNominated`
  - `prepaidFuneral`
  - `petCarePlanning`
  - `setAReminder`

**Other Models:**
- `DownloadLog`: Tracks PDF and template downloads
- `CallMeBack`: Call-back requests
- `User`: Admin user accounts

## 🎯 Stage System

The application tracks users through **11 stages** of the estate planning journey:

1. **Welcome** - Initial stage (no data collected)
2. **Personal Information** - Basic user details
3. **Net Worth Assessment** - Assets, liabilities, policies
4. **Estate Planning Goals** - User's estate planning objectives
5. **Choosing Estate Planning Tools** - Wills, trusts, insurance
6. **Tax Planning and Minimization** - Tax-related planning
7. **Business Succession Planning** - *Conditional* (only if `ownBusiness === 'Yes'`)
8. **Living Will and Healthcare Directives** - Healthcare planning
9. **Review of Foreign Assets** - Foreign asset review
10. **Additional Considerations** - Final considerations
11. **Final Review and Next Steps** - Completion stage

### How Stage Detection Works

**Location**: `src/app/user-control/_components/DataTableV2.js` and `src/app/user-control/page.jsx`

**Logic:**
1. The system uses a `stageFieldMap` that maps each stage to specific database fields
2. For each profile, it iterates through stages in order
3. It checks if the user has **any meaningful data** in the fields for that stage
4. The first stage with **no data** is considered the user's current stage
5. **Special Cases:**
   - **Business Succession Planning**: Only checked if `ownBusiness === 'Yes'`
   - **Completed Flow**: User has **all** `additionalConsideration` fields filled
   - **Welcome**: Always skipped (no data to check)

**Meaningful Data Check:**
- A field has "meaningful data" if it's not:
  - `null` or `undefined`
  - Empty string `""`
  - `"N/A"`
  - `false` (for booleans)
- For nested objects/arrays, it recursively checks if any nested value has meaningful data

**Example:**
```javascript
// If a user has filled firstName and age, but not sureName:
// Current Stage = "Personal Information" (still in progress)

// If a user has filled all Personal Information fields:
// Current Stage = "Net Worth Assessment" (moved to next stage)
```

## 🔍 Filter System

### User Control Filters

**Location**: `src/app/user-control/page.jsx`

**Search Filter:**
- Searches by user's full name (firstName + sureName) or email address
- Case-insensitive partial matching
- Updates in real-time as user types

**Stage Filter:**
- Dropdown with all 11 stages + "Show All" + "Completed Flow"
- Filters users whose `currentStage` matches the selected stage
- Uses the same `getCurrentStage()` logic as the table display
- **"Completed Flow"** filter shows users who have completed all stages

**Filter Logic:**
```javascript
// Filtered profiles = profiles that match BOTH:
1. Search text (name or email contains search term)
2. Stage filter (current stage matches selected stage)
```

**Performance:**
- Uses `useMemo` to compute filtered results
- Only recalculates when `profile`, `searchText`, or `selectedStage` changes
- Efficient for large datasets

### Dashboard Year Filter

**Location**: `src/app/dashboard/page.tsx`

- Filters all statistics by year
- Available years are dynamically generated from user profile `dateCreated` dates
- When changed, recalculates:
  - Completed flows per month
  - Users by stage
  - Property regime distribution
  - User growth
  - Download statistics

## 📊 Dashboard Analytics

### Charts Overview

All charts use **Chart.js** via `react-chartjs-2`.

#### 1. Completed Flow (Per Month)
- **Type**: Bar Chart
- **Data**: Count of users who completed the journey, grouped by month
- **Completion Logic**: User has **ANY** meaningful data in `additionalConsideration` fields
- **Format**: "Jan 2024", "Feb 2024", etc.

#### 2. Users in Progress
- **Type**: Bar Chart
- **Data**: Count of users at each stage
- **Logic**: Uses `mapSchemaToStage` to check which users have data in each stage's fields
- **Special Handling**: 
  - Business Succession Planning only counts if `ownBusiness === 'Yes'`
  - Final Review counts users with ANY Additional Considerations data

#### 3. Users who have started the journey
- **Type**: Line Chart
- **Data**: Total new users per month (based on `dateCreated`)
- **Shows**: User acquisition over time

#### 4. Downloads (Per Month)
- **Type**: Bar Chart (grouped)
- **Data**: 
  - User Reports (PDF downloads)
  - Resource Templates (template downloads)
- **Source**: `DownloadLog` model via `/api/downloadlogs`
- **Includes**: Template breakdown table showing individual template download counts

#### 5. Property Regime Distribution
- **Type**: Pie Chart (not currently displayed, but calculated)
- **Data**: Count of users by `propertyRegime` value

### Statistics Calculation

**Location**: `src/app/dashboard/page.tsx` - `calculateStatistics()` function

**Process:**
1. Filter profiles by selected year (if not "all")
2. Calculate completed flows by checking `additionalConsideration` fields
3. Map each stage to its database fields using `mapSchemaToStage`
4. Count users with meaningful data in each stage
5. Group data by month for time-based charts
6. Calculate download statistics from `DownloadLog` entries

**Key Helper Function:**
```javascript
hasMeaningfulData(obj): boolean
// Recursively checks if an object/array/primitive has meaningful data
// Returns false for null, undefined, "", "N/A", false
```

## 🔌 API Routes

### `/api/userprofiles`

**GET**: Fetch all user profiles
- Returns: `{ success: true, data: UserProfile[] }`
- Headers: Cache-Control disabled for real-time data

**DELETE**: Delete a user profile
- Body: `{ id: string }`
- Returns: `{ success: true }`

### `/api/downloadlogs`

**GET**: Fetch download logs
- Query params: `?year=2024` (optional)
- Returns: Download statistics and logs
- Used by Dashboard for download charts

### `/api/generatePdf`

**POST**: Generate PDF report for a user
- Body: User profile object
- Returns: PDF blob
- Used by "Download Report" button in User Control

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moneyveristylms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📝 Key Concepts for New Developers

### 1. Stage Detection is Consistent
The same `getCurrentStage()` logic is used in:
- User Control table display
- User Control stage filter
- Dashboard statistics

**Always use the same logic** to ensure consistency across the app.

### 2. Meaningful Data Check
The `hasMeaningfulData()` function is critical:
- Used to determine if a stage has been started
- Used to determine if a user has completed the flow
- Handles nested objects and arrays recursively

### 3. Business Succession Planning is Conditional
This stage is **skipped** if the user doesn't own a business (`ownBusiness !== 'Yes'`).

### 4. Completed Flow Definition
A user is "completed" if they have **ALL** 8 `additionalConsideration` fields filled:
- contactLegalAdviser
- legacyHeirlooms
- beneficiaryDesignations
- executorRemuneration
- informedNominated
- prepaidFuneral
- petCarePlanning
- setAReminder

### 5. Data Flow
```
MongoDB (UserProfile) 
  → API Route (/api/userprofiles)
    → Page Component (fetch on mount)
      → Filter/Process (useMemo)
        → Display Component (DataTableV2 or Charts)
```

### 6. Performance Considerations
- Filtering uses `useMemo` to avoid unnecessary recalculations
- Pagination limits table rendering to 10 items at a time
- Charts only recalculate when year filter changes
- API responses have cache-control disabled for real-time data

## 🐛 Debugging Tips

### Check User's Current Stage
```javascript
// In browser console on User Control page:
// The filteredProfiles are logged with their current stages
```

### Access Dashboard Data
```javascript
// In browser console on Dashboard page:
window.dashboardData
// Contains: completedUsers, incompleteUsers, allProfiles, statistics
```

### Verify Stage Field Mapping
Check `stageFieldMap` in:
- `src/app/user-control/_components/DataTableV2.js` (lines 44-123)
- `src/app/dashboard/page.tsx` (lines 226-455)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

When adding new stages or fields:
1. Update `UserProfile` model schema
2. Update `stageFieldMap` in both `DataTableV2.js` and `dashboard/page.tsx`
3. Update the stage dropdown in `user-control/page.jsx`
4. Test stage detection logic
5. Update this README

---

**Last Updated**: 2024
**Maintained By**: Development Team
