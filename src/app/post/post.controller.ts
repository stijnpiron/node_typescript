import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import express from 'express';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import Post from './post.interface';
import { OK } from 'http-status-codes';
import PostService from './post.service';

class PostController implements Controller {
  public path = '/post';
  public router = express.Router();
  private postService = new PostService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);

    this.router
      .all(`${this.path}/*`, authMiddleware())
      .delete(`${this.path}/:id`, this.deletePost)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .post(this.path, validationMiddleware(CreatePostDto), this.createPost as any);
  }

  private getAllPosts = async (
    _: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const posts = await this.postService.getAllPosts();
      res.status(OK).send(posts);
    } catch (err) {
      next(err);
    }
  };

  private getPostById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const post = await this.postService.getPost(id);
      res.status(OK).send(post);
    } catch (err) {
      next(err);
    }
  };

  private modifyPost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const postData: Post = req.body;

    try {
      const post = await this.postService.modifyPost(id, postData);
      res.status(OK).send(post);
    } catch (err) {
      next(err);
    }
  };

  private createPost = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const postData: CreatePostDto = req.body;

    if (!req.user) next(new WrongAuthenticationTokenException());

    const userId: string = req.user._id;

    try {
      const createdPost = await this.postService.createPost(userId, postData);
      res.status(OK).send(createdPost);
    } catch (err) {
      next(err);
    }
  };

  private deletePost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const { id } = req.params;

    try {
      await this.postService.deletePost(id);
      res.status(OK).send();
    } catch (err) {
      next(err);
    }
  };
}

export default PostController;
