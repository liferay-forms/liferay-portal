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

import { PagesVisitor } from 'dynamic-data-mapping-form-renderer';
import { normalizeDataLayout, normalizeDataLayoutRows } from './normalizers.es';

export function getDataDefinitionFieldSet({editingLanguageId, fieldSet, fieldTypes,}) {
	const dataLayoutPages = (
		fieldSet.defaultDataLayout || getDefaultDataLayout(fieldSet)
	).dataLayoutPages;

	return {
		// Converts a FieldSet from data-engine to form-builder definition
		fieldSet: getFieldSetDDMForm({
			dataDefinition: {
				availableLanguageIds,
			},
			editingLanguageId,
			fieldSet,
			fieldTypes,
		}),
		...(fieldSet.id && {
			rows: normalizeDataLayoutRows(dataLayoutPages),
		}),
	};
}

export function getDDMFormField({
	dataDefinition,
	editingLanguageId = themeDisplay.getDefaultLanguageId(),
	fieldTypes,
}) {
	const dataDefinitionField = getDataDefinitionField({field});

	if (dataDefinitionField.fieldType === 'ddm-text-html') {
		dataDefinitionField.fieldType = 'rich_text';
	}

	const settingsContext = getDDMFormFieldSettingsContext(
		dataDefinitionField,
		fieldTypes,
		editingLanguageId,
		dataDefinition.defaultLanguageId
	);

	const ddmFormField = {
		nestedFields: dataDefinitionField.nestedDataDefinitionFields,
		settingsContext,
	};
	const visitor = new PagesVisitor(settingsContext.pages);

	visitor.mapFields((field) => {
		const {fieldName} = field;
		let {value} = field;

		if (fieldName === 'options' && value) {
			value = value[editingLanguageId];
		}
		else if (fieldName === 'name') {
			ddmFormField.fieldName = value;
		}

		ddmFormField[fieldName] = value;
	});

	if (ddmFormField.nestedFields.length > 0) {
		ddmFormField.nestedFields = ddmFormField.nestedFields.map(
			() => getDDMFormField(dataDefinition)
		);
	}

	if (!ddmFormField.instanceId) {
		ddmFormField.instanceId = FieldSupport.generateInstanceId(8);
	}

	return ddmFormField;
}

/**
 * TODO: check if themeDisplay is global
 */
export function getDDMFormFieldSettingsContext(
	dataDefinitionField,
	fieldTypes,
	editingLanguageId = themeDisplay.getDefaultLanguageId(),
	defaultLanguageId = themeDisplay.getDefaultLanguageId()
) {
    const {settingsContext} = fieldTypes.find(({name}) => {
        return name === dataDefinitionField.fieldType;
    });
    const visitor = new PagesVisitor(settingsContext.pages);

    return {
        ...settingsContext,
        pages: visitor.mapFields((field) => {
            const {fieldName, localizable} = field;
            const propertyValue = _getDataDefinitionFieldPropertyValue(
                dataDefinitionField,
                _fromDDMFormToDataDefinitionPropertyName(fieldName)
            );

            let value = propertyValue || field.value;

			if (localizable && propertyValue && fieldName !== 'label') {
				value =
					propertyValue[editingLanguageId] ||
					propertyValue[defaultLanguageId];
			}

            let localizedValue = {};

            if (localizable) {
                localizedValue = {...propertyValue};
            }

            if (Object.keys(localizedValue).length == 0) {
                localizedValue = {[defaultLanguageId]: ''};
            }

            let options = field.options;

            if (
                field.type === 'select' &&
                field.fieldName === 'predefinedValue'
            ) {
                options =
                    dataDefinitionField.customProperties.options[
                        editingLanguageId
                    ];
            }

            return {
                ...field,
                localizedValue,
                options,
                value,
            };
        }),
    };
}

export function getDefaultDataLayout(dataDefinition) {
	const {dataDefinitionFields} = dataDefinition;

	return {
		dataLayoutPages: [
			{
				dataLayoutRows: dataDefinitionFields.map(({name}) => ({
					dataLayoutColumns: [
						{
							columnSize: 12,
							fieldNames: [name],
						},
					],
				})),
			},
		],
	};
}

export function getDataDefinitionField({field}) {
	const  {nestedFields, settingsContext} = field;
	const nestedDataDefinitionFields = nestedFields?.map((field) =>
		getDataDefinitionField({field})
	) ?? [];
	const fieldConfig = {
		customProperties: {},
		nestedDataDefinitionFields,
	};
	const settingsContextVisitor = new PagesVisitor(settingsContext.pages);

	settingsContextVisitor.mapFields(
		({
			dataType,
			fieldName,
			localizable,
			localizedValue = {},
			value,
		}) => {
			if (fieldName === 'predefinedValue') {
				fieldName = 'defaultValue';
			}
			else if (fieldName === 'type') {
				fieldName = 'fieldType';
			}

			if (localizable) {
				if (_isCustomProperty(fieldName)) {
					fieldConfig.customProperties[fieldName] = localizedValue;
				}
				else {
					fieldConfig[fieldName] = localizedValue;
				}
			}
			else {
				const formattedValue = _getDataDefinitionFieldFormattedValue(
					dataType,
					value
				);

				if (_isCustomProperty(fieldName)) {
					fieldConfig.customProperties[
						fieldName
					] = formattedValue;
				}
				else {
					fieldConfig[fieldName] = formattedValue;
				}
			}
		},
		false
	);

	return fieldConfig;
}

export function getFieldSetDDMForm({
	allowInvalidAvailableLocalesForProperty,
	dataDefinition,
	editingLanguageId,
	fieldSet,
	fieldTypes,
}) {
	const {defaultDataLayout, defaultLanguageId} = fieldSet;

	let newDataDefinition = {
		...fieldSet,
		availableLanguageIds: [
			...new Set([
				...dataDefinition.availableLanguageIds,
				...fieldSet.availableLanguageIds,
			]),
		],
		defaultLanguageId: fieldSet.defaultLanguageId,
	};

	if (!allowInvalidAvailableLocalesForProperty) {
		newDataDefinition = normalizeDataDefinition(
			newDataDefinition,
			defaultLanguageId
		);
	}

	const fieldSetDataLayout = normalizeDataLayout(
		defaultDataLayout,
		defaultLanguageId
	);

	return _getDDMForm({
		dataDefinition: newDataDefinition,
		dataLayout: fieldSetDataLayout,
		editingLanguageId,
		fieldTypes,
	});
}

// private

function _fromDDMFormToDataDefinitionPropertyName(propertyName) {
	const map = {
		fieldName: 'name',
		nestedFields: 'nestedDataDefinitionFields',
		predefinedValue: 'defaultValue',
		type: 'fieldType',
	};

	return map[propertyName] || propertyName;
}


function _getDataDefinitionFieldFormattedValue(dataType, value) {
	if (dataType === 'json' && typeof value !== 'string') {
		return JSON.stringify(value);
	}

	return value;
}

function _getDataDefinitionFieldPropertyValue(
	dataDefinitionField,
	propertyName
) {
	const {customProperties} = dataDefinitionField;

	if (customProperties && _isCustomProperty(propertyName)) {
		return customProperties[propertyName];
	}

	return dataDefinitionField[propertyName];
}

function _getDDMForm({
	dataDefinition,
	dataLayout = getDefaultDataLayout(dataDefinition),
	editingLanguageId,
	fieldTypes,
}) {
	const {defaultLanguageId, name} = dataDefinition;

	return {
		description: dataDefinition.description[editingLanguageId],
		id: dataDefinition.id,
		localizedDescription: dataDefinition.description,
		localizedTitle: name,
		pages: dataLayout.dataLayoutPages.map((dataLayoutPage) => ({
			rows: dataLayoutPage.dataLayoutRows.map((dataLayoutRow) => ({
				columns: dataLayoutRow.dataLayoutColumns.map(
					({columnSize, fieldNames}) => ({
						fields: fieldNames.map(() =>
							getDDMFormField({
								dataDefinition,
								editingLanguageId,
								fieldTypes,
							})
						),
						size: columnSize,
					})
				),
			})),
		})),
		title: name[editingLanguageId] || name[defaultLanguageId],
	};
}

function _isCustomProperty(name) {
	return [
		'defaultValue',
		'fieldType',
		'indexable',
		'indexType',
		'label',
		'localizable',
		'name',
		'readOnly',
		'repeatable',
		'required',
		'showLabel',
		'tip',
	].includes(name);
}
