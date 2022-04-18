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

import com.liferay.document.library.kernel.model.DLFolder;
import com.liferay.document.library.kernel.model.DLFolderConstants;
import com.liferay.document.library.kernel.service.DLAppLocalService;
import com.liferay.document.library.kernel.service.DLFolderLocalService;
import com.liferay.document.library.kernel.util.DLValidatorUtil;
import com.liferay.object.constants.ObjectFieldConstants;
import com.liferay.object.dynamic.data.mapping.form.field.type.constants.ObjectDDMFormFieldTypeConstants;
import com.liferay.object.exception.ObjectFieldSettingNameException;
import com.liferay.object.exception.ObjectFieldSettingValueException;
import com.liferay.object.field.business.type.ObjectFieldBusinessType;
import com.liferay.object.field.render.ObjectFieldRenderingContext;
import com.liferay.object.model.ObjectField;
import com.liferay.object.model.ObjectFieldSetting;
import com.liferay.object.service.ObjectFieldSettingLocalService;
import com.liferay.petra.string.CharPool;
import com.liferay.petra.string.StringPool;
import com.liferay.petra.string.StringUtil;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Repository;
import com.liferay.portal.kernel.portletfilerepository.PortletFileRepository;
import com.liferay.portal.kernel.repository.model.Folder;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.PropsUtil;
import com.liferay.portal.kernel.util.ResourceBundleUtil;
import com.liferay.portal.kernel.util.SetUtil;
import com.liferay.portal.kernel.util.Validator;

import java.math.BigDecimal;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Carolina Barbosa
 */
@Component(
	immediate = true,
	property = "object.field.business.type.key=" + ObjectFieldConstants.BUSINESS_TYPE_ATTACHMENT,
	service = {
		AttachmentObjectFieldBusinessType.class, ObjectFieldBusinessType.class
	}
)
public class AttachmentObjectFieldBusinessType
	implements ObjectFieldBusinessType {

	@Override
	public Set<String> getAllowedObjectFieldSettingsNames() {
		if (!GetterUtil.getBoolean(PropsUtil.get("feature.flag.LPS-148112"))) {
			return ObjectFieldBusinessType.super.
				getAllowedObjectFieldSettingsNames();
		}

		return SetUtil.fromArray(
			"showFilesInDocumentsAndMedia", "storageDLFolderPath");
	}

	@Override
	public String getDBType() {
		return ObjectFieldConstants.DB_TYPE_LONG;
	}

	@Override
	public String getDDMFormFieldTypeName() {
		return ObjectDDMFormFieldTypeConstants.ATTACHMENT;
	}

	@Override
	public String getDescription(Locale locale) {
		return LanguageUtil.get(
			ResourceBundleUtil.getModuleAndPortalResourceBundle(
				locale, getClass()),
			"upload-files-or-select-from-documents-and-media");
	}

	public DLFolder getFolder(
		long companyId, long groupId, String portletId,
		ServiceContext serviceContext, boolean showFilesInDocumentsAndMedia,
		String storageDLFolderPath, long userId) {

		Long dlFolderId;

		if (GetterUtil.getBoolean(PropsUtil.get("feature.flag.LPS-148112")) &&
			showFilesInDocumentsAndMedia) {

			dlFolderId = _getStorageDLFolderId(
				companyId, groupId, serviceContext, storageDLFolderPath);
		}
		else {
			dlFolderId = _getObjectsRepositoryFolderId(
				companyId, groupId, portletId, serviceContext, userId);
		}

		if (dlFolderId == null) {
			return null;
		}

		return _dlFolderLocalService.fetchDLFolder(dlFolderId);
	}

	@Override
	public String getLabel(Locale locale) {
		return LanguageUtil.get(
			ResourceBundleUtil.getModuleAndPortalResourceBundle(
				locale, getClass()),
			"attachment");
	}

	@Override
	public String getName() {
		return ObjectFieldConstants.BUSINESS_TYPE_ATTACHMENT;
	}

	@Override
	public Map<String, Object> getProperties(
		ObjectField objectField,
		ObjectFieldRenderingContext objectFieldRenderingContext) {

		Map<String, Object> properties = HashMapBuilder.<String, Object>put(
			"objectFieldId", objectField.getObjectFieldId()
		).put(
			"portletId", objectFieldRenderingContext.getPortletId()
		).build();

		ListUtil.isNotEmptyForEach(
			_objectFieldSettingLocalService.getObjectFieldSettings(
				objectField.getObjectFieldId()),
			objectFieldSetting -> properties.put(
				objectFieldSetting.getName(), objectFieldSetting.getValue()));

		properties.remove("showFilesInDocumentsAndMedia");
		properties.remove("storageDLFolderPath");

		return properties;
	}

	@Override
	public Set<String> getRequiredObjectFieldSettingsNames() {
		return SetUtil.fromArray(
			"acceptedFileExtensions", "fileSource", "maximumFileSize");
	}

	@Override
	public void validateObjectFieldSettings(
			String objectFieldName,
			List<ObjectFieldSetting> objectFieldSettings)
		throws PortalException {

		ObjectFieldBusinessType.super.validateObjectFieldSettings(
			objectFieldName, objectFieldSettings);

		Stream<ObjectFieldSetting> stream = objectFieldSettings.stream();

		Map<String, String> objectFieldSettingsValuesMap = stream.collect(
			Collectors.toMap(
				ObjectFieldSetting::getName, ObjectFieldSetting::getValue));

		_validateObjectFieldSettingFileSource(
			objectFieldSettingsValuesMap.get("fileSource"), objectFieldName,
			objectFieldSettingsValuesMap.get("showFilesInDocumentsAndMedia"),
			objectFieldSettingsValuesMap.get("storageDLFolderPath"));
		_validateObjectFieldSettingMaximumFileSize(
			objectFieldName,
			objectFieldSettingsValuesMap.get("maximumFileSize"));
	}

	private Repository _getObjectsRepository(
		long groupId, String portletId, ServiceContext serviceContext) {

		Repository repository = _portletFileRepository.fetchPortletRepository(
			groupId, portletId);

		if (repository != null) {
			return repository;
		}

		try {
			return _portletFileRepository.addPortletRepository(
				groupId, portletId, serviceContext);
		}
		catch (PortalException portalException) {
			if (_log.isDebugEnabled()) {
				_log.debug(portalException);
			}

			return null;
		}
	}

	private Long _getObjectsRepositoryFolderId(
		long companyId, long groupId, String portletId,
		ServiceContext serviceContext, long userId) {

		if (Validator.isNull(portletId)) {
			return null;
		}

		Repository repository = _getObjectsRepository(
			groupId, portletId, serviceContext);

		if (repository == null) {
			return null;
		}

		DLFolder dlFolder = _dlFolderLocalService.fetchFolder(
			repository.getGroupId(), repository.getDlFolderId(),
			String.valueOf(userId));

		if (dlFolder != null) {
			return dlFolder.getFolderId();
		}

		try {
			dlFolder = _dlFolderLocalService.addFolder(
				_userLocalService.getDefaultUserId(companyId),
				repository.getGroupId(), repository.getRepositoryId(), false,
				repository.getDlFolderId(), String.valueOf(userId), null, false,
				serviceContext);

			return dlFolder.getFolderId();
		}
		catch (PortalException portalException) {
			if (_log.isDebugEnabled()) {
				_log.debug(portalException);
			}

			return null;
		}
	}

	private Long _getStorageDLFolderId(
		long companyId, long groupId, ServiceContext serviceContext,
		String storageDLFolderPath) {

		long storageDLFolderId = DLFolderConstants.DEFAULT_PARENT_FOLDER_ID;

		for (String folderName :
				StringUtil.split(storageDLFolderPath, CharPool.FORWARD_SLASH)) {

			DLFolder dlFolder = _dlFolderLocalService.fetchFolder(
				groupId, storageDLFolderId, folderName);

			if (dlFolder != null) {
				storageDLFolderId = dlFolder.getFolderId();

				continue;
			}

			try {
				Folder folder = _dlAppLocalService.addFolder(
					_userLocalService.getDefaultUserId(companyId), groupId,
					storageDLFolderId, folderName, null, serviceContext);

				storageDLFolderId = folder.getFolderId();
			}
			catch (PortalException portalException) {
				if (_log.isDebugEnabled()) {
					_log.debug(portalException);
				}

				return null;
			}
		}

		return storageDLFolderId;
	}

	private void _validateObjectFieldSettingFileSource(
			String fileSource, String objectFieldName,
			String showFilesInDocumentsAndMedia, String storageDLFolderPath)
		throws PortalException {

		if (Objects.equals(fileSource, "documentsAndMedia")) {
			if (!GetterUtil.getBoolean(
					PropsUtil.get("feature.flag.LPS-148112"))) {

				return;
			}

			_validateObjectFieldSettingFileSourceDocumentsAndMedia(
				objectFieldName, showFilesInDocumentsAndMedia,
				storageDLFolderPath);
		}
		else if (Objects.equals(fileSource, "userComputer")) {
			if (!GetterUtil.getBoolean(
					PropsUtil.get("feature.flag.LPS-148112"))) {

				return;
			}

			_validateObjectFieldSettingFileSourceUserComputer(
				objectFieldName, showFilesInDocumentsAndMedia,
				storageDLFolderPath);
		}
		else {
			throw new ObjectFieldSettingValueException.InvalidValue(
				objectFieldName, "fileSource", fileSource);
		}
	}

	private void _validateObjectFieldSettingFileSourceDocumentsAndMedia(
			String objectFieldName, String showFilesInDocumentsAndMedia,
			String storageDLFolderPath)
		throws PortalException {

		Set<String> notAllowedObjectFieldSettingsNames = new HashSet<>();

		if (Validator.isNotNull(showFilesInDocumentsAndMedia)) {
			notAllowedObjectFieldSettingsNames.add(
				"showFilesInDocumentsAndMedia");
		}

		if (Validator.isNotNull(storageDLFolderPath)) {
			notAllowedObjectFieldSettingsNames.add("storageDLFolderPath");
		}

		if (!notAllowedObjectFieldSettingsNames.isEmpty()) {
			throw new ObjectFieldSettingNameException.NotAllowedNames(
				objectFieldName, notAllowedObjectFieldSettingsNames);
		}
	}

	private void _validateObjectFieldSettingFileSourceUserComputer(
			String objectFieldName, String showFilesInDocumentsAndMedia,
			String storageDLFolderPath)
		throws PortalException {

		if (StringUtil.equalsIgnoreCase(
				showFilesInDocumentsAndMedia, StringPool.FALSE)) {

			if (Validator.isNotNull(storageDLFolderPath)) {
				throw new ObjectFieldSettingNameException.NotAllowedNames(
					objectFieldName,
					Collections.singleton("storageDLFolderPath"));
			}
		}
		else if (StringUtil.equalsIgnoreCase(
					showFilesInDocumentsAndMedia, StringPool.TRUE)) {

			if (Validator.isNull(storageDLFolderPath)) {
				throw new ObjectFieldSettingValueException.
					MissingRequiredValues(
						objectFieldName,
						Collections.singleton("storageDLFolderPath"));
			}

			for (String directoryName :
					StringUtil.split(
						storageDLFolderPath, CharPool.FORWARD_SLASH)) {

				DLValidatorUtil.validateDirectoryName(directoryName);
			}
		}
		else if (Validator.isNull(showFilesInDocumentsAndMedia)) {
			throw new ObjectFieldSettingValueException.MissingRequiredValues(
				objectFieldName,
				Collections.singleton("showFilesInDocumentsAndMedia"));
		}
		else {
			throw new ObjectFieldSettingValueException.InvalidValue(
				objectFieldName, "showFilesInDocumentsAndMedia",
				showFilesInDocumentsAndMedia);
		}
	}

	private void _validateObjectFieldSettingMaximumFileSize(
			String objectFieldName, String objectFieldSettingValue)
		throws PortalException {

		try {
			BigDecimal maximumFileSize = new BigDecimal(
				objectFieldSettingValue);

			if (maximumFileSize.signum() == -1) {
				throw new ObjectFieldSettingValueException.InvalidValue(
					objectFieldName, "maximumFileSize",
					objectFieldSettingValue);
			}
		}
		catch (NumberFormatException numberFormatException) {
			throw new ObjectFieldSettingValueException.InvalidValue(
				objectFieldName, "maximumFileSize", objectFieldSettingValue,
				numberFormatException);
		}
	}

	private static final Log _log = LogFactoryUtil.getLog(
		AttachmentObjectFieldBusinessType.class);

	@Reference
	private DLAppLocalService _dlAppLocalService;

	@Reference
	private DLFolderLocalService _dlFolderLocalService;

	@Reference
	private ObjectFieldSettingLocalService _objectFieldSettingLocalService;

	@Reference
	private PortletFileRepository _portletFileRepository;

	@Reference
	private UserLocalService _userLocalService;

}