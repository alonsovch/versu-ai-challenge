import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/database';
import { AuthUser, LoginRequestDto, RegisterRequestDto } from '../types';

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
  }

  /**
   * Registrar un nuevo usuario
   */
  async register(userData: RegisterRequestDto): Promise<{ user: AuthUser; token: string }> {
    const { name, email, password } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      }
    });

    // Generar token
    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  /**
   * Autenticar usuario
   */
  async login(credentials: LoginRequestDto): Promise<{ user: AuthUser; token: string }> {
    const { email, password } = credentials;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = this.generateToken(user.id);

    // Datos del usuario sin contraseña
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    return {
      user: userWithoutPassword,
      token
    };
  }

  /**
   * Verificar token JWT
   */
  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        }
      });

      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtener perfil de usuario
   */
  async getProfile(userId: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      }
    });

    return user;
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId: string, updateData: Partial<Pick<AuthUser, 'name' | 'avatar'>>): Promise<AuthUser> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      }
    });

    return user;
  }

  /**
   * Generar token JWT
   */
  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      this.JWT_SECRET
    );
  }

  /**
   * Crear usuario de demo para desarrollo
   */
  async createDemoUser(): Promise<{ user: AuthUser; token: string }> {
    const demoEmail = 'demo@versu.ai';
    
    // Verificar si ya existe
    let user = await prisma.user.findUnique({
      where: { email: demoEmail },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      }
    });

    if (!user) {
      // Crear usuario demo
      const hashedPassword = await bcrypt.hash('demo123', 12);
      user = await prisma.user.create({
        data: {
          name: 'Usuario Demo',
          email: demoEmail,
          password: hashedPassword,
          avatar: 'https://avatar.vercel.sh/demo',
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        }
      });
    }

    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }
} 