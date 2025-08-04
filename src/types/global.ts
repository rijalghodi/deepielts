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

export class AppPaginatedResponse<T> {
  ok = true;
  data: {
    items: T;
    pagination: Pagination;
  };
  message?: string;
  constructor(p: { data: T; pagination: Pagination; ok?: boolean; message?: string }) {
    this.data = {
      items: p.data,
      pagination: p.pagination,
    };
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
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T;
  pagination: Pagination;
}>;

export type PaginatedRequest = {
  page?: number;
  limit?: number;
  search?: string;
};
