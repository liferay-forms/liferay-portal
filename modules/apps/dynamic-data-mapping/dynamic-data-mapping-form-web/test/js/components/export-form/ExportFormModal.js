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

import {act, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ExportFormModal} from 'dynamic-data-mapping-form-web/admin/js/components/export-form/openExportFormModal.es';
import React from 'react';

import '@testing-library/jest-dom/extend-expect';

const props = {
	csvExport: 'enabled-with-warning',
	exportFormInstanceURL: 'https://liferay.com/admin/export_form_instance',
	fileExtensions: {
		csv: 'CSV',
		json: 'JSON',
		xls: 'XLS',
		xml: 'XML',
	},
	portletNamespace: 'portletNamespace_',
	spritemap: 'spritemap',
};

describe('ExportFormModal', () => {
	beforeAll(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.restoreAllMocks();
	});

	it('renders', () => {
		render(<ExportFormModal {...props} />);

		act(() => {
			jest.runAllTimers();
		});

		expect(screen.getByText('cancel')).toBeInTheDocument();
		expect(screen.getByText('export')).toBeInTheDocument();
		expect(screen.getByText('ok')).toBeInTheDocument();
		expect(
			screen.getByText(
				'the-export-includes-data-from-all-fields-and-form-versions'
			)
		).toBeInTheDocument();
		expect(
			screen.getByText('timezone-warning-message')
		).toBeInTheDocument();
	});

	it('closes modal when clicking the cancel button', () => {
		render(<ExportFormModal {...props} />);

		act(() => {
			jest.runAllTimers();
		});

		userEvent.click(screen.getByText('cancel'));

		act(() => {
			jest.runAllTimers();
		});

		expect(screen.queryByText('export')).not.toBeInTheDocument();
	});

	it('changes warning message when changing file extension', () => {
		render(<ExportFormModal {...props} />);

		act(() => {
			jest.runAllTimers();
		});

		const fileExtension = screen.getByLabelText('file-extension');

		expect(fileExtension).toHaveValue('csv');
		expect(screen.getByText('csv-warning-message')).toBeInTheDocument();

		userEvent.selectOptions(fileExtension, 'json');
		fireEvent.change(fileExtension);

		expect(fileExtension).toHaveValue('json');
		expect(
			screen.queryByText('csv-warning-message')
		).not.toBeInTheDocument();

		userEvent.selectOptions(fileExtension, 'xls');
		fireEvent.change(fileExtension);

		expect(fileExtension).toHaveValue('xls');
		expect(
			screen.getByText(
				'the-total-number-of-characters-that-a-cell-can-contain-is-32767-characters'
			)
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'the-total-number-of-columns-that-a-worksheet-can-contain-is-256-columns'
			)
		).toBeInTheDocument();

		userEvent.selectOptions(fileExtension, 'xml');
		fireEvent.change(fileExtension);

		expect(fileExtension).toHaveValue('xml');
		expect(
			screen.queryByText(
				'the-total-number-of-characters-that-a-cell-can-contain-is-32767-characters'
			)
		).not.toBeInTheDocument();
		expect(
			screen.queryByText(
				'the-total-number-of-columns-that-a-worksheet-can-contain-is-256-columns'
			)
		).not.toBeInTheDocument();
	});

	it('does not show csv option according to csvExport', () => {
		render(<ExportFormModal {...props} csvExport="disabled" />);

		act(() => {
			jest.runAllTimers();
		});

		expect(screen.getByLabelText('file-extension')).toHaveValue('json');
		expect(screen.queryByText('CSV')).not.toBeInTheDocument();
	});

	it('does not show csv warning message according to csvExport', () => {
		render(<ExportFormModal {...props} csvExport="enabled" />);

		act(() => {
			jest.runAllTimers();
		});

		expect(screen.getByLabelText('file-extension')).toHaveValue('csv');
		expect(
			screen.queryByText('csv-warning-message')
		).not.toBeInTheDocument();
	});
});
