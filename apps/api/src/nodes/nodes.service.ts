import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DB_PROVIDER, type DrizzleDB } from '../db/db. module';
import { nodes } from '../db/schema';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Injectable()
export class NodesService {
  constructor(@Inject(DB_PROVIDER) private db: DrizzleDB) {}

  async findAll(userId: string) {
    // Trae TODOS los nodos planos del usuario; el árbol se arma en el frontend
    return this.db.select().from(nodes).where(eq(nodes.userId, userId));
  }

  async findOne(userId: string, id: string) {
    const [node] = await this.db
      .select()
      .from(nodes)
      .where(and(eq(nodes.id, id), eq(nodes.userId, userId)));

    if (!node) throw new NotFoundException('Nodo no encontrado');
    return node;
  }

  async create(userId: string, dto: CreateNodeDto) {
    const [node] = await this.db
      .insert(nodes)
      .values({
        userId,
        type: dto.type,
        title: dto.title,
        parentId: dto.parentId ?? null,
        content: dto.type === 'note' ? null : null,
      })
      .returning();
    return node;
  }

  async update(userId: string, id: string, dto: UpdateNodeDto) {
    await this.findOne(userId, id); // valida ownership, tira 404 si no es tuyo

    const [updated] = await this.db
      .update(nodes)
      .set({ ...dto, updatedAt: new Date() })
      .where(and(eq(nodes.id, id), eq(nodes.userId, userId)))
      .returning();

    return updated;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.db
      .delete(nodes)
      .where(and(eq(nodes.id, id), eq(nodes.userId, userId)));
    return { deleted: true };
  }
}
