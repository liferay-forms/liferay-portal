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

import ClayButton from '@clayui/button';
import {usePrevious} from '@liferay/frontend-js-react-web';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';

import {transformData} from './transform.es';

const HelpText = ({
	defaultLanguageId,
	displayErrors,
	editingLanguageId,
	errorMessage: initialErrorMessage,
	label,
	name,
	parameter: initialParameter,
	readOnly,
	repeatable,
	required,
	selectedValidation: initialSelectedValidation,
	showLabel = true,
	style,
	tooltip,
	valid,
	value,
	visible,
}) => {
	const [{errorMessage}, setState] = useState({
		errorMessage: initialErrorMessage,
		parameter: initialParameter,
		selectedValidation: initialSelectedValidation,
	});

	const renderLabel =
		(label && showLabel) || required || tooltip || repeatable;

	const fieldDetailsId = name + '_fieldDetails';

	const [enableHelpText, setEnableHelpText] = useState(false);
	const [showHideButton, setShowHideButton] = useState('Show more');

	const hasError = displayErrors && errorMessage && !valid;

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
		<div className="lfr-ddm-help-text-content">
			<div className="lfr-ddm-help-text-line">
				<kbd className="c-kbd">
					<kbd className="c-kbd c-kbd-light">9</kbd>
					<span className="c-kbd-separator"> </span>
					<span className="c-kbd-separator">
						{' '}
						{Liferay.Language.get(
							'user-must-enter-a-numeric-digit'
						)}
					</span>
				</kbd>
			</div>
			<div className="lfr-ddm-help-text-line">
				<kbd className="c-kbd">
					<kbd className="c-kbd c-kbd-light">0</kbd>
					<span className="c-kbd-separator"> </span>
					<span className="c-kbd-separator">
						{' '}
						{Liferay.Language.get('user-may-enter-a-numeric-digit')}
					</span>
				</kbd>
			</div>
			<div className="lfr-ddm-help-text-line">
				<kbd className="c-kbd">
					<kbd className="c-kbd c-kbd-light">ABC</kbd>
					<span className="c-kbd-separator"> </span>
					<span className="c-kbd-separator">
						{' '}
						{Liferay.Language.get('any-input-mask-character')}
					</span>
				</kbd>
			</div>
			<div className="lfr-ddm-help-text-line">
				<kbd className="c-kbd">
					<kbd className="c-kbd c-kbd-light">Space</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">-</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">/</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">:</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">,</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">.</kbd>
					<span className="c-kbd-separator"> </span>
					<span className="c-kbd-separator">
						{' '}
						{Liferay.Language.get('separators')}
					</span>
				</kbd>
			</div>
			<div className="lfr-ddm-help-text-line">
				<kbd className="c-kbd">
					<kbd className="c-kbd c-kbd-light">(</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">)</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">[</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">]</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">&#x7B;</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">&#x7D;</kbd>
					<span className="c-kbd-separator"> </span>
					<span className="c-kbd-separator">
						{' '}
						{Liferay.Language.get('group-separators')}
					</span>
				</kbd>
			</div>
			<div className="lfr-ddm-help-text-line">
				<kbd className="c-kbd">
					<kbd className="c-kbd c-kbd-light">#</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">$</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">%</kbd>
					<span className="c-kbd-separator"> </span>
					<kbd className="c-kbd c-kbd-light">+</kbd>
					<span className="c-kbd-separator"> </span>
					<span className="c-kbd-separator">
						{' '}
						{Liferay.Language.get('prefix-and-suffix-symbols')}
					</span>
				</kbd>
			</div>
		</div>
	);

	return (
		<div
			aria-labelledby={!renderLabel ? fieldDetailsId : null}
			className={classNames('form-group', {
				'has-error': hasError,
				hide: !visible,
			})}
			data-field-name={name}
			style={style}
			tabIndex={!renderLabel ? 0 : null}
		>
			<div className="lfr-ddm-help-text-flex-container">
				<div className="lfr-ddm-help-text-flex-element">
					{renderLabel && (
						<>
							<label
								aria-describedby={fieldDetailsId}
								className={classNames(
									'lfr-ddm-help-text-label'
								)}
								tabIndex="0"
							>
								{label && showLabel && label}
							</label>
						</>
					)}
				</div>
				<div className="lfr-ddm-help-text-flex-element">
					<ClayButton
						borderless={true}
						className="lfr-ddm-help-text-button"
						disabled={readOnly}
						displayType="secondary"
						name="enableHelpText"
						onClick={() => {
							setEnableHelpText(!enableHelpText),
								setShowHideButton(
									!enableHelpText ? 'Show less' : 'Show more'
								);
						}}
						type="button"
					>
						{showHideButton}
					</ClayButton>
				</div>
			</div>

			{enableHelpText && helpText}
		</div>
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
	value = {},
	visible,
}) => {
	const data = transformData({
		defaultLanguageId,
		editingLanguageId,
		initialDataType,
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
			value={value}
			visible={visible}
		/>
	);
};

export default Main;
