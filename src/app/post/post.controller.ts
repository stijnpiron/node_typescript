import express from 'express';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import Post from './post.interface';
import postModel from './post.model';
import { OK } from 'http-status-codes';
import PostService from './post.service';

class PostController implements Controller {
  public path = '/posts';
  public router = express.Router();
  private postService = new PostService();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const posts = await this.postService.getAllPosts();
      res.status(OK).send(posts);
    } catch (err) {
      next(err);
    }
  };

  private getPostById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    try {
      const post = await this.postService.getPost(id);
      res.status(OK).send(post);
    } catch (err) {
      next(err);
    }
  };

  private modifyPost = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    const postData: Post = req.body;
    try {
      const post = await this.postService.modifyPost(id, postData);
      res.status(OK).send(post);
    } catch (err) {
      next(err);
    }
  };

  private createPost = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    const postData: CreatePostDto = req.body;
    const userId: string = req.user._id;
    try {
      const createdPost = await this.postService.createPost(userId, postData);
      res.status(OK).send(createdPost);
    } catch (err) {
      next(err);
    }
  };

  private deletePost = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    try {
      const response = await this.postService.deletePost(id);
      res.status(OK).send();
    } catch (err) {
      next(err);
    }
  };
}

export default PostController;
