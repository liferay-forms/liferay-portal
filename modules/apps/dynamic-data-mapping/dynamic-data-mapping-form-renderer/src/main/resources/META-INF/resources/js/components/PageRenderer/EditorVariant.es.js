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
import {useEventListener} from 'frontend-js-react-web';
import React, {useContext, useRef, useState} from 'react';

import {EVENT_TYPES} from '../../actions/eventTypes.es';
import {DND_ORIGIN_TYPE, useDrop} from '../../hooks/useDrop.es';
import {useForm} from '../../hooks/useForm.es';
import {hasFieldSet} from '../../util/fields.es';
import {Actions, ActionsControls, useActions} from '../Actions.es';
import {ParentFieldContext} from '../Field/ParentFieldContext.es';
import {Placeholder} from '../Placeholder.es';
import * as DefaultVariant from './DefaultVariant.es';

const MAX_COLUMNS = 12;

export const Column = ({
	activePage,
	allowNestedFields,
	children,
	column,
	editable,
	index: columnIndex,
	pageIndex,
	rowIndex,
	rowRef,
}) => {
	const parentField = useContext(ParentFieldContext);

	const actionsRef = useRef(null);
	const columnRef = useRef(null);

	const [resizing, setResizing] = useState(false);

	const [{activeId, hoveredId}] = useActions();

	const {drop, overTarget} = useDrop({
		columnIndex,
		fieldName: column.fields[0]?.fieldName,
		origin: DND_ORIGIN_TYPE.FIELD,
		pageIndex,
		parentField,
		rowIndex,
	});

	if (editable && column.fields.length === 0 && activePage === pageIndex) {
		return (
			<Placeholder
				columnIndex={columnIndex}
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

	const addr = {
		'data-ddm-field-column': columnIndex,
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
					dragging: resizing,
					hovered: editable && firstField.fieldName === hoveredId,
					selected: editable && firstField.fieldName === activeId,
					'target-over targetOver':
						!rootParentField.ddmStructureId && overTarget,
				})}
				column={column}
				index={columnIndex}
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

				<ResizableColumn
					{...addr}
					allowNestedFields={allowNestedFields}
					columnIndex={columnIndex}
					drop={drop}
					editable={editable}
					isFieldSelected={isFieldSelected}
					isFieldSetOrGroup={isFieldSetOrGroup}
					onResizing={(resizing) => setResizing(resizing)}
					pageIndex={pageIndex}
					rootParentField={rootParentField}
					rowIndex={rowIndex}
					rowRef={rowRef}
				>
					{column.fields.map((field, index) =>
						children({
							field,
							index,
							loc: {
								columnIndex,
								pageIndex,
								rowIndex,
							},
						})
					)}
				</ResizableColumn>
			</DefaultVariant.Column>
		</ActionsControls>
	);
};

Column.displayName = 'EditorVariant.Column';

const DIRECTIONS = {
	LEFT: 'left',
	RIGHT: 'right',
};

const ResizableColumn = ({
	allowNestedFields,
	children,
	columnIndex,
	drop,
	editable,
	isFieldSelected,
	isFieldSetOrGroup,
	onResizing,
	pageIndex,
	rootParentField,
	rowIndex,
	rowRef,
}) => {
	const {loc = []} = useContext(ParentFieldContext);

	const resizeInfo = useRef();

	const dispatch = useForm();

	const handleMouseDown = (event, direction) => {
		event.preventDefault();
		event.stopPropagation();

		onResizing(true);

		resizeInfo.current = {
			direction,
		};
	};

	const handleMouseMove = (event) => {
		if (resizeInfo.current) {
			let column = Math.floor(
				((event.clientX -
					rowRef.current?.getBoundingClientRect().left) *
					(MAX_COLUMNS * 10)) /
					rowRef.current?.clientWidth /
					10
			);

			if (column > MAX_COLUMNS - 1) {
				column = MAX_COLUMNS - 1;
			}

			if (column >= 0) {
				const {direction} = resizeInfo.current;

				dispatch({
					payload: {
						column,
						direction,
						loc: [...loc, {columnIndex, pageIndex, rowIndex}],
					},
					type: EVENT_TYPES.COLUMN_RESIZED,
				});
			}
		}
	};

	useEventListener('mousemove', handleMouseMove, false, document.body);

	useEventListener(
		'mouseup',
		() => {
			onResizing(false);
			resizeInfo.current = null;
		},
		false,
		document.body
	);

	return (
		<>
			<div
				className={classNames(
					'ddm-resize-handle ddm-resize-handle-left',
					{
						hide: !isFieldSelected || !editable,
					}
				)}
				onMouseDown={(event) => handleMouseDown(event, DIRECTIONS.LEFT)}
			/>

			<div
				className={classNames('ddm-drag', {
					'py-0': isFieldSetOrGroup,
				})}
				ref={
					allowNestedFields && !rootParentField.ddmStructureId
						? drop
						: undefined
				}
			>
				{children}
			</div>

			<div
				className={classNames(
					'ddm-resize-handle ddm-resize-handle-right',
					{
						hide: !isFieldSelected || !editable,
					}
				)}
				onMouseDown={(event) =>
					handleMouseDown(event, DIRECTIONS.RIGHT)
				}
			/>
		</>
	);
};

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
	const {canDrop, drop, overTarget} = useDrop({
		columnIndex: 0,
		origin: DND_ORIGIN_TYPE.EMPTY,
		pageIndex,
		rowIndex: 0,
	});

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

export const Row = ({children, index, row}) => {
	const rowRef = useRef(null);

	return (
		<div className="position-relative row" key={index} ref={rowRef}>
			{row.columns.map((column, index) =>
				children({column, index, rowRef})
			)}
		</div>
	);
};

Row.displayName = 'EditorVariant.Row';
