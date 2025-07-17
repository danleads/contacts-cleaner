import { Contact } from './types';

export const sampleContacts: Contact[] = [
  // Duplicate set 1: John Smith from Maersk
  {
    id: '1',
    name: 'John Smith',
    email: 'j.smith@maersk.com',
    company: 'Maersk Line',
    jobTitle: 'Chartering Manager',
    phone: '+45 33 63 33 63',
    lastActivity: new Date('2024-12-25'), // Yesterday
    activityCount: 45,
    distributionLists: ['VLCC Chartering', 'Europe Shipping Updates'],
    recentConnections: [
      { userId: 'u1', userName: 'Sarah Johnson', interactionCount: 23 },
      { userId: 'u2', userName: 'Mike Chen', interactionCount: 15 },
      { userId: 'u3', userName: 'Emma Wilson', interactionCount: 7 }
    ],
    problem: {
      type: 'Duplicate',
      reason: 'Matches email pattern and name with John P. Smith',
      relatedContactIds: ['2', '3']
    }
  },
  {
    id: '2',
    name: 'John P. Smith',
    email: 'john.smith@maersk.com',
    company: 'A.P. Moller - Maersk',
    jobTitle: 'Senior Chartering Manager',
    phone: '+45 33 63 33 64',
    lastActivity: new Date('2024-12-23'), // 3 days ago
    activityCount: 52,
    distributionLists: ['VLCC Chartering', 'Global Shipping Network'],
    recentConnections: [
      { userId: 'u1', userName: 'Sarah Johnson', interactionCount: 28 },
      { userId: 'u4', userName: 'Tom Anderson', interactionCount: 18 },
      { userId: 'u2', userName: 'Mike Chen', interactionCount: 6 }
    ],
    problem: {
      type: 'Duplicate',
      reason: 'Matches name and company with John Smith and J. Smith',
      relatedContactIds: ['1', '3']
    }
  },
  {
    id: '3',
    name: 'J. Smith',
    email: 'jsmith@maersk.com',
    company: 'Maersk',
    jobTitle: 'Chartering Manager - Tankers',
    lastActivity: new Date('2024-12-10'), // 2 weeks ago
    activityCount: 12,
    distributionLists: ['VLCC Chartering'],
    recentConnections: [
      { userId: 'u1', userName: 'Sarah Johnson', interactionCount: 8 },
      { userId: 'u5', userName: 'Lisa Brown', interactionCount: 4 }
    ],
    problem: {
      type: 'Duplicate',
      reason: 'Likely the same person as John Smith and John P. Smith',
      relatedContactIds: ['1', '2']
    }
  },

  // Invalid email example
  {
    id: '4',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@evergreen-marine..com',
    company: 'Evergreen Marine Corp',
    jobTitle: 'Operations Manager',
    phone: '+886 2 2505 7766',
    lastActivity: new Date('2024-12-24'), // 2 days ago
    activityCount: 67,
    distributionLists: ['Container Operations', 'Asia Pacific Network'],
    recentConnections: [
      { userId: 'u6', userName: 'David Lee', interactionCount: 34 },
      { userId: 'u7', userName: 'Anna Petrov', interactionCount: 23 },
      { userId: 'u8', userName: 'Carlos Mendez', interactionCount: 10 }
    ],
    problem: {
      type: 'Invalid Email',
      reason: 'Email address contains double dots and bounced on December 20, 2024'
    }
  },

  // Duplicate set 2: Two brokers who might be the same person
  {
    id: '5',
    name: 'Alexandra Papadopoulos',
    email: 'apapadopoulos@clarksons.com',
    company: 'Clarksons Platou',
    jobTitle: 'Shipbroker',
    phone: '+44 20 7334 0000',
    lastActivity: new Date('2024-12-20'), // Last week
    activityCount: 89,
    distributionLists: ['Dry Bulk Market', 'Greek Shipping Community', 'London Brokers'],
    recentConnections: [
      { userId: 'u9', userName: 'George Konstantinos', interactionCount: 45 },
      { userId: 'u10', userName: 'Helen Zhang', interactionCount: 32 },
      { userId: 'u11', userName: 'Robert Brown', interactionCount: 12 }
    ],
    problem: {
      type: 'Duplicate',
      reason: 'Same person as Alex Papadopoulos - different email format',
      relatedContactIds: ['6']
    }
  },
  {
    id: '6',
    name: 'Alex Papadopoulos',
    email: 'alexandra.p@clarksons.com',
    company: 'Clarksons',
    jobTitle: 'Senior Shipbroker - Dry Bulk',
    phone: '+44 20 7334 0001',
    lastActivity: new Date('2024-12-19'), // Last week
    activityCount: 78,
    distributionLists: ['Dry Bulk Market', 'Greek Shipping Community', 'Capesize Focus Group'],
    recentConnections: [
      { userId: 'u9', userName: 'George Konstantinos', interactionCount: 41 },
      { userId: 'u12', userName: 'Sofia Dimitriou', interactionCount: 25 },
      { userId: 'u10', userName: 'Helen Zhang', interactionCount: 12 }
    ],
    problem: {
      type: 'Duplicate',
      reason: 'Same person as Alexandra Papadopoulos - shortened first name',
      relatedContactIds: ['5']
    }
  },

  // Invalid email - typo
  {
    id: '7',
    name: 'Captain Lars Nielsen',
    email: 'lars.nielsen@wallenius-wilhelmsen,com',
    company: 'Wallenius Wilhelmsen',
    jobTitle: 'Port Captain',
    phone: '+47 23 11 40 00',
    lastActivity: new Date('2024-11-15'), // Last month, less active
    activityCount: 23,
    distributionLists: ['Car Carrier Operations', 'Nordic Maritime Group'],
    recentConnections: [
      { userId: 'u13', userName: 'Erik Johansson', interactionCount: 15 },
      { userId: 'u14', userName: 'Ingrid Larsen', interactionCount: 8 }
    ],
    problem: {
      type: 'Invalid Email',
      reason: 'Email contains comma instead of dot - bounced on November 10, 2024'
    }
  },

  // Triple duplicate - agency contacts
  {
    id: '8',
    name: 'Yuki Tanaka',
    email: 'y.tanaka@mol-agency.co.jp',
    company: 'MOL Agency',
    jobTitle: 'Agency Manager',
    phone: '+81 3 3587 7111',
    lastActivity: new Date('2024-12-26'), // Today - very active
    activityCount: 134,
    distributionLists: ['Japan Agency Network', 'Port Operations Tokyo', 'MOL Group Communications'],
    recentConnections: [
      { userId: 'u15', userName: 'Kenji Yamamoto', interactionCount: 67 },
      { userId: 'u16', userName: 'Marie Dubois', interactionCount: 45 },
      { userId: 'u17', userName: 'James Park', interactionCount: 22 }
    ],
    problem: {
      type: 'Duplicate',
      reason: 'Same person with multiple email variations - see Tanaka Yuki and Y. Tanaka',
      relatedContactIds: ['9', '10']
    }
  },
  {
    id: '9',
    name: 'Tanaka Yuki',
    email: 'tanaka.yuki@mol.co.jp',
    company: 'Mitsui O.S.K. Lines',
    jobTitle: 'Senior Agency Manager',
    phone: '+81 3 3587 7112',
    lastActivity: new Date('2024-12-26'), // Today - very active
    activityCount: 145,
    distributionLists: ['Japan Agency Network', 'Port Operations Tokyo', 'Container Shipping Asia'],
    recentConnections: [
      { userId: 'u15', userName: 'Kenji Yamamoto', interactionCount: 72 },
      { userId: 'u18', userName: 'Liu Wei', interactionCount: 48 },
      { userId: 'u16', userName: 'Marie Dubois', interactionCount: 25 }
    ],
    problem: {
      type: 'Duplicate',
      reason: 'Name in different order - same person as Yuki Tanaka and Y. Tanaka',
      relatedContactIds: ['8', '10']
    }
  },
  {
    id: '10',
    name: 'Y. Tanaka',
    email: 'ytanaka@mol-agency.jp',
    company: 'MOL Agency Japan',
    jobTitle: 'Agency Manager - Kanto Region',
    lastActivity: new Date('2024-10-30'), // 2 months ago - less active
    activityCount: 8, // Low activity in last 30 days
    distributionLists: ['Japan Agency Network'],
    recentConnections: [
      { userId: 'u15', userName: 'Kenji Yamamoto', interactionCount: 5 },
      { userId: 'u19', userName: 'Sakura Ito', interactionCount: 3 }
    ],
    problem: {
      type: 'Duplicate',
      reason: 'Abbreviated name - same person as Yuki Tanaka and Tanaka Yuki',
      relatedContactIds: ['8', '9']
    }
  },

  // Clean contact (no issues)
  {
    id: '11',
    name: 'Philippe Berger',
    email: 'philippe.berger@cmacgm.com',
    company: 'CMA CGM',
    jobTitle: 'Trade Manager - Mediterranean',
    phone: '+33 4 88 91 90 00',
    lastActivity: new Date('2024-12-25'), // Yesterday - very active
    activityCount: 201,
    distributionLists: ['Mediterranean Trade', 'Container Alliance Updates', 'French Shipping Circle'],
    recentConnections: [
      { userId: 'u20', userName: 'Antoine Dupont', interactionCount: 89 },
      { userId: 'u21', userName: 'Isabella Rossi', interactionCount: 67 },
      { userId: 'u22', userName: 'Miguel Santos', interactionCount: 45 }
    ]
  },

  // Another invalid email
  {
    id: '12',
    name: 'Ahmed Hassan',
    email: 'a.hassan@suezcanal@authority.eg',
    company: 'Suez Canal Authority',
    jobTitle: 'Transit Coordinator',
    phone: '+20 66 3333000',
    lastActivity: new Date('2024-12-22'), // 4 days ago
    activityCount: 156,
    distributionLists: ['Suez Canal Updates', 'Egypt Shipping', 'Transit Schedules'],
    recentConnections: [
      { userId: 'u23', userName: 'Mohamed Farouk', interactionCount: 78 },
      { userId: 'u24', userName: 'Fatima Al-Rashid', interactionCount: 56 },
      { userId: 'u25', userName: 'Omar Khalil', interactionCount: 22 }
    ],
    problem: {
      type: 'Invalid Email',
      reason: 'Email contains two @ symbols - bounced on December 22, 2024'
    }
  },

  // Complex duplicate case - different departments
  {
    id: '13',
    name: 'Robert Chen',
    email: 'rchen@cosco.com',
    company: 'COSCO Shipping',
    jobTitle: 'Operations Manager',
    phone: '+86 21 6596 6666',
    lastActivity: new Date('2024-11-28'), // About a month ago
    activityCount: 32, // Moderate activity
    distributionLists: ['China Shipping Forum', 'Container Operations', 'Shanghai Port Updates'],
    recentConnections: [
      { userId: 'u26', userName: 'Li Ming', interactionCount: 15 },
      { userId: 'u27', userName: 'Zhang Wei', interactionCount: 10 },
      { userId: 'u28', userName: 'Wang Fang', interactionCount: 7 }
    ],
    problem: {
      type: 'Duplicate',
      reason: 'Possibly same person as Bob Chen who moved departments',
      relatedContactIds: ['14']
    }
  },
  {
    id: '14',
    name: 'Bob Chen',
    email: 'robert.chen@cosco-shipping.com',
    company: 'COSCO Shipping Lines',
    jobTitle: 'Chartering Manager',
    phone: '+86 21 6596 6667',
    lastActivity: new Date('2024-12-18'), // Last week
    activityCount: 112,
    distributionLists: ['China Shipping Forum', 'Chartering Network Asia', 'COSCO Internal'],
    recentConnections: [
      { userId: 'u26', userName: 'Li Ming', interactionCount: 52 },
      { userId: 'u29', userName: 'Jennifer Wu', interactionCount: 38 },
      { userId: 'u27', userName: 'Zhang Wei', interactionCount: 22 }
    ],
    problem: {
      type: 'Duplicate',
      reason: 'Same person as Robert Chen - moved from Operations to Chartering',
      relatedContactIds: ['13']
    }
  },

  // Bounced email - user no longer at company
  {
    id: '16',
    name: 'Hans Müller',
    email: 'h.muller@hamburgsud.com',
    company: 'Hamburg Süd',
    jobTitle: 'Logistics Coordinator',
    phone: '+49 40 3705 0',
    lastActivity: new Date('2024-10-05'), // Over 2 months ago
    activityCount: 18,
    distributionLists: ['Germany Logistics', 'Reefer Shipments'],
    recentConnections: [
      { userId: 'u30', userName: 'Klaus Mueller', interactionCount: 10 },
      { userId: 'u31', userName: 'Greta Schmidt', interactionCount: 8 }
    ],
    problem: {
      type: 'Invalid Email',
      reason: 'Email bounced on December 15, 2024'
    }
  },

  // Bounced email - another user who left their role
  {
    id: '17',
    name: 'Isabelle Dubois',
    email: 'isabelle.dubois@one.com',
    company: 'Ocean Network Express (ONE)',
    jobTitle: 'Customer Service Representative',
    phone: '+65 6418 8888',
    lastActivity: new Date('2024-11-20'), // About a month ago
    activityCount: 25,
    distributionLists: ['ONE Customer Updates', 'Asia-Europe Trade Lane'],
    recentConnections: [
      { userId: 'u16', userName: 'Marie Dubois', interactionCount: 15 },
      { userId: 'u20', userName: 'Antoine Dupont', interactionCount: 10 }
    ],
    problem: {
      type: 'Invalid Email',
      reason: 'Email bounced on November 30, 2024'
    }
  },

  // Clean contact
  {
    id: '18',
    name: 'Olaf Steinberg',
    email: 'o.steinberg@hapag-lloyd.com',
    company: 'Hapag-Lloyd',
    jobTitle: 'Regional Director - Northern Europe',
    phone: '+49 40 3001 0',
    lastActivity: new Date('2024-09-15'), // 3 months ago - inactive
    activityCount: 2, // Very low recent activity
    distributionLists: ['Hamburg Shipping Club', 'Container Alliance Updates', 'European Trade Routes'],
    recentConnections: [
      { userId: 'u30', userName: 'Klaus Mueller', interactionCount: 1 },
      { userId: 'u31', userName: 'Greta Schmidt', interactionCount: 1 }
    ]
  }
]; 