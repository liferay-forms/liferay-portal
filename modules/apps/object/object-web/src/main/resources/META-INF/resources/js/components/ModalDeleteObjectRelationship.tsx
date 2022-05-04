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

import ClayButton from '@clayui/button';
import ClayForm from '@clayui/form';
import ClayModal, {ClayModalProvider, useModal} from '@clayui/modal';
import {fetch} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import useForm from '../hooks/useForm';
import Input from './Form/Input';

type TInitialValues = {
	name: string;
};

const ModalDeleteObjectRelationship: React.FC<IProps> = ({
	handleChange,
	handleSubmit,
	objectRelationship,
	observer,
	onClose,
	values,
}) => {
	const [error, setError] = useState('');

	const handleBlur = () => {
		values.name.toLowerCase() !== objectRelationship?.name.toLowerCase()
			? setError(
					Liferay.Language.get(
						'input-and-relationship-name-does-not-match'
					)
			  )
			: setError('');
	};

	const getDangerMessages = () => {
		return (
			<>
				<p>
					{Liferay.Language.get(
						'this-action-cannot-be-undone-and-will-delete-permanently-all-related-fields-from-this-relationship'
					)}
				</p>
				<p>{Liferay.Language.get('it-may-affect-many-records')}</p>
				<p
					dangerouslySetInnerHTML={{
						__html: Liferay.Util.sub(
							Liferay.Language.get(
								'please-type-the-relationship-name-x-to-confirm'
							),
							`<strong>${objectRelationship?.name}</strong>`
						),
					}}
				/>
			</>
		);
	};

	const getWarningMessages = () => {
		return (
			<>
				<div>
					{Liferay.Language.get(
						'you-do-not-have-permission-to-delete-this-relationship'
					)}
				</div>
				<div>
					{Liferay.Language.get(
						'to-delete-this-relationship-you-need-to-go-to-parent-relationship-side'
					)}
				</div>
			</>
		);
	};

	return (
		<ClayModal
			center
			observer={observer}
			status={objectRelationship?.reverse ? 'warning' : 'danger'}
		>
			<ClayForm onSubmit={handleSubmit}>
				<ClayModal.Header>
					{objectRelationship?.reverse
						? Liferay.Language.get('deletion-not-allowed')
						: Liferay.Language.get('delete-relationship')}
				</ClayModal.Header>

				<ClayModal.Body>
					<>
						{objectRelationship?.reverse ? (
							getWarningMessages()
						) : (
							<>
								{getDangerMessages()}
								<Input
									error={error}
									id="objectRelationshipName"
									label=""
									name="name"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.name}
								/>
							</>
						)}
					</>
				</ClayModal.Body>

				<ClayModal.Footer
					last={
						objectRelationship?.reverse ? (
							<ClayButton
								displayType="warning"
								onClick={() => onClose()}
							>
								{Liferay.Language.get('done')}
							</ClayButton>
						) : (
							<ClayButton.Group key={1} spaced>
								<ClayButton
									displayType="secondary"
									onClick={() => onClose()}
								>
									{Liferay.Language.get('cancel')}
								</ClayButton>

								<ClayButton
									disabled={
										!values.name || error ? true : false
									}
									displayType="danger"
									type="submit"
								>
									{Liferay.Language.get('delete')}
								</ClayButton>
							</ClayButton.Group>
						)
					}
				/>
			</ClayForm>
		</ClayModal>
	);
};

interface IProps extends React.HTMLAttributes<HTMLElement> {
	handleChange: any;
	handleSubmit: any;
	isApproved: boolean;
	objectRelationship: any;
	observer: any;
	onClose: () => void;
	relationshipId: string;
	values: any;
}

const ModalWithProvider: React.FC<IProps> = ({isApproved}: any) => {
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [relationshipId, setRelationshipId] = useState('');

	const {observer, onClose} = useModal({
		onClose: () => {
			setVisibleModal(false);
			setRelationshipId('');
		},
	});

	const [objectRelationship, setObjectRelationship] = useState<any>({});

	const initialValues: TInitialValues = {
		name: '',
	};

	const openToast = (options: {
		message: string;
		type?: 'danger' | 'success';
	}) => {
		const parentWindow = Liferay.Util.getOpener();
		parentWindow.Liferay.Util.openToast(options);
	};

	const deleteRelationship = async () => {
		const response = await fetch(
			`/o/object-admin/v1.0/object-relationships/${relationshipId}`,
			{
				headers: new Headers({
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}),
				method: 'DELETE',
			}
		);

		if (response.ok) {
			openToast({
				message: Liferay.Language.get(
					'relationship-deleted-successfully'
				),
				type: 'success',
			});

			setTimeout(() => {
				window.location.reload();
			}, 500);

			return;
		}
		onClose();
	};

	const onValidate = (values: TInitialValues) => {
		const errors: any = {};

		if (!values.name) {
			errors.name = Liferay.Language.get('required');
		}

		return errors;
	};

	const {handleChange, handleSubmit, values} = useForm({
		initialValues,
		onSubmit: deleteRelationship,
		validate: onValidate,
	});

	const openDeleteObjectRelationshipModal = async ({itemId}: any) => {
		const objectRelationshipResponse = await fetch(
			`/o/object-admin/v1.0/object-relationships/${itemId}`,
			{
				headers: new Headers({
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}),
				method: 'GET',
			}
		);

		setObjectRelationship((await objectRelationshipResponse.json()) as any);
		setRelationshipId(itemId);
	};

	useEffect(() => {
		Liferay.on(
			'deleteObjectRelationship',
			openDeleteObjectRelationshipModal
		);

		return () => {
			Liferay.detach('deleteObjectRelationship');
		};
	}, []);

	useEffect(() => {
		if (!isApproved && !objectRelationship?.reverse) {
			deleteRelationship();

			return;
		}
		else if (relationshipId) {
			setVisibleModal(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [relationshipId]);

	return (
		<ClayModalProvider>
			{visibleModal && (
				<ModalDeleteObjectRelationship
					handleChange={handleChange}
					handleSubmit={handleSubmit}
					isApproved={isApproved}
					objectRelationship={objectRelationship}
					observer={observer}
					onClose={onClose}
					relationshipId={relationshipId}
					values={values}
				/>
			)}
		</ClayModalProvider>
	);
};

export default ModalWithProvider;
