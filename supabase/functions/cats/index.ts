import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req: Request) => {
  // Simple content-type header is all we need
  const headers = { "Content-Type": "application/json" };

  try {
    // Handle GET request - fetch cats
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("cats")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }

    // Handle POST request - add cat
    if (req.method === "POST") {
      const { breed, age } = await req.json();
      const { error } = await supabase.from("cats").insert([{ breed, age }]);
      
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: "Message sent!" }), { headers });
    }

    if (req.method === "PUT") {
      const { id, breed, age } = await req.json();

      if (!id) {
        return new Response(JSON.stringify({ error: "Cat ID is required for update" }), { 
          status: 400, 
          headers 
        });
      }

      const { error } = await supabase
        .from("cats")
        .update({ breed, age })
        .eq("id", id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: "Cat updated successfully!" }), { headers });
    }

    // Handle unsupported methods
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405, 
      headers 
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500, 
      headers 
    });
  }
});


// Testing curl requests

// curl -L -X POST 'https://nvfptdwvvezwnylxbykg.supabase.co/functions/v1/cats' 
// -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52ZnB0ZHd2dmV6d255bHhieWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTI3MjMsImV4cCI6MjA1NTYyODcyM30.xToPqEl08Mq1C2X1tkBRmYMMRRjop0RdKJ_and86KWo' 
// --data '{"breed": "siamese", "age": 1}'

// curl -L -X PUT 'https://nvfptdwvvezwnylxbykg.supabase.co/functions/v1/cats' 
//   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52ZnB0ZHd2dmV6d255bHhieWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTI3MjMsImV4cCI6MjA1NTYyODcyM30.xToPqEl08Mq1C2X1tkBRmYMMRRjop0RdKJ_and86KWo' 
//   -H 'Content-Type: application/json'
//   --data '{
//     "id": 1,
//     "breed": "Persian",
//     "age": 3
//   }'
