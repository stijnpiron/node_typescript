import ExceptionWithPayload from '../exceptions/ExceptionWithPayload';
import userModel from '../user/user.model';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import Report from './report.interface';

class ReportService {
  private user = userModel;

  public generateReport = async (): Promise<Report> => {
    const usersByCountries = await this.user.aggregate([
      {
        $match: {
          'address.country': {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: {
            country: '$address.country',
          },
          users: {
            $push: {
              _id: '$_id',
              name: '$name',
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'users._id',
          foreignField: 'author',
          as: 'articles',
        },
      },
      {
        $addFields: {
          amountOfArticles: {
            $size: '$articles',
          },
        },
      },
      {
        $sort: {
          amountOfArticles: 1,
        },
      },
    ]);
    const countries = await this.user.distinct('address.country');

    const numberOfUsersWithAddress = await this.user.countDocuments({
      address: {
        $exists: true,
      },
    });
    if (usersByCountries && countries && numberOfUsersWithAddress)
      return {
        countries,
        numberOfUsersWithAddress,
        usersByCountries,
      };
    throw new ExceptionWithPayload(INTERNAL_SERVER_ERROR, 'Unable to generate report', {
      usersByCounrties: usersByCountries || undefined,
      countries: countries || undefined,
      numberOfUsersWithAddress: numberOfUsersWithAddress || undefined,
    });
  };
}

export default ReportService;
