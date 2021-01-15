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
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {FieldsSidebar} from '../../fields-sidebar/components/FieldsSidebar.es';
import classNames from 'classnames';
import {FormsSidebarPluginContext} from '../../../components/sidebar/MultiPanelSidebar.es';
import React, {useContext} from 'react';

const sortFieldTypes = (fieldTypes) =>
    fieldTypes.sort(({displayOrder: a}, {displayOrder: b}) => a - b);

export const FormsFieldSidebar = ({title}) => {
    const {
        activePage,
        dataProviderInstanceParameterSettingsURL,
        dataProviderInstancesURL,
        defaultLanguageId,
        dispatch,
        editingLanguageId,
        fieldTypes,
        focusedField,
        focusedCustomObjectField,
        functionsMetadata,
        functionsURL,
        pages,
        rules
    } = useContext(FormsSidebarPluginContext)

    //só ruleSetting

    const config = {
        "allowSuccessPage": false,
        "disabledProperties": [

        ],
        "ruleSettings": {
            "functionsURL": functionsURL,
            "dataProviderInstanceParameterSettingsURL": dataProviderInstanceParameterSettingsURL,
            "dataProviderInstancesURL": dataProviderInstancesURL,
            "functionsMetadata": functionsMetadata,
        },
        "unimplementedProperties": [
            "allowGuestUsers",
            "fieldNamespace",
            "readOnly",
            "visibilityExpression"
        ],
        "allowFieldSets": true,
        "allowNestedFields": false,
        "allowMultiplePages": false,
        "allowRules": true,
        "disabledTabs": [

        ]
    };

	const hasFocusedCustomObjectField = (focusedCustomObjectField) => {
		return false;
	};

	const hasFocusedField = Object.keys(focusedField).length > 0;

	const fieldTypesSorted= sortFieldTypes(
		fieldTypes.filter(({group}) => group === 'basic')
    );
//dataLayoutPages: pages.map(...),
    const dataLayout = {
        dataLayoutFields: [],
        dataLayoutPages: [],
        dataRules: rules,
        name: '',
        paginationMode: 'single-page'
    }

	return (
        <DndProvider backend={HTML5Backend} context={window}>
            <FieldsSidebar
                classNames={classNames}
                config={config}
                customFields={{}}
                dataLayout={dataLayout}
                defaultLanguageId={defaultLanguageId}
                dispatchEvent={dispatch}
                displaySettings={hasFocusedField}
                editingLanguageId={editingLanguageId}
                fieldTypes={fieldTypesSorted}
                focusedCustomObjectField={focusedCustomObjectField}
                focusedField={focusedField}
                hasFocusedCustomObjectField={hasFocusedCustomObjectField}
                onClick={() => {
                    dispatch('sidebarFieldBlurred');
                }}
                onDoubleClick={({name: fieldTypeName}) => {
                    dispatch(
                        'fieldAdded',
                        {
                            data: {
                                fieldName: '',
                                parentFieldName: '',
                            },
                            fieldType: {
                                ...fieldTypes.find(({name}) => {
                                    return name === fieldTypeName;
                                }),
                                editable: true,
                            },
                            indexes: {
                                columnIndex: 0,
                                pageIndex: activePage,
                                rowIndex: pages[activePage].rows.length,
                            },
                        }
                    );
                }}
                title={title}
            />
        </DndProvider>
	);
};

// {
//     "number": [
//         {
//             "parameterTypes": [
//                 "number",
//                 "number"
//             ],
//             "name": "greater-than",
//             "label": "Is greater than",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "number",
//                 "number"
//             ],
//             "name": "greater-than-equals",
//             "label": "Is greater than or equal to",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "number",
//                 "number"
//             ],
//             "name": "less-than",
//             "label": "Is less than",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "number",
//                 "number"
//             ],
//             "name": "less-than-equals",
//             "label": "Is less than or equal to",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "number",
//                 "number"
//             ],
//             "name": "equals-to",
//             "label": "Is equal to",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "number",
//                 "number"
//             ],
//             "name": "not-equals-to",
//             "label": "Is not equal to",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "number"
//             ],
//             "name": "is-empty",
//             "label": "Is empty",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "number"
//             ],
//             "name": "not-is-empty",
//             "label": "Is not empty",
//             "returnType": "boolean"
//         }
//     ],
//     "text": [
//         {
//             "parameterTypes": [
//                 "text",
//                 "text"
//             ],
//             "name": "equals-to",
//             "label": "Is equal to",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "text",
//                 "text"
//             ],
//             "name": "not-equals-to",
//             "label": "Is not equal to",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "text",
//                 "text"
//             ],
//             "name": "contains",
//             "label": "Contains",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "text",
//                 "text"
//             ],
//             "name": "not-contains",
//             "label": "Does not contain",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "text"
//             ],
//             "name": "is-empty",
//             "label": "Is empty",
//             "returnType": "boolean"
//         },
//         {
//             "parameterTypes": [
//                 "text"
//             ],
//             "name": "not-is-empty",
//             "label": "Is not empty",
//             "returnType": "boolean"
//         }
//     ],
//     "user": [
//         {
//             "parameterTypes": [
//                 "user",
//                 "list"
//             ],
//             "name": "belongs-to",
//             "label": "Belongs to",
//             "returnType": "boolean"
//         }
//     ]
// }
// }