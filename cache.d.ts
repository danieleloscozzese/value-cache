// SPDX-License-Identifier: EUPL-1.2
// Copyright © 2025 Daniel Arthur Gallagher

declare module "@dagher/value-cache" {
	/**
	 * @class ValueCache
	 * @classdesc The value is automatically reset to undefined after a given timeout.
	 * @template T The type of the value being cached should be consistent.
	 */
	export default class ValueCache<T> {
		/**
		 * Creates a {@link ValueCache} instance
		 * @param duration The number of milliseconds to hold the value in cache.
		 * @param startingValue The value to immediately set in the cache.
		 * This _will_ be reset undefined after the timeout.
		 */
		constructor(duration: number, startingValue?: T);

		/**
		 * The underlying value of the cache, or `undefined` if it is not set.
		 *
		 * **Do not** read multiple times in the same logic: once retrieved the value
		 * could change by the next read, in particular becoming undefined.
		 */
		get value(): T | undefined;
		/**
		 * Overwrites the cached value, resetting the timeout to the expiry to the
		 * duration defined in the constructor.
		 * @param v The new value
		 */
		set value(v: T);

		/**
		 * Immediately clear the object:
		 * - setting the value to `undefined`
		 * - deregistering the timeout
		 */
		clear(): void;
	}
}
