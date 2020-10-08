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

import {ClayCheckbox} from '@clayui/form';
import classNames from 'classnames';
import React, {useState} from 'react';

import {FieldBase} from '../FieldBase/ReactFieldBase.es';
import {setJSONArrayValue} from '../util/setters.es';

const Switcher = ({
	checked,
	disabled,
	id,
	inline,
	invalid,
	label,
	name,
	onBlur,
	onChange,
	onFocus,
	required,
	value,
}) => (
	<div
		className={classNames('lfr-ddm-form-field-checkbox-switch', {
			'lfr-ddm-form-field-checkbox-switch-inline': inline,
		})}
	>
		<label className="simple-toggle-switch toggle-switch">
			<input
				aria-checked={checked}
				aria-errormessage={`${name}_fieldError`}
				aria-invalid={invalid}
				aria-labelledby={`${name}_${value}_fieldLabel ${name}_fieldLabel`}
				aria-required={required}
				checked={checked}
				className="toggle-switch-check"
				disabled={disabled}
				id={id}
				name={name}
				onBlur={onBlur}
				onChange={onChange}
				onFocus={onFocus}
				type="checkbox"
				value={value}
			/>
			<span aria-hidden="true" className="toggle-switch-bar">
				<span className="toggle-switch-handle"></span>
			</span>
			<span className="toggle-switch-label">{label}</span>
		</label>
	</div>
);

const CheckboxMultiple = ({
	disabled,
	inline,
	invalid,
	isSwitcher,
	name,
	onBlur,
	onChange,
	onFocus,
	options,
	predefinedValue,
	required,
	value: initialValue,
}) => {
	const [value, setValue] = useState(initialValue);

	const displayValues = value && value.length > 0 ? value : predefinedValue;
	const Toggle = isSwitcher ? Switcher : ClayCheckbox;

	const handleChange = (event) => {
		const {target} = event;
		const newValue = value.filter(
			(currentValue) => currentValue !== target.value
		);

		if (target.checked) {
			newValue.push(target.value);
		}

		setValue(newValue);
		onChange(event, newValue);
	};

	return (
		<div className="lfr-ddm-checkbox-multiple">
			{options.map((option) => (
				<>
					<Toggle
						aria-checked={displayValues.includes(option.value)}
						aria-errormessage={`${name}_fieldError`}
						aria-invalid={invalid}
						aria-labelledby={`${name}_${option.value}_fieldLabel ${name}_fieldLabel`}
						aria-required={required}
						checked={displayValues.includes(option.value)}
						disabled={disabled}
						id={`${name}_${option.value}`}
						inline={inline}
						invalid={invalid}
						key={option.value}
						label={option.label}
						name={name}
						onBlur={onBlur}
						onChange={handleChange}
						onFocus={onFocus}
						required={required}
						value={option.value}
					/>
					<span
						className="sr-only"
						id={`${name}_${option.value}_fieldLabel`}
					>
						{option.label}
					</span>
				</>
			))}
		</div>
	);
};

const Main = ({
	inline,
	name,
	options = [
		{
			label: 'Option 1',
			value: 'option1',
		},
		{
			label: 'Option 2',
			value: 'option2',
		},
	],
	onBlur,
	onChange,
	onFocus,
	predefinedValue,
	readOnly,
	showAsSwitcher = true,
	value,
	...otherProps
}) => (
	<FieldBase name={name} readOnly={readOnly} {...otherProps}>
		<CheckboxMultiple
			disabled={readOnly}
			inline={inline}
			invalid={!otherProps.valid}
			isSwitcher={showAsSwitcher}
			name={name}
			onBlur={onBlur}
			onChange={onChange}
			onFocus={onFocus}
			options={options}
			predefinedValue={setJSONArrayValue(predefinedValue)}
			required={otherProps.required}
			value={setJSONArrayValue(value)}
		/>
	</FieldBase>
);

Main.displayName = 'CheckboxMultiple';

export default Main;
