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

package com.liferay.object.web.internal.object.entries.upload;

import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectField;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectFieldLocalService;
import com.liferay.object.web.internal.object.entries.upload.util.AttachmentUploadValidator;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.portletfilerepository.PortletFileRepository;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.upload.UploadPortletRequest;
import com.liferay.portal.kernel.util.FileUtil;
import com.liferay.portal.kernel.util.MimeTypes;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.upload.UploadFileEntryHandler;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Carolina Barbosa
 */
@Component(service = AttachmentUploadFileEntryHandler.class)
public class AttachmentUploadFileEntryHandler
	implements UploadFileEntryHandler {

	@Override
	public FileEntry upload(UploadPortletRequest uploadPortletRequest)
		throws IOException, PortalException {

		File file = null;

		try (InputStream inputStream = uploadPortletRequest.getFileAsStream(
				"file")) {

			file = FileUtil.createTempFile(inputStream);

			String fileName = uploadPortletRequest.getFileName("file");

			long objectFieldId = ParamUtil.getLong(
				uploadPortletRequest, "objectFieldId");

			_attachmentUploadValidator.validateFileSize(
				file, fileName, objectFieldId);

			_attachmentUploadValidator.validateFileExtension(
				fileName, objectFieldId);

			long folderId = ParamUtil.getLong(uploadPortletRequest, "folderId");

			ObjectDefinition objectDefinition = _getObjectDefinition(
				objectFieldId);

			ThemeDisplay themeDisplay =
				(ThemeDisplay)uploadPortletRequest.getAttribute(
					WebKeys.THEME_DISPLAY);

			return _portletFileRepository.addPortletFileEntry(
				themeDisplay.getScopeGroupId(), themeDisplay.getUserId(),
				objectDefinition.getClassName(), 0,
				objectDefinition.getPortletId(), folderId, file,
				_portletFileRepository.getUniqueFileName(
					themeDisplay.getScopeGroupId(), folderId, fileName),
				_mimeTypes.getContentType(file, fileName), true);
		}
		finally {
			if (file != null) {
				FileUtil.delete(file);
			}
		}
	}

	private ObjectDefinition _getObjectDefinition(long objectFieldId) {
		ObjectField objectField = _objectFieldLocalService.fetchObjectField(
			objectFieldId);

		return _objectDefinitionLocalService.fetchObjectDefinition(
			objectField.getObjectDefinitionId());
	}

	@Reference
	private AttachmentUploadValidator _attachmentUploadValidator;

	@Reference
	private MimeTypes _mimeTypes;

	@Reference
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Reference
	private ObjectFieldLocalService _objectFieldLocalService;

	@Reference
	private PortletFileRepository _portletFileRepository;

}