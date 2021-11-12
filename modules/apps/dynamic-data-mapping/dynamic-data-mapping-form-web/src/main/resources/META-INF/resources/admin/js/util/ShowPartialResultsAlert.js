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
import React, {useState} from 'react';

export const ShowPartialResultsAlert = ({
	dismissible,
	showPartialResultsToRespondents
}) => {
	const [showPartialResult, setShowPartialResult] = useState(
		showPartialResultsToRespondents
	);

	const alertProps = {
		displayType: 'info',
		title: 'Info',
	};

	if (dismissible) {
		alertProps.onClose = () => setShowPartialResult(false);
	}

	return (
		<div
			className="container-fluid container-fluid-max-xl show-partial-results"
			id="showPartialResultsToRespondents"
			style={showPartialResult ? {display: 'block'} : {display: 'none'}}
		>
			<ClayAlert {...alertProps}>
				{Liferay.Language.get(
					'respondents-can-see-all-submitted-form-data'
				)}

				<div
					id={`${portletNamespace}dismissible`}
					style={dismissible ? {display: 'block'} : {display: 'none'}}
				>
					<ClayAlert.Footer>
						<ClayButton.Group>
							<ClayButton
								alert
								onClick={() => setShowPartialResult(false)}
							>
								{Liferay.Language.get('understood')}
							</ClayButton>
						</ClayButton.Group>
					</ClayAlert.Footer>
				</div>
			</ClayAlert>
		</div>
	);
};

ShowPartialResultsAlert.displayName = 'ShowPartialResultsAlert';

export default ShowPartialResultsAlert;
