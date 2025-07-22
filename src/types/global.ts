export class AppError {
  ok = false;
  message?: string;
  code?: number;
  constructor(p: { message: string; code?: number }) {
    this.message = p.message;
    this.code = p.code;
  }
}

export class AppResponse<T> {
  ok = true;
  data: T;
  message?: string;
  constructor(p: { data: T; ok?: boolean; message?: string }) {
    this.data = p.data;
    this.ok = p.ok ?? true;
    this.message = p.message ?? "Success";
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
