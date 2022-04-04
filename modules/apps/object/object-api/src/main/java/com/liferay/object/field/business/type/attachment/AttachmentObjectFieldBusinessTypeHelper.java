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

package com.liferay.object.field.business.type.attachment;

import com.liferay.document.library.kernel.exception.FileExtensionException;
import com.liferay.document.library.kernel.exception.FileSizeException;

import org.osgi.annotation.versioning.ProviderType;

/**
 * @author Carolina Barbosa
 */
@ProviderType
public interface AttachmentObjectFieldBusinessTypeHelper {

	public String[] getAcceptedFileExtensions(long objectFieldId);

	public long getMaximumFileSize(long objectFieldId);

	public void validateFileExtension(String fileName, long objectFieldId)
		throws FileExtensionException;

	public void validateFileSize(
			String fileName, long fileSize, long objectFieldId)
		throws FileSizeException;

}