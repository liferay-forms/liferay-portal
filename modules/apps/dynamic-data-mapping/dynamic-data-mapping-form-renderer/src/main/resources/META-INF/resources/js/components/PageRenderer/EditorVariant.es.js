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

import ClayLayout from '@clayui/layout';
import classNames from 'classnames';
import React, {useContext, useRef} from 'react';

import {EVENT_TYPES} from '../../actions/eventTypes.es';
import {useDrag} from '../../hooks/useDrag.es';
import {DND_ORIGIN_TYPE, useDrop} from '../../hooks/useDrop.es';
import {useForm} from '../../hooks/useForm.es';
import {hasFieldSet} from '../../util/fields.es';
import {Actions, ActionsControls, useActions} from '../Actions.es';
import {ParentFieldContext} from '../Field/ParentFieldContext.es';
import {Placeholder} from '../Placeholder.es';
import * as DefaultVariant from './DefaultVariant.es';

const DRAG_FIELD_TYPE = 'fieldType';

export const Column = ({
	activePage,
	allowNestedFields,
	children,
	column,
	editable,
	index,
	pageIndex,
	rowIndex,
}) => {
	const ref = useRef(null);

	const parentField = useContext(ParentFieldContext);

	const actionsRef = useRef(null);
	const columnRef = useRef(null);

	const [{activeId, hoveredId}] = useActions();

	const dispatch = useForm();

	const handleDrop = ({item, monitor, sourceItem}) => {
		Boolean(allowNestedFields);

		// if (allowNestedFields && !rootParentField.ddmStructureId) {
		// 	return;
		// }

		// source vem do item
		// target vem do destructuring do useDrop

		// Used by DataLayoutBuilder's Sidebar for handling drop action
		// typeof item.pageIndex !== 'number' because this value differs from the item gave by useDrag's Sidebar

		// if (
		// 	item.type === DRAG_FIELD_TYPE &&
		// 	typeof item.pageIndex !== 'number'
		// ) {
		// 	dispatch({
		// 		payload: {item, monitor, sourceItem},
		// 		type: EVENT_TYPES.FIELD_DROP,
		// 	});
		// }
		
		dispatch({
			payload: {
				sourceFieldName: item.data.fieldName,
				sourceFieldPage: item.pageIndex,
				targetFieldName: sourceItem.fieldName,
				targetIndexes: {
					columnIndex: sourceItem.columnIndex,
					pageIndex: sourceItem.pageIndex,
					rowIndex: sourceItem.rowIndex,
				},
				targetParentFieldName: sourceItem.parentField.fieldName,
			},
			type: EVENT_TYPES.FIELD_MOVED,
		});
	};

	if (editable && column.fields.length === 0 && activePage === pageIndex) {
		return (
			<Placeholder
				columnIndex={index}
				pageIndex={pageIndex}
				rowIndex={rowIndex}
				size={column.size}
			/>
		);
	}

	const firstField = column.fields[0];
	const rootParentField = parentField.root ?? firstField;
	const isFieldSetOrGroup = firstField.type === 'fieldset';
	const isFieldSet = hasFieldSet(firstField);
	const isFieldSelected =
		firstField.fieldName === activeId || firstField.fieldName === hoveredId;

	const {canDrop, drop, overTarget} = useDrop(
		{
			columnIndex: index,
			fieldName: firstField.fieldName,
			origin: DND_ORIGIN_TYPE.FIELD,
			pageIndex,
			parentField,
			rowIndex,
		},
		handleDrop
	);

	const {drag} = useDrag({
		item: firstField,
		pageIndex,
		type: DRAG_FIELD_TYPE,
	});

	const addr = {
		'data-ddm-field-column': index,
		'data-ddm-field-page': pageIndex,
		'data-ddm-field-row': rowIndex,
	};

	const fieldId =
		!editable && hasFieldSet(parentField.root)
			? parentField.root.fieldName
			: firstField.fieldName;

	return (
		<ActionsControls
			actionsRef={actionsRef}
			activePage={pageIndex}
			columnRef={columnRef}
			fieldId={fieldId}
		>
			<DefaultVariant.Column
				className={classNames({
					'active-drop-child':
						isFieldSetOrGroup &&
						overTarget &&
						!rootParentField.ddmStructureId,
					hovered: editable && firstField.fieldName === hoveredId,
					selected: editable && firstField.fieldName === activeId,
					'target-droppable': canDrop,
					'target-over targetOver':
						!rootParentField.ddmStructureId && overTarget,
				})}
				column={column}
				index={index}
				pageIndex={pageIndex}
				ref={columnRef}
				rowIndex={rowIndex}
			>
				{editable && isFieldSelected && (
					<Actions
						activePage={pageIndex}
						fieldId={firstField.fieldName}
						fieldType={firstField.type}
						isFieldSet={isFieldSet}
						ref={actionsRef}
					/>
				)}

				<div
					className={classNames(
						'ddm-resize-handle ddm-resize-handle-left',
						{
							hide: !isFieldSelected || !editable,
						}
					)}
					{...addr}
				/>

				<div
					className={classNames('ddm-drag', {
						'py-0': isFieldSetOrGroup,
					})}
					ref={drag(drop(ref))}
				>
					{column.fields.map((field, index) =>
						children({field, index})
					)}
				</div>

				<div
					className={classNames(
						'ddm-resize-handle ddm-resize-handle-right',
						{
							hide: !isFieldSelected || !editable,
						}
					)}
					{...addr}
				/>
			</DefaultVariant.Column>
		</ActionsControls>
	);
};

Column.displayName = 'EditorVariant.Column';

export const Page = ({
	activePage,
	children,
	editable,
	empty,
	forceAriaUpdate,
	header,
	invalidFormMessage,
	pageIndex,
}) => {
	const dispatch = useForm();

	const handleDrop = ({item, monitor, sourceItem}) => {

		// if (allowNestedFields && !rootParentField.ddmStructureId) {
		// 	return;
		// }

		// source vem do item
		// target vem do destructuring do useDrop

		// Used by DataLayoutBuilder's Sidebar for handling drop action
		// typeof item.pageIndex !== 'number' because this value differs from the item gave by useDrag's Sidebar

		// if (
		// 	item.type === DRAG_FIELD_TYPE &&
		// 	typeof item.pageIndex !== 'number'
		// ) {
		// 	dispatch({
		// 		payload: {item, monitor, sourceItem},
		// 		type: EVENT_TYPES.FIELD_DROP,
		// 	});
		// }
		
		dispatch({
			payload: {
				sourceFieldName: item.data.fieldName,
				sourceFieldPage: item.pageIndex,
				targetFieldName: sourceItem.fieldName,
				targetIndexes: {
					columnIndex: sourceItem.columnIndex,
					pageIndex: sourceItem.pageIndex,
					rowIndex: sourceItem.rowIndex,
				},
				targetParentFieldName: sourceItem.parentField.fieldName,
			},
			type: EVENT_TYPES.FIELD_MOVED,
		});
	};

	const {canDrop, drop, overTarget} = useDrop(
		{
			columnIndex: 0,
			origin: DND_ORIGIN_TYPE.EMPTY,
			pageIndex,
			rowIndex: 0,
		},
		handleDrop
	);

	return (
		<DefaultVariant.Page
			activePage={activePage}
			forceAriaUpdate={forceAriaUpdate}
			header={header}
			invalidFormMessage={invalidFormMessage}
			pageIndex={pageIndex}
		>
			{editable && empty ? (
				<ClayLayout.Row>
					<ClayLayout.Col
						className="col-ddm col-empty last-col lfr-initial-col mb-4 mt-5"
						data-ddm-field-column="0"
						data-ddm-field-page={pageIndex}
						data-ddm-field-row="0"
					>
						<div
							className={classNames('ddm-empty-page ddm-target', {
								'target-droppable': canDrop,
								'target-over targetOver': overTarget,
							})}
							ref={drop}
						>
							<p className="ddm-empty-page-message">
								{Liferay.Language.get(
									'drag-fields-from-the-sidebar-to-compose-your-form'
								)}
							</p>
						</div>
					</ClayLayout.Col>
				</ClayLayout.Row>
			) : (
				children
			)}
		</DefaultVariant.Page>
	);
};

Page.displayName = 'EditorVariant.Page';

export const Rows = ({children, editable, pageIndex, rows}) => {
	if (!rows) {
		return null;
	}

	return rows.map((row, index) => (
		<div key={index}>
			{editable && index === 0 && (
				<Placeholder
					isRow
					pageIndex={pageIndex}
					rowIndex={0}
					size={12}
				/>
			)}

			{children({index, row})}

			{editable && (
				<Placeholder
					isRow
					pageIndex={pageIndex}
					rowIndex={index + 1}
					size={12}
				/>
			)}
		</div>
	));
};

Rows.displayName = 'EditorVariant.Rows';
