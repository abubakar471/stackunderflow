'use client';

import { AskQuestionSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const QuestionForm = () => {
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
    },
  });

  const handleCreateQuestion = () => {};
  return (
    <div>
      <form
        className='flex w-full flex-col gap-10'
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <Controller
          name={'title'}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className='flex w-full flex-col'
            >
              <FieldLabel
                htmlFor='form-rhf-input-username'
                className='paragraph-medium text-dark400_light700'
              >
                Question Title <span className='text-primary-500'>*</span>
              </FieldLabel>
              <Input
                {...field}
                required
                className='paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 border'
              />
              <FieldDescription className='body-regular text-light-500 mt-2.5'>
                Be specific and imagine you are asking question to another person
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name={'content'}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className='flex w-full flex-col'
            >
              <FieldLabel
                htmlFor='form-rhf-input-username'
                className='paragraph-medium text-dark400_light700'
              >
                Detailed Explanation of your content <span className='text-primary-500'>*</span>
              </FieldLabel>
              Editor
              <FieldDescription className='body-regular text-light-500 mt-2.5'>
                Introduce the problem and expand on what you have put on the title
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name={'tags'}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className='flex w-full flex-col'
            >
              <FieldLabel
                htmlFor='form-rhf-input-username'
                className='paragraph-medium text-dark400_light700'
              >
                Tags <span className='text-primary-500'>*</span>
              </FieldLabel>

              <div>
                <Input
                  {...field}
                  required
                  className='paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 border'
                  placeholder='Add tags'
                />
                Tags
              </div>

              <FieldDescription className='body-regular text-light-500 mt-2.5'>
                Add up to 3 tags to describe what your question is about. You need to press enter to
                add a tag.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className='mt-16 flex justify-end'>
          <Button
            type='submit'
            className={'primary-gradient text-light-900!'}
          >
            Ask a Question
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
