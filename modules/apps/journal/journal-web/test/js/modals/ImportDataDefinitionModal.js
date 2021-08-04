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

import '@testing-library/jest-dom/extend-expect';
import {act, fireEvent, render, waitForElement} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import Modal from '../../../src/main/resources/META-INF/resources/js/modals/ImportDataDefinitionModal';

const ImportDataDefinitionModal = () => <Modal portletNamespace="test" />;

describe('Import Structure Modal', () => {
	let container, file;

	beforeAll(() => {
		Liferay.component = jest.fn();
		container = render(<ImportDataDefinitionModal />);
		file = new File(['testing file upload'], 'Testing.lar', {
			type: '.lar',
		});
	});

	it('renders the title modal', async () => {
		const {getByText} = container;

		act(() => {
			Liferay.component.mock.calls[0][1].open();
		});

		const title = await waitForElement(() => getByText('import-structure'));

		expect(title).toBeInTheDocument();
	});

	it('renders the info alert', () => {
		const {queryByText} = container;

		const infoAlert = queryByText(
			'the-import-process-will-run-in-the-background-and-may-take-a-few-minutes'
		);

		expect(infoAlert).toBeInTheDocument();
	});

	it('renders name input', () => {
		const {queryByText} = container;

		const inputName = queryByText('name');

		expect(inputName).toBeInTheDocument();
	});

	it('input name has correct name prop', () => {
		const {getByLabelText} = container;

		const inputName = getByLabelText('name');

		expect(inputName).toHaveAttribute('name', 'testname');
	});

	it('renders json input', () => {
		const {queryByText} = container;

		const jsonInput = queryByText('json-file');

		expect(jsonInput).toBeInTheDocument();
	});

	it('input json file has correct name prop', () => {
		const inputs = document.getElementsByName('testjsonFile');

		expect(!!inputs).toBe(true);
	});

	it('renders cancel button in footer', () => {
		const {queryByText} = container;

		const buttonCancel = queryByText('cancel');

		expect(buttonCancel).toBeInTheDocument();
	});

	it('the cancel button closes modal', () => {
		const {queryByText} = container;

		const buttonCancel = queryByText('cancel');

		userEvent.click(buttonCancel);

		const body = document.getElementsByTagName('body').item(0);

		expect(body).not.toHaveClass();
	});

	it('renders import button in footer', () => {
		const {queryByText} = container;

		const buttonImport = queryByText('import');

		expect(buttonImport).toBeInTheDocument();
	});

	it(
		'when exists a file selected,' +
			' the file name appear in disabled input file',
		() => {
			const {queryByText} = container;

			const [inputFile] = document.getElementsByName('testjsonFile');
			const inputFileName = document.getElementById('testjsonFile');

			fireEvent.change(inputFile, {
				target: {files: [file]},
				value: 'C://downloads/Testing.lar',
			});

			expect(inputFileName).toHaveValue('Testing.lar');
			expect(inputFileName).toBeDisabled();

			const clearButton = queryByText('clear');
			fireEvent.click(clearButton);
		}
	);

	it(
		'the clear button dont appear,' +
			' when not exists value in input file name',
		() => {
			const {queryByText} = container;

			const clearButton = queryByText('clear');

			expect(clearButton).not.toBeInTheDocument();
		}
	);

	it('the clear button appear when exists value in input file name', () => {
		const {queryByText} = container;

		const inputFile = document.getElementsByName('testjsonFile')[0];
		const inputFileName = document.getElementById('testjsonFile');

		fireEvent.change(inputFile, {target: {files: [file]}});

		const clearButton = queryByText('clear');

		expect(inputFileName).toHaveValue('Testing.lar');
		expect(clearButton).toBeInTheDocument();
	});

	it('the click in clear button erases the file', () => {
		const {getByText} = container;

		const inputFile = document.getElementsByName('testjsonFile')[0];
		const inputFileName = document.getElementById('testjsonFile');

		fireEvent.change(inputFile, {target: {files: [file]}});

		const clearButton = getByText('clear');

		expect(inputFileName).toHaveAttribute('value', 'Testing.lar');
		expect(clearButton).not.toBeNull();

		userEvent.click(clearButton);

		expect(inputFileName).toHaveAttribute('value', '');
	});

	it('the import button is disabled when the input arent filled', async () => {
		const {queryByText} = container;

		const buttonImport = queryByText('import');

		expect(buttonImport).toHaveAttribute('disabled');
	});

	it('the import button isnt disabled when the inputs are filled', async () => {
		const {getByLabelText, getByText} = container;

		const inputName = getByLabelText('name');
		const inputFile = document.getElementsByName('testjsonFile')[0];
		const inputFileName = getByLabelText('json-file');
		const buttonImport = getByText('import');

		fireEvent.change(inputFile, {target: {files: [file]}});
		userEvent.type(inputName, 'structure test');

		expect(inputFileName).toHaveAttribute('value', 'Testing.lar');
		expect(inputName).toHaveAttribute('value', 'structure test');
		expect(buttonImport).not.toHaveAttribute('disabled');
	});

	it('the button import has submit property', async () => {
		const {queryByText} = container;

		const buttonImport = queryByText('import');

		expect(buttonImport).toHaveAttribute('type', 'submit');
	});
});
