import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateCatData, handleError, checkCatExists } from "./util-functions.ts";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req: Request) => {
  const headers = { "Content-Type": "application/json" };

  try {
    // Handle GET request - fetch cats
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("cats")
        .select("*")
        .order("breed", { ascending: true });

      if (error) return handleError("Error fetching cats:", 500);

      return new Response(JSON.stringify(data), { status: 200, headers });
    }

    // Handle POST request - add cat
    if (req.method === "POST") {
      const { breed, temperament, description, hypoallergenic, image_url } =
        await req.json();

      const validationErrors = validateCatData({
        breed,
        temperament,
        description,
        hypoallergenic,
        image_url,
      });

      if (validationErrors.length > 0) {
        return new Response(JSON.stringify({ validationErrors }), {
          status: 400,
          headers,
        });
      }

      const { error } = await supabase
        .from("cats")
        .insert([
          { breed, temperament, description, hypoallergenic, image_url },
        ]);

      if (error) return handleError("Error inserting cat into database: ", 500);

      return new Response(
        JSON.stringify({ success: true, message: "Message sent!" }),
        { status: 201, headers }
      );
    }

    // Handle PUT request - edit cat
    if (req.method === "PUT") {
      const { id, breed, temperament, description, hypoallergenic, image_url } =
        await req.json();

      const validationErrors = validateCatData(
        {
          id,
          breed,
          temperament,
          description,
          hypoallergenic,
          image_url,
        },
        true
      );

      if (validationErrors.length > 0) {
        return new Response(JSON.stringify({ validationErrors }), {
          status: 400,
          headers,
        });
      }

      const catExists = await checkCatExists(supabase, id);
      if (!catExists) {
        return new Response(
          JSON.stringify({ error: `No cat found with id: ${id}` }),
          { status: 404, headers }
        );
      }

      const { error } = await supabase
        .from("cats")
        .update({ breed, temperament, description, hypoallergenic, image_url })
        .eq("id", id);

      if (error) return handleError("Error updating Cat: ", 500);

      return new Response(
        JSON.stringify({ success: true, message: "Cat updated successfully!" }),
        { status: 200, headers }
      );
    }

    // Handle DELETE request - delete cat
    if (req.method === "DELETE") {
      const { id } = await req.json();

      const validationErrors = validateCatData({ id }, true);
      if (validationErrors.length > 0) {
        return new Response(JSON.stringify({ validationErrors }), {
          status: 400,
          headers,
        });
      }

      const catExists = await checkCatExists(supabase, id);
      
      if (!catExists) {
        return new Response(
          JSON.stringify({ error: `No cat found with id: ${id}` }),
          { status: 404, headers }
        );
      }

      const { error } = await supabase.from("cats").delete().eq("id", id);

      if (error) return handleError("Error deleting cat: ", 500);

      return new Response(
        JSON.stringify({ success: true, message: "Cat deleted successfully" }),
        { status: 200, headers }
      );
    }

    // Handle unsupported methods
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers,
      }
    );
  }
});
