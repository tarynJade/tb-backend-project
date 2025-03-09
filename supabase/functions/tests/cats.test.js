import { validateCatData } from "../cats/util-functions.ts";
import { assertEquals } from "https://deno.land/std@0.181.0/testing/asserts.ts";


Deno.test('Valid cat data should pass validation', () => {
    const cat = {
        breed: 'Siamese', 
        temperament: 'Friendly',
        description: 'A friendly cat.',
        hypoallergenic: false,
        image_url: 'https://example.com/cat.jpg',
        };
    
    const errors = validateCatData(cat);
    assertEquals(errors.length, 0);
});
