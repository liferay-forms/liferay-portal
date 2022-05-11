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

package com.liferay.object.internal.action.engine;

import com.liferay.dynamic.data.mapping.expression.CreateExpressionRequest;
import com.liferay.dynamic.data.mapping.expression.DDMExpression;
import com.liferay.dynamic.data.mapping.expression.DDMExpressionException;
import com.liferay.dynamic.data.mapping.expression.DDMExpressionFactory;
import com.liferay.object.action.engine.ObjectActionEngine;
import com.liferay.object.action.executor.ObjectActionExecutor;
import com.liferay.object.action.executor.ObjectActionExecutorRegistry;
import com.liferay.object.model.ObjectAction;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.service.ObjectActionLocalService;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.PropsUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.vulcan.dto.converter.DTOConverter;
import com.liferay.portal.vulcan.dto.converter.DTOConverterRegistry;

import java.util.List;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Marco Leo
 * @author Brian Wing Shun Chan
 */
@Component(service = ObjectActionEngine.class)
public class ObjectActionEngineImpl implements ObjectActionEngine {

	@Override
	public void executeObjectActions(
		String className, long companyId, String objectActionTriggerKey,
		JSONObject payloadJSONObject, long userId) {

		try {
			_executeObjectActions(
				className, companyId, objectActionTriggerKey, payloadJSONObject,
				userId);
		}
		catch (Exception exception) {
			_log.error(exception);
		}
	}

	private boolean _evaluateObjectActionCondition(
		String condition, ObjectDefinition objectDefinition,
		JSONObject payloadJSONObject) {

		if (Validator.isNull(condition)) {
			return true;
		}

		try {
			DDMExpression<Boolean> ddmExpression =
				_ddmExpressionFactory.createExpression(
					CreateExpressionRequest.Builder.newBuilder(
						condition
					).build());

			ddmExpression.setVariables(
				_getDDMExpressionVariables(
					objectDefinition, payloadJSONObject));

			return ddmExpression.evaluate();
		}
		catch (DDMExpressionException ddmExpressionException) {
			_log.error(ddmExpressionException);

			return false;
		}
	}

	private void _executeObjectActions(
			String className, long companyId, String objectActionTriggerKey,
			JSONObject payloadJSONObject, long userId)
		throws Exception {

		if ((companyId == 0) || (userId == 0)) {
			return;
		}

		User user = _userLocalService.fetchUser(userId);

		if ((user == null) || (companyId != user.getCompanyId())) {
			return;
		}

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.fetchObjectDefinitionByClassName(
				user.getCompanyId(), className);

		if (objectDefinition == null) {
			return;
		}

		payloadJSONObject.put(
			"companyId", companyId
		).put(
			"userId", userId
		);

		List<ObjectAction> objectActions =
			_objectActionLocalService.getObjectActions(
				objectDefinition.getObjectDefinitionId(),
				objectActionTriggerKey);

		for (ObjectAction objectAction : objectActions) {
			if (GetterUtil.getBoolean(
					PropsUtil.get("feature.flag.LPS-152181")) &&
				!_evaluateObjectActionCondition(
					objectAction.getCondition(), objectDefinition,
					payloadJSONObject)) {

				continue;
			}

			ObjectActionExecutor objectActionExecutor =
				_objectActionExecutorRegistry.getObjectActionExecutor(
					objectAction.getObjectActionExecutorKey());

			objectActionExecutor.execute(
				companyId, objectAction.getParametersUnicodeProperties(),
				payloadJSONObject, userId);
		}
	}

	private Map<String, Object> _getDDMExpressionVariables(
		ObjectDefinition objectDefinition, JSONObject payloadJSONObject) {

		if (!objectDefinition.isSystem()) {
			JSONObject objectEntryJSONObject = payloadJSONObject.getJSONObject(
				"objectEntry");

			return (Map<String, Object>)objectEntryJSONObject.get("values");
		}

		DTOConverter<?, ?> dtoConverter = _dtoConverterRegistry.getDTOConverter(
			objectDefinition.getClassName());

		JSONObject modelDTOJSONObject = payloadJSONObject.getJSONObject(
			"modelDTO" + dtoConverter.getContentType());

		return modelDTOJSONObject.toMap();
	}

	private static final Log _log = LogFactoryUtil.getLog(
		ObjectActionEngineImpl.class);

	@Reference
	private DDMExpressionFactory _ddmExpressionFactory;

	@Reference
	private DTOConverterRegistry _dtoConverterRegistry;

	@Reference
	private ObjectActionExecutorRegistry _objectActionExecutorRegistry;

	@Reference
	private ObjectActionLocalService _objectActionLocalService;

	@Reference
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Reference
	private UserLocalService _userLocalService;

}