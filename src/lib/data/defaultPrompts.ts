import type { PromptSchema } from '$types';

const defaultPrompts: PromptSchema[] = [
    {
        id: 1,
        title: "A Dragon's Tale",
        text: 'Create a captivating short story about a dragon who has lost his ability to breathe fire.',
        isFavorited: false,
        tagIds: [14, 8], // Fiction Writing, Creative
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        title: 'Green Business Proposition',
        text: 'Compose a persuasive proposal for an innovative, eco-friendly product line our company could venture into.',
        isFavorited: false,
        tagIds: [4, 25, 11], // Business & Finance, Marketing, Education & Learning
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 3,
        title: 'Simplified Gravitational Waves',
        text: 'Simplify the complex concept of gravitational waves into easily understandable terms suitable for a high school student.',
        isFavorited: false,
        tagIds: [1, 36, 11], // Academic Writing, Science & Nature, Education & Learning
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 4,
        title: 'Crafting a Software Engineer Resume',
        text: 'Assist in crafting a compelling summary section for a resume aimed at a software engineering role, leveraging five years of industry experience.',
        isFavorited: false,
        tagIds: [11, 32, 4], // Education & Learning, Programming & Technology, Business & Finance
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 5,
        title: 'Professional Client Introduction Email',
        text: 'Compose a professional email introducing our services to a potential client.',
        isFavorited: false,
        tagIds: [12, 4, 25], // Email, Business & Finance, Marketing
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    {
        id: 6,
        title: 'Climate Change Insights',
        text: 'Concisely summarize the main findings of the latest research on climate change mitigation.',
        isFavorited: false,
        tagIds: [33, 36, 1], // Research, Science & Nature, Academic Writing
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 7,
        title: 'Planning a Virtual Team-Building Event',
        text: 'Devise a detailed plan for a virtual team-building event catering to a team of 20.',
        isFavorited: false,
        tagIds: [4, 31, 39], // Business & Finance, Productivity, Speeches & Scripts
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 8,
        title: 'Cultural Rome Itinerary',
        text: 'Design a comprehensive 7-day itinerary for a cultural exploration of Rome, Italy.',
        isFavorited: false,
        tagIds: [44, 11, 19], // Travel, Education & Learning, History & Culture
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 9,
        title: 'Project Manager Interview Guide',
        text: 'Prepare a list of potential questions and suitable answers for a job interview for a project manager role.',
        isFavorited: false,
        tagIds: [4, 11, 39], // Business & Finance, Education & Learning, Speeches & Scripts
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 10,
        title: 'Vegetarian Family Feast',
        text: 'Create a three-course vegetarian menu suitable for a delightful family dinner.',
        isFavorited: false,
        tagIds: [15, 8, 20], // Fitness, Nutrition, & Health, Creative, Ideas
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 11,
        title: 'Spanish for Beginners',
        text: "Generate a beginner's guide to conversational Spanish.",
        isFavorited: false,
        tagIds: [11, 43], // Education & Learning, Translation
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 12,
        title: 'Reviewing "1984"',
        text: "Write an insightful review of the dystopian novel '1984' by George Orwell.",
        isFavorited: false,
        tagIds: [27, 1, 29], // Nonfiction Writing, Academic Writing, Philosophy & Logic
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 13,
        title: '30-Day Fitness Challenge',
        text: 'Design a 30-day fitness plan aimed at weight loss.',
        isFavorited: false,
        tagIds: [15, 31, 11], // Fitness, Nutrition, & Health, Productivity, Education & Learning
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 14,
        title: 'Budgeting for College',
        text: 'Draw up a simple yet effective budgeting plan catered to a college student.',
        isFavorited: false,
        tagIds: [4, 11, 39], // Business & Finance, Education & Learning, Speeches & Scripts
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 15,
        title: 'Deciphering Python Recursion',
        text: 'Explain the concept of recursion in Python, including examples.',
        isFavorited: false,
        tagIds: [6, 32, 11], // Coding, Programming & Technology, Education & Learning
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 16,
        title: 'Thriller Watchlist',
        text: 'Recommend five thrilling movies released in the thriller genre over the last two years.',
        isFavorited: false,
        tagIds: [20, 18, 27], // Ideas, General, Nonfiction Writing
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 17,
        title: 'Marketing an Online Learning Platform',
        text: 'Propose an effective marketing strategy to launch a new online learning platform.',
        isFavorited: false,
        tagIds: [25, 35, 11], // Marketing, SaaS, Education & Learning
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 18,
        title: 'Middle Eastern Cuisine Introduction',
        text: 'Introduce Middle Eastern cuisine to someone unfamiliar with it.',
        isFavorited: false,
        tagIds: [15, 8, 11], // Fitness, Nutrition, & Health, Creative, Education & Learning
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 19,
        title: 'Evolution of Social Media',
        text: 'Summarize the evolution of social media over the past decade.',
        isFavorited: false,
        tagIds: [26, 33, 1], // News & Media, Research, Academic Writing
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 20,
        title: 'Exploring Greek Mythology',
        text: 'Provide an overview of Greek mythology, focusing on the main gods and goddesses.',
        isFavorited: false,
        tagIds: [19, 1, 11], // History & Culture, Academic Writing, Education & Learning
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 21,
        title: 'Future of AI in Healthcare',
        text: 'Predict the potential impact of artificial intelligence in the healthcare sector over the next decade.',
        isFavorited: false,
        tagIds: [36, 33, 4], // Science & Nature, Research, Business & Finance
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 22,
        title: 'Analyzing a Stock',
        text: 'Describe the key factors to consider when analyzing a stock for potential investment.',
        isFavorited: false,
        tagIds: [4, 11, 33], // Business & Finance, Education & Learning, Research
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 23,
        title: 'Cooking for Allergies',
        text: 'Propose a list of meals for a week suitable for someone with nut, gluten, and dairy allergies.',
        isFavorited: false,
        tagIds: [15, 8, 20], // Fitness, Nutrition, & Health, Creative, Ideas
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 24,
        title: 'Debate: Single-Use Plastics',
        text: 'Write an argument in favor of banning single-use plastics worldwide.',
        isFavorited: false,
        tagIds: [1, 39, 36], // Academic Writing, Speeches & Scripts, Science & Nature
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 25,
        title: 'Exploring Mars',
        text: 'Elaborate on the current efforts and future plans for Mars exploration.',
        isFavorited: false,
        tagIds: [36, 33, 1], // Science & Nature, Research, Academic Writing
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export default defaultPrompts;
