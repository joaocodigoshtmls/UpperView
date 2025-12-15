import { startOfMonth as fnsStartOfMonth, endOfMonth as fnsEndOfMonth } from 'date-fns';

export const toDate = (value: string | number | Date): Date => {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) {
		throw new Error('Data inválida');
	}
	return date;
};

export const startOfMonth = (date: Date | string | number = new Date()) => fnsStartOfMonth(toDate(date));
export const endOfMonth = (date: Date | string | number = new Date()) => fnsEndOfMonth(toDate(date));
