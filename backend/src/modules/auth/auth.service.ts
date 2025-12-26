import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, Language } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.user.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Check if slug exists
    const existingSlug = await this.prisma.organization.findUnique({
      where: { slug: dto.organization.slug },
    });
    if (existingSlug) throw new ConflictException('Organization slug already taken');

    const hashedPassword = await bcrypt.hash(dto.user.password, 10);

    // Transaction to create Org + User
    const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const org = await tx.organization.create({
        data: {
          name: dto.organization.name,
          slug: dto.organization.slug,
        },
      });

      const user = await tx.user.create({
        data: {
          email: dto.user.email,
          password: hashedPassword,
          firstName: dto.user.firstName,
          lastName: dto.user.lastName,
          phone: dto.user.phone,
          language: (dto.user.language as Language) || Language.FRENCH,
          role: 'ADMIN', // First user is Admin
          organizationId: org.id,
        },
      });

      return { org, user };
    });

    const tokens = await this.generateTokens(
      result.user.id,
      result.user.email,
      'ADMIN',
      result.org.id,
    );
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        organizationId: result.org.id,
      },
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.organizationId);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      tokens,
    };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    organizationId: string,
  ) {
    const payload = { sub: userId, email, role, organizationId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15m
    };
  }
}
