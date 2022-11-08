/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {DealRegistrationColumnKey} from '../../../common/enums/dealRegistrationColumnKey';
import {RequestStatus} from '../../../common/enums/requestStatus';
import {DealRegistrationListItem} from '../../../common/interfaces/dealRegistrationListItem';
import TableColumn from '../../../common/interfaces/tableColumn';
import DealStatusBadge from '../../DealRegistrationList/components/DealStatusBadge';

export default function getDealColumns(
	columns?: TableColumn<DealRegistrationListItem>[]
): TableColumn<DealRegistrationListItem>[] | undefined {
	return (
		columns && [
			{
				columnKey: DealRegistrationColumnKey.ACCOUNT_NAME,
				label: 'Account Name',
			},
			{
				columnKey: DealRegistrationColumnKey.START_DATE,
				label: 'Start Date',
			},
			{
				columnKey: DealRegistrationColumnKey.END_DATE,
				label: 'End Date',
			},
			{
				columnKey: DealRegistrationColumnKey.STAGE,
				label: 'Stage',
				render: (data) => (
					<DealStatusBadge status={data as RequestStatus} />
				),
			},
		]
	);
}
