/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.dynamic.data.mapping.internal.upgrade.v5_4_2;

import com.liferay.dynamic.data.mapping.constants.DDMPortletKeys;
import com.liferay.dynamic.data.mapping.internal.upgrade.BasePollsPortletIdUpgradeProcess;

/**
 * @author Carolina Barbosa
 */
public class PollsPortletIdToDDMPortletIdUpgradeProcess
	extends BasePollsPortletIdUpgradeProcess {

	@Override
	protected void doUpgrade() throws Exception {
		removeDuplicatePortletPreferences(
			PORTLET_ID_POLLS, DDMPortletKeys.DYNAMIC_DATA_MAPPING_FORM_ADMIN);

		super.doUpgrade();

		upgradePortletPreferenceValue();
	}

}