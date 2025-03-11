export const mockSupabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          data: [
            {
              id: 1,
              breed: "Siamese",
              temperament: "Friendly",
              description: "A friendly cat.",
              hypoallergenic: false,
              image_url: "https://example.com/cat.jpg",
            },
          ],
          error: null,
        }),
      }),
    }),
  };