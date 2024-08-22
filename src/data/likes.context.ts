import { db } from ".";
import { Blog } from ".";

export class Like {
  blog: Blog;
  constructor(blog: Blog) {
    this.blog = blog;
  }

  public async likeBlog(blogId: string, userId: string) {
    const isExist = await this.uniqueLikeCheck(blogId, userId);
    if (isExist) {
      throw new Error("You have already liked this blog.");
    }
    const like = await this.createLike(blogId, userId);
    this.blog.likeIncrement(blogId);
    return like;
  }

  private async createLike(blogId: string, userId: string) {
    return db.like.create({
      data: {
        userId,
        blogId,
      },
    });
  }
  private async uniqueLikeCheck(blogId: string, userId: string) {
    return await db.like.findUnique({
      where: { userId_blogId: { userId, blogId } },
    });
  }
  private async deleteLike(id: string) {
    await db.like.delete({ where: { id } });
  }

  public async unlikeBlog(blogId: string, userId: string) {
    // check if it was already unliked then return from here 
    const isExist = await this.uniqueLikeCheck(blogId, userId);
    if (!isExist) {
      return true
    }
    await this.deleteLike(isExist.id);
    this.blog.likeDecrement(blogId);
    return true;
  }
}

//
