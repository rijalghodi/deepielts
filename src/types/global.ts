export class AppError extends Error {
  ok = false;
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export class AppResponse<T> {
  ok: boolean;
  status: number;
  data: T;
  constructor(data: T, status = 200, ok = true) {
    this.status = status;
    this.data = data;
    this.ok = ok;
  }
}

export type ApiResponse<T> = {
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

export type PaginatedResponse<T> = ApiResponse<T & { pagination: Pagination }>;

export type PaginatedRequest = {
  page?: number;
  limit?: number;
  search?: string;
};
