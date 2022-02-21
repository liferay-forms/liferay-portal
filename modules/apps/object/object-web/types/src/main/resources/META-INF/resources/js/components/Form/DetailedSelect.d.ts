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

/// <reference types="react" />

import './DetailedSelect.scss';
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
}: IDetailedSelectProps<T>): JSX.Element;
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
export {};
