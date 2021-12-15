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

import {ClayInput} from '@clayui/form';
import React, {ChangeEvent, KeyboardEvent, useEffect, useState} from 'react';

const MAX_QUANTITY = 999;
const MIN_QUANTITY = 1;

const DDMQuantity: React.FC<IProps> = ({
	label,
	name,
	onChange,
	readOnly,
	value: initialValue,
}) => {
	const [value, setValue] = useState<string>(initialValue.toString());

	useEffect(() => {
		if (initialValue.toString() !== value) {
			setValue(initialValue.toString());
		}
	}, [initialValue, value]);

	const handleChange = ({target: {value}}: ChangeEvent<HTMLInputElement>) => {
		setValue(value);
	};

	const normalizeValue = (event: KeyboardEvent<HTMLInputElement>) => {
		if (/[-.+,]/.test(event.key)) {
			event.preventDefault();
		}
	};

	return (
		<label>
			{label}

			<ClayInput
				disabled={readOnly}
				max={MAX_QUANTITY}
				min={MIN_QUANTITY}
				name={name}
				onBlur={onChange}
				onChange={handleChange}
				onKeyPress={normalizeValue}
				type="number"
				value={value}
			/>
		</label>
	);
};

export default DDMQuantity;

interface IProps {
	label: string;
	name?: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readOnly?: boolean;
	value: number;
}
