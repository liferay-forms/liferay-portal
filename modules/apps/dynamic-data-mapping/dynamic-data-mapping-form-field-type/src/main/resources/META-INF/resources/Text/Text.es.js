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

import ClayAutocomplete from '@clayui/autocomplete';
import ClayDropDown from '@clayui/drop-down';
import {ClayInput} from '@clayui/form';
import {normalizeFieldName} from 'data-engine-js-components-web';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {FieldBase} from '../FieldBase/ReactFieldBase.es';
import withConfirmationField from '../util/withConfirmationField.es';

const Text = ({
	defaultLanguageId,
	disabled,
	fieldName,
	id,
	locale,
	localizable,
	localizedValue,
	name,
	onBlur,
	onChange,
	onFocus,
	placeholder,
	shouldUpdateValue,
	value: initialValue,
}) => {
	const inputRef = useRef(null);

	const memoValue = useMemo(() => {
		return localizable
			? localizedValue[locale] ?? localizedValue[defaultLanguageId]
			: initialValue;
	}, [defaultLanguageId, locale, localizable, localizedValue, initialValue]);
	const [value, setValue] = useState(memoValue);

	return (
		<ClayInput
			aria-labelledby={id}
			className="ddm-field-text"
			dir={Liferay.Language.direction[locale]}
			disabled={disabled}
			id={id}
			lang={locale}
			name={name}
			onBlur={(event) => {
				if (shouldUpdateValue) {
					onChange({target: {value}});
				}
				onBlur(event);
			}}
			onChange={(event) => {
				const {value} = event.target;

				if (fieldName === 'fieldReference' || fieldName === 'name') {
					event.target.value = normalizeFieldName(value);
				}
				else if (fieldName === 'inputMaskFormat') {
					event.target.value = value.replace(/[1-8]/g, '');
				}
				if (shouldUpdateValue) {
					onChange(event);
				}
				else {
					setValue(event.target.value);
				}
			}}
			onFocus={onFocus}
			placeholder={placeholder}
			ref={inputRef}
			type="text"
			value={value}
		/>
	);
};

const Textarea = ({
	disabled,
	id,
	locale,
	name,
	onBlur,
	onChange,
	onFocus,
	placeholder,
	value,
}) => {
	return (
		<textarea
			aria-labelledby={id}
			className="ddm-field-text form-control"
			dir={Liferay.Language.direction[locale]}
			disabled={disabled}
			id={id}
			lang={locale}
			name={name}
			onBlur={onBlur}
			onChange={(event) => {
				onChange(event);
			}}
			onFocus={onFocus}
			placeholder={placeholder}
			style={disabled ? {resize: 'none'} : null}
			type="text"
			value={value}
		/>
	);
};

const Autocomplete = ({
	disabled,
	id,
	locale,
	name,
	onBlur,
	onChange,
	onFocus,
	options,
	placeholder,
	value,
}) => {
	const [selectedItem, setSelectedItem] = useState(false);
	const [visible, setVisible] = useState(false);
	const inputRef = useRef(null);
	const itemListRef = useRef(null);

	const escapeChars = (string) =>
		string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

	const filteredItems = options.filter(
		(item) => item && item.match(escapeChars(value))
	);

	const isValidItem = useCallback(() => {
		return (
			!selectedItem &&
			filteredItems.length > 1 &&
			!filteredItems.includes(value)
		);
	}, [filteredItems, selectedItem, value]);

	useEffect(() => {
		const ddmPageContainerLayout = inputRef.current.closest(
			'.ddm-page-container-layout'
		);

		if (
			!isValidItem() &&
			ddmPageContainerLayout &&
			ddmPageContainerLayout.classList.contains('hide')
		) {
			setVisible(false);
		}
	}, [filteredItems, isValidItem, value, selectedItem]);

	const handleFocus = (event, direction) => {
		const target = event.target;
		const focusabledElements = event.currentTarget.querySelectorAll(
			'button'
		);
		const targetIndex = [...focusabledElements].findIndex(
			(current) => current === target
		);

		let nextElement;

		if (direction) {
			nextElement = focusabledElements[targetIndex - 1];
		}
		else {
			nextElement = focusabledElements[targetIndex + 1];
		}

		if (nextElement) {
			event.preventDefault();
			event.stopPropagation();
			nextElement.focus();
		}
		else if (targetIndex === 0 && direction) {
			event.preventDefault();
			event.stopPropagation();
			inputRef.current.focus();
		}
	};

	return (
		<ClayAutocomplete>
			<ClayAutocomplete.Input
				aria-labelledby={id}
				dir={Liferay.Language.direction[locale]}
				disabled={disabled}
				id={id}
				lang={locale}
				name={name}
				onBlur={onBlur}
				onChange={(event) => {
					setVisible(!!event.target.value);
					setSelectedItem(false);
					onChange(event);
				}}
				onFocus={(event) => {
					if (isValidItem() && event.target.value) {
						setVisible(true);
					}

					onFocus(event);
				}}
				onKeyDown={(event) => {
					if (
						(event.key === 'Tab' || event.key === 'ArrowDown') &&
						!event.shiftKey &&
						filteredItems.length > 0 &&
						visible
					) {
						event.preventDefault();
						event.stopPropagation();

						const firstElement = itemListRef.current.querySelector(
							'button'
						);
						firstElement.focus();
					}
				}}
				placeholder={placeholder}
				ref={inputRef}
				value={value}
			/>

			<ClayAutocomplete.DropDown
				active={visible && !disabled}
				onSetActive={setVisible}
			>
				<ul
					className="list-unstyled"
					onKeyDown={(event) => {
						switch (event.key) {
							case 'ArrowDown':
								handleFocus(event, false);
								break;
							case 'ArrowUp':
								handleFocus(event, true);
								break;
							case 'Tab':
								handleFocus(event, event.shiftKey);
								break;
							default:
								break;
						}
					}}
					ref={itemListRef}
				>
					{filteredItems.length === 0 && (
						<ClayDropDown.Item className="disabled">
							{Liferay.Language.get('no-results-were-found')}
						</ClayDropDown.Item>
					)}
					{filteredItems.map((label, index) => (
						<ClayAutocomplete.Item
							key={index}
							match={value}
							onClick={() => {
								setVisible(false);
								setSelectedItem(true);
								onChange({target: {value: label}});
							}}
							value={label}
						/>
					))}
				</ul>
			</ClayAutocomplete.DropDown>
		</ClayAutocomplete>
	);
};

const DISPLAY_STYLE = {
	autocomplete: Autocomplete,
	multiline: Textarea,
	singleline: Text,
};

const Main = ({
	autocomplete,
	autocompleteEnabled,
	defaultLanguageId,
	displayStyle = 'singleline',
	locale,
	fieldName,
	id,
	localizable,
	localizedValue = {},
	name,
	onBlur,
	onChange,
	onFocus,
	options = [],
	placeholder,
	predefinedValue = '',
	readOnly,
	shouldUpdateValue = false,
	value,
	...otherProps
}) => {
	const optionsMemo = useMemo(() => options.map((option) => option.label), [
		options,
	]);
	const Component =
		DISPLAY_STYLE[
			autocomplete || autocompleteEnabled ? 'autocomplete' : displayStyle
		];

	const fieldDetailsId = id ? id + '_fieldDetails' : name + '_fieldDetails';

	return (
		<FieldBase
			{...otherProps}
			fieldName={fieldName}
			id={id}
			localizedValue={localizedValue}
			name={name}
			readOnly={readOnly}
		>
			<Component
				defaultLanguageId={defaultLanguageId}
				disabled={readOnly}
				fieldName={fieldName}
				id={fieldDetailsId}
				locale={locale}
				localizable={localizable}
				localizedValue={localizedValue}
				name={name}
				onBlur={onBlur}
				onChange={onChange}
				onFocus={onFocus}
				options={optionsMemo}
				placeholder={placeholder}
				shouldUpdateValue={shouldUpdateValue}
				value={value ? value : predefinedValue}
			/>
		</FieldBase>
	);
};

Main.displayName = 'Text';

export default withConfirmationField(Main);
