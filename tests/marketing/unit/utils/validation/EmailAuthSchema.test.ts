import { EmailAuthSchema } from '$marketingUtils/validation/EmailAuthSchema';

describe('EmailAuthSchema', () => {
    it('should successfully validate a valid email without throwing an error', () => {
        const validEmail = { email: 'test@gmail.com' };

        expect(() => EmailAuthSchema.parse(validEmail)).not.toThrow();
    });

    it('should throw an error if email is empty', () => {
        const invalidEmail = { email: '' };

        expect(() => EmailAuthSchema.parse(invalidEmail)).toThrow(
            'Email is required'
        );
    });

    it('should throw an error if email is invalid', () => {
        const invalidEmail = { email: 'test' };

        expect(() => EmailAuthSchema.parse(invalidEmail)).toThrow(
            'Invalid email'
        );
    });
});
