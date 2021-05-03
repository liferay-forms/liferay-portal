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
import ClayButton from '@clayui/button';
import {usePrevious} from '@liferay/frontend-js-react-web';
import React, {useEffect, useState} from 'react';

import Text from '../Text/Text.es';
import {subWords} from '../util/strings.es';
import {getSelectedValidation, transformData} from './transform.es';

const HelpText = ({
	dataType,
	defaultLanguageId,
	editingLanguageId,
	enableHelpTextOld: initialenableHelpTextOld,
	errorMessage: initialErrorMessage,
	label,
	localizationMode,
	name,
	onChange,
	parameter: initialParameter,
	parameterMessage,
	readOnly,
	selectedValidation: initialSelectedValidation,
	spritemap,
	validations,
	value,
	visible,
}) => {
	const [
		{enableHelpTextOld, errorMessage, parameter, selectedValidation},
		setState,
	] = useState({
		enableHelpTextOld: initialenableHelpTextOld,
		errorMessage: initialErrorMessage,
		parameter: initialParameter,
		selectedValidation: initialSelectedValidation
	});

	const [enableHelpText, setEnableHelpText] = useState(false);

	// const DynamicComponent =
	// 	selectedValidation &&
	// 	selectedValidation.parameterMessage &&
	// 	dataType === 'string'
	// 		? Text
	// 		: Numeric;

	const handleChange = (key, newValue) => {
		setState((prevState) => {
			const newState = {
				...prevState,
				[key]: newValue,
			};

			let expression = {};

			if (newState.enableHelpTextOld) {
				expression = {
					name: newState.selectedValidation.name,
					// value: subWords(newState.selectedValidation.template, {
					// 	name: validation.fieldName,
					// }),
				};
			}

			onChange({
				enableHelpTextOld: newState.enableHelpTextOld,
				errorMessage: {
					...value.errorMessage,
					[editingLanguageId]: newState.errorMessage,
				},
				expression,
				parameter: {
					...value.parameter,
					[editingLanguageId]: !value.expression
						? parameterMessage
						: newState.parameter,
				},
			});

			return newState;
		});
	};

	// const transformSelectedValidation = getSelectedValidation(validations);

	const prevEditingLanguageId = usePrevious(editingLanguageId);

	useEffect(() => {
		if (prevEditingLanguageId !== editingLanguageId) {
			setState((prevState) => {
				const {errorMessage = {}, parameter = {}} = value;

				return {
					...prevState,
					errorMessage:
						errorMessage[editingLanguageId] !== undefined
							? errorMessage[editingLanguageId]
							: errorMessage[defaultLanguageId],
					parameter:
						parameter[editingLanguageId] !== undefined
							? parameter[editingLanguageId]
							: parameter[defaultLanguageId],
				};
			});
		}
	}, [defaultLanguageId, editingLanguageId, prevEditingLanguageId, value]);

	const helpText = (
	<>		
		<p>
			<kbd class="c-kbd">
				<kbd class="c-kbd c-kbd-light">9</kbd>
				<text class="c-kbd-separator"> User must enter a numeric digit (0-9)</text>
			</kbd>
		</p>
		<p>
			<kbd class="c-kbd">
				<kbd class="c-kbd c-kbd-light">0</kbd>
				<text class="c-kbd-separator"> User may enter a numeric digit (0-9)</text>
			</kbd>
		</p>
		<p>
			<kbd class="c-kbd">
				<kbd class="c-kbd c-kbd-light">ABC</kbd>
				<text class="c-kbd-separator"> Any input mask character</text>
			</kbd>
		</p>
		<p>
			<kbd class="c-kbd">
				<kbd class="c-kbd c-kbd-light">Space</kbd>
				<kbd class="c-kbd c-kbd-light">-</kbd>
				<kbd class="c-kbd c-kbd-light">/</kbd>
				<kbd class="c-kbd c-kbd-light">:</kbd>
				<kbd class="c-kbd c-kbd-light">,</kbd>
				<kbd class="c-kbd c-kbd-light">.</kbd>
				<text class="c-kbd-separator"> Separators</text>
			</kbd>
		</p>
		<p>
			<kbd class="c-kbd">
				<kbd class="c-kbd c-kbd-light">(</kbd>
				<kbd class="c-kbd c-kbd-light">)</kbd>
				<kbd class="c-kbd c-kbd-light">[</kbd>
				<kbd class="c-kbd c-kbd-light">]</kbd>
				<kbd class="c-kbd c-kbd-light">[</kbd>
				<kbd class="c-kbd c-kbd-light">]</kbd>
				<text class="c-kbd-separator"> Group separators</text>
			</kbd>
		</p>
		<p>
			<kbd class="c-kbd">
				<kbd class="c-kbd c-kbd-light">#</kbd>
				<kbd class="c-kbd c-kbd-light">$</kbd>
				<kbd class="c-kbd c-kbd-light">%</kbd>
				<kbd class="c-kbd c-kbd-light">+</kbd>
				<text class="c-kbd-separator"> Prefix and suffix symbols</text>
			</kbd>
		</p>
	</>
	);

	return (
		<ClayForm.Group className="lfr-ddm-form-field-validation">

			<ClayButton
				displayType="secondary"
				outline="false"
				disabled={readOnly}
				name="enableHelpText"
				onClick={() => setEnableHelpText(!enableHelpText)}
				type="button"
			>show more
			</ClayButton>

			{enableHelpText && helpText}

		</ClayForm.Group>
	);
};

const Main = ({
	dataType: initialDataType,
	defaultLanguageId,
	editingLanguageId,
	label,
	name,
	onChange,
	readOnly,
	spritemap,
	validation,
	validations: initialValidations,
	value = {},
	visible,
}) => {
	const data = transformData({
		defaultLanguageId,
		editingLanguageId,
		initialDataType,
		initialValidations,
		validation,
		value,
	});

	return (
		<HelpText
			{...data}
			defaultLanguageId={defaultLanguageId}
			editingLanguageId={editingLanguageId}
			label={label}
			name={name}
			onChange={(value) => onChange({}, value)}
			readOnly={readOnly}
			spritemap={spritemap}
			validation={validation}
			value={value}
			visible={visible}
		/>
	);
};

export default Main;
