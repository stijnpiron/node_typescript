import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';
import postModel from './post.model';
import Post from './post.interface';
import CreatePostDto from './post.dto';
import HttpException from '../exceptions/HttpException';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import ExceptionWithPayload from '../exceptions/ExceptionWithPayload';
import User from '../user/user.interface';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import { compareStrings } from '../utils/utils';

class PostService {
  private post = postModel;

  public getAllPosts = async (): Promise<Post[]> => {
    const posts = await this.post.find().populate('author', '-password');
    if (posts) return posts;
    throw new HttpException(INTERNAL_SERVER_ERROR, 'Unable to get all posts');
  };

  public getPost = async (id: string): Promise<Post> => {
    const post = await this.post.findById(id);
    if (post) return post;
    throw new PostNotFoundException(id);
  };

  public getPostsForUser = async (author: string, user: User): Promise<Post[]> => {
    if (compareStrings(author, user._id.toString())) {
      const posts = await this.post.find({ author });
      if (posts) return posts;
    }
    throw new NotAuthorizedException();
  };

  public modifyPost = async (id: string, postData: Post): Promise<Post> => {
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
    if (post) return post;
    throw new PostNotFoundException(id);
  };

  public createPost = async (author: string, postData: CreatePostDto): Promise<Post> => {
    const createdPost = new this.post({
      ...postData,
      author,
    });
    const savedPost = await createdPost.save();

    const returnPost = await savedPost.populate('author', '-password').execPopulate();
    if (returnPost) return returnPost;
    throw new ExceptionWithPayload(INTERNAL_SERVER_ERROR, 'Unable to create post', { author, postData });
  };

  public deletePost = async (id: string): Promise<Post> => {
    const deleteResponse = await this.post.findByIdAndDelete(id);
    if (deleteResponse) return deleteResponse;
    throw new ExceptionWithPayload(NOT_FOUND, `Post not found with id ${id}`, {
      id,
    });
  };
}

export default PostService;
