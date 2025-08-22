import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostRequestDto } from '../dto/notice-board/create-post-request.dto';
import { ClassType } from '@/shared/class-type.enum';
import {
  CommentDto,
  GetPostsResponseDto,
} from '../dto/notice-board/get-posts-response.dto';
import { GetPostsRequestDto } from '../dto/notice-board/get-posts-request.dto';
import { CreatePostsResponseDto } from '../dto/notice-board/create-post-response.dto';
import { UpdatePostRequestDto } from '../dto/notice-board/update-post-request.dto';
import { UpdatePostResponseDto } from '../dto/notice-board/update-post-response.dto';
import { DeletePostRequestDto } from '../dto/notice-board/delete-post-request.dto';
import { DeletePostResponseDto } from '../dto/notice-board/delete-post-response.dto';
import { NoticeBoardPost } from '@/entity/notice-board-post.entity';
import { User } from '@/entity/user.entity';
import { Comment } from '@/entity/comment.entity';

@Injectable()
export class NoticeBoardService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(NoticeBoardPost)
    private readonly postRepo: Repository<NoticeBoardPost>,

    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 기본 데이터 삽입
  async onApplicationBootstrap() {
    const tempUser1 = this.userRepo.create({
      name: '이병길',
      age: 26,
      nickname: 'byunggil',
    });
    await this.userRepo.save(tempUser1);

    const tempUser2 = this.userRepo.create({
      name: '이병문',
      age: 26,
      nickname: 'qudrlf72',
    });
    await this.userRepo.save(tempUser2);

    console.log('🟢 User 기본 데이터 삽입 완료');

    for (let i = 0; i < 100; i++) {
      const tempPost = this.postRepo.create({
        classType: ClassType.CLASS_0,
        author: tempUser1,
        title: `${i + 1}번 게시글`,
        content: `${i + 1}번 게시글의 내용`,
        createdAt: new Date(Date.now() - i * 60000),
      });
      await this.postRepo.save(tempPost);

      for (let j = 0; j < 3; j++) {
        const tempComment = this.commentRepo.create({
          post: tempPost,
          author: tempUser2,
          parent: null,
          content: `${i + 1}번 게시글의 ${j + 1}번 댓글`,
          createdAt: new Date(Date.now() - j * 60000),
        });
        await this.commentRepo.save(tempComment);
      }
    }

    console.log('🟢 NoticeBoardPost 기본 데이터 삽입 완료');
  }

  // 게시글 생성
  async createPost(
    body: CreatePostRequestDto,
  ): Promise<CreatePostsResponseDto> {
    const author = await this.userRepo.findOneBy({ id: body.authorId });
    if (!author) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    const post = this.postRepo.create({
      classType: body.classType,
      author,
      title: body.title,
      content: body.content,
    });

    const result = await this.postRepo.save(post);

    return {
      id: result.id,
      classType: result.classType,
      author: {
        id: result.author.id,
        nickname: result.author.nickname,
      },
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  // 게시글 조회(페이지네이션: 무한 스크롤 방식)
  async getPosts(query: GetPostsRequestDto): Promise<GetPostsResponseDto> {
    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .select('post.id', 'id')
      .where('post.class_type = :classType', { classType: query.classType })
      .orderBy('post.created_at', 'DESC')
      .limit(query.limit + 1);

    if (query.cursor) {
      queryBuilder.andWhere('post.created_at < (:cursor)::timestamptz', {
        cursor: query.cursor,
      });
    }

    const postIds = await queryBuilder.getRawMany();

    const postIdArr = postIds.slice(0, query.limit).map((item) => item.id);

    const posts = await this.postRepo
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.nickname'])
      .where('post.id IN (:...postIdArr)', { postIdArr })
      .orderBy('post.created_at', 'DESC')
      .getMany();

    const comments = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.post', 'post')
      .leftJoin('comment.author', 'author')
      .leftJoin('comment.children', 'child')
      .leftJoin('child.author', 'childAuthor')
      .select([
        'comment.id',
        'comment.content',
        'comment.createdAt',
        'comment.updatedAt',
        'post.id',
        'author.id',
        'author.nickname',
        'child.id',
        'childAuthor.id',
        'childAuthor.nickname',
        'child.content',
        'child.createdAt',
        'child.updatedAt',
      ])
      .where('post.id IN (:...postIdArr)', { postIdArr })
      .andWhere('comment.parent IS NULL')
      .orderBy('comment.createdAt', 'ASC')
      .addOrderBy('child.createdAt', 'ASC')
      .getMany();

    let hasMore = true;
    if (postIds.length <= query.limit) hasMore = false;

    const commentsByPostId = new Map<string, CommentDto[]>();

    for (const comment of comments) {
      const postId = comment.post.id;
      if (!commentsByPostId.has(comment.post.id))
        commentsByPostId.set(postId, []);

      const children =
        comment.children?.map((child) => {
          return {
            id: child.id,
            author: {
              id: child.author.id,
              nickname: child.author.nickname,
            },
            content: child.content,
            parent: comment.id,
            children: null,
            createdAt: child.createdAt,
            updatedAt: child.updatedAt,
          };
        }) ?? null;

      commentsByPostId.get(postId)!.push({
        id: comment.id,
        author: {
          id: comment.author.id,
          nickname: comment.author.nickname,
        },
        content: comment.content,
        parent: comment.parent?.id ?? null,
        children: children,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      });
    }

    const result = {
      posts: posts.map((post) => {
        return {
          id: post.id,
          classType: post.classType,
          author: {
            id: post.author.id,
            nickname: post.author.nickname,
          },
          title: post.title,
          content: post.content,
          comments: commentsByPostId.get(post.id) ?? [],
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      }),
      hasMore,
    };

    return result;
  }

  // 게시글 수정
  async updatePost(
    postId: string,
    body: UpdatePostRequestDto,
  ): Promise<UpdatePostResponseDto> {
    const prevPost = await this.postRepo.findOne({
      where: {
        id: postId,
      },
      relations: {
        author: true,
      },
    });

    if (!prevPost)
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');

    if (prevPost.author.id !== body.authorId)
      throw new ForbiddenException('본인 게시글만 수정할 수 있습니다.');

    if (body.title !== undefined) prevPost.title = body.title;
    if (body.content !== undefined) prevPost.content = body.content;

    try {
      const updatedPost = await this.postRepo.save(prevPost);

      return {
        success: true,
        updatedPost: {
          id: updatedPost.id,
          classType: updatedPost.classType,
          author: {
            id: updatedPost.author.id,
            nickname: updatedPost.author.nickname,
          },
          title: updatedPost.title,
          content: updatedPost.content,
          createdAt: updatedPost.createdAt,
          updatedAt: updatedPost.updatedAt,
        },
      };
    } catch (error) {
      const latestPost = await this.postRepo.findOne({
        where: { id: prevPost.id },
        relations: { author: true },
      });

      if (!latestPost)
        throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');

      return {
        success: false,
        latestPost: {
          id: latestPost.id,
          classType: latestPost.classType,
          author: {
            id: latestPost.author.id,
            nickname: latestPost.author.nickname,
          },
          title: latestPost.title,
          content: latestPost.content,
          createdAt: latestPost.createdAt,
          updatedAt: latestPost.updatedAt,
        },
        error: '수정 중 오류가 발생했습니다.',
      };
    }
  }

  // 게시글 삭제
  async deletePost(
    postId: string,
    body: DeletePostRequestDto,
  ): Promise<DeletePostResponseDto> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
      relations: {
        author: true,
      },
    });
    if (!post) throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');

    if (post.author.id !== body.authorId)
      throw new ForbiddenException('본인 게시글만 삭제할 수 있습니다.');

    await this.postRepo.remove(post);

    return { success: true, message: '해당 게시글을 삭제했습니다.' };
  }
}
