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

import './FieldBase.scss';

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import {ClayTooltipProvider} from '@clayui/tooltip';
import classNames from 'classnames';
import {
	EVENT_TYPES,
	Layout,
	getRepeatedIndex,
	useForm,
	usePage,
} from 'dynamic-data-mapping-form-renderer';
import moment from 'moment';
import React, {useMemo} from 'react';

const convertInputValue = (fieldType, value) => {
	if (fieldType === 'date') {
		const date = moment(value).toDate();

		if (moment(date).isValid()) {
			return moment(date).format('YYYY-MM-DD');
		}
	}
	else if (
		fieldType === 'document_library' ||
		fieldType === 'grid' ||
		fieldType === 'image'
	) {
		if (Object.keys(value).length === 0) {
			return '';
		}

		return JSON.stringify(value);
	}

	return value;
};

const getDefaultRows = (nestedFields) => {
	return nestedFields.map((nestedField) => {
		return {
			columns: [
				{
					fields: [nestedField],
					size: 12,
				},
			],
		};
	});
};

const FieldProperties = ({required, requiredLabelId, tooltip}) => {
	return (
		<>
			{required && (
				<span className="reference-mark">
					<ClayIcon symbol="asterisk" />
				</span>
			)}

			{required && (
				<span className="sr-only" id={requiredLabelId}>
					{Liferay.Language.get('required')}
				</span>
			)}

			{tooltip && (
				<span className="ddm-tooltip">
					<ClayIcon
						data-tooltip-align="right"
						symbol="question-circle-full"
						title={tooltip}
					/>
				</span>
			)}
		</>
	);
};

function FieldBase({
	children,
	displayErrors,
	errorMessage,
	label,
	localizedValue = {},
	name,
	nestedFields,
	onClick,
	readOnly,
	repeatable,
	required,
	showLabel = true,
	style,
	tip,
	tooltip,
	type,
	valid,
	visible,
	addLabelsIds = [],
}) {
	const {editingLanguageId = themeDisplay.getLanguageId()} = usePage();
	const dispatch = useForm();
	const hasError = displayErrors && errorMessage && !valid;
	const localizedValueArray = useMemo(() => {
		const languageValues = [];

		if (!localizedValue) {
			return languageValues;
		}

		Object.keys(localizedValue).forEach((key) => {
			if (key !== editingLanguageId && localizedValue[key] !== '') {
				languageValues.push({
					name: name.replace(editingLanguageId, key),
					value: localizedValue[key],
				});
			}
		});

		return languageValues;
	}, [localizedValue, editingLanguageId, name]);

	const renderLabel =
		(label && showLabel) || required || tooltip || repeatable;

	const repeatedIndex = useMemo(() => getRepeatedIndex(name), [name]);

	const showLegend =
		type &&
		(type === 'checkbox_multiple' ||
			type === 'grid' ||
			type === 'paragraph' ||
			type === 'separator' ||
			type === 'radio');

	const fieldDetailsId = `${name}_fieldLabel`;
	const labelHiddenId = `${name}_fieldOnlyLabel`;
	const requiredLabelId = `${name}_fieldRequired`;
	const tipId = `${name}_fieldTip`;
	const errorMessageId = `${name}_fieldError`;

	const fieldDetailsIds = [];

	if (renderLabel) {
		fieldDetailsIds.push(labelHiddenId);
	}
	if (required) {
		fieldDetailsIds.push(requiredLabelId);
	}
	if (tip) {
		fieldDetailsIds.push(tipId);
	}
	if (hasError) {
		fieldDetailsIds.push(errorMessageId);
	}

	const joinFieldDetailsIds = fieldDetailsIds.join(' ');
	const joinAddLabelsIds = addLabelsIds.length
		? ` ${addLabelsIds.join(' ')}`
		: '';

	let parentDivTabIndex;

	if (!renderLabel) {
		parentDivTabIndex = 0;
	}

	return (
		<ClayTooltipProvider>
			<div
				className={classNames('form-group', {
					'has-error': hasError,
					hide: !visible,
				})}
				data-field-name={name}
				onClick={onClick}
				style={style}
				tabIndex={parentDivTabIndex}
			>
				{repeatable && (
					<div className="lfr-ddm-form-field-repeatable-toolbar">
						{repeatable && repeatedIndex > 0 && (
							<ClayButton
								aria-labelledby={`${name}removeDuplicateLabel ${name}_fieldOnlyLabel`}
								className="ddm-form-field-repeatable-delete-button p-0"
								disabled={readOnly}
								onClick={() =>
									dispatch({
										payload: name,
										type: EVENT_TYPES.FIELD_REMOVED,
									})
								}
								small
								title={Liferay.Language.get('remove')}
								type="button"
							>
								<ClayIcon symbol="hr" />
								<span
									className="sr-only"
									id={`${name}removeDuplicateLabel`}
								>
									{`${Liferay.Language.get(
										'remove'
									)} ${Liferay.Language.get(
										'duplicate'
									)} ${Liferay.Language.get('field')}`}
								</span>
							</ClayButton>
						)}

						<ClayButton
							aria-labelledby={`${name}addDuplicateLabel ${name}_fieldOnlyLabel`}
							className="ddm-form-field-repeatable-add-button p-0"
							disabled={readOnly}
							onClick={() =>
								dispatch({
									payload: name,
									type: EVENT_TYPES.FIELD_REPEATED,
								})
							}
							small
							title={Liferay.Language.get('duplicate')}
							type="button"
						>
							<ClayIcon symbol="plus" />
							<span
								className="sr-only"
								id={`${name}addDuplicateLabel`}
							>
								{`${Liferay.Language.get(
									'duplicate'
								)} ${Liferay.Language.get('field')}`}
							</span>
						</ClayButton>
					</div>
				)}

				{renderLabel && (
					<>
						{showLegend ? (
							<fieldset>
								<legend
									aria-labelledby={`${joinFieldDetailsIds}${joinAddLabelsIds}`}
									className="lfr-ddm-legend"
									id={fieldDetailsId}
									tabIndex="0"
								>
									{label && showLabel && label}

									<FieldProperties
										required={required}
										requiredLabelId={requiredLabelId}
										tooltip={tooltip}
									/>
								</legend>
								{children}
							</fieldset>
						) : (
							<>
								<label
									aria-labelledby={`${joinFieldDetailsIds}${joinAddLabelsIds}`}
									className={classNames({
										'ddm-empty': !showLabel && !required,
										'ddm-label': showLabel || required,
									})}
									id={fieldDetailsId}
									tabIndex="0"
								>
									{label && showLabel && label}

									<FieldProperties
										required={required}
										requiredLabelId={requiredLabelId}
										tooltip={tooltip}
									/>
								</label>
								{children}
							</>
						)}
					</>
				)}

				{!renderLabel && children}

				{localizedValueArray.length > 0 &&
					localizedValueArray.map((language) => (
						<input
							key={language.name}
							name={language.name}
							type="hidden"
							value={
								language.value
									? convertInputValue(type, language.value)
									: ''
							}
						/>
					))}

				{renderLabel && (
					<span className="sr-only" id={labelHiddenId}>
						{label && showLabel && label}
					</span>
				)}

				{tip && (
					<span className="form-text" id={tipId}>
						{tip}
					</span>
				)}

				{hasError && (
					<span className="form-feedback-group" id={errorMessageId}>
						<span className="form-feedback-item" role="alert">
							{errorMessage}
						</span>
					</span>
				)}

				{nestedFields && <Layout rows={getDefaultRows(nestedFields)} />}
			</div>
		</ClayTooltipProvider>
	);
}

export {FieldBase};
