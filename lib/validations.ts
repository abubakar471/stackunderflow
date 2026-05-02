import { z } from 'zod';

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email address' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(100, { message: 'Password can not exceed 100 characters' }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username can not exceed 30 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers and underscores',
    }),

  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(30, { message: 'Name can not exceed 30 characters' })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Name can only contain letters and spaces',
    }),

  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email address' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password can not exceed 100 characters' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one number',
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character',
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title can not exceed 100 characters' }),

  content: z.string().min(1, { message: 'Body is required' }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: 'Tag is required' })
        .max(30, { message: 'Tag can not exceed 30 characters' })
    )
    .min(1, { message: 'At least one tag is required' })
    .max(3, {message : "Can not add more than 3 tags"}),
});

export const UserSchema = z.object({
  name : z.string().min(1, {message : "Name is required"}),
  username : z.string().min(3, {message : "Username must be atleast 3 characters long"}),
  email : z.string().email({
    message : "Pleave provide a valid email address"
  }),
  bio : z.string().optional(),
  image : z.string().url({
    message :  "Please provide a valid url"
  }),
  location : z.string().optional(),
  portfolio : z.string().url({
    message : "Please provide a valid url"
  }).optional(),
  reputation : z.number().optional()
})

export const AccountSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Invalid image URL").optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
});