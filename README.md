# Sedna Contacts Cleaner

A modern, user-friendly application for maintaining clean and accurate contact information in your address book. Built with Next.js, TypeScript, and shadcn/ui.

## 🚀 Features

### Core Functionality
- **Duplicate Detection & Merging**: Intelligently identifies duplicate contacts and provides a powerful merge interface
- **Invalid Email Handling**: Flags contacts with invalid email addresses for correction
- **Bulk Operations**: Select multiple contacts for merge, delete, or ignore actions
- **Smart Field Selection**: When merging, choose which values to keep for each field
- **Distribution List Preservation**: Automatically combines all distribution lists when merging contacts

### User Experience
- **Sortable Columns**: Sort by name, email, problem type, activity, or company
- **Advanced Filtering**: Filter by problem type or search across all contact fields
- **Pagination**: Efficiently handle large contact lists
- **Persistent State**: All changes are saved to localStorage
- **Confirmation Dialogs**: Prevent accidental data loss with clear confirmation prompts
- **Toast Notifications**: Get immediate feedback on all actions

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React hooks with localStorage persistence
- **Date Formatting**: date-fns

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd contacts-cleaner
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Usage

### Viewing Problem Contacts
The main view displays all contacts that require attention, showing:
- Contact name and company
- Email address
- Problem type (Duplicate or Invalid Email)
- Detailed reason for the issue
- Recent team connections
- Activity metrics
- Distribution list memberships

### Merging Duplicates
1. Select 2 or more duplicate contacts using the checkboxes
2. Click "Merge Selected"
3. Choose the primary contact record
4. Select the best value for each field (name, email, company, etc.)
5. Review that all distribution lists will be preserved
6. Click "Merge Contacts" to complete

### Fixing Invalid Emails
1. Click the edit button next to any contact with an invalid email
2. Update the email address (and any other fields)
3. The email validator will show real-time feedback
4. Click "Save Changes" when done

### Bulk Actions
- **Delete**: Permanently remove selected contacts
- **Ignore**: Dismiss suggestions without making changes
- **Merge**: Combine duplicate contacts into one

### Resetting Data
Click "Reset to Sample Data" to restore the original shipping industry demo data.

## 📊 Sample Data

The application includes realistic shipping industry sample data featuring:
- Major shipping companies (Maersk, CMA CGM, COSCO, etc.)
- Various roles (Chartering Managers, Brokers, Operations, Agency)
- Multiple duplicate scenarios
- Invalid email examples
- Rich activity data and distribution lists

## 🔧 Project Structure

```
contacts-cleaner/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── contacts-list.tsx # Main contact list table
│   ├── merge-dialog.tsx  # Contact merging interface
│   ├── edit-contact-dialog.tsx # Contact editing form
│   └── ui/              # shadcn/ui components
├── hooks/
│   ├── use-contacts.ts   # Contact state management
│   └── use-toast.ts      # Toast notifications
├── lib/
│   ├── types.ts          # TypeScript type definitions
│   ├── sample-data.ts    # Demo data
│   └── utils.ts          # Utility functions
└── package.json
```

## 🎨 Design Principles

1. **Simple**: Clean, intuitive interface that doesn't overwhelm users
2. **Lovable**: Thoughtful UX with helpful feedback and smooth interactions
3. **Complete**: All features work end-to-end without requiring backend integration

## 🚦 Running in Production

To build for production:

```bash
npm run build
npm start
```

## 📝 Notes

- This is a prototype demonstrating front-end capabilities
- All data is stored in browser localStorage
- No backend API connections are implemented
- Sample data represents realistic shipping industry scenarios

## 🤝 Contributing

This is a prototype application. For the production version, please refer to Sedna's internal development guidelines.

## 📄 License

Proprietary - Sedna Systems
