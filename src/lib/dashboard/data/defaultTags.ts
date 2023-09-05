import type { TagSchema } from '$databaseDir/schema';

/**
 * Creates a new tag with the provided name. The createdAt and updatedAt fields are
 * set to the current date and time.
 *
 * @param  name - The name for the new tag
 * @returns The newly created tag with ID, profileId, name, createdAt, and updatedAt fields
 */
function createTag(name: string): TagSchema {
	const currentDate = new Date().toISOString();

	return {
		id: crypto.randomUUID(),
		profileId: '0000000',
		name,
		createdAt: currentDate,
		updatedAt: currentDate
	};
}

const defaultTags: TagSchema[] = [
	createTag('📚 Academic Writing'),
	createTag('🤖 Artificial Intelligence & Machine Learning'),
	createTag('✍️ Blogging'),
	createTag('💼 Business & Finance'),
	createTag('🎭 Bypass & Personas'),
	createTag('💻 Coding'),
	createTag('📝 Copywriting'),
	createTag('🎨 Creative'),
	createTag('📰 Current Events & News'),
	createTag('🖌️ Design'),
	createTag('🎓 Education & Learning'),
	createTag('📧 Email'),
	createTag('👔 Expert/Consultant'),
	createTag('📖 Fiction Writing'),
	createTag('💪 Fitness, Nutrition, & Health'),
	createTag('🎉 Fun & Games'),
	createTag('🕹️ Games'),
	createTag('🌐 General'),
	createTag('🏛️ History & Culture'),
	createTag('💡 Ideas'),
	createTag('🖼️ Image Generation'),
	createTag('🔓 Jailbreak'),
	createTag('📚 Learning'),
	createTag('⚖️ Legal'),
	createTag('📈 Marketing'),
	createTag('🎵 Music'),
	createTag('📘 Nonfiction Writing'),
	createTag('🤷 Other'),
	createTag('🤔 Philosophy & Logic'),
	createTag('🖋️ Poetry'),
	createTag('🗂️ Productivity'),
	createTag('💾 Programming & Technology'),
	createTag('🔍 Research'),
	createTag('❤️ Relationships & Dating'),
	createTag('💻 SaaS'),
	createTag('🌿 Science & Nature'),
	createTag('🔍 SEO'),
	createTag('📱 Social Media & Blogging'),
	createTag('🎙️ Speeches & Scripts'),
	createTag('⚽ Sports & Recreation'),
	createTag('🧘‍♀️ Therapy & Life-help'),
	createTag('🎙️ Tones'),
	createTag('🌐 Translation'),
	createTag('✈️ Travel'),
	createTag('🎥 Videos')
];

export default defaultTags;
