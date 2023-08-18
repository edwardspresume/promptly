import type { PromptSchema } from '$databaseDir/schema.ts';

/**
 * Creates a new prompt with the provided title and text. The function returns a prompt object
 * @param title - The title of the prompt
 * @param text - The text of the prompt
 * @param tagIds - An array of tag IDs associated with the prompt
 * @returns {PromptSchema} The newly created prompt
 */
function createPrompt(title: string, text: string): PromptSchema {
    const currentDate = new Date().toISOString();

    return {
        id: crypto.randomUUID(),
        userId: '0000000',
        title,
        text,
        isFavorited: false,
        tagIds: [],
        visibility: 'private',
        createdAt: currentDate,
        updatedAt: currentDate,
    };
}

const defaultPrompts: PromptSchema[] = [
    createPrompt(
        "A Dragon's Tale",
        'Create a captivating short story about a dragon who has lost his ability to breathe fire.'
    ),
    createPrompt(
        'Green Business Proposition',
        'Compose a persuasive proposal for an innovative, eco-friendly product line our company could venture into.'
    ),
    createPrompt(
        'Simplified Gravitational Waves',
        'Simplify the complex concept of gravitational waves into easily understandable terms suitable for a high school student.'
    ),
    createPrompt(
        'Crafting a Software Engineer Resume',
        'Assist in crafting a compelling summary section for a resume aimed at a software engineering role, leveraging five years of industry experience.'
    ),
    createPrompt(
        'Professional Client Introduction Email',
        'Compose a professional email introducing our services to a potential client.'
    ),
    createPrompt(
        'Climate Change Insights',
        'Concisely summarize the main findings of the latest research on climate change mitigation.'
    ),
    createPrompt(
        'Planning a Virtual Team-Building Event',
        'Devise a detailed plan for a virtual team-building event catering to a team of 20.'
    ),
    createPrompt(
        'Cultural Rome Itinerary',
        'Design a comprehensive 7-day itinerary for a cultural exploration of Rome, Italy.'
    ),
    createPrompt(
        'Project Manager Interview Guide',
        'Prepare a list of potential questions and suitable answers for a job interview for a project manager role.'
    ),
    createPrompt(
        'Vegetarian Family Feast',
        'Create a three-course vegetarian menu suitable for a delightful family dinner.'
    ),
    createPrompt(
        'Spanish for Beginners',
        "Generate a beginner's guide to conversational Spanish."
    ),
    createPrompt(
        'Reviewing "1984"',
        "Write an insightful review of the dystopian novel '1984' by George Orwell."
    ),
    createPrompt(
        '30-Day Fitness Challenge',
        'Design a 30-day fitness plan aimed at weight loss.'
    ),
    createPrompt(
        'Budgeting for College',
        'Draw up a simple yet effective budgeting plan catered to a college student.'
    ),
    createPrompt(
        'Deciphering Python Recursion',
        'Explain the concept of recursion in Python, including examples.'
    ),
    createPrompt(
        'Thriller Watchlist',
        'Recommend five thrilling movies released in the thriller genre over the last two years.'
    ),
    createPrompt(
        'Marketing an Online Learning Platform',
        'Propose an effective marketing strategy to launch a new online learning platform.'
    ),
    createPrompt(
        'Middle Eastern Cuisine Introduction',
        'Introduce Middle Eastern cuisine to someone unfamiliar with it.'
    ),
    createPrompt(
        'Evolution of Social Media',
        'Summarize the evolution of social media over the past decade.'
    ),
    createPrompt(
        'Exploring Greek Mythology',
        'Provide an overview of Greek mythology, focusing on the main gods and goddesses.'
    ),
    createPrompt(
        'Future of AI in Healthcare',
        'Predict the potential impact of artificial intelligence in the healthcare sector over the next decade.'
    ),
    createPrompt(
        'Analyzing a Stock',
        'Describe the key factors to consider when analyzing a stock for potential investment.'
    ),
    createPrompt(
        'Cooking for Allergies',
        'Propose a list of meals for a week suitable for someone with nut, gluten, and dairy allergies.'
    ),
    createPrompt(
        'Debate: Single-Use Plastics',
        'Write an argument in favor of banning single-use plastics worldwide.'
    ),
    createPrompt(
        'Exploring Mars',
        'Elaborate on the current efforts and future plans for Mars exploration.'
    ),
];

export default defaultPrompts;
