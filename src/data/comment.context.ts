import { GraphQLError } from "graphql";
import { db } from ".";
import { CreateCommentInput, UpdateCommentInput } from "../generated/graphql";

export class Comment {

  
  
  /**
   * GET Comment by Id
   */
  public async getCommentById(id: string) {
    return db.comment.findUnique({ where: { id }, include:{
      author: true,
      blog: true,
    } });
  }

  public async getCommentsByBlogId(blogId: string) {
    return db.comment.findMany({ where: { blogId }, include:{
      author: true,
      blog: true,
    } });
  }

  /**
   * CREATE Comment -
   */
  public async createComment(userId:string ,input: CreateCommentInput) {
    // Check if the blog exists
    const blog = await db.blog.findUnique({ where: { id: input.blogId } });
    if (!blog) {
      throw new GraphQLError(`Blog with ID ${input.blogId} not found`, {
        extensions: {
          code: "NOT_FOUND",
        },
      });
    }
    
    // Create the comment
    return db.comment.create({
      data: {
        content: input.content,
        authorId: userId,
        blogId: input.blogId,
      }
    });
  }

  /**
   * UPDATE Comment -
   */
  public async updateComment(id: string, input: UpdateCommentInput) {
    const comment = await this.getCommentById(id);
    if (!comment) {
      throw new GraphQLError(`Could not find Comment`, {
        extensions: {
          code: "NOT_FOUND",
        },
      });
    }

    return db.comment.update({
      where: { id },
      data: {
        content: input.content ?? comment.content,
      }
    });
  }
  
  /**
   * DELETE Comment -
   */
  public async deleteComment(id: string) {
    const comment = await this.getCommentById(id);
    if (!comment) {
      throw new GraphQLError(`Could not find Comment`, {
        extensions: {
          code: "NOT_FOUND",
        },
      });
    }

    return db.comment.delete({ where: { id } });
  }
}
