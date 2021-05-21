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

package com.liferay.click.to.chat.web.internal.configuration;

import com.liferay.petra.reflect.ReflectionUtil;
import com.liferay.portal.kernel.module.configuration.ConfigurationException;
import com.liferay.portal.kernel.module.configuration.ConfigurationProviderUtil;
import com.liferay.portal.kernel.util.Validator;

import java.util.Objects;

/**
 * @author José Abelenda
 */
public class ClickToChatConfigurationUtil {

	public static ClickToChatConfiguration getClickToChatConfiguration(
		long companyId, long groupId) {

		try {
			ClickToChatConfiguration clickToChatConfigurationCompany =
				ConfigurationProviderUtil.getCompanyConfiguration(
					ClickToChatConfiguration.class, companyId);

			if (groupId == 0) {
				return clickToChatConfigurationCompany;
			}

			if (Objects.equals(
					clickToChatConfigurationCompany.siteSettingsStrategy(),
					"always-inherit")) {

				return clickToChatConfigurationCompany;
			}

			ClickToChatConfiguration clickToChatConfigurationGroup =
				ConfigurationProviderUtil.getGroupConfiguration(
					ClickToChatConfiguration.class, groupId);

			if (Objects.equals(
					clickToChatConfigurationCompany.siteSettingsStrategy(),
					"always-override")) {

				return clickToChatConfigurationGroup;
			}

			if (Objects.equals(
					clickToChatConfigurationCompany.siteSettingsStrategy(),
					"inherit-or-override")) {

				if (Validator.isNotNull(
						clickToChatConfigurationGroup.
							chatProviderAccountId()) &&
					Validator.isNotNull(
						clickToChatConfigurationGroup.chatProviderId())) {

					return clickToChatConfigurationGroup;
				}

				return clickToChatConfigurationCompany;
			}

			return clickToChatConfigurationCompany;
		}
		catch (ConfigurationException configurationException) {
			return ReflectionUtil.throwException(configurationException);
		}
	}

}