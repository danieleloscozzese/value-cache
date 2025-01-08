# `@dagher/value-cache`

Allows temporarily storing values, resetting them to undefined after a timeout.

The use case is as a simple, so simple that nothing else should be introduced,
cache.
A value retrieved from an expensive operation can be stored, retrieved on the
next pass from memory if it hasn't expired and updated if not.
The ideal is a straightforward result, for example from the same HTTP request
being made or the same file being read in sequence.

The value can be initialised at the creation of the cache, and can be
overwritten (resetting the TTL) at any time.

## Example usage

```typescript
const fiveMinutesInMilliseconds = 300_000;
// Created without a starting value
const cache = new ValueCache(fiveMinutesInMilliseconds);

const retrieveFromNetwork = async () => {
	// Do not use this value after the `await`: the underlying value may have
	// changed in the meantime.
	// It could also be checked and returned without using a variable: the getter
	// is very cheap and just returns the underlying value.
	const cachedValue = cache.value;

	// The value is always reset to `undefined`.
	if (cachedValue !== undefined) {
		return cachedValue;
	} else {
		// This can work because there is no variation on the call, ever
		const fetchedValue = await fetch(
			new URL("/some-fixed-path", "https://example.com"),
			{ headers: new Headers({ Accept: "text/html" }) },
		).then((r) => {
			r.text();
		});

		// The `await` above creates the possibility that an already-scheduled
		// timeout has updated the cache in the meantime.
		// Although the setter clears the timeout, skipping the overwrite works
		// well (and will otherwise be signalled by example by ESLint as a
		// non-atomic operation).
		// Semantically, this check is "if the value is _still_ undefined".
		if (cache.value === undefined) {
			// Cache the retrieved value
			cache.value = fetchedValue;
		}
		return fetchedValue;
	}
};
```
