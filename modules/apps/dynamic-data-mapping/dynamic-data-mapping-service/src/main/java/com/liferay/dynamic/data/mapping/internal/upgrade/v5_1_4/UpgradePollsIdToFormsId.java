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

package com.liferay.dynamic.data.mapping.internal.upgrade.v5_1_4;

import com.liferay.dynamic.data.mapping.constants.DDMPortletKeys;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.upgrade.BasePortletIdUpgradeProcess;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import org.apache.commons.lang.StringUtils;

/**
 * @author Rebeca Silva
 */
public class UpgradePollsIdToFormsId extends BasePortletIdUpgradeProcess {

	@Override
	protected void doUpgrade() throws Exception {
		super.doUpgrade();

		_upgradePortletPreferenceValue();
	}

	@Override
	protected String[][] getRenamePortletIdsArray() {
		return new String[][] {
			{_OLD_PORTLET_NAME, DDMPortletKeys.DYNAMIC_DATA_MAPPING_FORM}
		};
	}

	private void _upgradePortletPreferenceValue() throws Exception {
		try (PreparedStatement preparedStatement = connection.prepareStatement(
				StringBundler.concat(
					"select portletPreferencesId, portletId from ",
					"PortletPreferences where portletId like '%",
					_OLD_PORTLET_NAME, "%'"));
			ResultSet resultSet = preparedStatement.executeQuery()) {

			while (resultSet.next()) {
				long portletPreferencesId = resultSet.getLong(
					"portletPreferencesId");

				String portletId = resultSet.getString("portletId");

				String newPortletId = StringUtils.substringAfter(
					portletId, "PollsDisplayPortlet");

				runSQL(
					StringBundler.concat(
						"update PortletPreferenceValue set name = ",
						"'formInstanceId' where portletPreferencesId=",
						portletPreferencesId, " AND name = 'questionId'"));

				runSQL(
					StringBundler.concat(
						"update PortletPreferences set portletId = '",
						DDMPortletKeys.DYNAMIC_DATA_MAPPING_FORM, newPortletId,
						"' where portletId like '%", _OLD_PORTLET_NAME,
						"%' AND portletPreferencesId=", portletPreferencesId));
			}
		}
	}

	private static final String _OLD_PORTLET_NAME =
		"com_liferay_polls_web_portlet_PollsDisplayPortlet";

}