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

export default function getMiscellaneousMarketing(
	mdfRequestActivity: MDFRequestActivity
) {
	const miscellaneousMarketingFields = [
		{
			title: 'Marketing activity',
			value: mdfRequestActivity.activityDescription?.marketingActivity,
		},
	];
	if (mdfRequestActivity.tactic.key === TacticKeys.BROADCAST_ADVERTISING) {
		miscellaneousMarketingFields.push(
			{
				title: 'Broadcast channel',
				value: mdfRequestActivity.activityDescription?.broadcastChannel,
			},
			{
				title: 'CTA',
				value: mdfRequestActivity.activityDescription?.cta,
			},
			{
				title: '# of weeks/airing',
				value: mdfRequestActivity.activityDescription?.weeksAiring,
			},
			{
				title: 'Guaranteed Impressions',
				value:
					mdfRequestActivity.activityDescription
						?.guaranteedImpressions,
			}
		);
	}
	else if (
		mdfRequestActivity.tactic.key ===
		TacticKeys.CAMPAIGN_WITH_INDUSTRY_PUBLICATION
	) {
		miscellaneousMarketingFields.push(
			{
				title: 'Publication',
				value: mdfRequestActivity.activityDescription?.publication,
			},
			{
				title: 'CTA',
				value: mdfRequestActivity.activityDescription?.cta,
			},
			{
				title: 'Expected Impressions',
				value:
					mdfRequestActivity.activityDescription?.expectedImpressions,
			}
		);
	}
	else if (
		mdfRequestActivity.tactic.key === TacticKeys.CO_BRANDED_MERCHANDISE
	) {
		miscellaneousMarketingFields.push(
			{
				title: 'What type of merchandise?',
				value: mdfRequestActivity.activityDescription?.typeMerchandise,
			},
			{
				title: 'Quantity',
				value: mdfRequestActivity.activityDescription?.quantity,
			}
		);
	}
	else if (mdfRequestActivity.tactic.key === TacticKeys.DIRECT_MAIL) {
		miscellaneousMarketingFields.push(
			{
				title: 'Target # of sends',
				value: mdfRequestActivity.activityDescription?.targetOfSends,
			},
			{
				title: 'CTA',
				value: mdfRequestActivity.activityDescription?.cta,
			}
		);
	}
	else if (
		mdfRequestActivity.tactic.key ===
		TacticKeys.OUTBOUND_TELEMARKETING_SALES
	) {
		miscellaneousMarketingFields.push(
			{
				title: 'Audience Target',
				value: mdfRequestActivity.activityDescription?.audienceTarget,
			},
			{
				title: 'Source and Size of call List*',
				value:
					mdfRequestActivity.activityDescription
						?.sourceAndSizeOfCallList,
			},
			{
				title: 'Resources necessary from Liferay',
				value:
					mdfRequestActivity.activityDescription
						?.resourcesNecessaryFromLiferay,
			}
		);
	}
	else if (mdfRequestActivity.tactic.key === TacticKeys.PRINT_ADVERTISING) {
		miscellaneousMarketingFields.push(
			{
				title: 'Publication',
				value: mdfRequestActivity.activityDescription?.publication,
			},
			{
				title: 'CTA',
				value: mdfRequestActivity.activityDescription?.cta,
			},
			{
				title: 'Expected Impressions',
				value:
					mdfRequestActivity.activityDescription?.expectedImpressions,
			}
		);
	}

	return miscellaneousMarketingFields;
}
