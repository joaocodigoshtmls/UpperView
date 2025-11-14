import { startOfMonth as fnsStartOfMonth, endOfMonth as fnsEndOfMonth } from 'date-fns';

export const startOfMonth = (date: Date = new Date()) => fnsStartOfMonth(date);
export const endOfMonth = (date: Date = new Date()) => fnsEndOfMonth(date);
