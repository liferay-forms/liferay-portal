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

export const FIELDS = [
	{
		dataType: 'string',
		fieldName: 'date',
		label: 'date',
		name: 'date',
		options: [],
		repeatable: true,
		title: 'date',
		type: 'date',
		value: 'date',
	},
	{
		dataType: 'string',
		fieldName: 'text',
		label: 'text',
		name: 'text',
		options: [],
		repeatable: true,
		title: 'text',
		type: 'text',
		value: 'text',
	},
	{
		dataType: 'string',
		fieldName: 'select',
		label: 'select',
		name: 'select',
		options: [],
		repeatable: false,
		title: 'select',
		type: 'select',
		value: 'select',
	},
	{
		dataType: 'string',
		fieldName: 'grid',
		label: 'grid',
		name: 'grid',
		options: [],
		repeatable: false,
		title: 'grid',
		type: 'grid',
		value: 'grid',
	},
	{
		dataType: 'string',
		fieldName: 'radio',
		label: 'radio',
		name: 'radio',
		options: [],
		repeatable: false,
		title: 'radio',
		type: 'radio',
		value: 'radio',
	},
	{
		dataType: 'string',
		fieldName: 'color',
		label: 'color',
		name: 'color',
		options: [],
		repeatable: false,
		title: 'color',
		type: 'color',
		value: 'color',
	},
	{
		dataType: 'string',
		fieldName: 'richText',
		label: 'richText',
		name: 'richText',
		options: [],
		repeatable: false,
		title: 'richText',
		type: 'rich_text',
		value: 'richText',
	},
	{
		dataType: 'string',
		fieldName: 'checkboxMultiple',
		label: 'checkboxMultiple',
		name: 'checkboxMultiple',
		options: [],
		repeatable: false,
		title: 'checkboxMultiple',
		type: 'checkbox_multiple',
		value: 'checkboxMultiple',
	},
	{
		dataType: 'integer',
		fieldName: 'integer',
		label: 'integer',
		name: 'integer',
		options: [],
		repeatable: false,
		title: 'integer',
		type: 'numeric',
		value: 'integer',
	},
	{
		dataType: 'double',
		fieldName: 'double',
		label: 'double',
		name: 'double',
		options: [],
		repeatable: false,
		title: 'double',
		type: 'numeric',
		value: 'double',
	},
	{
		dataType: 'document_library',
		fieldName: 'document_library',
		label: 'document_library',
		name: 'document_library',
		options: [],
		repeatable: false,
		title: 'document_library',
		type: 'document_library',
		value: 'document_library',
	},
];

export const STRING_DATATYPE_FIELDS = FIELDS.filter(
	(field) => field.dataType === 'string'
).map((field) => field.value);
export const NUMBER_TYPE_FIELDS = FIELDS.filter(
	(field) => field.type === 'numeric'
).map((field) => field.dataType);
export const UPLOAD_TYPE_FIELD = FIELDS.filter(
	(field) => field.type === 'document_library'
).map((field) => field.dataType);

export const OPERATORS_BY_TYPE = {
	number: [
		{
			label: 'Is greater than',
			name: 'greater-than',
			parameterTypes: ['number', 'number'],
			returnType: 'boolean',
		},
		{
			label: 'Is greater than or equal to',
			name: 'greater-than-equals',
			parameterTypes: ['number', 'number'],
			returnType: 'boolean',
		},
		{
			label: 'Is less than',
			name: 'less-than',
			parameterTypes: ['number', 'number'],
			returnType: 'boolean',
		},
		{
			label: 'Is less than or equal to',
			name: 'less-than-equals',
			parameterTypes: ['number', 'number'],
			returnType: 'boolean',
		},
		{
			label: 'Is equal to',
			name: 'equals-to',
			parameterTypes: ['number', 'number'],
			returnType: 'boolean',
		},
		{
			label: 'Is not equal to',
			name: 'not-equals-to',
			parameterTypes: ['number', 'number'],
			returnType: 'boolean',
		},
		{
			label: 'Is empty',
			name: 'is-empty',
			parameterTypes: ['number'],
			returnType: 'boolean',
		},
		{
			label: 'Is not empty',
			name: 'not-is-empty',
			parameterTypes: ['number'],
			returnType: 'boolean',
		},
	],
	text: [
		{
			label: 'Is equal to',
			name: 'equals-to',
			parameterTypes: ['text', 'text'],
			returnType: 'boolean',
		},
		{
			label: 'Is not equal to',
			name: 'not-equals-to',
			parameterTypes: ['text', 'text'],
			returnType: 'boolean',
		},
		{
			label: 'Contains',
			name: 'contains',
			parameterTypes: ['text', 'text'],
			returnType: 'boolean',
		},
		{
			label: 'Does not contain',
			name: 'not-contains',
			parameterTypes: ['text', 'text'],
			returnType: 'boolean',
		},
		{
			label: 'Is empty',
			name: 'is-empty',
			parameterTypes: ['text'],
			returnType: 'boolean',
		},
		{
			label: 'Is not empty',
			name: 'not-is-empty',
			parameterTypes: ['text'],
			returnType: 'boolean',
		},
	],
	user: [
		{
			label: 'Belongs to',
			name: 'belongs-to',
			parameterTypes: ['user', 'list'],
			returnType: 'boolean',
		},
	],
};
