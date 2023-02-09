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

import {TacticKeys} from '../../../../../../../../../common/enums/mdfRequestTactics';
import MDFRequestActivity from '../../../../../../../../../common/interfaces/mdfRequestActivity';

export default function getEventFields(mdfRequestActivity: MDFRequestActivity) {
	const eventFields = [
		{
			title: 'Activity Description',
			value: mdfRequestActivity.activityDescription?.description,
		},
	];

	if (mdfRequestActivity.tactic.key === TacticKeys.WEBINAR) {
		eventFields.push(
			{
				title: 'Webinar Topic',
				value: mdfRequestActivity.activityDescription?.webinarTopic,
			},
			{
				title: 'Webinar Host/Platform',
				value:
					mdfRequestActivity.activityDescription?.webinarHostPlatform,
			}
		);
	}
	else {
		eventFields.push(
			{
				title: 'Location',
				value: mdfRequestActivity.activityDescription?.location,
			},
			{
				title: 'Venue Name',
				value: mdfRequestActivity.activityDescription?.venueName,
			}
		);
	}

	eventFields.push(
		{
			title: 'Liferay Branding',
			value: mdfRequestActivity.activityDescription?.liferayBranding,
		},
		{
			title: 'Liferay Participation / Requirements',
			value:
				mdfRequestActivity.activityDescription
					?.liferayParticipationRequirements,
		},
		{
			title: 'Source and Size of Invitee List',
			value:
				mdfRequestActivity.activityDescription
					?.sourceAndSizeOfInviteeList,
		},
		{
			title: 'Activity Promotion',
			value: mdfRequestActivity.activityDescription?.activityPromotion,
		}
	);

	return eventFields;
}
