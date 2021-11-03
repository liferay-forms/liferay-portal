/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

const NON_NUMERIC_REGEX = /[\D]/g;
const POSITIVE_NUMBERS_REGEX = /[1-9]/;

export const limitValue = ({
	defaultValue,
	max,
	min,
	value,
}: {
	defaultValue: number;
	max: number;
	min: number;
	value: number;
}) => {
	if (isNaN(value) || value < min) {
		return defaultValue;
	}
	else if (value > max) {
		return max;
	}

	return value;
};

export const trimLeftZero = (value: string) => {
	if (
		value.length > 1 &&
		value[0] === '0' &&
		!value[1].match(NON_NUMERIC_REGEX)
	) {
		const zeroes = value
			.split(POSITIVE_NUMBERS_REGEX)[0]
			.split(NON_NUMERIC_REGEX)[0];
		value = value.replace(zeroes, '');
	}

	return value;
};
