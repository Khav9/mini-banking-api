export interface BoardNames {
  en: string;
  ko: string;
}

export interface Board {
  id: number;
  names: BoardNames;
}

export interface BoardListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    boards: Board[];
  };
}

export interface CreateBoardRequest {
  id: number;
  names: BoardNames;
}

export interface CreateBoardResponse {
  success: boolean;
  message: string;
  code: number;
  data: Record<string, never>;
}

export interface Article {
  id: number;
  subject: string;
  content: string;
}

export interface ArticleListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    articles: Article[];
  };
}

export interface CreateArticleRequest {
  id: number;
  subject: string;
  content: string;
}

export interface CreateArticleResponse {
  success: boolean;
  message: string;
  code: number;
  data: Record<string, never>;
}

export interface ArticleDetailResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    article: Article;
  };
}

export interface UpdateArticleRequest {
  id: number;
  subject: string;
  content: string;
}

export interface UpdateArticleResponse {
  success: boolean;
  message: string;
  code: number;
  data: Record<string, never>;
}

export interface DeleteArticleResponse {
  success: boolean;
  message: string;
  code: number;
  data: Record<string, never>;
}

export interface UpdateBoardRequest {
  id: number;
  names: BoardNames;
}

export interface UpdateBoardResponse {
  success: boolean;
  message: string;
  code: number;
  data: Record<string, never>;
}

export interface DeleteBoardResponse {
  success: boolean;
  message: string;
  code: number;
  data: Record<string, never>;
}
