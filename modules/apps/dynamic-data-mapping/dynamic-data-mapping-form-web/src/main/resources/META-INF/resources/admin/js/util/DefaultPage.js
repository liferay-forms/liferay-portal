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
import {PartialResults} from 'data-engine-js-components-web';
import React, {useState} from 'react';

const DefaultPage = ({
	formReportDataURL,
	formTitle,
	limitToOneSubmissionPerUser,
	pageDescription,
	pageTitle,
	showPartialResultsToRespondents,
}) => {
	const [showReport, setShowReport] = useState(false);
	const onSeePartialResultsClick = () => {
		setShowReport(true);
	};

	return (
		<div className="ddm-form-web-dafault-page portlet-forms">
			<div className="container-fluid container-fluid-max-xl">
				<div className="ddm-form-basic-info">
					<h1 className="ddm-form-name">{formTitle}</h1>

					<div className="horizontal-line"></div>
				</div>

				{showReport ? (
					<PartialResults
						onShow={() => setShowReport(false)}
						reportDataURL={formReportDataURL}
					/>
				) : (
					<>
						<div className="ddm-form-basic-info ddm-form-success-page">
							<h1 className="ddm-form-name">{pageTitle}</h1>

							<p className="ddm-form-description">
								{pageDescription}
							</p>

							<div />
						</div>

						<div className="lfr-ddm-default-page-footer-buttons">
							{!limitToOneSubmissionPerUser && (
								<ClayButton
									className="float-left lfr-ddm-default-page-footer-buttons--submit-again"
									displayType="secondary"
									id="ddm-form-submit-again"
									onClick={() =>
										window.location.reload(false)
									}
								>
									{Liferay.Language.get('submit-again')}
								</ClayButton>
							)}

							{showPartialResultsToRespondents && (
								<ClayButton
									className="float-left"
									displayType="secondary"
									id="ddm-form-see-partial-results"
									onClick={() => onSeePartialResultsClick()}
								>
									{Liferay.Language.get(
										'see-partial-results'
									)}
								</ClayButton>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

DefaultPage.displayName = 'DefaultPage';

export default DefaultPage;
