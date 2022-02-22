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

import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayForm, {ClayToggle} from '@clayui/form';
import ClayModal, {ClayModalProvider, useModal} from '@clayui/modal';
import {fetch} from 'frontend-js-web';
import React, {useEffect, useMemo, useState} from 'react';

import useForm from '../hooks/useForm';
import {ERRORS} from '../utils/errors';
import {toCamelCase} from '../utils/string';
import DetailedSelect from './Form/DetailedSelect';
import Input from './Form/Input';
import Select from './Form/Select';

const objectFieldTypes = [
	'BigDecimal',
	'Boolean',
	'Clob',
	'Date',
	'Double',
	'Integer',
	'Long',
	'Picklist',
	'String',
];

const userComputer = {
	description: Liferay.Language.get(
		'the-files-are-scoped-by-object-entry-and-can-be-only-accessed-through-the-entry-itself'
	),
	label: Liferay.Language.get('directly-from-users-computer'),
};

const attachmentSources = [userComputer];

const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId();

const headers = new Headers({
	'Accept': 'application/json',
	'Content-Type': 'application/json',
});

async function fetchPickList() {
	const result = await fetch(
		'/o/headless-admin-list-type/v1.0/list-type-definitions',
		{
			headers,
			method: 'GET',
		}
	);

	const {items = []} = (await result.json()) as {
		items: IPicklist[] | undefined;
	};

	return items.map(({id, name}) => ({id, name}));
}

function ModalAddObjectField({
	apiURL,
	ffObjectFieldBusinessTypeConfigurationEnabled,
	objectFieldBusinessTypes,
	observer,
	onClose,
}: IProps) {
	const {businessTypeMap, dbTypeMap} = useMemo(() => {
		const businessTypeMap = new Map<string, ObjectFieldType>();
		const dbTypeMap = new Map<string, ObjectFieldType>();

		objectFieldBusinessTypes.forEach((type) => {
			businessTypeMap.set(type.businessType, type);
			dbTypeMap.set(type.dbType, type);
		});

		return {businessTypeMap, dbTypeMap};
	}, [objectFieldBusinessTypes]);

	const [error, setError] = useState<string>('');
	const [picklist, setPicklist] = useState<IPicklist[]>([]);

	const initialValues: ObjectField = {
		DBType: '',
		businessType: '',
		label: '',
		listTypeDefinitionId: 0,
		name: undefined,
		required: false,
	};

	const onSubmit = async ({
		DBType,
		businessType,
		label,
		listTypeDefinitionId,
		name,
		required,
	}: ObjectField) => {
		const response = await fetch(apiURL, {
			body: JSON.stringify({
				DBType,
				businessType,
				indexed: true,
				indexedAsKeyword: false,
				indexedLanguageId: null,
				label: {[defaultLanguageId]: label},
				listTypeDefinitionId,
				name: name || toCamelCase(label),
				required,
			}),
			headers,
			method: 'POST',
		});

		if (response.status === 401) {
			window.location.reload();
		}
		else if (response.ok) {
			onClose();

			window.location.reload();
		}
		else {
			const {type} = (await response.json()) as any;
			const isMapped = Object.prototype.hasOwnProperty.call(ERRORS, type);
			const errorMessage = isMapped
				? ERRORS[type]
				: Liferay.Language.get('an-error-occurred');

			setError(errorMessage);
		}
	};

	const validate = (values: ObjectField) => {
		const errors: any = {};

		if (!values.label) {
			errors.label = Liferay.Language.get('required');
		}

		if (!(values.name ?? toCamelCase(values.label))) {
			errors.name = Liferay.Language.get('required');
		}

		if (!values.businessType) {
			errors.type = Liferay.Language.get('required');
		}

		if (
			values.businessType === 'Picklist' &&
			!values.listTypeDefinitionId
		) {
			errors.listTypeDefinitionId = Liferay.Language.get('required');
		}

		return errors;
	};

	const {errors, handleChange, handleSubmit, setValues, values} = useForm({
		initialValues,
		onSubmit,
		validate,
	});

	return (
		<ClayModal observer={observer}>
			<ClayForm onSubmit={handleSubmit}>
				<ClayModal.Header>
					{Liferay.Language.get('new-field')}
				</ClayModal.Header>

				<ClayModal.Body>
					{error && (
						<ClayAlert displayType="danger">{error}</ClayAlert>
					)}

					<Input
						error={errors.label}
						id="objectFieldLabel"
						label={Liferay.Language.get('label')}
						name="label"
						onChange={handleChange}
						required
						value={values.label}
					/>

					<Input
						error={errors.name || errors.label}
						id="objectFieldName"
						label={Liferay.Language.get('field-name')}
						name="name"
						onChange={handleChange}
						required
						value={values.name ?? toCamelCase(values.label)}
					/>

					{ffObjectFieldBusinessTypeConfigurationEnabled ? (
						<DetailedSelect<ObjectFieldType>
							error={(errors as any).type}
							label={Liferay.Language.get('type')}
							onChange={async (option) => {
								if (option.businessType === 'Picklist') {
									setPicklist(await fetchPickList());
								}

								const objectFieldSettings:
									| ObjectFieldSetting[]
									| undefined =
									option.businessType === 'Attachment'
										? [
												{
													required: true,
													setting:
														'acceptedFileExtensions',
													value:
														'jpeg, jpg, pdf, png',
												},
												{
													required: true,
													setting: 'fileSource',
													value: 'userComputer',
												},
												{
													required: true,
													setting: 'maximumFileSize',
													value: 100,
												},
										  ]
										: undefined;

								setValues({
									DBType: option.dbType,
									businessType: option.businessType,
									objectFieldSettings,
								});
							}}
							options={objectFieldBusinessTypes}
							required
							selected={businessTypeMap.get(values.businessType)}
						/>
					) : (
						<Select
							error={(errors as any).type}
							id="objectFieldType"
							label={Liferay.Language.get('type')}
							onChange={async ({target: {value}}: any) => {
								const selected =
									objectFieldTypes[Number(value) - 1];

								let type;

								switch (selected) {
									case 'Picklist':
										setPicklist(await fetchPickList());
										type = businessTypeMap.get('Picklist');
										break;
									case 'String':
										type = businessTypeMap.get('Text');
										break;
									default:
										type = dbTypeMap.get(selected);
								}

								setValues({
									DBType: type?.dbType,
									businessType: type?.businessType,
								});
							}}
							options={objectFieldTypes}
							required
						/>
					)}

					{values.businessType === 'Attachment' && (
						<DetailedSelect
							error={(errors as any).attachmentSource}
							label={Liferay.Language.get('request-files')}
							onChange={() => {}}
							options={attachmentSources}
							required
							selected={userComputer}
						/>
					)}

					{values.businessType === 'Picklist' && (
						<Select
							error={errors.listTypeDefinitionId}
							label={Liferay.Language.get('picklist')}
							onChange={({target: {value}}: any) =>
								setValues({
									listTypeDefinitionId: Number(
										picklist[Number(value) - 1].id
									),
								})
							}
							options={picklist.map(({name}) => name)}
							required
						/>
					)}

					<ClayToggle
						label={Liferay.Language.get('mandatory')}
						onToggle={() => setValues({required: !values.required})}
						toggled={values.required}
					/>
				</ClayModal.Body>

				<ClayModal.Footer
					last={
						<ClayButton.Group key={1} spaced>
							<ClayButton
								displayType="secondary"
								onClick={() => onClose()}
							>
								{Liferay.Language.get('cancel')}
							</ClayButton>

							<ClayButton displayType="primary" type="submit">
								{Liferay.Language.get('save')}
							</ClayButton>
						</ClayButton.Group>
					}
				/>
			</ClayForm>
		</ClayModal>
	);
}

interface IProps {
	apiURL: string;
	ffObjectFieldBusinessTypeConfigurationEnabled: boolean;
	objectFieldBusinessTypes: ObjectFieldType[];
	observer: any;
	onClose: () => void;
}

interface IPicklist {
	id: string;
	name: string;
}

export default function ModalWithProvider({
	apiURL,
	ffObjectFieldBusinessTypeConfigurationEnabled,
	objectFieldBusinessTypes,
}: IProps) {
	const [isVisible, setVisibility] = useState<boolean>(false);
	const {observer, onClose} = useModal({onClose: () => setVisibility(false)});

	useEffect(() => {
		Liferay.on('addObjectField', () => setVisibility(true));

		return () => Liferay.detach('addObjectField');
	}, []);

	return (
		<ClayModalProvider>
			{isVisible && (
				<ModalAddObjectField
					apiURL={apiURL}
					ffObjectFieldBusinessTypeConfigurationEnabled={
						ffObjectFieldBusinessTypeConfigurationEnabled
					}
					objectFieldBusinessTypes={objectFieldBusinessTypes}
					observer={observer}
					onClose={onClose}
				/>
			)}
		</ClayModalProvider>
	);
}
