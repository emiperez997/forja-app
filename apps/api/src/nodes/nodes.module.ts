import { Module } from '@nestjs/common';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // necesario para que JwtAuthGuard tenga la estrategia disponible
  controllers: [NodesController],
  providers: [NodesService],
})
export class NodesModule {}
