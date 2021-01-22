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

import {useDrop as useDndDrop} from 'react-dnd';

import {usePage} from './usePage.es';

// TODO - IMPORT FROM DATA-ENGINE-TAGLIB

export const DRAG_FIELD_TYPE = 'fieldType';
export const DRAG_FIELDSET = 'fieldset';
export const DRAG_DATA_DEFINITION_FIELD = 'dataDefinitionField';

const defaultSpec = {
	accept: [DRAG_FIELD_TYPE, DRAG_FIELDSET, DRAG_DATA_DEFINITION_FIELD],
};

export const DND_ORIGIN_TYPE = {
	EMPTY: 'empty',
	FIELD: 'field',
};

export const useDrop = (sourceItem, onDrop) => {
	const {dnd} = usePage();
	const spec = dnd ?? defaultSpec;

	const [{canDrop, overTarget}, drop] = useDndDrop({
		...spec,
		collect: (monitor) => ({
			canDrop: monitor.canDrop(),
			overTarget: monitor.isOver({shallow: true}),
		}),
		drop: (item, monitor) => {
			if (!item || !item.data || monitor.didDrop()) {
				return;
			}

			if (onDrop) {
				return onDrop({item, monitor, sourceItem});
			}

			throw new Error('onDrop callback is not defined');
		},
	});

	return {
		canDrop,
		drop,
		overTarget,
	};
};
