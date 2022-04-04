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

package com.liferay.object.internal.field.business.type.attachment;

import com.liferay.document.library.kernel.exception.FileExtensionException;
import com.liferay.document.library.kernel.exception.FileSizeException;
import com.liferay.object.field.business.type.attachment.AttachmentObjectFieldBusinessTypeHelper;
import com.liferay.object.model.ObjectFieldSetting;
import com.liferay.object.service.ObjectFieldSettingLocalService;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.FileUtil;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.StringUtil;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Carolina Barbosa
 */
@Component(service = AttachmentObjectFieldBusinessTypeHelper.class)
public class AttachmentObjectFieldBusinessTypeHelperImpl
	implements AttachmentObjectFieldBusinessTypeHelper {

	@Override
	public String[] getAcceptedFileExtensions(long objectFieldId) {
		ObjectFieldSetting objectFieldSetting =
			_objectFieldSettingLocalService.fetchObjectFieldSetting(
				objectFieldId, "acceptedFileExtensions");

		if (objectFieldSetting == null) {
			return new String[0];
		}

		return StringUtil.split(objectFieldSetting.getValue());
	}

	@Override
	public long getMaximumFileSize(long objectFieldId) {
		ObjectFieldSetting objectFieldSetting =
			_objectFieldSettingLocalService.fetchObjectFieldSetting(
				objectFieldId, "maximumFileSize");

		if (objectFieldSetting == null) {
			return 0;
		}

		return GetterUtil.getLong(objectFieldSetting.getValue()) *
			_FILE_LENGTH_MB;
	}

	@Override
	public void validateFileExtension(String fileName, long objectFieldId)
		throws FileExtensionException {

		boolean validFileExtension = false;

		String fileExtension = FileUtil.getExtension(fileName);

		for (String acceptedFileExtension :
				getAcceptedFileExtensions(objectFieldId)) {

			if (StringUtil.equalsIgnoreCase(
					fileExtension, StringUtil.trim(acceptedFileExtension))) {

				validFileExtension = true;

				break;
			}
		}

		if (!validFileExtension) {
			throw new FileExtensionException(
				"Invalid file extension for " + fileName);
		}
	}

	@Override
	public void validateFileSize(
			String fileName, long fileSize, long objectFieldId)
		throws FileSizeException {

		long maximumFileSize = getMaximumFileSize(objectFieldId);

		if ((maximumFileSize > 0) && (fileSize > maximumFileSize)) {
			throw new FileSizeException(
				StringBundler.concat(
					"File ", fileName,
					" exceeds the maximum permitted size of ",
					maximumFileSize / _FILE_LENGTH_MB, " MB"));
		}
	}

	private static final long _FILE_LENGTH_MB = 1024 * 1024;

	@Reference
	private ObjectFieldSettingLocalService _objectFieldSettingLocalService;

}