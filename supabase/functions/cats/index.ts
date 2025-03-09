import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 200, headers });
    }

    // Handle POST request - add cat
    if (req.method === "POST") {
      const { breed, temperament, description, hypoallergenic, image_url } =
        await req.json();

      if (
        !breed ||
        !temperament ||
        !description ||
        !hypoallergenic ||
        !image_url
      ) {
        return new Response(
          JSON.stringify({ error: "All inputs are required for posting" }),
          {
            status: 400,
            headers,
          }
        );
      }

      const { error } = await supabase
        .from("cats")
        .insert([
          { breed, temperament, description, hypoallergenic, image_url },
        ]);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, message: "Message sent!" }),
        { status: 200, headers }
      );
    }

    // Handle PUT request - edit cat
    if (req.method === "PUT") {
      const { id, breed, temperament, description, hypoallergenic, image_url } =
        await req.json();

      if (!breed) {
        return new Response(
          JSON.stringify({ error: "Cat breed is required for update" }),
          {
            status: 400,
            headers,
          }
        );
      }

      const { data, error } = await supabase
        .from("cats")
        .update({ breed, temperament, description, hypoallergenic, image_url })
        .eq("breed", breed);

      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true, message: "Cat updated successfully!" }),
        { status: 200, headers }
      );
    }

    // Handle DELETE request - delete cat
    if (req.method === "DELETE") {
      const { breed } = await req.json();

      if (!breed || typeof breed !== "string" || breed.trim() === "") {
        return new Response(
          JSON.stringify({ error: "Valid cat breed is required for delete" }),
          {
            status: 400,
            headers,
          }
        );
      }

      const { data: catExists } = await supabase
        .from("cats")
        .select("id")
        .eq("breed", breed);

      if (!catExists || catExists.length === 0) {
        return new Response(
          JSON.stringify({ error: `No cat found with breed: ${breed}` })
        );
      }

      const { error } = await supabase.from("cats").delete().eq("breed", breed);

      if (error) {
        return new Response(JSON.stringify({ error: "Error deleting cat." }));
      }
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers,
    });
  }
});

// mock unit test response
// endpoint calls
// invalid
// happy paths
