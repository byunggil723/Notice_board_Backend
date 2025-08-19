export class CreateCommentResponseDto {
  id: string;
  content: string;
  parent: string | null;
  createdAt: Date;
  updatedAt: Date;
}
