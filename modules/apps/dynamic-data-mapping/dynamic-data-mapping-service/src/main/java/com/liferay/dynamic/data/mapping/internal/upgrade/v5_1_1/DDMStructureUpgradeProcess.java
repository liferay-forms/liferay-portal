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

package com.liferay.dynamic.data.mapping.internal.upgrade.v5_1_1;

import com.liferay.petra.string.StringPool;
import com.liferay.portal.json.JSONArrayImpl;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.upgrade.UpgradeProcess;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * @author Daniel Bonasser
 */
public class DDMStructureUpgradeProcess extends UpgradeProcess {

	@Override
	protected void doUpgrade() throws Exception {
		PreparedStatement preparedStatement1 = connection.prepareStatement(
			"select * from DDMStructure");

		PreparedStatement preparedStatement2 = connection.prepareStatement(
			"update DDMStructure set definition = ?");

		ResultSet resultSet1 = preparedStatement1.executeQuery();

		while (resultSet1.next()) {
			String definition = resultSet1.getString("definition");

			JSONObject definitionJSONObject = JSONFactoryUtil.createJSONObject(
				definition);

			JSONArray fieldsJSONArray = definitionJSONObject.getJSONArray(
				"fields");

			String equalsRegex = "equals\\(getValue\\(\\'(\\w+)\\'\\),";
			String notEqualsRegex =
				"not\\(equals\\(getValue\\(\\'(\\w+)\\'\\),";

			for (int x = 0; x < fieldsJSONArray.length(); x++) {
				JSONObject fieldJSONObject = fieldsJSONArray.getJSONObject(x);

				String fieldType = fieldJSONObject.getString("type");

				if (fieldType.equals("numeric")) {
					JSONArray rulesJSONArray =
						definitionJSONObject.getJSONArray("rules");

					if (rulesJSONArray != null) {
						String fieldName = fieldJSONObject.getString("name");

						JSONArray newRulesJSONArray = new JSONArrayImpl();

						for (int y = 0; y < rulesJSONArray.length(); y++) {
							JSONObject ruleJSONObject =
								rulesJSONArray.getJSONObject(y);

							String condition = ruleJSONObject.getString(
								"condition");

							if (condition.contains(fieldName)) {
								ruleJSONObject.remove("condition");

								String[] splitedCondition = condition.split(
									StringPool.SPACE);

								StringBuilder upgradedCondition =
									new StringBuilder();

								for (int z = 0; z < splitedCondition.length;
									 z++) {

									if (splitedCondition[z].matches(
											equalsRegex) ||
										splitedCondition[z].matches(
											notEqualsRegex)) {

										String upgradedValue =
											splitedCondition[z + 1].replace(
												StringPool.APOSTROPHE,
												StringPool.BLANK);

										if (z > 0) {
											upgradedCondition.append(
												StringPool.SPACE);
										}

										upgradedCondition.append(
											splitedCondition[z]);
										upgradedCondition.append(
											StringPool.SPACE);
										upgradedCondition.append(upgradedValue);
										z++;
									}
									else {
										if (z > 0) {
											upgradedCondition.append(
												StringPool.SPACE);
										}

										upgradedCondition.append(
											splitedCondition[z]);
									}
								}

								ruleJSONObject.put(
									"condition", upgradedCondition);

								newRulesJSONArray.put(ruleJSONObject);
							}
							else {
								newRulesJSONArray.put(ruleJSONObject);
							}
						}

						definitionJSONObject.remove("rules");
						definitionJSONObject.put("rules", newRulesJSONArray);
					}
				}
			}

			preparedStatement2.setString(1, definitionJSONObject.toString());

			preparedStatement2.addBatch();
			preparedStatement2.executeBatch();
		}
	}

}