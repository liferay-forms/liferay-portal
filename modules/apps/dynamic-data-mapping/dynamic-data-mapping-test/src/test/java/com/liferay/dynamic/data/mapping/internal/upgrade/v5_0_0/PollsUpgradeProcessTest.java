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

package com.liferay.dynamic.data.mapping.internal.upgrade.v5_0_0;

import com.liferay.dynamic.data.mapping.internal.io.DDMFormLayoutJSONSerializer;
import com.liferay.dynamic.data.mapping.internal.io.DDMFormValuesJSONSerializer;
import com.liferay.dynamic.data.mapping.model.DDMForm;
import com.liferay.dynamic.data.mapping.model.DDMFormField;
import com.liferay.dynamic.data.mapping.model.DDMFormFieldOptions;
import com.liferay.dynamic.data.mapping.model.LocalizedValue;
import com.liferay.osgi.service.tracker.collections.map.ServiceTrackerMap;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.json.JSONFactoryImpl;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.language.Language;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.Localization;
import com.liferay.portal.kernel.util.LocalizationUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.ProxyFactory;
import com.liferay.portal.kernel.util.ResourceBundleUtil;
import com.liferay.portal.kernel.util.SetUtil;
import com.liferay.portal.kernel.util.StringUtil;

import java.io.InputStream;

import java.util.Locale;
import java.util.ResourceBundle;
import java.util.Set;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import org.powermock.api.mockito.PowerMockito;
import org.powermock.api.support.membermodification.MemberMatcher;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import org.skyscreamer.jsonassert.JSONAssert;

/**
 * @author Carolina Barbosa
 */
@PrepareForTest({LocaleUtil.class, ResourceBundleUtil.class})
@RunWith(PowerMockRunner.class)
public class PollsUpgradeProcessTest extends PowerMockito {

	@Before
	public void setUp() throws Exception {
		_setUpDDMFormLayoutJSONSerializer();
		_setUpDDMFormValuesJSONSerializer();
		_setUpJSONFactoryUtil();
		_setUpLanguageUtil();
		_setUpLocaleUtil();
		_setUpLocalizationUtil();
		_setUpPollsUpgradeProcess();
		_setUpPortalUtil();
		_setUpResourceBundleUtil();
	}

	@Test
	public void testCreateDDDMFormFieldOptions() throws Exception {
		DDMFormFieldOptions ddmFormFieldOptions = new DDMFormFieldOptions(
			LocaleUtil.US);

		_pollsUpgradeProcess.createDDDMFormFieldOptions(
			ddmFormFieldOptions,
			_getPollsChoiceDescription("Option 1", "Option 1 PT"), "a",
			"Option1");
		_pollsUpgradeProcess.createDDDMFormFieldOptions(
			ddmFormFieldOptions,
			_getPollsChoiceDescription("Option 2", "Option 2 PT"), "b",
			"Option2");

		Set<String> optionsValues = ddmFormFieldOptions.getOptionsValues();

		Assert.assertEquals(optionsValues.toString(), 2, optionsValues.size());
		Assert.assertTrue(
			optionsValues.toString(), optionsValues.contains("Option1"));
		Assert.assertTrue(
			optionsValues.toString(), optionsValues.contains("Option2"));

		LocalizedValue optionLabels = ddmFormFieldOptions.getOptionLabels(
			"Option1");

		Assert.assertEquals(
			"a. Option 1 PT", optionLabels.getString(LocaleUtil.BRAZIL));
		Assert.assertEquals(
			"a. Option 1", optionLabels.getString(LocaleUtil.US));

		optionLabels = ddmFormFieldOptions.getOptionLabels("Option2");

		Assert.assertEquals(
			"b. Option 2 PT", optionLabels.getString(LocaleUtil.BRAZIL));
		Assert.assertEquals(
			"b. Option 2", optionLabels.getString(LocaleUtil.US));
	}

	@Test
	public void testGetDataJSONObject() throws Exception {
		DDMFormField ddmFormField = _pollsUpgradeProcess.getDDMFormField(
			new DDMFormFieldOptions(LocaleUtil.US));

		DDMFormFieldOptions ddmFormFieldOptions = new DDMFormFieldOptions(
			LocaleUtil.US);

		ddmFormFieldOptions.addOption("Option1");
		ddmFormFieldOptions.addOption("Option2");

		ddmFormField.setDDMFormFieldOptions(ddmFormFieldOptions);

		ddmFormField.setName("SingleSelection");

		Assert.assertEquals(
			JSONUtil.put(
				"SingleSelection",
				JSONUtil.put(
					"type", "radio"
				).put(
					"values",
					JSONUtil.put(
						"Option1", 0
					).put(
						"Option2", 0
					)
				)
			).put(
				"totalItems", 0
			).toString(),
			String.valueOf(
				_pollsUpgradeProcess.getDataJSONObject(ddmFormField)));
	}

	@Test
	public void testGetDDMForm() throws Exception {
		DDMForm ddmForm = _pollsUpgradeProcess.getDDMForm(
			new DDMFormField("fieldName", "radio"));

		Assert.assertEquals(
			SetUtil.fromArray(new Locale[] {LocaleUtil.BRAZIL, LocaleUtil.US}),
			ddmForm.getAvailableLocales());
		Assert.assertEquals(LocaleUtil.US, ddmForm.getDefaultLocale());
	}

	@Test
	public void testGetDDMFormField() throws Exception {
		DDMFormField ddmFormField = _pollsUpgradeProcess.getDDMFormField(
			new DDMFormFieldOptions(LocaleUtil.US));

		Assert.assertEquals("string", ddmFormField.getDataType());

		LocalizedValue localizedValue = ddmFormField.getLabel();

		Assert.assertEquals(
			"Single Selection", localizedValue.getString(LocaleUtil.US));

		Assert.assertEquals("radio", ddmFormField.getType());
		Assert.assertFalse((boolean)ddmFormField.getProperty("inline"));
		Assert.assertFalse(ddmFormField.isShowLabel());
		Assert.assertNotNull(ddmFormField.getDDMFormFieldOptions());
		Assert.assertTrue(
			StringUtil.startsWith(ddmFormField.getName(), "SingleSelection"));
		Assert.assertTrue((boolean)ddmFormField.getProperty("visible"));
		Assert.assertTrue(ddmFormField.isLocalizable());
		Assert.assertTrue(ddmFormField.isRequired());
	}

	@Test
	public void testGetDDMFormFieldName() throws Exception {
		String ddmFormFieldName = _pollsUpgradeProcess.getDDMFormFieldName(
			"Single Selection");

		Assert.assertTrue(
			ddmFormFieldName.matches("^SingleSelection[\\d]{8}$"));
	}

	@Test
	public void testGetDDMFormLayoutDefinition() throws Exception {
		DDMFormField ddmFormField = _pollsUpgradeProcess.getDDMFormField(
			new DDMFormFieldOptions(LocaleUtil.US));

		ddmFormField.setName("SingleSelection");

		JSONAssert.assertEquals(
			_read("ddm-form-layout-definition.json"),
			_pollsUpgradeProcess.getDDMFormLayoutDefinition(ddmFormField),
			false);
	}

	@Test
	public void testGetSerializedSettingsDDMFormValues() throws Exception {
		JSONAssert.assertEquals(
			_read("ddm-form-instance-settings.json"),
			_pollsUpgradeProcess.getSerializedSettingsDDMFormValues(), false);
	}

	private String _getPollsChoiceDescription(
		String enChoice, String ptChoice) {

		StringBundler sb = new StringBundler(8);

		sb.append("<?xml version=\"1.0\"?>");
		sb.append("<root available-locales='en_US,pt_BR' ");
		sb.append("default-locale='en_US'>");
		sb.append("<Description language-id='en_US'>");
		sb.append(enChoice);
		sb.append("</Description><Description language-id='pt_BR'>");
		sb.append(ptChoice);
		sb.append("</Description></root>");

		return sb.toString();
	}

	private String _read(String fileName) throws Exception {
		Class<?> clazz = getClass();

		InputStream inputStream = clazz.getResourceAsStream(
			"dependencies/" + fileName);

		return StringUtil.read(inputStream);
	}

	private void _setUpDDMFormLayoutJSONSerializer() throws Exception {
		MemberMatcher.field(
			DDMFormLayoutJSONSerializer.class, "_jsonFactory"
		).set(
			_ddmFormLayoutJSONSerializer, new JSONFactoryImpl()
		);
	}

	private void _setUpDDMFormValuesJSONSerializer() throws Exception {
		field(
			DDMFormValuesJSONSerializer.class, "_jsonFactory"
		).set(
			_ddmFormValuesJSONSerializer, new JSONFactoryImpl()
		);

		field(
			DDMFormValuesJSONSerializer.class, "_serviceTrackerMap"
		).set(
			_ddmFormValuesJSONSerializer,
			ProxyFactory.newDummyInstance(ServiceTrackerMap.class)
		);
	}

	private void _setUpJSONFactoryUtil() {
		JSONFactoryUtil jsonFactoryUtil = new JSONFactoryUtil();

		jsonFactoryUtil.setJSONFactory(new JSONFactoryImpl());
	}

	private void _setUpLanguageUtil() {
		LanguageUtil languageUtil = new LanguageUtil();

		Language language = mock(Language.class);

		when(
			language.get(
				Matchers.any(ResourceBundle.class),
				Matchers.eq("radio-field-type-label"))
		).thenReturn(
			"Single Selection"
		);

		languageUtil.setLanguage(language);
	}

	private void _setUpLocaleUtil() {
		mockStatic(LocaleUtil.class);

		when(
			LocaleUtil.fromLanguageId("en_US")
		).thenReturn(
			LocaleUtil.US
		);

		when(
			LocaleUtil.fromLanguageId("pt_BR")
		).thenReturn(
			LocaleUtil.BRAZIL
		);

		when(
			LocaleUtil.toLanguageId(LocaleUtil.US)
		).thenReturn(
			"en_US"
		);

		when(
			LocaleUtil.toLanguageId(LocaleUtil.BRAZIL)
		).thenReturn(
			"pt_BR"
		);
	}

	private void _setUpLocalizationUtil() {
		LocalizationUtil localizationUtil = new LocalizationUtil();

		when(
			_localization.getAvailableLanguageIds(Matchers.anyString())
		).thenReturn(
			new String[] {"en_US", "pt_BR"}
		);

		when(
			_localization.getLocalization(
				Matchers.anyString(), Matchers.anyString())
		).then(
			new Answer<String>() {

				public String answer(InvocationOnMock invocationOnMock)
					throws Throwable {

					Object[] args = invocationOnMock.getArguments();

					String xml = (String)args[0];

					String languageIdAttribute =
						"language-id='" + (String)args[1] + "'>";

					String languageIdElement = xml.substring(
						xml.indexOf(languageIdAttribute) +
							languageIdAttribute.length());

					return languageIdElement.substring(
						0, languageIdElement.indexOf("</"));
				}

			}
		);

		localizationUtil.setLocalization(_localization);
	}

	private void _setUpPollsUpgradeProcess() throws Exception {
		MemberMatcher.field(
			PollsUpgradeProcess.class, "_availableLocales"
		).set(
			_pollsUpgradeProcess,
			SetUtil.fromArray(new Locale[] {LocaleUtil.BRAZIL, LocaleUtil.US})
		);

		MemberMatcher.field(
			PollsUpgradeProcess.class, "_defaultLocale"
		).set(
			_pollsUpgradeProcess, LocaleUtil.US
		);
	}

	private void _setUpPortalUtil() {
		PortalUtil portalUtil = new PortalUtil();

		Portal portal = mock(Portal.class);

		ResourceBundle resourceBundle = mock(ResourceBundle.class);

		when(
			portal.getResourceBundle(Matchers.any(Locale.class))
		).thenReturn(
			resourceBundle
		);

		portalUtil.setPortal(portal);
	}

	private void _setUpResourceBundleUtil() {
		mockStatic(ResourceBundleUtil.class);

		when(
			ResourceBundleUtil.getBundle(
				Matchers.anyString(), Matchers.any(Locale.class),
				Matchers.any(ClassLoader.class))
		).thenReturn(
			ResourceBundleUtil.EMPTY_RESOURCE_BUNDLE
		);
	}

	private static final DDMFormLayoutJSONSerializer
		_ddmFormLayoutJSONSerializer = new DDMFormLayoutJSONSerializer();
	private static final DDMFormValuesJSONSerializer
		_ddmFormValuesJSONSerializer = new DDMFormValuesJSONSerializer();
	private static final PollsUpgradeProcess _pollsUpgradeProcess =
		new PollsUpgradeProcess(
			_ddmFormLayoutJSONSerializer, null, _ddmFormValuesJSONSerializer,
			null, null);

	@Mock
	private Localization _localization;

}