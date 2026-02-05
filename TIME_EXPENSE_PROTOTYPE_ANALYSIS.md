# Time & Expense Smart App - Prototype Analysis

Based on the Crawford & Company prototype HTML file.

## Key Features Overview

### 1. **User/Role Switching**
- **User Selector in Header** - Allows switching between different users/roles
- Each user has:
  - Name
  - Role (Senior Adjuster, Manager, Staff Adjuster, etc.)
  - Hourly rate (e.g., $180/hr)
  - Color-coded avatar with initials
- Users:
  - Sarah Johnson - Senior Adjuster - $180/hr
  - Mike Thompson - Manager - $250/hr
  - Jessica Chen - Staff Adjuster - $150/hr
  - David Martinez - Junior Adjuster - $100/hr
  - Emily Wilson - Administrative - $75/hr

### 2. **Main Navigation Sections**
- **Claims** - Active claims list
- **Configuration** - System settings
- **Reports** - Reporting section

### 3. **Claims List View**
Shows all active claims with:
- Claim Number (clickable link)
- Claimant Name
- Carrier
- Type (Property, Auto, etc.)
- Total Hours
- Total Amount
- Status Badge (Open, Pending Review, Billed, etc.)
- Search functionality
- Filter by status

Sample Claims:
- CLM-2024-1047 - Johnson Property LLC - State Farm - $2,650
- CLM-2024-1048 - Smith Residence - Allstate - $1,890
- CLM-2024-1049 - Martinez Auto Claim - Progressive - $3,240
- CLM-2024-1050 - Anderson Home - Travelers - $4,125
- CLM-2024-1051 - Wilson Property - Liberty Mutual - $2,280

### 4. **Claim Detail View (Time & Billing)**

#### **Claim Header**
- Claim Number
- Claimant Name
- Status Badge
- Claim Metadata:
  - Carrier
  - Type (Property - Water Damage, etc.)
  - Your Rate (role-based)
  - Adjuster Name

#### **Billing Summary Cards (4 Cards)**
1. **Total Hours** - Shows total hours logged with trend
2. **Amount Billed** - Total billed amount with pending amount
3. **Auto-Captured** - Auto-captured time/amount percentage
4. **Expenses** - Expense amounts (Mileage + Photos, etc.)

#### **Assure Claims Integration Panel**
- **Event Feed** - Shows real-time events from Assure Claims
- **Live Status** indicator (green dot)
- **Event Metrics:**
  - Number of events for this claim
  - Total auto-billed amount
  - Events pending review
- Background: Blue gradient (#1a237e to #283593)

### 5. **Time Entry Methods (3 Types)**

#### **A. Manual Entry**
- Activity dropdown
- Duration (hours) input
- Date picker
- Notes textarea
- Real-time amount calculation (duration × rate)
- Icon: ✏️
- Modal form

#### **B. Timer Entry**
- Start/Pause/Resume timer
- Live elapsed time display (HH:MM:SS)
- Real-time amount calculation
- Activity selection
- Save timer to entries
- Icon: ⏱️
- Modal interface

#### **C. Auto Events (Assure Claims)**
- Automatic capture from Assure Claims events
- System-generated entries
- Configurable event triggers
- Fixed amounts per event type
- Icon: ⚡
- No user input required

### 6. **Time & Billing Entries List**

**Columns:**
- Type indicator (icon: manual/timer/auto)
- Entry Title
- Activity Code
- Time/Date
- User Name
- Role
- Rate
- Duration (hours)
- Amount ($)
- Status (Pending/Approved/Billed)

**Entry Types:**
- **Manual** - User-created entries
- **Timer** - Timer-based entries
- **Auto** - System auto-captured events

**Sample Entries:**
1. Document Upload (Auto) - 0.25h - $45.00 - Pending
2. Site Inspection (Timer) - 2.5h - $625.00 - Approved
3. Phone Call with Claimant (Manual) - 0.5h - $90.00 - Approved
4. Status Change (Auto) - 0h - $30.00 - Billed
5. Email Sent to Carrier (Auto) - 0h - $22.50 - Billed

**Filter Options:**
- All Types
- Manual only
- Timer only
- Auto Events only

### 7. **Configuration Section**

#### **Tab 1: Role Levels & Billing Rates**
Manage user roles and their billing rates:
- Role Level (e.g., Senior Adjuster)
- Description
- Default Rate ($/hr)
- Minimum Time Increment (6 min, 15 min, etc.)
- Status (Active/Inactive)
- Actions (Edit/Delete)

Example Roles:
- Senior Adjuster - $180/hr - 6 min increments
- Manager - $250/hr - 15 min increments
- Staff Adjuster - $150/hr - 6 min increments
- Junior Adjuster - $100/hr - 15 min increments
- Administrative - $75/hr - 15 min increments

#### **Tab 2: Carrier-Specific Rate Configuration**
Override rates for specific carriers:
- Carrier Name
- Override Rule (specific carriers can have different rates)
- Role-specific rates per carrier
- Effective dates

#### **Tab 3: Activity Codes & Task Types**
Configurable activity codes for time tracking:
- Activity Code
- Activity Name
- Category (Investigation, Communication, Admin, etc.)
- Billable (Yes/No)
- Default Duration
- Auto-capture Enabled
- Status

Example Activities:
- INVESTIGATION - Site Inspection - Billable
- PHONE_CALL_CLAIMANT - Phone Call - Claimant - Billable
- DOC_REVIEW - Document Review - Billable
- EMAIL_CORR - Email Correspondence - Billable
- STATUS_CHANGE - Status Change - Auto (may not be billable)

#### **Tab 4: Expense Types**
Configure expense categories:
- Code (e.g., MILE, PHOTO)
- Expense Type Name
- Category (Travel, Equipment, etc.)
- Rate Type (Per Mile, Flat Fee, Markup %, Pass-through)
- Rate/Markup amount
- Max Amount allowed
- Receipt Required (Yes/No)
- Status

Example Expense Types:
- MILE - Mileage - Travel - $0.67/mile
- PHOTO - Photography - Equipment - Flat $50
- LODGING - Hotel/Lodging - Travel - Pass-through - Max $200
- MEALS - Meals - Travel - Flat $50/day
- PARKING - Parking Fees - Travel - Pass-through

#### **Tab 5: Assure Claims Event Triggers**
Configure which Assure Claims events auto-create billing entries:
- Event Type
- Description
- Auto-Capture (Yes/No)
- Billing Amount (fixed or calculated)
- Activity Code mapping
- Role requirements
- Status

Example Events:
- Document Upload → Auto-bill $45
- Status Change → Auto-bill $30
- Email Sent → Auto-bill $22.50
- Phone Log Created → Auto-bill based on duration
- Note Added → May or may not bill
- Estimate Updated → Auto-bill $60

### 8. **Reports Section**
- Time & Expense reports
- Billable hours by adjuster
- Revenue by claim
- Activity breakdown
- Auto-capture vs manual analysis

## Key Design Patterns

### **Color Scheme**
- Header: Dark gray (#293e40)
- Primary Blue: #68b3c8
- Success Green: #388e3c
- Warning Orange: #f57c00
- Error Red: #d32f2f
- Purple (Manager): #7b1fa2
- Gray (Admin): #9e9e9e
- Assure Panel: Blue gradient (#1a237e to #283593)

### **Status Badges**
- Open - Blue
- Pending Review - Orange
- Approved - Green
- Billed - Purple
- Rejected - Red

### **Typography**
- Font: SourceSansPro, Helvetica Neue, Arial
- Base size: 14px
- Colors: #293e40 (dark gray)

### **Layout**
- Header: 48px height
- Card-based design
- White cards (#fff) on light gray background (#f5f5f5)
- Border radius: 8-12px
- Box shadows for depth

## Key Interactions

### **Entry Creation Flow**
1. Click entry type (Manual/Timer)
2. Modal opens
3. Fill in details (activity, duration, notes)
4. Amount auto-calculates based on user rate
5. Save creates entry in "Pending" status
6. Entry appears in list
7. Summary cards update

### **Timer Flow**
1. Click Timer card
2. Select activity
3. Click "Start Timer"
4. Timer runs, showing elapsed time
5. Amount updates in real-time
6. Pause/Resume as needed
7. Click "Save" to create entry
8. Timer resets

### **Auto Event Flow**
1. Event occurs in Assure Claims
2. ServiceNow receives event
3. System checks event trigger configuration
4. If auto-capture enabled, creates entry automatically
5. Entry appears with "Auto" type
6. No user interaction required

### **User Switching**
1. Click user avatar in header
2. Dropdown shows available users/roles
3. Select different user
4. All calculations update to new rate
5. Interface updates to show new user info

## What's Missing from Current Implementation

Comparing the prototype to what we've built:

### **Need to Add:**

1. **User/Role Switcher**
   - Header dropdown to switch between roles/rates
   - Real-time rate recalculation

2. **Three Entry Methods**
   - Manual entry (we have this)
   - Timer entry (missing)
   - Auto events from Assure Claims (missing)

3. **Assure Claims Integration Panel**
   - Event feed display
   - Live status indicator
   - Auto-capture metrics

4. **Claim-Centric View**
   - Claims list with filtering
   - Claim detail view showing all time/expense for that claim
   - Billing summary cards (4 cards)
   - Iframe indicator (showing it's embedded in Assure Claims)

5. **Configuration Section**
   - Role levels & rates management
   - Carrier-specific rate overrides
   - Activity codes configuration
   - Expense types configuration
   - Event triggers configuration

6. **Entry Type Filtering**
   - Filter by Manual/Timer/Auto

7. **Better Status Management**
   - Pending → Approved → Billed workflow
   - Status badges throughout

8. **Reports Section**
   - Time & expense analytics

## Recommendations for Implementation

### **Phase 1: Core Improvements**
1. Add Timer entry modal
2. Add user/role switching
3. Add billing summary cards to claim view
4. Enhance entry list with type icons and better filtering

### **Phase 2: Assure Claims Integration**
1. Create Assure Claims event panel
2. Implement auto-capture logic
3. Add event trigger configuration

### **Phase 3: Configuration**
1. Build configuration section with tabs
2. Role & rate management
3. Activity codes management
4. Expense types management
5. Event trigger configuration

### **Phase 4: Reporting**
1. Basic time & expense reports
2. Analytics dashboards

## Technical Notes

- **Rate Calculation**: `amount = duration × userRate`
- **Time Increments**: Different roles have different minimum billable increments (6 min vs 15 min)
- **Real-time Updates**: Amount calculations update as user types
- **Role-Based Rates**: Each user has a specific hourly rate based on their role
- **Carrier Overrides**: Some carriers may have different rates for the same role
- **Auto-Capture**: System events can automatically create billable entries
- **Status Workflow**: Pending → Approved → Billed (not Pending → Submitted like we have)
