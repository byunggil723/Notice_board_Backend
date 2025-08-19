import { CommentDto } from '../notice-board/get-posts-response.dto';

export class UpdateCommentResponseDto {
  success: boolean;
  updatedComment?: {
    id: string;
    content: string;
    parent: string | null;
    children: CommentDto[] | null;
    createdAt: Date;
    updatedAt: Date;
  };
  latestComment?: {
    id: string;
    content: string;
    parent: string | null;
    children: CommentDto[] | null;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}
