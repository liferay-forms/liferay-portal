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
import {useResource} from '@clayui/data-provider';
import ClayIcon from '@clayui/icon';
import Reports from 'dynamic-data-mapping-form-report-web';
import {fetch} from 'frontend-js-web';
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

	const {resource} = useResource({
		fetch,
		link: formReportDataURL,
	});

	const onSeePartialResultsClick = () => {
		setShowReport(true);
	};

	return (
		<div className="portlet-forms">
			<div className="container-fluid container-fluid-max-xl">
				<div className="ddm-form-basic-info">
					<h1 className="ddm-form-name">{formTitle}</h1>

					<div className="horizontal-line"></div>
				</div>

				{showReport ? (
					<>
						<div className="ddm-form-page-back">
							<ClayButton
								displayType="link"
								onClick={() => setShowReport(false)}
							>
								<ClayIcon symbol="order-arrow-left" />

								{Liferay.Language.get('back')}
							</ClayButton>
						</div>
						<div
							className="portlet-ddm-form-report"
							id="container-portlet-ddm-form-report"
						>
							<div className="portlet-ddm-form-report-header">
								<div className="container-fluid">
									<div className="align-items-center">
										<span className="portlet-ddm-form-report-header-title text-truncate">
											{resource?.totalItems === 1
												? Liferay.Util.sub(
														Liferay.Language.get(
															'x-entry'
														),
														[resource?.totalItems]
												  )
												: Liferay.Util.sub(
														Liferay.Language.get(
															'x-entries'
														),
														[resource?.totalItems]
												  )}
										</span>
									</div>

									<div className="align-items-center">
										<span className="portlet-ddm-form-report-header-subtitle text-truncate">
											{resource?.totalItems > 0
												? resource?.lastModifiedDate
												: Liferay.Language.get(
														'there-are-no-entries'
												  )}
										</span>
									</div>
								</div>
							</div>

							<Reports
								data={resource?.data}
								fields={resource?.fields}
								formReportRecordsFieldValuesURL={
									resource?.formReportRecordsFieldValuesURL
								}
								portletNamespace={resource?.portletNamespace}
							/>
						</div>
					</>
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
