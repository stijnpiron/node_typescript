import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';
import postModel from './post.model';
import Post from './post.interface';
import CreatePostDto from './post.dto';
import HttpException from '../exceptions/HttpException';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import ErrorWithPayload from '../exceptions/ErrorWithPayload';
import User from '../user/user.interface';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import { compareStrings } from '../utils/utils';

class PostService {
  private post = postModel;

  public getAllPosts = async () => {
    const posts = await this.post.find().populate('author', '-password');
    if (posts) return posts;
    throw new HttpException(INTERNAL_SERVER_ERROR, 'Unable to get all posts');
  };

  public getPost = async (id: string) => {
    const post = await this.post.findById(id);
    if (post) return post;
    throw new PostNotFoundException(id);
  };

  public getPostsForUser = async (author: string, user: User) => {
    if (compareStrings(author, user._id)) {
      const posts = await this.post.find({ author });
      if (posts) return posts;
    }
    throw new NotAuthorizedException();
  };

  public modifyPost = async (id: string, postData: Post) => {
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
    if (post) return post;
    throw new PostNotFoundException(id);
  };

  public createPost = async (author: string, postData: CreatePostDto) => {
    const createdPost = new this.post({
      ...postData,
      author,
    });
    const savedPost = await createdPost.save();
    const returnPost = await savedPost.populate('author', '-password').execPopulate();
    if (returnPost) return returnPost;
    throw new ErrorWithPayload(INTERNAL_SERVER_ERROR, 'Unable to create post', { author, postData });
  };

  public deletePost = async (id: string) => {
    const deleteResponse = await this.post.findByIdAndDelete(id);
    if (deleteResponse) return deleteResponse;
    throw new ErrorWithPayload(NOT_FOUND, `Post not found with id ${id}`, { id });
  };
}

export default PostService;
