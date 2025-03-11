import { validateCatData, checkCatExists } from "../cats/util-functions.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.181.0/testing/asserts.ts";
import { mockSupabase } from "./mockSupabase.js"

Deno.test("checkCatExists should return true for an existing cat", async () => {
  const exists = await checkCatExists(mockSupabase, 1);
  assertEquals(exists, true);
});

Deno.test(
  "checkCatExists should return false for a non-existent cat",
  async () => {
    const mockSupabaseEmpty = {
      from: () => ({
        select: () => ({
          eq: () => ({
            data: [],
            error: null,
          }),
        }),
      }),
    };

    const exists = await checkCatExists(mockSupabaseEmpty, 99);
    assertEquals(exists, false);
  }
);
