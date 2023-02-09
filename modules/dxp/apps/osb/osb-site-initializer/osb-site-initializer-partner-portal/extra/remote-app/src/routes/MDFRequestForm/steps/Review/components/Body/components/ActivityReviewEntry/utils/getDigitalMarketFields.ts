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
import getBooleanValue from '../../../../../../../../../common/utils/getBooleanValue';

export default function getDigitalMarketFields(
	mdfRequestActivity: MDFRequestActivity
) {
	const digitalMarketingFields = [
		{
			title: 'Overall message, content or CTA',
			value:
				mdfRequestActivity.activityDescription
					?.overallMessageContentCTA,
		},
	];
	if (mdfRequestActivity.tactic.key === TacticKeys.EMAIL_CAMPAIGN) {
		digitalMarketingFields.push(
			{
				title: 'Landing page copy',
				value: mdfRequestActivity.activityDescription?.landingPageCopy,
			},
			{
				title: 'Nurture or drip campaign?',
				value:
					mdfRequestActivity.activityDescription?.nurtureDripCampaign,
			}
		);
		if (mdfRequestActivity.activityDescription?.nurtureDripCampaign) {
			digitalMarketingFields.push({
				title: 'How many in series?',
				value: mdfRequestActivity.activityDescription?.manySeries,
			});
		}

		digitalMarketingFields.push({
			title: 'Do you require any assets from Liferay?',
			value:
				mdfRequestActivity.activityDescription?.assetsLiferayRequired,
		});
		if (mdfRequestActivity.activityDescription?.assetsLiferayRequired) {
			digitalMarketingFields.push({
				title: 'Please describe including specifications and due dates',
				value: mdfRequestActivity.activityDescription?.specificSites,
			});
		}
		digitalMarketingFields.push(
			{
				title: 'Are you using any CIAB assets?',
				value: mdfRequestActivity.activityDescription?.usingCIABAssets,
			},
			{
				title: 'How will the Liferay brand be used in the campaign?',
				value:
					mdfRequestActivity.activityDescription?.howLiferayBrandUsed,
			}
		);
	}
	else {
		digitalMarketingFields.push(
			{
				title: 'Overall message, content or CTA',
				value:
					mdfRequestActivity.activityDescription
						?.overallMessageContentCTA,
			},
			{
				title: 'Specific sites to be used',
				value: mdfRequestActivity.activityDescription?.specificSites,
			},
			{
				title: 'Keywords for PPC campaigns',
				value:
					mdfRequestActivity.activityDescription
						?.keywordsForPPCCampaigns,
			},
			{
				title: 'Ad (any size/type)',
				value: mdfRequestActivity.activityDescription?.ad,
			},
			{
				title: 'Do you require any assets from Liferay?',
				value: getBooleanValue(
					mdfRequestActivity.activityDescription
						?.assetsLiferayRequired as string
				),
			}
		);
		if (mdfRequestActivity.activityDescription?.assetsLiferayRequired) {
			digitalMarketingFields.push({
				title: 'Please describe including specifications and due dates',
				value:
					mdfRequestActivity.activityDescription
						?.assetsLiferayDescription,
			});
		}
		digitalMarketingFields.push({
			title: 'How will the Liferay brand be used in the campaign?',
			value: mdfRequestActivity.activityDescription?.howLiferayBrandUsed,
		});
	}

	return digitalMarketingFields;
}
