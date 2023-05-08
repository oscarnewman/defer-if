import { describe, expect, it } from "bun:test";
import { deferIf, deferSingleItemConditionally } from ".";
import { TypedDeferredData, defer } from "@remix-run/server-runtime";

const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const doesThrow = async (fn: () => any) => {
  let threw = null;
  try {
    await fn();
  } catch (e: any) {
    threw = e.message;
  }
  return threw;
};


describe("deferSingleItemConditionally", () => {
  it("should return a promise if predicate is true", async () => {
    let { val: p } = await deferSingleItemConditionally(
      Promise.resolve(1),
      true
    );
    expect(p).toBeInstanceOf(Promise);
  });

  it("should return a value if predicate is false", async () => {
    let { val: p } = await deferSingleItemConditionally(
      Promise.resolve(1),
      false
    );
    expect(p).toBe(1);
  });

  it("should block the return if predicate is false", async () => {
    let { val: p } = await deferSingleItemConditionally(wait(10), false);
    let start = Date.now();
    await p;
    let end = Date.now();
    expect(end - start).toBeLessThan(1);
  });

  it("should not block the return if predicate is true", async () => {
    let { val: p } = await deferSingleItemConditionally(wait(10), true);
    let start = Date.now();
    await p;
    let end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(10);
  });
});

describe("deferIf", () => {
  it("errors if alwaysAwait and neverAwait are not disjoint", async () => {
    expect(
      await doesThrow(() =>
        deferIf({ foo: "bar", baz: "bam" }, true, {
          alwaysAwait: ["foo"],
          neverAwait: ["foo"],
        })
      )
    ).toMatch(/disjoint/);
  });

  it("succeeds when alwaysAwait and neverAwait are disjoint", async () => {
    expect(
      async () =>
        await deferIf({ foo: "bar", baz: "bam" }, true, {
          neverAwait: ["foo"],
          alwaysAwait: ["baz"],
        })
    ).not.toThrow();
  });

  it("Acts like `defer` when predicate is true", async () => {
    let { data } = await deferIf(
      { foo: Promise.resolve(true), baz: "bam" },
      true
    );

    expect(data.foo).toBeInstanceOf(Promise);
    expect(data.baz).toBe("bam");
  });

  it("Always blocks when predicate is false", async () => {
    let { data } = await deferIf(
      { foo: Promise.resolve(true), baz: "bam" },
      false
    );

    expect(data.foo).toBe(true);
    expect(data.baz).toBe("bam");
  });

  it("Awaits when predicate is true key is in `alwaysAwait`", async () => {
    let { data } = await deferIf(
      { foo: Promise.resolve(true), baz: "bam" },
      true,
      { alwaysAwait: ["foo"] }
    );

    expect(data.foo).toBe(true);
    expect(data.baz).toBe("bam");
  });

  it("Defers when predicate is false and key is in `neverAwait`", async () => {
    let { data } = await deferIf(
      { foo: Promise.resolve(true), baz: "bam" },
      false,
      { neverAwait: ["foo"] }
    );

    expect(data.foo).toBeInstanceOf(Promise);
    expect(data.baz).toBe("bam");
  });

  it("Returns a valid DeferredData response", async () => {
    let foo = Promise.resolve("bar");
    let baz = Promise.resolve("bam");

    let deferIfResult = await deferIf({ foo, baz }, true);
    let expected = defer({ foo, baz });

    const keysToCheck = [
      "pendingKeysSet",
      "subscribers",
      "deferredKeys",
      "init",
      "data",
    ];
    keysToCheck.forEach((key) => {
      // @ts-expect-error we're accessing private properties here
      expect(deferIfResult[key]).toEqual(expected[key]);
    });
  });
});
