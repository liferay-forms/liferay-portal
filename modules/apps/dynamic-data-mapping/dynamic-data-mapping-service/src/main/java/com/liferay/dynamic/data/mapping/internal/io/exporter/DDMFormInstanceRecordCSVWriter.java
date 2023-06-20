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

package com.liferay.dynamic.data.mapping.internal.io.exporter;

import com.liferay.dynamic.data.mapping.io.exporter.DDMFormInstanceRecordWriter;
import com.liferay.dynamic.data.mapping.io.exporter.DDMFormInstanceRecordWriterRequest;
import com.liferay.dynamic.data.mapping.io.exporter.DDMFormInstanceRecordWriterResponse;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.util.CSVUtil;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.ListUtils;

import org.osgi.service.component.annotations.Component;

/**
 * @author Leonardo Barros
 */
@Component(
	property = "ddm.form.instance.record.writer.type=csv",
	service = DDMFormInstanceRecordWriter.class
)
public class DDMFormInstanceRecordCSVWriter
	implements DDMFormInstanceRecordWriter {

	@Override
	public DDMFormInstanceRecordWriterResponse write(
			DDMFormInstanceRecordWriterRequest
				ddmFormInstanceRecordWriterRequest)
		throws Exception {

		StringBundler sb = new StringBundler(3);

		Map<String, String> ddmFormFieldsLabel =
			ddmFormInstanceRecordWriterRequest.getDDMFormFieldsLabel();

		int packageSize = 1000;

		sb.append(writeValues(ddmFormFieldsLabel.values()));

		sb.append(StringPool.NEW_LINE);

		List<List<Map<String, String>>> partitions = ListUtils.partition(
			ddmFormInstanceRecordWriterRequest.getDDMFormFieldValues(),
			packageSize);

		for (List<Map<String, String>> partition : partitions) {
			sb.append(writeRecords(partition));
		}

		String csv = sb.toString();

		DDMFormInstanceRecordWriterResponse.Builder builder =
			DDMFormInstanceRecordWriterResponse.Builder.newBuilder(
				csv.getBytes());

		return builder.build();
	}

	protected String writeRecords(
		List<Map<String, String>> ddmFormFieldValues) {

		StringBundler sb = new StringBundler(ddmFormFieldValues.size() * 2);

		for (Map<String, String> ddmFormFieldsValue : ddmFormFieldValues) {
			sb.append(writeValues(ddmFormFieldsValue.values()));
			sb.append(StringPool.NEW_LINE);
		}

		return sb.toString();
	}

	protected String writeValues(Collection<String> values) {
		StringBundler sb = new StringBundler(values.size() * 2);

		for (String value : values) {
			sb.append(CSVUtil.encode(value));
			sb.append(StringPool.COMMA);
		}

		return sb.toString();
	}

}