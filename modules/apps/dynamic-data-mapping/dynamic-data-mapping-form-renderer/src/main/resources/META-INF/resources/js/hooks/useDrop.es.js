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

import {DataConverter} from 'data-engine-taglib';
import {useDrop as useDndDrop} from 'react-dnd';

import {EVENT_TYPES} from '../actions/eventTypes.es';
import {useForm} from '../hooks/useForm.es';
import {usePage} from './usePage.es';

const defaultSpec = {
	accept: ['dataDefinitionField', 'fieldType', 'fieldset'],
};

export const DND_ORIGIN_TYPE = {
	EMPTY: 'empty',
	FIELD: 'field',
};

export const useDrop = ({
	columnIndex,
	fieldName,
	origin,
	pageIndex,
	parentField,
	rowIndex,
}) => {
	const {
		allowInvalidAvailableLocalesForProperty,
		dnd,
		editingLanguageId: testEditingLanguageId,
		fieldTypesMetadata
	} = usePage(); // TODO: change testEditingLanguageId name
	const dispatch = useForm();

	const spec = dnd ?? defaultSpec;

	const [{canDrop, overTarget}, drop] = useDndDrop({
		...spec,
		collect: (monitor) => ({
			canDrop: monitor.canDrop(),
			overTarget: monitor.isOver(),
		}),
		drop: (item, monitor) => {
			if (monitor.didDrop()) {
				return;
			}
			let dataDefinitionField;
			let label;
			switch (item.type) {
				case 'fieldType':
					dispatch({
						payload: {
							data: {
								fieldName,
								parentFieldName: parentField?.fieldName,
							},
							fieldType: {
								...fieldTypesMetadata.find(({name}) => {
									return name === item.data.name;
								}),
								editable: true,
							},
							indexes: {columnIndex, pageIndex, rowIndex},
						},
						type:
							origin === DND_ORIGIN_TYPE.EMPTY
								? EVENT_TYPES.FIELD_ADD
								: EVENT_TYPES.SECTION_ADD,
					});
					break;
				case 'dataDefinitionField':
					dataDefinitionField = item.data.getDataDefinitionField(
						item.data.name
					);
					const {editingLanguageId, fieldType, label, settingsContext} = dataDefinitionField;
					dispatch({
						payload: {
							data: {
								fieldName,
								parentFieldName: parentField?.fieldName,
							},
							fieldType: {
								...fieldTypesMetadata.find(({name}) => {
									return (
										name === fieldType
									);
								}),
								editable: true,
								label: label[editingLanguageId ?? themeDisplay.getLanguageId()],
								settingsContext,
							},
							indexes: {columnIndex, pageIndex, rowIndex},
							skipFieldNameGeneration: true,
						},
						type:
							origin === DND_ORIGIN_TYPE.EMPTY
								? EVENT_TYPES.FIELD_ADD
								: EVENT_TYPES.SECTION_ADD,
					});
					break;
				case 'fieldset':
					const {
						fieldSet,
						fieldSet: {availableLanguageIds, defaultLanguageId},
						properties,
						rows,
						useFieldName
					} = item.data;
					dispatch({
						payload: {
							availableLanguageIds,
							defaultLanguageId,
							fieldName,
							// fieldSet,
							indexes: {columnIndex, pageIndex, rowIndex},
							parentFieldName: parentField?.fieldName,
							properties,
							// rows: fieldSet.pages[0].rows,
							useFieldName,
							...DataConverter.getDataDefinitionFieldSet({
								allowInvalidAvailableLocalesForProperty,
								availableLanguageIds,
								defaultLanguageId,
								editingLanguageId: testEditingLanguageId,
								fieldSet,
								fieldTypes: fieldTypesMetadata
							}),
						},
						type: EVENT_TYPES.FIELD_SET_ADD,
					});
					break;
				default:
					break;
			}
		},
	});

	return {
		canDrop,
		drop,
		overTarget,
	};
};
