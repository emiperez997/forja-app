import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { users } from '../db/schema';
import { DB_PROVIDER, type DrizzleDB } from 'src/db/db. module';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_PROVIDER) private db: DrizzleDB,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await this.db
      .insert(users)
      .values({ email, passwordHash, name })
      .returning();
    return this.buildToken(user);
  }

  async login(email: string, password: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    return this.buildToken(user);
  }

  private buildToken(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
