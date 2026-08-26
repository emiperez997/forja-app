import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
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

  @Get('trash/list')
  findTrash(@CurrentUser() user: { userId: string }) {
    return this.nodesService.findTrash(user.userId);
  }

  @Get('search/query')
  search(@CurrentUser() user: { userId: string }, @Query('q') q: string) {
    if (!q?.trim()) return [];
    return this.nodesService.search(user.userId, q);
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

  @Post(':id/restore')
  restore(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.nodesService.restore(user.userId, id);
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

  @Delete(':id/permanent')
  removePermanent(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.nodesService.removePermanent(user.userId, id);
  }
}
