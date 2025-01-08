import assert from "node:assert/strict";
import { test, describe } from "node:test";
import { setTimeout } from "node:timers/promises";
import ValueCache from "./cache.mjs";

describe("The ValueCache class", () => {
	test("the initial value is immediately readable", () => {
		const val = "mock";
		const c = new ValueCache(100, val);

		assert.equal(c.value, val);
	});

	test("the value is undefined after the duration", async () => {
		const val = "mock";
		const c = new ValueCache(1, val);

		assert.equal(c.value, val);

		await setTimeout(10);

		assert.equal(c.value, undefined);
	});

	test("the value is prolonged if overwritten", async () => {
		const firstVal = "mock",
			secondVal = "updated";
		// Set up the cache with an initial value
		const c = new ValueCache(50, firstVal);

		// Verify as usual the initial state
		assert.equal(c.value, firstVal);

		// Advance by 40% of the timeout
		await setTimeout(20);

		// Verify that the starting state remains
		assert.equal(c.value, firstVal);

		// Update the value
		c.value = secondVal;

		// Verify the update
		assert.equal(c.value, secondVal);

		// Advance from 20ms to 60ms waited:
		// the original timeout would be exceeded,
		// if it were still active.
		// However it should have been replace, and now
		// the timer is at 80% of the second timeout.
		await setTimeout(40);

		// Verify the updated value remains
		assert.equal(c.value, secondVal);

		// Exceed the timeout
		await setTimeout(20);

		// Verify the updated value is cleared
		assert.equal(c.value, undefined);
	});

	test("the value is immediately removed on clear", async () => {
		const val = "mock";
		const c = new ValueCache(15, val);

		assert.equal(c.value, val);

		c.clear();

		// Verify that the value is unset without ever yielding for the timeout
		assert.equal(c.value, undefined);
	});

	describe("error handling", () => {
		test("it doesn't build with a non-number duration", () => {
			assert.throws(() => {
				new ValueCache("t");
			});
		});

		test("it doesn't build with a duration of 0", () => {
			assert.throws(() => {
				new ValueCache(0);
			});
		});

		test("it doesn't build with a duration of Infinity", () => {
			assert.throws(() => {
				new ValueCache(Infinity);
			});
		});
	});
});
