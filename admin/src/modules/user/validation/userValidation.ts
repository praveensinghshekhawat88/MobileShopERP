import { z } from 'zod';

const passwordSchema = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be at most 100 characters');

export const userFormSchema = z.object({
  roleId: z.string().min(1, 'Role is required'),
  firstName: z.string().trim().min(1, 'First name is required').max(100, 'First name must be at most 100 characters'),
  lastName: z.string().trim().max(100, 'Last name must be at most 100 characters').optional(),
  mobile: z.string().trim().min(1, 'Mobile is required').max(15, 'Mobile must be at most 15 characters'),
  email: z.union([
    z.literal(''),
    z.string().trim().max(150, 'Email must be at most 150 characters').email('Enter a valid email address'),
  ]),
  password: z.string().optional(),
  active: z.boolean().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const USER_FORM_DEFAULT_VALUES: UserFormValues = {
  roleId: '',
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  password: '',
  active: true,
};

export const createUserFormSchema = userFormSchema.extend({
  password: passwordSchema,
});

export const updateUserFormSchema = userFormSchema.superRefine((data, ctx) => {
  if (data.password && data.password.trim().length > 0 && data.password.trim().length < 8) {
    ctx.addIssue({
      code: 'custom',
      message: 'Password must be at least 8 characters',
      path: ['password'],
    });
  }
});

export const profileFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100, 'First name must be at most 100 characters'),
  lastName: z.string().trim().max(100, 'Last name must be at most 100 characters').optional(),
  mobile: z.string().trim().min(1, 'Mobile is required').max(15, 'Mobile must be at most 15 characters'),
  email: z.union([
    z.literal(''),
    z.string().trim().max(150, 'Email must be at most 150 characters').email('Enter a valid email address'),
  ]),
  password: z.union([z.literal(''), passwordSchema]),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const PROFILE_FORM_DEFAULT_VALUES: ProfileFormValues = {
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  password: '',
};
