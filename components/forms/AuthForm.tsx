'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import ROUTES from '@/constants/routes';

interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T, T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: 'SIGN_UP' | 'SIGN_IN';
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    await onSubmit(data);
  };

  const buttonText = formType === 'SIGN_IN' ? 'Sign in' : 'Sign up';

  return (
    <div className='w-full sm:max-w-md'>
      <form
        className='mt-10 space-y-6'
        id='form-rhf-input'
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {Object.keys(defaultValues).map((field) => (
          <Controller
            key={field}
            name={field as Path<T>}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className='flex w-full flex-col gap-2.5'
              >
                <FieldLabel
                  htmlFor='form-rhf-input-username'
                  className='paragraph-medium text-dark400_light700'
                >
                  {field.name === 'email'
                    ? 'Email'
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FieldLabel>
                <Input
                  {...field}
                  required
                  type={field.name === 'password' ? 'password' : 'text'}
                  className='paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border'
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}
      </form>

      <Field
        orientation='vertical'
        className='mt-4 gap-y-4'
      >
        <Button
          type='submit'
          form='form-rhf-input'
          disabled={form.formState.isSubmitting}
          className='primary-gradient paragraph-medium rounded-2 px-4 py-3 font-inter text-light-900! min-h-12 w-full'
        >
          {form.formState.isSubmitting
            ? buttonText === 'Sign in'
              ? 'Signing in...'
              : 'Signing up...'
            : buttonText}
        </Button>

        {formType === 'SIGN_IN' ? (
          <p>
            Don&apos;t have an account?{' '}
            <Link
              href={ROUTES.SIGN_UP}
              className='paragraph-semibold primary-text-gradient'
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link
              href={ROUTES.SIGN_IN}
              className='paragraph-semibold primary-text-gradient'
            >
              Sign in
            </Link>
          </p>
        )}
      </Field>
    </div>
  );
};

export default AuthForm;
