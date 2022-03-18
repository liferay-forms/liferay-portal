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

package com.liferay.object.internal.field.business.type;

import com.liferay.dynamic.data.mapping.form.field.type.constants.DDMFormFieldTypeConstants;
import com.liferay.object.constants.ObjectFieldConstants;
import com.liferay.object.exception.ObjectFieldSettingValueException;
import com.liferay.object.field.business.type.ObjectFieldBusinessType;
import com.liferay.object.model.ObjectFieldSetting;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.ResourceBundleUtil;
import com.liferay.portal.kernel.util.SetUtil;
import com.liferay.portal.kernel.util.Validator;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

import org.osgi.service.component.annotations.Component;

/**
 * @author Marcela Cunha
 */
@Component(
	immediate = true,
	property = "object.field.business.type.key=" + ObjectFieldConstants.BUSINESS_TYPE_TEXT,
	service = {ObjectFieldBusinessType.class, TextObjectFieldBusinessType.class}
)
public class TextObjectFieldBusinessType implements ObjectFieldBusinessType {

	@Override
	public Set<String> getAllowedObjectFieldSettingsNames() {
		return SetUtil.fromArray("maxLength");
	}

	@Override
	public String getDBType() {
		return ObjectFieldConstants.DB_TYPE_STRING;
	}

	@Override
	public String getDDMFormFieldTypeName() {
		return DDMFormFieldTypeConstants.TEXT;
	}

	@Override
	public String getDescription(Locale locale) {
		return LanguageUtil.get(
			ResourceBundleUtil.getModuleAndPortalResourceBundle(
				locale, getClass()),
			"add-text-up-to-280-characters");
	}

	@Override
	public String getLabel(Locale locale) {
		return LanguageUtil.get(
			ResourceBundleUtil.getModuleAndPortalResourceBundle(
				locale, getClass()),
			"text");
	}

	@Override
	public String getName() {
		return ObjectFieldConstants.BUSINESS_TYPE_TEXT;
	}

	@Override
	public Set<String> getRequiredObjectFieldSettingsNames() {
		return SetUtil.fromArray("showCounter");
	}

	@Override
	public void validateObjectFieldSettings(
			String objectFieldName,
			List<ObjectFieldSetting> objectFieldSettings)
		throws PortalException {

		ObjectFieldBusinessType.super.validateObjectFieldSettings(
			objectFieldName, objectFieldSettings);

		for (ObjectFieldSetting objectFieldSetting : objectFieldSettings) {
			if (Objects.equals(objectFieldSetting.getName(), "maxLength") &&
				Validator.isNotNull(objectFieldSetting.getValue())) {

				int maxLength = GetterUtil.getInteger(
					objectFieldSetting.getValue());

				if ((maxLength < 1) || (maxLength > 280)) {
					throw new ObjectFieldSettingValueException.InvalidValue(
						objectFieldName, "maxLength",
						objectFieldSetting.getValue());
				}
			}
			else if (Objects.equals(
						objectFieldSetting.getName(), "showCounter") &&
					 !Objects.equals(
						 objectFieldSetting.getValue(), StringPool.FALSE) &&
					 !Objects.equals(
						 objectFieldSetting.getValue(), StringPool.TRUE)) {

				throw new ObjectFieldSettingValueException.InvalidValue(
					objectFieldName, "showCounter",
					objectFieldSetting.getValue());
			}
		}
	}

}