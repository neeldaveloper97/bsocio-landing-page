import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url } = req;
        const now = Date.now();

        this.logger.log(`[Before] Handling ${method} ${url}`);

        return next
            .handle()
            .pipe(
                tap(() =>
                    this.logger.log(
                        `[After] Finished ${method} ${url} in ${Date.now() - now}ms`,
                    ),
                ),
            );
    }
}
