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
import {customFormatDateOptions} from '../../../common/utils/constants/customFormatDateOptions';
import getDateCustomFormat from '../../../common/utils/getDateCustomFormat';

export default function getDealDates(dateCreated?: Date, dateModified?: Date) {
	if (dateCreated && dateModified) {
		const startDate = getDateCustomFormat(
			dateCreated,
			customFormatDateOptions.SHORT_MONTH
		);

		const endDate = getDateCustomFormat(
			dateModified,
			customFormatDateOptions.SHORT_MONTH
		);

		return {
			[DealRegistrationColumnKey.START_DATE]: startDate,
			[DealRegistrationColumnKey.END_DATE]: endDate,
		};
	}
}
