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

package com.liferay.dynamic.data.mapping.form.field.type.internal.numeric;

import com.liferay.dynamic.data.mapping.annotations.DDMForm;
import com.liferay.dynamic.data.mapping.annotations.DDMFormField;
import com.liferay.dynamic.data.mapping.annotations.DDMFormLayout;
import com.liferay.dynamic.data.mapping.annotations.DDMFormLayoutColumn;
import com.liferay.dynamic.data.mapping.annotations.DDMFormLayoutPage;
import com.liferay.dynamic.data.mapping.annotations.DDMFormLayoutRow;
import com.liferay.dynamic.data.mapping.annotations.DDMFormRule;
import com.liferay.dynamic.data.mapping.form.field.type.DefaultDDMFormFieldTypeSettings;
import com.liferay.dynamic.data.mapping.model.DDMFormFieldValidation;
import com.liferay.dynamic.data.mapping.model.LocalizedValue;

/**
 * @author Leonardo Barros
 */
@DDMForm(
	rules = {
		@DDMFormRule(
			actions = {
				"setVisible('inputMask', TRUE)",
				"setVisible('repeatable', TRUE)",
				"setVisible('requireConfirmation', TRUE)",
				"setVisible('required', TRUE)", "setVisible('showLabel', TRUE)",
				"setVisible('validation', TRUE)"
			},
			condition = "equals(getValue('hideField'), FALSE)"
		),
		@DDMFormRule(
			actions = {
				"setValue('inputMask', FALSE)", "setValue('repeatable', FALSE)",
				"setValue('requireConfirmation', FALSE)",
				"setValue('required', FALSE)", "setValue('showLabel', TRUE)",
				"setVisible('inputMask', FALSE)",
				"setVisible('repeatable', FALSE)",
				"setVisible('requireConfirmation', FALSE)",
				"setVisible('required', FALSE)",
				"setVisible('showLabel', FALSE)",
				"setVisible('validation', FALSE)"
			},
			condition = "equals(getValue('hideField'), TRUE)"
		),
		@DDMFormRule(
			actions = {
				"setDataType('predefinedValue', getValue('dataType'))",
				"setValidationDataType('validation', getValue('dataType'))",
				"setValidationFieldName('validation', getValue('name'))",
				"setVisible('append', equals(getValue('dataType'), 'double') and equals(getValue('inputMask'), TRUE))",
				"setVisible('appendType', equals(getValue('dataType'), 'double') and equals(getValue('inputMask'), TRUE) and not(isEmpty(getValue('append'))))",
				"setVisible('characterOptions', equals(getValue('dataType'), 'integer') and equals(getValue('inputMask'), TRUE))",
				"setVisible('confirmationErrorMessage', getValue('requireConfirmation'))",
				"setVisible('confirmationLabel', getValue('requireConfirmation'))",
				"setVisible('decimalSymbol', equals(getValue('dataType'), 'double') and equals(getValue('inputMask'), TRUE))",
				"setVisible('direction', getValue('requireConfirmation'))",
				"setVisible('inputMaskFormat', equals(getValue('dataType'), 'integer') and equals(getValue('inputMask'), TRUE))",
				"setVisible('requiredErrorMessage', false)",
				"setVisible('thousandsSeparator', equals(getValue('dataType'), 'double') and equals(getValue('inputMask'), TRUE))",
				"setVisible('tooltip', false)"
			},
			condition = "TRUE"
		)
	}
)
@DDMFormLayout(
	paginationMode = com.liferay.dynamic.data.mapping.model.DDMFormLayout.TABBED_MODE,
	value = {
		@DDMFormLayoutPage(
			title = "%basic",
			value = {
				@DDMFormLayoutRow(
					{
						@DDMFormLayoutColumn(
							size = 12,
							value = {
								"label", "placeholder", "tip", "dataType",
								"required", "requiredErrorMessage"
							}
						)
					}
				)
			}
		),
		@DDMFormLayoutPage(
			title = "%advanced",
			value = {
				@DDMFormLayoutRow(
					{
						@DDMFormLayoutColumn(
							size = 12,
							value = {
								"name", "fieldReference", "predefinedValue",
								"visibilityExpression", "fieldNamespace",
								"indexType", "labelAtStructureLevel",
								"localizable", "nativeField", "readOnly",
								"type", "hideField", "showLabel", "repeatable",
								"requireConfirmation", "direction",
								"confirmationLabel", "confirmationErrorMessage",
								"validation", "tooltip", "inputMask",
								"inputMaskFormat", "characterOptions"
							}
						)
					}
				),
				@DDMFormLayoutRow(
					{
						@DDMFormLayoutColumn(
							size = 6, value = "thousandsSeparator"
						),
						@DDMFormLayoutColumn(size = 6, value = "decimalSymbol")
					}
				),
				@DDMFormLayoutRow(
					{
						@DDMFormLayoutColumn(
							size = 12, value = {"append", "appendType"}
						)
					}
				)
			}
		)
	}
)
public interface NumericDDMFormFieldTypeSettings
	extends DefaultDDMFormFieldTypeSettings {

	@DDMFormField(
		dataType = "string", label = "%prefix-or-suffix",
		properties = "placeholder=%input-mask-append-placeholder",
		tip = "%the-maximum-length-is-10-characters", type = "text"
	)
	public LocalizedValue append();

	@DDMFormField(
		optionLabels = {"%prefix", "%suffix"},
		optionValues = {"prefix", "suffix"}, predefinedValue = "prefix",
		properties = "showLabel=false", type = "radio"
	)
	public String appendType();

	@DDMFormField(label = "%character-options", type = "help_text")
	public boolean characterOptions();

	@DDMFormField(
		dataType = "string", label = "%error-message",
		properties = "initialValue=%the-information-does-not-match",
		type = "text"
	)
	public LocalizedValue confirmationErrorMessage();

	@DDMFormField(
		dataType = "string", label = "%label",
		properties = "initialValue=%confirm", type = "text"
	)
	public LocalizedValue confirmationLabel();

	@DDMFormField(
		label = "%my-numeric-type-is", optionLabels = {"%integer", "%decimal"},
		optionValues = {"integer", "double"}, predefinedValue = "integer",
		type = "radio"
	)
	@Override
	public String dataType();

	@DDMFormField(
		label = "%decimal-separator", optionLabels = {"0.00", "0,00"},
		optionValues = {".", ","}, predefinedValue = "[\".\"]",
		properties = "showEmptyOption=false", type = "select"
	)
	public LocalizedValue decimalSymbol();

	@DDMFormField(
		label = "%direction", optionLabels = {"%horizontal", "%vertical"},
		optionValues = {"horizontal", "vertical"},
		predefinedValue = "[\"vertical\"]",
		properties = "showEmptyOption=false", type = "select"
	)
	public String direction();

	@DDMFormField(
		label = "%hide-field",
		properties = {
			"showAsSwitcher=true",
			"tooltip=%the-user-filling-the-form-will-not-be-able-to-see-this-field"
		}
	)
	public boolean hideField();

	@DDMFormField(label = "%input-mask", properties = "showAsSwitcher=true")
	public boolean inputMask();

	@DDMFormField(
		dataType = "string", label = "%format",
		properties = {
			"placeholder=%input-mask-format-placeholder",
			"tooltip=%an-input-mask-helps-to-ensure-a-predefined-format"
		},
		required = true,
		tip = "%to-create-a-custom-input-mask-you-will-need-to-use-a-specific-set-of-characters",
		type = "text",
		validationErrorMessage = "%you-must-add-at-least-one-0-or-one-9",
		validationExpression = "match(inputMaskFormat, '^$|^(?=.*[09])([^1-8]+)$')"
	)
	public LocalizedValue inputMaskFormat();

	@DDMFormField(
		dataType = "string", label = "%placeholder-text",
		properties = {
			"tooltip=%enter-text-that-assists-the-user-but-is-not-submitted-as-a-field-value",
			"visualProperty=true"
		},
		type = "text"
	)
	public LocalizedValue placeholder();

	@DDMFormField(
		label = "%predefined-value",
		properties = {
			"placeholder=%enter-a-default-value",
			"tooltip=%enter-a-default-value-that-is-submitted-if-no-other-value-is-entered",
			"visualProperty=true"
		},
		type = "numeric"
	)
	@Override
	public LocalizedValue predefinedValue();

	@DDMFormField(
		label = "%require-confirmation", properties = "showAsSwitcher=true"
	)
	public boolean requireConfirmation();

	@DDMFormField(
		label = "%thousands-separator",
		optionLabels = {"%none", "1,000", "1.000", "1 000", "1\'000"},
		optionValues = {"none", ",", ".", " ", "\'"},
		predefinedValue = "[\"none\"]", properties = "showEmptyOption=false",
		type = "select"
	)
	public LocalizedValue thousandsSeparator();

	@DDMFormField
	public LocalizedValue tooltip();

	@DDMFormField(
		dataType = "numeric", label = "%validation", type = "validation"
	)
	@Override
	public DDMFormFieldValidation validation();

}