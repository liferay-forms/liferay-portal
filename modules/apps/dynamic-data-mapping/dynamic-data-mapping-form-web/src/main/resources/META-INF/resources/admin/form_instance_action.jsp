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

<%
ResultRow resultRow = (ResultRow)request.getAttribute(WebKeys.SEARCH_CONTAINER_RESULT_ROW);

DDMFormInstance ddmFormInstance = (DDMFormInstance)resultRow.getObject();

FormInstancePermissionCheckerHelper formInstancePermissionCheckerHelper = ddmFormAdminDisplayContext.getPermissionCheckerHelper();
%>

<liferay-ui:icon-menu
	direction="left-side"
	icon="<%= StringPool.BLANK %>"
	markupView="lexicon"
	message="<%= StringPool.BLANK %>"
	showWhenSingleIcon="<%= true %>"
>

	<%
	boolean valid = ddmFormAdminDisplayContext.hasValidDDMFormFields(ddmFormInstance) && ddmFormAdminDisplayContext.hasValidStorageType(ddmFormInstance);
	%>

	<c:if test="<%= formInstancePermissionCheckerHelper.isShowEditIcon(ddmFormInstance) %>">
		<portlet:renderURL var="editURL">
			<portlet:param name="mvcRenderCommandName" value="/admin/edit_form_instance" />
			<portlet:param name="redirect" value="<%= currentURL %>" />
			<portlet:param name="formInstanceId" value="<%= String.valueOf(ddmFormInstance.getFormInstanceId()) %>" />
		</portlet:renderURL>

		<liferay-ui:icon
			cssClass='<%= !valid ? "disabled" : "" %>'
			icon="pencil"
			iconCssClass="inline-item inline-item-before"
			markupView="lexicon"
			message="edit"
			url="<%= editURL %>"
		/>
	</c:if>

	<c:if test="<%= formInstancePermissionCheckerHelper.isShowViewEntriesIcon(ddmFormInstance) %>">
		<portlet:renderURL var="viewEntriesURL">
			<portlet:param name="mvcPath" value="/admin/view_form_instance_records.jsp" />
			<portlet:param name="redirect" value="<%= currentURL %>" />
			<portlet:param name="formInstanceId" value="<%= String.valueOf(ddmFormInstance.getFormInstanceId()) %>" />
		</portlet:renderURL>

		<liferay-ui:icon
			cssClass='<%= !valid ? "disabled" : "" %>'
			icon="list-ul"
			iconCssClass="inline-item inline-item-before"
			markupView="lexicon"
			message="view-entries"
			url="<%= viewEntriesURL %>"
		/>
	</c:if>

	<c:if test="<%= ddmFormAdminDisplayContext.isFormPublished(ddmFormInstance) && formInstancePermissionCheckerHelper.isShowShareIcon(ddmFormInstance) %>">
		<liferay-ui:icon
			cssClass='<%= !valid ? "disabled" : "" %>'
			icon="share"
			iconCssClass="inline-item inline-item-before"
			markupView="lexicon"
			message="share"
			onClick='<%= "Liferay.fire('" + liferayPortletResponse.getNamespace() + "openShareFormModal', { localizedName:" + ddmFormAdminDisplayContext.getFormLocalizedNameJSONObject(ddmFormInstance) + " , shareFormInstanceURL:'" + ddmFormAdminDisplayContext.getShareFormInstanceURL(ddmFormInstance) + "' , url:'" + ddmFormAdminDisplayContext.getPublishedFormURL(ddmFormInstance) + "' , node: this});" %>'
			url="javascript:;"
		/>
	</c:if>

	<%
	boolean showDuplicateIcon = formInstancePermissionCheckerHelper.isShowDuplicateIcon();
	boolean showExportIcon = formInstancePermissionCheckerHelper.isShowExportIcon(ddmFormInstance);
	%>

	<c:if test="<%= showDuplicateIcon || showExportIcon %>">
		<li aria-hidden="true" class="dropdown-divider" role="presentation"></li>
	</c:if>

	<c:if test="<%= showDuplicateIcon %>">
		<liferay-portlet:actionURL name="/dynamic_data_mapping_form/copy_form_instance" var="copyFormInstanceURL">
			<portlet:param name="groupId" value="<%= String.valueOf(scopeGroupId) %>" />
			<portlet:param name="formInstanceId" value="<%= String.valueOf(ddmFormInstance.getFormInstanceId()) %>" />
		</liferay-portlet:actionURL>

		<liferay-ui:icon
			cssClass='<%= !valid ? "disabled" : "" %>'
			icon="copy"
			iconCssClass="inline-item inline-item-before"
			markupView="lexicon"
			message="duplicate"
			url="<%= copyFormInstanceURL %>"
		/>
	</c:if>

	<c:if test="<%= showExportIcon %>">
		<liferay-portlet:resourceURL copyCurrentRenderParameters="<%= false %>" id="/dynamic_data_mapping_form/export_form_instance" var="exportFormInstanceURL">
			<portlet:param name="formInstanceId" value="<%= String.valueOf(ddmFormInstance.getFormInstanceId()) %>" />
		</liferay-portlet:resourceURL>

		<%
		StringBundler sb = new StringBundler(5);

		sb.append("javascript:");
		sb.append(liferayPortletResponse.getNamespace());
		sb.append("exportFormInstance('");
		sb.append(exportFormInstanceURL);
		sb.append("');");
		%>

		<liferay-ui:icon
			cssClass='<%= !valid ? "disabled" : "" %>'
			iconCssClass="inline-item inline-item-before lexicon-icon"
			message="export"
			url="<%= sb.toString() %>"
		/>
	</c:if>

	<c:if test="<%= formInstancePermissionCheckerHelper.isShowPermissionsIcon(ddmFormInstance) %>">
		<li aria-hidden="true" class="dropdown-divider" role="presentation"></li>

		<liferay-security:permissionsURL
			modelResource="<%= DDMFormInstance.class.getName() %>"
			modelResourceDescription="<%= ddmFormInstance.getName(locale) %>"
			resourcePrimKey="<%= String.valueOf(ddmFormInstance.getFormInstanceId()) %>"
			var="permissionsFormInstanceURL"
			windowState="<%= LiferayWindowState.POP_UP.toString() %>"
		/>

		<liferay-ui:icon
			iconCssClass="inline-item inline-item-before lexicon-icon"
			message="permissions"
			method="get"
			url="<%= permissionsFormInstanceURL %>"
			useDialog="<%= true %>"
		/>
	</c:if>

	<c:if test="<%= formInstancePermissionCheckerHelper.isShowDeleteIcon(ddmFormInstance) %>">
		<li aria-hidden="true" class="dropdown-divider" role="presentation"></li>

		<portlet:actionURL name="/dynamic_data_mapping_form/delete_form_instance" var="deleteURL">
			<portlet:param name="formInstanceId" value="<%= String.valueOf(ddmFormInstance.getFormInstanceId()) %>" />
		</portlet:actionURL>

		<liferay-ui:icon
			icon="times-circle"
			iconCssClass="inline-item inline-item-before"
			markupView="lexicon"
			message="delete"
			url="<%= deleteURL %>"
		/>
	</c:if>
</liferay-ui:icon-menu>