import { validateCatData } from "../cats/util-functions.ts";
import { assertEquals } from "https://deno.land/std@0.181.0/testing/asserts.ts";

Deno.test(
  "Valid cat data should pass validation with no errors being logged",
  () => {
    const cat = {
      breed: "Siamese",
      temperament: "Friendly",
      description: "A friendly cat.",
      hypoallergenic: false,
      image_url: "https://example.com/cat.jpg",
    };

    const errors = validateCatData(cat);
    assertEquals(errors.length, 0);
  }
);

Deno.test("Hypoallergenic set as string should return an error", () => {
  const result = validateCatData({
    breed: "siamese",
    temperament: "cute",
    description: "A friendly cat",
    hypoallergenic: "yes",
    image_url: "https://cat-image.com",
  });
  const expectedErrors = ["Hypoallergenic must be true or false"];
  assertEquals(result, expectedErrors);
});

Deno.test("Empty string for description should return an error", () => {
  const result = validateCatData({
    breed: "siamese",
    temperament: "cute",
    description: "",
    hypoallergenic: true,
    image_url: "https://cat-image.com",
  });
  const expectedErrors = ["Valid description is required"];
  assertEquals(result, expectedErrors);
});

Deno.test("Breed number input should return an error", () => {
  const result = validateCatData({
    breed: 34,
    temperament: "cute",
    description: "playful",
    hypoallergenic: true,
    image_url: "https://cat-image.com",
  });
  const expectedErrors = ["Valid cat breed is required"];
  assertEquals(result, expectedErrors);
});

Deno.test("Image_url input missed should return an error", () => {
  const result = validateCatData({
    breed: "Siamese",
    temperament: "cute",
    description: "playful",
    hypoallergenic: true,
  });
  const expectedErrors = ["Valid image URL is required"];
  assertEquals(result, expectedErrors);
});
