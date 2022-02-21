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

import ClayDropDown from '@clayui/drop-down';
import ClayForm from '@clayui/form';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import React, {useEffect, useRef, useState} from 'react';

import ErrorFeedback from './ErrorFeedback';
import RequiredMask from './RequiredMask';

import './DetailedSelect.scss';

function Select({
	active,
	children,
	error,
	label,
	onActiveChange,
	required,
	value,
}: ISelectProps) {
	const customSelectRef = useRef<HTMLDivElement>(null);
	const dropdownMenuRef = useRef(null);

	const alignElementWidth = customSelectRef.current?.clientWidth;

	return (
		<ClayForm.Group className={classNames({'has-error': error})}>
			{label && (
				<label>
					{label}

					{required && <RequiredMask />}
				</label>
			)}

			<div
				className="form-control lfr-objects__form-detailed-select"
				onClick={() => onActiveChange(!active)}
				ref={customSelectRef}
				tabIndex={0}
			>
				<span>{value ?? Liferay.Language.get('choose-an-option')}</span>

				<ClayIcon symbol="caret-double" />
			</div>

			{customSelectRef.current && (
				<ClayDropDown.Menu
					active={active}
					alignElementRef={customSelectRef}
					onSetActive={onActiveChange}
					ref={dropdownMenuRef}
					style={{
						maxWidth: 'none',
						width: `${alignElementWidth}px`,
					}}
				>
					{children}
				</ClayDropDown.Menu>
			)}

			{error && <ErrorFeedback error={error} />}
		</ClayForm.Group>
	);
}

function DetailedItem<T extends IDetailedItem>({
	onChange,
	option,
}: {
	onChange: (option: T) => void;
	option: T;
}) {
	return (
		<ClayDropDown.Item onClick={() => onChange(option)}>
			<div>{option.label}</div>

			{option.description && (
				<span className="text-small">{option.description}</span>
			)}
		</ClayDropDown.Item>
	);
}

export default function DetailedSelect<
	T extends IDetailedItem = IDetailedItem
>({
	error,
	getValue,
	label,
	name,
	onChange,
	open,
	options,
	required,
	selected,
}: IDetailedSelectProps<T>) {
	const [active, setActive] = useState<boolean>(open ?? false);

	useEffect(() => setActive(open ?? false), [open]);

	const handleChange = (option: T) => {
		setActive(false);
		onChange(option);
	};

	return (
		<Select
			active={active}
			error={error}
			label={label}
			onActiveChange={setActive}
			required={required}
			value={selected?.label}
		>
			{name && getValue ? (
				<input type="hidden" value={getValue(selected)} />
			) : null}

			{options.map((option, index) => (
				<DetailedItem<T>
					key={index}
					onChange={handleChange}
					option={option}
				/>
			))}
		</Select>
	);
}

interface IDetailedSelectProps<T> {
	error: string;
	getValue?: (selected?: T | null) => string | number | string[] | undefined;
	label?: string;
	name?: string;
	onChange: (option: T) => void;
	open?: boolean;
	options: T[];
	required?: boolean;
	selected?: T | null;
}

interface IDetailedItem {
	description?: string;
	label: string;
}
interface ISelectProps {
	active?: boolean;
	children?: React.ReactNode;
	error: string;
	label?: string;
	onActiveChange: (val: boolean) => void;
	required?: boolean;
	value?: string;
}
