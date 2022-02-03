<%--
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
--%>

<%@ include file="/admin/init.jsp" %>

<liferay-ui:icon
	message="export"
	onClick='<%= "Liferay.fire('" + liferayPortletResponse.getNamespace() + "openExportFormModal');" %>'
	url="javascript:;"
/>

<aui:script require='<%= mainRequire + "/admin/js/components/export-form/openExportFormModal.es as Modal" %>'>
	Liferay.after('<portlet:namespace />openExportFormModal', () => {
		<liferay-portlet:resourceURL copyCurrentRenderParameters="<%= false %>" id="/dynamic_data_mapping_form/export_form_instance" var="exportFormInstanceURL">
			<portlet:param name="formInstanceId" value='<%= String.valueOf(ParamUtil.getLong(request, liferayPortletResponse.getNamespace() + "formInstanceId")) %>' />
		</liferay-portlet:resourceURL>

		Modal.openExportFormModal({
			csvExport: '<%= ddmFormAdminDisplayContext.getCSVExport() %>',
			exportFormInstanceURL: '<%= exportFormInstanceURL %>',
			fileExtensions: <%= ddmFormAdminDisplayContext.getExportFileExtensionsJSONObject() %>,
			portletNamespace: '<portlet:namespace />',
			spritemap: themeDisplay.getPathThemeImages() + '/clay/icons.svg',
		});
	});
</aui:script>