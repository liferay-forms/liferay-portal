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

import './VisibleSelectInput.scss';

import ClayLabel from '@clayui/label';
import classNames from 'classnames';
import React, {forwardRef} from 'react';

const LabelOptionListItem = ({onCloseButtonClicked, option, readOnly}) => (
	<li>
		<ClayLabel
			className="ddm-select-option-label"
			closeButtonProps={{
				'data-testid': `closeButton${option.value}`,
				'onClick': (event) => {
					event.preventDefault();
					event.stopPropagation();

					onCloseButtonClicked({event, value: option.value});
				},
			}}
			value={option.value}
			withClose={!readOnly}
		>
			{option.label}
		</ClayLabel>
	</li>
);

const OptionSelected = ({isPlaceholder, label}) => (
	<span
		className={classNames('option-selected', {
			'option-selected-placeholder': isPlaceholder,
		})}
	>
		{label}
	</span>
);

const VisibleSelectInput = forwardRef(
	(
		{
			className,
			fieldDetailsId,
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

		const isValueEmpty = !value.length;

		const selectedLabel = () => {
			if (isValueEmpty) {
				return triggerPlaceholder;
			}

			const selectedOption = options.find(
				(option) => option.value === value[0]
			);

			return selectedOption ? selectedOption.label : triggerPlaceholder;
		};

		return (
			<div
				className={classNames(
					className,
					'form-builder-select-field input-group-container',
					'lfr__ddm-select-input-trigger'
				)}
				onClick={onClick}
				onKeyDown={onKeyDown}
				ref={ref}
			>
				<button
					aria-haspopup="listbox"
					className={classNames(
						'form-control form-control-select results-chosen select-field-trigger',
						{
							'disabled': readOnly,
							'multiple-label-list': multiple,
						}
					)}
					disabled={readOnly}
					id={fieldDetailsId}
					type="button"
				>
					{isValueEmpty || (value.length === 1 && !multiple) ? (
						<OptionSelected
							isPlaceholder={isValueEmpty}
							label={selectedLabel()}
						/>
					) : (
						<>
							{value.map((item) => {
								const option = options.find(
									(option) => option.value === item
								);

								return (
									<>
										{option && (
											<LabelOptionListItem
												key={`${option.value}-${option.label}`}
												onCloseButtonClicked={
													onCloseButtonClicked
												}
												option={option}
												readOnly={readOnly}
											/>
										)}
									</>
								);
							})}
						</>
					)}
				</button>
			</div>
		);
	}
);

export default VisibleSelectInput;
