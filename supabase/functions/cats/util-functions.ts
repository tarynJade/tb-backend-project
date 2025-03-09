export const validateCatData = (cat, requiresId = false) => {
  const errors = [];

  if (requiresId) {
    if (!cat.id || typeof cat.id !== "number") {
      errors.push("Valid cat ID is required for delete.");
    }
  } else {
    if (
      !cat.breed ||
      typeof cat.breed !== "string" ||
      cat.breed.trim() === ""
    ) {
      errors.push("Valid cat breed is required");
    }

    if (
      !cat.temperament ||
      typeof cat.temperament !== "string" ||
      cat.temperament.trim() === ""
    ) {
      errors.push("Valid temperament is required");
    }

    if (
      !cat.description ||
      typeof cat.description !== "string" ||
      cat.description.trim() === ""
    ) {
      errors.push("Valid description is required");
    }

    if (typeof cat.hypoallergenic !== "boolean") {
      errors.push("Hypoallergenic must be true or false");
    }

    if (!cat.image_url || typeof cat.image_url !== "string") {
      errors.push("Valid image URL is required");
    }
  }

  return errors;
};

export const handleError = (errorMessage, statusCode = 500) => {
  console.error(errorMessage);
  return new Response(JSON.stringify({ error: errorMessage }), {
    status: statusCode,
    headers,
  });
};

export const checkCatExists = async (supabase, id) => {
  const { data, error } = await supabase.from("cats").select("id").eq("id", id);

  if (error) {
    throw new Error("Error checking cat existence: " + error.message);
  }

  return data && data.length > 0;
};
