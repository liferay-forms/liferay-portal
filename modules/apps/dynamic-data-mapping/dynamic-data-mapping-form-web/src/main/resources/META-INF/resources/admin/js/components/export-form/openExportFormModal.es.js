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
import {ClayIconSpriteContext} from '@clayui/icon';
import ClayModal, {useModal} from '@clayui/modal';
import {render} from '@liferay/frontend-js-react-web';
import React, {useState} from 'react';
import {unmountComponentAtNode} from 'react-dom';

import {ExportFormModalBody} from './ExportFormModalBody.es';

export function ExportFormModal({
	csvExport,
	exportFormInstanceURL,
	fileExtensions,
	portletNamespace,
}) {
	const [visible, setVisible] = useState(true);

	const {observer, onClose} = useModal({
		onClose: () => setVisible(false),
	});

	return (
		<>
			{visible && (
				<ClayModal observer={observer}>
					<ClayModal.Header>
						{Liferay.Language.get('export')}
					</ClayModal.Header>

					<ClayForm action={exportFormInstanceURL} method="post">
						<ClayModal.Body>
							<ExportFormModalBody
								csvExport={csvExport}
								fileExtensions={fileExtensions}
								portletNamespace={portletNamespace}
							/>
						</ClayModal.Body>

						<ClayModal.Footer
							last={
								<ClayButton.Group spaced>
									<ClayButton
										displayType="secondary"
										onClick={onClose}
									>
										{Liferay.Language.get('cancel')}
									</ClayButton>

									<ClayButton
										displayType="primary"
										onClick={onClose}
										type="submit"
									>
										{Liferay.Language.get('ok')}
									</ClayButton>
								</ClayButton.Group>
							}
						/>
					</ClayForm>
				</ClayModal>
			)}
		</>
	);
}

let container;

export function openExportFormModal({spritemap, ...data}) {
	if (container) {
		cleanUp();
	}

	container = document.createElement('div');

	document.body.appendChild(container);

	render(
		<ClayIconSpriteContext.Provider value={spritemap}>
			<ExportFormModal {...data} />
		</ClayIconSpriteContext.Provider>,
		data,
		container
	);

	Liferay.once('destroyPortlet', cleanUp);
}

function cleanUp() {
	if (container) {
		unmountComponentAtNode(container);
		document.body.removeChild(container);

		container = null;
	}
}
