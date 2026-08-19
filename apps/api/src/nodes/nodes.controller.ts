import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('nodes')
export class NodesController {
  constructor(private nodesService: NodesService) {}

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.nodesService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.nodesService.findOne(user.userId, id);
  }

  @Post()
  create(@CurrentUser() user: { userId: string }, @Body() dto: CreateNodeDto) {
    return this.nodesService.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateNodeDto,
  ) {
    return this.nodesService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.nodesService.remove(user.userId, id);
  }
}
