export interface StarWarsPagination {
  message: "ok",
  total_records: number,
  total_pages: number,
  previous: string | null,
  next: string | null,
  results: [
    {
      uid: string,
      name: string,
      url: string
    }
  ]
}
