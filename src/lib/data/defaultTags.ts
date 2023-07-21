import type { TagSchema } from '$types';

/**
 * Creates a new tag with the provided ID and name. The createdAt and updatedAt fields are
 * set to the current date and time.
 *
 * @param  id - The ID for the new tag
 * @param  name - The name for the new tag
 * @returns The newly created tag with ID, name, createdAt, and updatedAt fields
 */
function createTag(id: number, name: string): TagSchema {
    const currentDate = new Date().toISOString();
    return {
        id,
        name,
        createdAt: currentDate,
        updatedAt: currentDate,
    };
}

const defaultTags: TagSchema[] = [
    createTag(1, 'Academic Writing'),
    createTag(2, 'Artificial Intelligence & Machine Learning'),
    createTag(3, 'Blogging'),
    createTag(4, 'Business & Finance'),
    createTag(5, 'Bypass & Personas'),
    createTag(6, 'Coding'),
    createTag(7, 'Copywriting'),
    createTag(8, 'Creative'),
    createTag(9, 'Current Events & News'),
    createTag(10, 'Design'),
    createTag(11, 'Education & Learning'),
    createTag(12, 'Email'),
    createTag(13, 'Expert/Consultant'),
    createTag(14, 'Fiction Writing'),
    createTag(15, 'Fitness, Nutrition, & Health'),
    createTag(16, 'Fun & Games'),
    createTag(17, 'Games'),
    createTag(18, 'General'),
    createTag(19, 'History & Culture'),
    createTag(20, 'Ideas'),
    createTag(21, 'Image Generation'),
    createTag(22, 'Jailbreak'),
    createTag(23, 'Learning'),
    createTag(24, 'Legal'),
    createTag(25, 'Marketing'),
    createTag(26, 'Music'),
    createTag(27, 'Nonfiction Writing'),
    createTag(28, 'Other'),
    createTag(29, 'Philosophy & Logic'),
    createTag(30, 'Poetry'),
    createTag(31, 'Productivity'),
    createTag(32, 'Programming & Technology'),
    createTag(33, 'Research'),
    createTag(34, 'Relationships & Dating'),
    createTag(35, 'SaaS'),
    createTag(36, 'Science & Nature'),
    createTag(37, 'SEO'),
    createTag(38, 'Social Media & Blogging'),
    createTag(39, 'Speeches & Scripts'),
    createTag(40, 'Sports & Recreation'),
    createTag(41, 'Therapy & Life-help'),
    createTag(42, 'Tones'),
    createTag(43, 'Translation'),
    createTag(44, 'Travel'),
    createTag(45, 'Videos'),
];

export default defaultTags;
