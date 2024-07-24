'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@headlessui/react';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className={`rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 ${
        pending && 'bg-sky-100 text-sky-700 cursor-wait data-[hover]:bg-sky-100'
      }`}
      disabled={pending}
      type="submit"
    >
      Start
    </Button>
  );
}
