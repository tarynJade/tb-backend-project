export const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      order: () => ({
        data: [
          {
            id: 1,
            breed: "Siamese",
            temperament: "Playful",
            description: "A friendly cat.",
            hypoallergenic: true,
            image_url: "http://cat-image.com",
          },
        ],
        error: null,
      }),
    }),
    insert: () => ({ error: null }),
    update: () => ({ error: null }),
    delete: () => ({ error: null }),
  }),
};
