// SPDX-License-Identifier: EUPL-1.2
// Copyright © 2025 Daniel Arthur Gallagher

/**
 * @class ValueCache
 * @classdesc The value is automatically reset to undefined after a given timeout.
 * @template T The type of the value being cached should be consistent.
 */
class ValueCache {
	/**
	 * @type {Number} The TTL of the value in the cache, in milliseconds.
	 */
	#duration;
	/**
	 * @type {T|undefined}
	 * The stored value, or undefined if it has not been set or if it has been cleared.
	 */
	#value;
	/**
	 * @type {NodeJS.Timeout|number|undefined}
	 * The ID to clear a timeout with. In Node.js this may be a Timeout object.
	 */
	#cacheClearId;

	/**
	 * Creates a {@link ValueCache} instance
	 * @param {Number} duration The number of milliseconds to hold the value in cache.
	 * @param {T} [startingValue] The value to immediately set in the cache.
	 * This _will_ be reset undefined after the timeout.
	 */
	constructor(duration, startingValue) {
		if (
			typeof duration !== "number" ||
			duration < 1 ||
			!Number.isFinite(duration)
		) {
			throw new RangeError(
				"The duration (in ms) must be a positive number greater than 0",
			);
		}

		this.#duration = duration;
		if (startingValue !== undefined) {
			// Deliberately sets using the setter in order to tap into the logic
			// for the reset.
			this.value = startingValue;
		}
	}

	/**
	 * The underlying value of the cache, or `undefined` if it is not set.
	 *
	 * **Do not** read multiple times in the same logic: once retrieved the value
	 * could change by the next read, in particular becoming undefined.
	 * @returns {T|undefined}
	 */
	get value() {
		return this.#value;
	}

	/**
	 * Overwrites the cached value, resetting the timeout to the expiry to the
	 * duration defined in the constructor.
	 * @param {T} v The new value
	 */
	set value(v) {
		this.#value = v;

		clearTimeout(this.#cacheClearId);
		const timeoutId = setTimeout(() => {
			this.#value = undefined;
			this.#cacheClearId = undefined;
		}, this.#duration);

		this.#cacheClearId = timeoutId;
	}

	/**
	 * Immediately clear the object:
	 * - setting the value to `undefined`
	 * - deregistering the timeout
	 */
	clear() {
		clearTimeout(this.#cacheClearId);
		this.#cacheClearId = undefined;
		this.#value = undefined;
	}
}

export default ValueCache;
