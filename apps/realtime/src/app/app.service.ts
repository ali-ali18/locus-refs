import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: string; timestampISO: string; timestampMs: number } {
    return {
      status: 'ok',
      timestampISO: new Date().toISOString(),
      timestampMs: Date.now(),
    };
  }
}
