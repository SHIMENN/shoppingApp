import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger = new Logger('AppLogger');

  // תיעוד פעולות רגילות
  log(message: string, context = 'General') {
    this.logger.log(`[${context}] ${message}`);
  }

  // תיעוד שגיאות קריטיות
  error(message: string, stack: string, context = 'Error') {
    this.logger.error(`[${context}] ${message}`, stack);
  }
}