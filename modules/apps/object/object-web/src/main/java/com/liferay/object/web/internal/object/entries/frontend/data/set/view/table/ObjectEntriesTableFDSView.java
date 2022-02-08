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

package com.liferay.object.web.internal.object.entries.frontend.data.set.view.table;

import com.liferay.frontend.data.set.view.table.BaseTableFDSView;
import com.liferay.frontend.data.set.view.table.DateFDSTableSchemaField;
import com.liferay.frontend.data.set.view.table.FDSTableSchema;
import com.liferay.frontend.data.set.view.table.FDSTableSchemaBuilder;
import com.liferay.frontend.data.set.view.table.FDSTableSchemaBuilderFactory;
import com.liferay.frontend.data.set.view.table.FDSTableSchemaField;
import com.liferay.frontend.data.set.view.table.StringFDSTableSchemaField;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectField;
import com.liferay.object.model.ObjectRelationship;
import com.liferay.object.model.ObjectView;
import com.liferay.object.model.ObjectViewColumn;
import com.liferay.object.model.ObjectViewColumnModel;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectFieldLocalService;
import com.liferay.object.service.ObjectRelationshipLocalService;
import com.liferay.object.service.ObjectViewLocalService;
import com.liferay.object.web.internal.util.ObjectRelationshipNameUtil;
import com.liferay.petra.string.StringPool;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author Marco Leo
 * @author Brian Wing Shun Chan
 */
public class ObjectEntriesTableFDSView extends BaseTableFDSView {

	public ObjectEntriesTableFDSView(
		FDSTableSchemaBuilderFactory fdsTableSchemaBuilderFactory,
		ObjectDefinition objectDefinition,
		ObjectDefinitionLocalService objectDefinitionLocalService,
		ObjectFieldLocalService objectFieldLocalService,
		ObjectRelationshipLocalService objectRelationshipLocalService,
		ObjectViewLocalService objectViewLocalService) {

		_fdsTableSchemaBuilderFactory = fdsTableSchemaBuilderFactory;
		_objectDefinition = objectDefinition;
		_objectDefinitionLocalService = objectDefinitionLocalService;
		_objectFieldLocalService = objectFieldLocalService;
		_objectRelationshipLocalService = objectRelationshipLocalService;
		_objectViewLocalService = objectViewLocalService;
	}

	@Override
	public FDSTableSchema getFDSTableSchema(Locale locale) {
		FDSTableSchemaBuilder fdsTableSchemaBuilder =
			_fdsTableSchemaBuilderFactory.create();

		FDSTableSchemaField idFDSTableSchemaField =
			fdsTableSchemaBuilder.addFDSTableSchemaField("id", "id");

		idFDSTableSchemaField.setContentRenderer("actionLink");

		for (ObjectField objectField : _getObjectFields()) {
			FDSTableSchemaField fdsTableSchemaField = null;

			if (Objects.equals(objectField.getDBType(), "Clob") ||
				Objects.equals(objectField.getDBType(), "String")) {

				StringFDSTableSchemaField stringFDSTableSchemaField =
					fdsTableSchemaBuilder.addFDSTableSchemaField(
						StringFDSTableSchemaField.class,
						_getFieldName(objectField),
						objectField.getLabel(locale, true));

				stringFDSTableSchemaField.setTruncate(true);

				fdsTableSchemaField = stringFDSTableSchemaField;
			}
			else if (Objects.equals(objectField.getDBType(), "Date")) {
				DateFDSTableSchemaField dateFDSTableSchemaField =
					fdsTableSchemaBuilder.addFDSTableSchemaField(
						DateFDSTableSchemaField.class,
						_getFieldName(objectField),
						objectField.getLabel(locale, true));

				dateFDSTableSchemaField.setFormat("short");

				fdsTableSchemaField = dateFDSTableSchemaField;
			}
			else {
				fdsTableSchemaField =
					fdsTableSchemaBuilder.addFDSTableSchemaField(
						_getFieldName(objectField),
						objectField.getLabel(locale, true));

				if (Objects.equals(objectField.getDBType(), "Boolean")) {
					fdsTableSchemaField.setContentRenderer("boolean");
				}
			}

			fdsTableSchemaBuilder.addFDSTableSchemaField(fdsTableSchemaField);

			if (!Objects.equals(objectField.getDBType(), "Blob") &&
				objectField.isIndexed()) {

				fdsTableSchemaField.setSortable(true);
			}
		}

		FDSTableSchemaField statusFDSTableSchemaField =
			fdsTableSchemaBuilder.addFDSTableSchemaField("status", "status");

		statusFDSTableSchemaField.setContentRenderer("status");

		fdsTableSchemaBuilder.addFDSTableSchemaField("creator.name", "author");

		return fdsTableSchemaBuilder.build();
	}

	private String _getFieldName(ObjectField objectField) {
		if (objectField.getListTypeDefinitionId() > 0) {
			return objectField.getName() + ".name";
		}
		else if (Objects.equals(
					objectField.getRelationshipType(), "oneToMany")) {

			ObjectRelationship objectRelationship =
				_objectRelationshipLocalService.
					fetchObjectRelationshipByObjectFieldId2(
						objectField.getObjectFieldId());

			ObjectDefinition objectDefinition =
				_objectDefinitionLocalService.fetchObjectDefinition(
					objectRelationship.getObjectDefinitionId1());

			ObjectField titleObjectField =
				_objectFieldLocalService.fetchObjectField(
					objectDefinition.getTitleObjectFieldId());

			String relationshipName =
				ObjectRelationshipNameUtil.getRelationshipName(
					objectField.getName());

			return relationshipName + StringPool.PERIOD +
				titleObjectField.getName();
		}

		return objectField.getName();
	}

	private List<ObjectField> _getObjectFields() {
		ObjectView defaultObjectView =
			_objectViewLocalService.getFirstDefaultObjectView(
				_objectDefinition.getObjectDefinitionId());

		if (defaultObjectView == null) {
			return _objectFieldLocalService.getObjectFields(
				_objectDefinition.getObjectDefinitionId());
		}

		List<ObjectViewColumn> objectViewColumns =
			defaultObjectView.getObjectViewColumns();

		Stream<ObjectViewColumn> objectViewColumnsStream =
			objectViewColumns.stream();

		return objectViewColumnsStream.sorted(
			Comparator.comparingInt(ObjectViewColumnModel::getPriority)
		).map(
			objectViewColumn -> _objectFieldLocalService.fetchObjectField(
				_objectDefinition.getObjectDefinitionId(),
				objectViewColumn.getObjectFieldName())
		).collect(
			Collectors.toList()
		);
	}

	private final FDSTableSchemaBuilderFactory _fdsTableSchemaBuilderFactory;
	private final ObjectDefinition _objectDefinition;
	private final ObjectDefinitionLocalService _objectDefinitionLocalService;
	private final ObjectFieldLocalService _objectFieldLocalService;
	private final ObjectRelationshipLocalService
		_objectRelationshipLocalService;
	private final ObjectViewLocalService _objectViewLocalService;

}