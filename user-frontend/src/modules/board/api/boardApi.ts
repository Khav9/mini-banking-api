import { axiosInstance } from "@/api/authApi";
import {
  BoardListResponse,
  CreateBoardRequest,
  CreateBoardResponse,
  CreateArticleRequest,
  CreateArticleResponse,
  ArticleListResponse,
  ArticleDetailResponse,
  UpdateArticleRequest,
  UpdateArticleResponse,
  DeleteArticleResponse,
  UpdateBoardRequest,
  UpdateBoardResponse,
  DeleteBoardResponse,
} from "../types/board";

export const boardApi = {
  getBoards: async (): Promise<BoardListResponse> => {
    const response = await axiosInstance.get<BoardListResponse>("/board");
    return response.data;
  },

  createBoard: async (
    data: CreateBoardRequest
  ): Promise<CreateBoardResponse> => {
    const response = await axiosInstance.post<CreateBoardResponse>(
      "/board",
      data
    );
    return response.data;
  },

  getArticles: async (boardId: number): Promise<ArticleListResponse> => {
    const response = await axiosInstance.get<ArticleListResponse>(
      `/board/${boardId}/articles`
    );
    return response.data;
  },

  createArticle: async (
    boardId: number,
    data: CreateArticleRequest
  ): Promise<CreateArticleResponse> => {
    const response = await axiosInstance.post<CreateArticleResponse>(
      `/board/${boardId}/articles`,
      data
    );
    return response.data;
  },

  getArticle: async (
    boardId: number,
    articleId: number
  ): Promise<ArticleDetailResponse> => {
    const response = await axiosInstance.get<ArticleDetailResponse>(
      `/board/${boardId}/articles/${articleId}`
    );
    return response.data;
  },

  updateArticle: async (
    boardId: number,
    articleId: number,
    data: UpdateArticleRequest
  ): Promise<UpdateArticleResponse> => {
    const response = await axiosInstance.put<UpdateArticleResponse>(
      `/board/${boardId}/articles/${articleId}`,
      data
    );
    return response.data;
  },

  deleteArticle: async (
    boardId: number,
    articleId: number
  ): Promise<DeleteArticleResponse> => {
    const response = await axiosInstance.delete<DeleteArticleResponse>(
      `/board/${boardId}/articles/${articleId}`
    );
    return response.data;
  },

  updateBoard: async (
    boardId: number,
    data: UpdateBoardRequest
  ): Promise<UpdateBoardResponse> => {
    const response = await axiosInstance.put<UpdateBoardResponse>(
      `/board/${boardId}`,
      data
    );
    return response.data;
  },

  deleteBoard: async (boardId: number): Promise<DeleteBoardResponse> => {
    const response = await axiosInstance.delete<DeleteBoardResponse>(
      `/board/${boardId}`
    );
    return response.data;
  },
};
