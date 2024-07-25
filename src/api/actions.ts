'use server';

import { limits } from '@/constants/limits';
import { responses } from '@/constants/responses';
import { waitDelay } from '@/helpers/waitDelay';

import { Result } from '@/types/result';
import { NextResponse } from 'next/server';

type MainRequest = (num: number) => Promise<Result>;

let timeOfFirstRequestInCurrentTime: number;
let requestCount = 0;

export const mainRequest: MainRequest = async (num) => {
  if (!timeOfFirstRequestInCurrentTime) {
    timeOfFirstRequestInCurrentTime = Date.now();
  }
  requestCount += 1;

  const timeOfNextRequestInCurrentTime = Date.now();

  // check if the user hasn't exceeded the limits
  if (
    timeOfNextRequestInCurrentTime - timeOfFirstRequestInCurrentTime >=
      limits.time &&
    requestCount >= limits.requestsPerSecond
  ) {
    NextResponse.json(
      { message: responses[429].message },
      { status: responses[429].code }
    );
  }

  // clear checkpoints after defined period of time
  if (
    timeOfNextRequestInCurrentTime - timeOfFirstRequestInCurrentTime >=
      limits.time &&
    requestCount < limits.requestsPerSecond
  ) {
    timeOfFirstRequestInCurrentTime = timeOfNextRequestInCurrentTime;
    requestCount = 0;
  }

  const delay = Math.floor(
    Math.random() * (limits.maxTime - limits.minTime) + limits.minTime
  );

  return waitDelay(delay).then(() => {
    return {
      id: num,
      value: num,
    };
  });
};
