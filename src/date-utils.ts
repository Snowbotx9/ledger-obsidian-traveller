// Traveller Calendar Utilities
// Modified to use Traveller 2e calendar with days numbered 1-365

import { getWithDefault } from './generic-utils';
import { EnhancedTransaction } from './parser';
import { Moment } from 'moment';

export type Interval = 'day'; // Only 'day' is valid for Traveller 2e

/**
 * makeBucketNames creates a list of Traveller 2e dates between the startDate and the endDate.
 */
export const makeBucketNames = (
  interval: Interval,
  startDate: Moment,
  endDate: Moment,
): string[] => {
  const names: string[] = [];
  const currentDate = startDate.clone();

  while (currentDate.isSameOrBefore(endDate)) {
    const year = currentDate.year();
    const dayOfYear = currentDate.dayOfYear();
    names.push(`${year}.${dayOfYear.toString().padStart(3, '0')}`);
    currentDate.add(1, interval);
  }

  return names;
};

/**
 * bucketTransactions sorts the provided transactions into Traveller 2e calendar buckets.
 * Transactions are placed in the bucket with the closest earlier or matching Traveller date.
 *
 * Assumes bucketNames are sorted chronologically.
 */
export const bucketTransactions = (
  bucketNames: string[],
  txs: EnhancedTransaction[],
): Map<string, EnhancedTransaction[]> => {
  const buckets = new Map<string, EnhancedTransaction[]>();

  // Initialize buckets
  bucketNames.forEach((name) => {
    buckets.set(name, []);
  });

  // Sort transactions into buckets
  txs.forEach((tx) => {
    const txDate = window.moment(tx.value.date);
    const txTravellerDate = `${txDate.year()}.${txDate.dayOfYear().toString().padStart(3, '0')}`;

    let targetBucket = bucketNames[0]; // Default to the first bucket
    for (const bucketName of bucketNames) {
      if (bucketName > txTravellerDate) {
        break;
      }
      targetBucket = bucketName;
    }

    getWithDefault(buckets, targetBucket, []).push(tx);
  });

  return buckets;
};
