import { ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer';

/**
 * Convert camelCase to snake_case
 * @param type output type
 * @param data source data
 * @returns Object with snake_case attribute
 */
export function snakeCaseKeys<T>(type: ClassConstructor<T>, data: T | T[]) {
  const request = plainToInstance(type, data, {
    exposeDefaultValues: true,
  });
  return instanceToPlain(request, {
    exposeDefaultValues: false,
    exposeUnsetFields: false,
  });
}

/**
 * Convert snake_case to camelCase
 * @param type output type
 * @param data source data
 * @returns Object with camelCase attribute
 */
export function camelCaseKeys<T>(type: ClassConstructor<T>, data: T | T[]): T | T[] {
  return plainToInstance(type, data, {
    exposeDefaultValues: true,
  });
}
