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

import Checkbox from '../Checkbox/Checkbox.es';
import Numeric from '../Numeric/Numeric.es';
import Select from '../Select/Select.es';
import Text from '../Text/Text.es';
import {subWords} from '../util/strings.es';
import {getSelectedValidation, transformData} from './transform.es';

const HelpText = ({
	dataType,
	defaultLanguageId,
	editingLanguageId,
	enableHelpText: initialEnableHelpText,
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
	validation,
	validations,
	value,
	visible,
}) => {
	const [
		{enableHelpText, errorMessage, parameter, selectedValidation},
		setState,
	] = useState({
		enableHelpText: initialEnableHelpText,
		errorMessage: initialErrorMessage,
		parameter: initialParameter,
		selectedValidation: initialSelectedValidation,
	});

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

			if (newState.enableHelpText) {
				expression = {
					name: newState.selectedValidation.name,
					// value: subWords(newState.selectedValidation.template, {
					// 	name: validation.fieldName,
					// }),
				};
			}

			onChange({
				enableHelpText: newState.enableHelpText,
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

	/* const Paragraph = ({
		name = 'Test',
		showLabel = false,
		text = 'Paragraph test',
		...otherProps
	}) => (
		<FieldBase
			{...otherProps}
			name={name}
			showLabel={showLabel}
			text={text}
		>
			<div
				className="form-group liferay-ddm-form-field-paragraph"
				data-field-name={name}
			>
				<div
					className="liferay-ddm-form-field-paragraph-text"
					dangerouslySetInnerHTML={{
						__html: text,
					}}
				/>
			</div>
		</FieldBase>
	);*/

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
			<Checkbox
				disabled={readOnly}
				label={label}
				name="enableHelpText"
				onChange={(event, value) => 
					handleChange('enableHelpText', value)
				}
				showAsSwitcher
				spritemap={spritemap}
				value={enableHelpText}
				visible={visible}
			/>

			<ClayButton
				displayType="secondary"
				outline="false"
				disabled={readOnly}
				name="enableHelpText"
				onClick={(event, value) => 
					handleChange('enableHelpText', value)
				}
				small
				title={Liferay.Language.get('remove')}
				type="button"
			>show more
			</ClayButton>

			{enableHelpText && helpText}

			{/*enableHelpText && (
				<>
					<Select
						disableEmptyOption
						label={Liferay.Language.get('if-input')}
						name="selectedValidation"
						onChange={(event, value) =>
							handleChange(
								'selectedValidation',
								transformSelectedValidation(value)
							)
						}
						options={validations}
						placeholder={Liferay.Language.get('choose-an-option')}
						readOnly={readOnly || localizationMode}
						spritemap={spritemap}
						value={[selectedValidation.name]}
						visible={visible}
					/>
					{selectedValidation.parameterMessage && (
						<DynamicComponent
							dataType={dataType}
							label={Liferay.Language.get('the-value')}
							name={`${name}_parameter`}
							onChange={(event) =>
								handleChange('parameter', event.target.value)
							}
							placeholder={selectedValidation.parameterMessage}
							readOnly={readOnly}
							required={false}
							spritemap={spritemap}
							value={parameter}
							visible={visible}
						/>
					)}
					<Text
						label={Liferay.Language.get('show-error-message')}
						name={`${name}_errorMessage`}
						onChange={(event) =>
							handleChange('errorMessage', event.target.value)
						}
						placeholder={Liferay.Language.get('show-error-message')}
						readOnly={readOnly}
						required={false}
						spritemap={spritemap}
						value={errorMessage}
						visible={visible}
					/>
				</>
					)*/}
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
