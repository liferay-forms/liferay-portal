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

package com.liferay.document.library.preview.pdf.internal.util;

import com.liferay.document.library.configuration.DLFileEntryConfiguration;
import com.liferay.document.library.kernel.model.DLFileEntry;
import com.liferay.document.library.kernel.service.DLFileEntryLocalService;
import com.liferay.document.library.kernel.util.PDFProcessor;
import com.liferay.portal.configuration.metatype.bnd.util.ConfigurableUtil;
import com.liferay.portal.kernel.dao.orm.ActionableDynamicQuery;
import com.liferay.portal.kernel.dao.orm.Property;
import com.liferay.portal.kernel.dao.orm.PropertyFactoryUtil;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.repository.liferayrepository.model.LiferayFileEntry;

import java.util.Map;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Roberto Díaz
 */
@Component(
	configurationPid = "com.liferay.document.library.configuration.DLFileEntryConfiguration",
	service = PDFPreviewOptimizer.class
)
public class PDFPreviewOptimizer {

	public void optimize(long companyId) {
		ActionableDynamicQuery actionableDynamicQuery =
			_dlFileEntryLocalService.getActionableDynamicQuery();

		actionableDynamicQuery.setAddCriteriaMethod(
			dynamicQuery -> {
				Property companyIdProperty = PropertyFactoryUtil.forName(
					"companyId");

				dynamicQuery.add(companyIdProperty.eq(companyId));

				Property mimeTypeProperty = PropertyFactoryUtil.forName(
					"mimeType");

				dynamicQuery.add(mimeTypeProperty.eq("application/pdf"));

				Property sizeProperty = PropertyFactoryUtil.forName("size");

				dynamicQuery.add(
					sizeProperty.le(
						_dlFileEntryConfiguration.
							previewableProcessorMaxSize()));
			});
		actionableDynamicQuery.setPerformActionMethod(
			(DLFileEntry dlFileEntry) -> {
				FileEntry fileEntry = new LiferayFileEntry(dlFileEntry);

				try {
					_pdfProcessor.generateImages(
						null, fileEntry.getLatestFileVersion());
				}
				catch (Exception exception) {
					if (_log.isWarnEnabled()) {
						_log.warn(
							"Unable to process file entry " +
								fileEntry.getFileEntryId(),
							exception);
					}
				}
			});

		try {
			actionableDynamicQuery.performActions();
		}
		catch (PortalException portalException) {
			_log.error(portalException);
		}
	}

	@Activate
	@Modified
	protected void activate(Map<String, Object> properties) {
		_dlFileEntryConfiguration = ConfigurableUtil.createConfigurable(
			DLFileEntryConfiguration.class, properties);
	}

	private static final Log _log = LogFactoryUtil.getLog(
		PDFPreviewOptimizer.class);

	private volatile DLFileEntryConfiguration _dlFileEntryConfiguration;

	@Reference
	private DLFileEntryLocalService _dlFileEntryLocalService;

	@Reference
	private PDFProcessor _pdfProcessor;

}