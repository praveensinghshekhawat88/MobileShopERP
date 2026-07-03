import { Stack } from '@mui/material';
import type { JSX, ReactNode } from 'react';
import { FormProvider, type FieldValues, type UseFormReturn } from 'react-hook-form';

interface FormProps<TFieldValues extends FieldValues> {
  readonly methods: UseFormReturn<TFieldValues>;
  readonly onSubmit: (values: TFieldValues) => void | Promise<void>;
  readonly children: ReactNode;
  readonly id?: string;
}

/**
 * The one reusable form shell — see 01_AGENTS.md § Form Rules: "Use React
 * Hook Form + Zod. Only. No uncontrolled forms." and § Form Architecture
 * (Page → Dialog → Form → React Hook Form → Zod → Service → Backend).
 *
 * Every module form wraps its fields with this component instead of a raw
 * `<form>` tag, so submit handling and layout stay consistent everywhere.
 * Responsive layout: 2 columns desktop / 1 column mobile is the caller's
 * responsibility via a `Grid`/`Stack` inside `children` (see 05_UI_STANDARDS.md
 * § Forms) — this shell only owns submit wiring and vertical field spacing.
 */
export function Form<TFieldValues extends FieldValues>({
  methods,
  onSubmit,
  children,
  id,
}: FormProps<TFieldValues>): JSX.Element {
  return (
    <FormProvider {...methods}>
      <form
        id={id}
        noValidate
        onSubmit={(event) => {
          void methods.handleSubmit(onSubmit)(event);
        }}
      >
        <Stack spacing={3}>{children}</Stack>
      </form>
    </FormProvider>
  );
}
