// Traveller Calendar Utilities - React Integration
// Modified to use Traveller 2e calendar with days numbered 1-365

import { Interval } from '../date-utils';
import {
  Button,
  DatePicker,
  FlexContainer,
  FlexFloatRight,
  FlexShrink,
} from './SharedStyles';
import { Moment } from 'moment';
import { Notice } from 'obsidian';
import React from 'react';
import styled from 'styled-components';

const MarginSpan = styled.span`
  margin: 0 12px;
`;

export const DateRangeSelector: React.FC<{
  startDate: Moment;
  endDate: Moment;
  setStartDate: React.Dispatch<React.SetStateAction<Moment>>;
  setEndDate: React.Dispatch<React.SetStateAction<Moment>>;
  interval: Interval;
  setInterval: React.Dispatch<React.SetStateAction<Interval>>;
}> = (props): JSX.Element => (
  <FlexContainer>
    <FlexFloatRight className="ledger-interval-selectors">
      <Button
        selected={props.interval === 'day'}
        action={() => {
          props.setInterval('day');
          validateAndUpdateEndDate(
            'day',
            props.startDate,
            props.endDate,
            props.setEndDate,
          );
        }}
      >
        Daily
      </Button>
    </FlexFloatRight>

    <FlexShrink className="ledger-daterange-selectors">
      <DatePicker
        type="number"
        placeholder="Start"
        value={props.startDate.dayOfYear()}
        onChange={(e) => {
          const newDate = window.moment().dayOfYear(Number(e.target.value)).year(props.startDate.year());
          props.setStartDate(newDate);
          if (newDate.isAfter(props.endDate)) {
            props.setEndDate(newDate);
          } else {
            validateAndUpdateEndDate(
              props.interval,
              newDate,
              props.endDate,
              props.setEndDate,
            );
          }
        }}
      />
      <MarginSpan>➜</MarginSpan>
      <DatePicker
        type="number"
        placeholder="End"
        value={props.endDate.dayOfYear()}
        max={365}
        onChange={(e) => {
          const newDate = window.moment().dayOfYear(Number(e.target.value)).year(props.endDate.year());
          props.setEndDate(newDate.clone());
          if (newDate.isBefore(props.startDate)) {
            props.setStartDate(newDate);
          } else {
            validateAndUpdateStartDate(
              props.interval,
              props.startDate,
              newDate,
              props.setStartDate,
            );
          }
        }}
      />
    </FlexShrink>
  </FlexContainer>
);

const validateAndUpdateStartDate = (
  interval: Interval,
  startDate: Moment,
  endDate: Moment,
  setStartDate: React.Dispatch<React.SetStateAction<Moment>>,
): void => {
  const maxDays = interval === 'day' ? 15 : 15; // Single interval in Traveller is always 'day'
  if (endDate.dayOfYear() - startDate.dayOfYear() > maxDays) {
    new Notice('Exceeded maximum time window. Adjusting start date.');
    setStartDate(endDate.clone().subtract(maxDays, 'days'));
  }
};

const validateAndUpdateEndDate = (
  interval: Interval,
  startDate: Moment,
  endDate: Moment,
  setEndDate: React.Dispatch<React.SetStateAction<Moment>>,
): void => {
  const maxDays = interval === 'day' ? 15 : 15; // Single interval in Traveller is always 'day'
  if (endDate.dayOfYear() - startDate.dayOfYear() > maxDays) {
    new Notice('Exceeded maximum time window. Adjusting end date.');
    setEndDate(startDate.clone().add(maxDays, 'days'));
  }
};
