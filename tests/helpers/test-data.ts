/**
 * Test data and fixtures for E2E tests
 */

export const TEST_USERS = {
  regular: {
    email: 'test.buyer@vertex.test',
    password: 'testpassword123',
    name: 'Test Buyer',
  },
  buyer: {
    email: 'test.buyer@vertex.test',
    password: 'testpassword123',
    name: 'Test Buyer',
  },
  executor: {
    email: 'test.specialist@vertex.test',
    password: 'testpassword123',
    name: 'Test Specialist',
  },
  specialist: {
    email: 'test.specialist@vertex.test',
    password: 'testpassword123',
    name: 'Test Specialist',
  },
  admin: {
    email: 'test.admin@vertex.test',
    password: 'testpassword123',
    name: 'Test Admin',
  },
};

export const TEST_REQUESTS = {
  aiStrategy: {
    description: 'I require expert strategic counsel on AI transformation for my Fortune 500 organization. Looking for sophisticated advisory on advanced analytics, custom implementation roadmap, and bespoke AI solutions tailored to organizational needs.',
    expectedTasks: ['AI Strategy', 'ML Implementation'],
  },
  mlConsulting: {
    description: 'Need comprehensive machine learning consulting for organization-wide implementation. Focus on predictive analytics and automated decision-making systems.',
    expectedTasks: ['ML Consulting', 'Data Architecture'],
  },
  dataArchitecture: {
    description: 'Seeking expert guidance on building secure, scalable data infrastructure for AI/ML workloads. Private cloud deployment with business-grade security.',
    expectedTasks: ['Data Architecture', 'Cloud Strategy'],
  },
};

export const TEST_SPECIALISTS = {
  aiExpert: {
    firstName: 'Dr. Alexandra',
    lastName: 'Chen',
    bio: 'Leading AI strategist with 15+ years of experience in Fortune 500 digital transformation.',
    hourlyRate: 500,
    rating: 4.95,
  },
  mlSpecialist: {
    firstName: 'Marcus',
    lastName: 'Williams',
    bio: 'Machine learning expert specializing in large-scale implementations.',
    hourlyRate: 450,
    rating: 4.88,
  },
};

export const MOCK_API_RESPONSES = {
  matchSpecialists: {
    success: {
      requestId: 'test-request-123',
      isAuthenticated: false,
      matches: [
        {
          id: 'match-1',
          specialist: {
            id: 'spec-1',
            firstName: 'Alexandra',
            avatarSeed: 'seed1',
            rating: 4.9,
            completedTasks: 156,
          },
          taskName: 'AI Strategy',
          price: 5000,
          confidence: 0.95,
          reasoning: 'Expert in organizational AI transformation with proven track record',
        },
        {
          id: 'match-2',
          specialist: {
            id: 'spec-2',
            firstName: 'Marcus',
            avatarSeed: 'seed2',
            rating: 4.8,
            completedTasks: 142,
          },
          taskName: 'ML Implementation',
          price: 4500,
          confidence: 0.88,
          reasoning: 'Specialized in machine learning systems for Fortune 500 companies',
        },
      ],
      suggestedTasks: ['AI Strategy', 'ML Implementation'],
    },
    noMatches: {
      requestId: 'test-request-456',
      isAuthenticated: false,
      matches: [],
      suggestedTasks: ['General Consulting'],
    },
    error: {
      error: 'Failed to match specialists',
      message: 'An error occurred while processing your request',
    },
  },
  dashboard: {
    success: {
      stats: {
        walletBalance: 10000,
        activeOrders: 3,
        completedOrders: 12,
        totalSpent: 45000,
      },
      recentOrders: [
        {
          id: 'order-1',
          specialist: {
            firstName: 'Alexandra',
            avatarSeed: 'seed1',
          },
          task: {
            displayName: 'AI Strategy Consulting',
          },
          status: 'IN_PROGRESS',
          credits: 5000,
          createdAt: new Date().toISOString(),
        },
      ],
      recommendedSpecialists: [
        {
          id: 'spec-1',
          firstName: 'Marcus',
          avatarSeed: 'seed2',
          bio: 'Expert in machine learning and data science',
          rating: 4.9,
          hourlyRate: 450,
        },
      ],
    },
  },
};

export const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  mobileLandscape: { width: 667, height: 375 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 1920, height: 1080 },
  desktopSmall: { width: 1366, height: 768 },
};

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  wallet: '/dashboard/wallet',
  purchases: '/dashboard/purchases',
  settings: '/settings',
  specialists: '/specialists',
  tasks: '/tasks',
  request: '/request',
  pricing: '/pricing',
  executor: '/executor',
  executorTelegram: '/executor/telegram',
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy',
};
