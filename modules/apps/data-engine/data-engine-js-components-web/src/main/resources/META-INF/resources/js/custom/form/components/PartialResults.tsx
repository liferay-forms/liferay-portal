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
import React from 'react';

const PartialResults: React.FC<IProps> = ({onShow, reportDataURL}) => {
	const {resource} = useResource({
		fetch,
		link: reportDataURL,
	});

	return (
		<>
			<div className="ddm-form-page-back">
				<ClayButton displayType="link" onClick={onShow}>
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
											Liferay.Language.get('x-entry'),
											[resource?.totalItems]
									  )
									: Liferay.Util.sub(
											Liferay.Language.get('x-entries'),
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
	);
};

export default PartialResults;

interface IProps {
	onShow: () => void;
	reportDataURL: string;
}
