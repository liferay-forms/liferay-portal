/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import React, {useCallback, useEffect, useState} from 'react';

const META_FIELD_NAMES = {
	description: 'descriptionMapAsXML',
	friendlyURL: 'friendlyURL',
	title: 'titleMapAsXML',
};

export default function UndoRedo({
	initialDefaultLanguageId,
	languageId,
	namespace,
}) {
	const [
		{defaultLanguageId, history, selectedLanguageId, step},
		setState,
	] = useState({
		defaultLanguageId: initialDefaultLanguageId,
		history: [],
		selectedLanguageId: languageId,
		step: -1,
	});

	const handleUndo = () => {
		Liferay.fire('undo');

		const nextStep = history[step - 1];

		const titleInputComponent = Liferay.component(
			`${namespace}${META_FIELD_NAMES.title}`
		);

		const descriptionInputComponent = Liferay.component(
			`${namespace}${META_FIELD_NAMES.description}`
		);

		const friendlyURLInputComponent = Liferay.component(
			`${namespace}${META_FIELD_NAMES.friendlyURL}`
		);

			titleInputComponent.updateInputLanguage(
				nextStep.titleInputComponent,
				nextStep.selectedLanguageId
			);
			descriptionInputComponent.updateInputLanguage(
				nextStep.descriptionInputComponent,
				nextStep.selectedLanguageId
			);
			friendlyURLInputComponent.updateInputLanguage(
				nextStep.friendlyURLInputComponent,
				nextStep.selectedLanguageId
			);
			titleInputComponent.updateInput(nextStep.titleInputComponent);
			descriptionInputComponent.updateInput(
				nextStep.descriptionInputComponent
			);
			friendlyURLInputComponent.updateInput(
				nextStep.friendlyURLInputComponent
			);
		setState({
			defaultLanguageId: nextStep.defaultLanguageId,
			history,
			selectedLanguageId: nextStep.selectedLanguageId,
			step: step - 1,
		});
	};

	const handleRedo = () => {
		Liferay.fire('redo');

		const nextStep = history[step + 1];

		const titleInputComponent = Liferay.component(
			`${namespace}${META_FIELD_NAMES.title}`
		);

		const descriptionInputComponent = Liferay.component(
			`${namespace}${META_FIELD_NAMES.description}`
		);

		const friendlyURLInputComponent = Liferay.component(
			`${namespace}${META_FIELD_NAMES.friendlyURL}`
		);

			const titleInputComponent = Liferay.component(
				`${namespace}${META_FIELD_NAMES.title}`
			);

			const descriptionInputComponent = Liferay.component(
				`${namespace}${META_FIELD_NAMES.description}`
			);

			const friendlyURLInputComponent = Liferay.component(
				`${namespace}${META_FIELD_NAMES.friendlyURL}`
			);

			titleInputComponent.updateInputLanguage(
				nextStep.titleInputComponent,
				nextStep.selectedLanguageId
			);
			descriptionInputComponent.updateInputLanguage(
				nextStep.descriptionInputComponent,
				nextStep.selectedLanguageId
			);
			friendlyURLInputComponent.updateInputLanguage(
				nextStep.friendlyURLInputComponent,
				nextStep.selectedLanguageId
			);
			titleInputComponent.updateInput(nextStep.titleInputComponent);
			descriptionInputComponent.updateInput(
				nextStep.descriptionInputComponent
			);
			friendlyURLInputComponent.updateInput(
				nextStep.friendlyURLInputComponent
			);
		setState({
			defaultLanguageId: nextStep.defaultLanguageId,
			history,
			selectedLanguageId: nextStep.selectedLanguageId,
			step: step + 1,
		});
	};

	const handleAutoSave = useCallback(
		({fieldName}) => {
			const defaultLanguageIdInput = document.getElementById(
				`${namespace}defaultLanguageId`
			);

			const descriptionInputComponent = Liferay.componentReady(
				`${namespace}${META_FIELD_NAMES.description}`
			);

			const titleInputComponent = Liferay.componentReady(
				`${namespace}${META_FIELD_NAMES.title}`
			);

			const friendlyURLInputComponent = Liferay.componentReady(
				`${namespace}${META_FIELD_NAMES.friendlyURL}`
			);

			const selectedLanguageIdInput = document.getElementById(
				`${namespace}languageId`
			);

			Promise.all([
				descriptionInputComponent,
				titleInputComponent,
				friendlyURLInputComponent,
			]).then(
				([
					descriptionInputComponent,
					titleInputComponent,
					friendlyURLInputComponent,
				]) => {
					const newHistory = {
						defaultLanguageId: defaultLanguageIdInput.value,
						descriptionInputComponent: descriptionInputComponent.getValue(
							selectedLanguageId
						),
						friendlyURLInputComponent: friendlyURLInputComponent.getValue(
							selectedLanguageId
						),
						name: fieldName,
						selectedLanguageId: selectedLanguageIdInput.value,
						titleInputComponent: titleInputComponent.getValue(
							selectedLanguageId
						),
					};

					setState({
						defaultLanguageId: defaultLanguageIdInput.value,
						history: [...history.slice(0, step + 1), newHistory],
						selectedLanguageId: selectedLanguageIdInput.value,
						step: step + 1,
					});
				}
			);
		},
		[history, namespace, selectedLanguageId, step]
	);

	useEffect(() => {
		Liferay.on('autoSave', handleAutoSave);

		return () => {
			Liferay.detach('autoSave', handleAutoSave);
		};
	}, [handleAutoSave]);

	useEffect(() => {
		setTimeout(() => {
			Liferay.fire('autoSave', {fieldName: 'Reset'});
		}, 1000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<ClayButtonWithIcon
				aria-label={Liferay.Language.get('undo')}
				className="btn-monospaced"
				disabled={step <= 0}
				displayType="secondary"
				onClick={handleUndo}
				size="sm"
				symbol="undo"
				title="Undo"
			/>

			<ClayButtonWithIcon
				aria-label={Liferay.Language.get('redo')}
				className="btn-monospaced"
				disabled={!history.length || step === history.length - 1}
				displayType="secondary"
				onClick={handleRedo}
				size="sm"
				symbol="redo"
				title="Redo"
			/>
		</div>
	);
}
