'use server';

import { limits } from '@/constants/limits';
import { responses } from '@/constants/responses';
import { waitDelay } from '@/helpers/waitDelay';

import { Result } from '@/types/result';
import { NextResponse } from 'next/server';

type MainRequest = (num: number) => Promise<Result>;

let firstRequest: number;
let requestCount = 0;

const delay = 100;

export const mainRequest: MainRequest = async (num) => {
  if (!firstRequest) {
    firstRequest = Date.now();
  }
  requestCount += 1;

  const nextRequest = Date.now();

  // check if the user hasn't exceeded the limits
  if (
    nextRequest - firstRequest >= limits.perSecond &&
    requestCount >= limits.requestsPerSecond
  ) {
    NextResponse.json(
      { message: responses[429].message },
      { status: responses[429].code }
    );
  }

  // clear checkpoints after defined period of time
  if (
    nextRequest - firstRequest >= limits.perSecond &&
    requestCount < limits.requestsPerSecond
  ) {
    firstRequest = nextRequest;
    requestCount = 0;
  }

  // clear checkpoints after defined time
  return waitDelay(delay).then(() => {
    return {
      id: num,
      value: num,
    };
  });
};
