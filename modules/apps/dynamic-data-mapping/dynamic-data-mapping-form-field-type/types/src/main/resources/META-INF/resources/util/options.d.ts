export declare function normalizeOptions({
	editingLanguageId,
	fixedOptions,
	multiple,
	options,
	showEmptyOption,
	valueArray,
}: {
	editingLanguageId: Locale;
	fixedOptions: Option<string>[];
	multiple: boolean;
	options: Option<string>[];
	showEmptyOption: boolean;
	valueArray: string[];
}): {
	separator?: boolean | undefined;
	active?: boolean | undefined;
	checked?: boolean | undefined;
	label: string | undefined;
	type?: 'checkbox' | 'item' | undefined;
	value: string | null;
}[];
export declare function normalizeValue<T>({
	localizedValueEdited,
	multiple,
	normalizedOptions,
	predefinedValueArray,
	valueArray,
}: {
	localizedValueEdited: boolean;
	multiple: boolean;
	normalizedOptions: {
		value: T;
	}[];
	predefinedValueArray: T[];
	valueArray: T[];
}): T[];
interface Option<T> {
	value: T;
	label: LocalizedValue<string>;
}
export {};
