import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { STATUS_CODES } from 'http';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;
      response.status(status).json({
        statusCode: status,
        error: STATUS_CODES[status],
        message: message,
      });
      return;
    }

    const errorMessage = exception.message;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = errorMessage;
    switch (errorMessage) {
      case 'Cannot retrieve access token':
      case 'Cannot retrieve github user':
        status = HttpStatus.UNAUTHORIZED;
        message = 'Invalid authorization code';
        break;

      case 'Failed to verify token: tempId':
      case 'tempIdToken does not match':
        status = HttpStatus.UNAUTHORIZED;
        message = 'Expired:tempIdToken';
        break;

      case 'Failed to verify token: access':
        status = HttpStatus.UNAUTHORIZED;
        message = 'Expired:accessToken';
        break;

      case 'Failed to verify token: refresh':
      case 'No matching refresh token':
        status = HttpStatus.UNAUTHORIZED;
        message = 'Expired:refreshToken';
        break;

      case 'Not a logged in member':
        status = HttpStatus.UNAUTHORIZED;
        message = 'Not a logged in member';
        break;
    }

    response.status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message,
    });
  }
}
