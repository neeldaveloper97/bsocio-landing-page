import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction): void {
        const { method, originalUrl } = req;
        const start = Date.now();

        this.logger.log(`Request: ${method} ${originalUrl}`);

        res.on('finish', () => {
            const { statusCode } = res;
            if (statusCode >= 400) {
                // Don't log duration for errors here if we want to rely on the filter, 
                // but standard HTTP logging usually logs everything.
                // Let's keep it simple.
            }
            const duration = Date.now() - start;
            this.logger.log(`Response: ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
        });

        next();
    }
}
