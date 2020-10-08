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

import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import classNames from 'classnames';
import React, {forwardRef} from 'react';

const LabelOptionListItem = ({onCloseButtonClicked, option, name}) => (
	<li>
		<ClayLabel
			className="ddm-select-option-label"
			closeButtonProps={{
				'data-testid': `closeButton${option.value}`,
				onClick: (event) => {
					event.preventDefault();
					event.stopPropagation();

					onCloseButtonClicked({event, value: option.value});
				},
				'aria-labelledby': `${name}_removeLabel ${name}_${option.value}_optionLabel ${name}_fieldLabel`,
			}}
			value={option.value}
		>
			{option.label}
		</ClayLabel>
		<span id={`${name}_${option.value}_optionLabel`} className="sr-only">
			{option.label}
		</span>
	</li>
);

const OptionSelected = ({isPlaceholder, label, name}) => (
	<div
		id={`${name}_placeholderLabel`}
		className={classNames('option-selected', {
			'option-selected-placeholder': isPlaceholder,
		})}
	>
		{label}
	</div>
);

const VisibleSelectInput = forwardRef(
	(
		{
			className,
			id,
			name,
			multiple,
			onClick,
			onCloseButtonClicked,
			onKeyDown,
			options,
			readOnly,
			value,
		},
		ref
	) => {
		const triggerPlaceholder = multiple
			? Liferay.Language.get('choose-options')
			: Liferay.Language.get('choose-an-option');

		const isValueEmpty = value.length === 0;

		const selectedLabel = () => {
			if (isValueEmpty) {
				return triggerPlaceholder;
			}

			const selectedOption = options.find(
				(option) => option.value === value[0]
			);

			return selectedOption ? selectedOption.label : triggerPlaceholder;
		};

		const selectedOptionsLabelsIds = [];
		value.map(item => {
			selectedOptionsLabelsIds.push(`${name}_${item}_optionLabel`);
		});
		if (selectedOptionsLabelsIds.length > 0) {
			selectedOptionsLabelsIds.push(`${name}_selectedLabel`);
		} else {
			selectedOptionsLabelsIds.push(`${name}_placeholderLabel`);
		}

		return (
			<div
				className={classNames(
					className,
					'form-builder-select-field input-group-container'
				)}
				onClick={onClick}
				onKeyDown={onKeyDown}
				ref={ref}
			>
				<div
					className={classNames(
						'form-control results-chosen select-field-trigger',
						{
							disabled: readOnly,
							'multiple-label-list': multiple,
						}
					)}
					disabled={readOnly}
					id={id}
					tabIndex="0"
					aria-labelledby={`${selectedOptionsLabelsIds.join(' ')} ${name}_fieldLabel`}
				>
					{isValueEmpty || (value.length === 1 && !multiple) ? (
						<OptionSelected
							isPlaceholder={isValueEmpty}
							label={selectedLabel()}
							name={name}
						/>
					) : (
						value.map((item) => {
							const option = options.find(
								(option) => option.value === item
							);

							return (
								<LabelOptionListItem
									key={`${option.value}-${option.label}`}
									onCloseButtonClicked={onCloseButtonClicked}
									option={option}
									name={name}
								/>
							);
						})
					)}

					<a className="select-arrow-down-container">
						<ClayIcon symbol="caret-double" />
					</a>

				</div>

				<span id={`${name}_selectedLabel`} className="sr-only">
					{Liferay.Language.get('selected')}
				</span>

				<span id={`${name}_removeLabel`} className="sr-only">
					{Liferay.Language.get('remove')}
				</span>

			</div>
		);
	}
);

export default VisibleSelectInput;
