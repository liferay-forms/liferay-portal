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

import ClayForm from '@clayui/form';
import React from 'react';

import Checkbox from '../Checkbox/Checkbox.es';

interface IValidationCheckboxProps {
	children: React.ReactElement;
	label: string;
	onChange: (event: Event, value: boolean) => void;
	readOnly: boolean;
	spritemap: string;
	value: boolean;
	visible: boolean;
}

const ValidationCheckbox: React.FC<IValidationCheckboxProps> = ({
	children,
	label,
	onChange,
	readOnly,
	spritemap,
	value,
	visible,
}) => {
	return (
		<ClayForm.Group className="lfr-ddm-form-field-validation">
			{/* 
			// @ts-ignore */}
			<Checkbox
				label={label}
				name="enableValidation"
				onChange={onChange}
				readOnly={readOnly}
				showAsSwitcher
				spritemap={spritemap}
				value={value}
				visible={visible}
			/>

			{children}
		</ClayForm.Group>
	);
};

export default ValidationCheckbox;
