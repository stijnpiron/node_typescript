import { OK } from 'http-status-codes';
import express from 'express';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import ReportService from './report.service';

class ReportController implements Controller {
  public path = '/report';
  public router = express.Router();
  private reportService = new ReportService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}`, authMiddleware()).get(`${this.path}`, this.generateReport);
  }

  private generateReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const report = await this.reportService.generateReport();
      res.status(OK).send(report);
    } catch (err) {
      next(err);
    }
  };
}

export default ReportController;
