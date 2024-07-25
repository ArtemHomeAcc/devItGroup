'use client';

import { Input } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { mainRequest } from '@/api';
import { SubmitButton } from '@/components/ui/submitButton';
import { limits } from '@/constants/limits';
import { errorMessage } from '@/constants/errorMessage';

import { Result } from '@/types/result';

export default function Home() {
  const [resultList, setResultList] = useState<Result[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (error.length) {
      timer = setTimeout(() => {
        setError('');
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [error]);

  const formSubmit = (formData: FormData) => {
    const quantity = Number(formData.get('quantity'));

    if (quantity > 100 || quantity < 0) {
      setError(errorMessage.inputValue);

      return;
    }

    if (quantity) {
      // limitation of the request quantity to the server according to the test assignment
      for (let i = 0; i < limits.requestQuantity; i += quantity) {
        // next two variables are needed according to point 1.2 test assignment
        let firstRequestTime = Date.now();
        let requestCount = 0;

        const requestsArr = [];

        for (let j = 1; j <= quantity; j += 1) {
          const nextRequestTime = Date.now();

          // check if there is possibility to send new request;
          if (
            nextRequestTime - firstRequestTime < limits.time &&
            requestCount === quantity
          ) {
            j -= 1;
            continue;
          }

          // resetting the request count
          if (
            nextRequestTime - firstRequestTime >= limits.time &&
            requestCount === quantity
          ) {
            firstRequestTime = nextRequestTime;
            requestCount = 0;
          }

          requestsArr.push(mainRequest(i + j));
        }

        // sending all 10 requests
        Promise.all(requestsArr)
          .then((response) => {
            setResultList((prevState) => [...prevState, ...response]);
          })
          .catch(() => setError(errorMessage.loadingFail));
      }
    }
  };

  return (
    <main className="flex flex-col gap-7 min-h-screen items-center justify-center py-20">
      <form action={formSubmit} className="flex flex-col gap-5 relative">
        <Input
          name="quantity"
          type="number"
          className="rounded-md text-black px-3 py-2"
        />
        <SubmitButton />
        {!!error.length && (
          <div className="px-3 py-2 min-w-40 rounded-md bg-amber-200 text-orange-600 absolute bottom-[-90px]">
            {error}
          </div>
        )}
      </form>

      <ul className="flex flex-col gap-2 items-center justify-center">
        {resultList.map((result) => (
          <li
            key={result.id}
            className="px-3 py-2 bg-sky-100 text-black rounded-md min-w-20 text-center"
          >
            {result.value}
          </li>
        ))}
      </ul>
    </main>
  );
}
