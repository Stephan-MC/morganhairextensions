import { AbstractControl, FormGroup, FormRecord } from "@angular/forms";

// Overload signatures
export function toFormData(form: FormGroup | FormRecord): FormData;
export function toFormData<T extends object>(data: T): FormData;

/**
 * Converts a FormGroup, FormRecord, or a plain JavaScript object into a FormData object.
 *
 * This function recursively traverses the data structure and appends its values
 * to a FormData object. It correctly formats keys for nested objects and arrays
 * (e.g., 'user[address][street]', 'items[0][id]').
 *
 * It handles primitive values, File objects, Date objects, and null/undefined values.
 *
 * @param source The FormGroup, FormRecord, or object to convert.
 * @returns A FormData object representing the data.
 */
export function toFormData<T extends object>(
	source: FormGroup | FormRecord | T,
): FormData {
	const formData = new FormData();

	const data =
		source instanceof AbstractControl ? source.getRawValue() : source;

	buildFormData(formData, data);

	return formData;
}

function buildFormData(formData: FormData, data: any, parentKey?: string) {
	if (
		data &&
		typeof data === "object" &&
		!(data instanceof Date) &&
		!(data instanceof File)
	) {
		Object.keys(data).forEach((key) => {
			const value = data[key as keyof typeof data];
			// For arrays, the key from Object.keys is the index.
			// This format (e.g., items[0], items[1]) is widely supported.
			const newKey = parentKey ? `${parentKey}[${key}]` : key;
			buildFormData(formData, value, newKey);
		});
	} else {
		// We only append if parentKey is present. For the root object, keys are handled
		// in the initial loop. For primitives, this ensures they are part of a structure.
		if (parentKey) {
			const valueToAppend = data == null ? "" : data;
			formData.append(parentKey, valueToAppend);
		}
	}
}
