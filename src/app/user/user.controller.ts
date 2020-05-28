import express from 'express';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import { OK } from 'http-status-codes';
import PostService from '../post/post.service';

class UserController implements Controller {
  public path = '/user';
  public router = express.Router();
  private postService = new PostService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id(\\S{0,})/posts`, authMiddleware(), this.getAllPostsOfUser as any);
  }

  private getAllPostsOfUser = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    const userId = req.params.id;
    try {
      const posts = await this.postService.getPostsForUser(userId, req.user);
      res.status(OK).send(posts);
    } catch (err) {
      next(err);
    }
  };
}

export default UserController;
