export type SortDir = "asc" | "desc";

export type GlobalResponse<T> = {
  ok?: boolean;
  message?: string;
  status?: number;
  errors?: any[] | null | any;
  data?: T;
};

export type Pagination = {
  page: number;
  lastPage: number;
  totalItems: number;
  itemsPerPage: number;
};

export type PaginatedResponse<T> = GlobalResponse<T> & {
  pagination: Pagination;
};

export type PaginatedRequest = {
  page?: number;
  limit?: number;
  search?: string;
  order?: SortDir;
};
