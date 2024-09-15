import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class GlobalExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GlobalExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`Request to ${method} ${url} completed successfully.`);
      }),
      catchError((error) => {
        this.logger.error(
          `Error occurred during request to ${method} ${url}`,
          error.stack
        );

        const status =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const response =
          error instanceof HttpException ? error.getResponse() : null;

        const errorResponse = {
          statusCode: status,
          message:
            response?.["message"] || error.message || "Internal Server Error",
          error: response?.["error"] || error.name || "Internal Server Error",
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        return throwError(() => new HttpException(errorResponse, status));
      })
    );
  }
}
