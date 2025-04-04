// src/auth/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token non fourni');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Vérification et décodage du token JWT
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      if (error || !data.user) {
        throw new UnauthorizedException('Token invalide');
      }

      // Ajouter l'utilisateur à l'objet request pour qu'il soit disponible dans les routes
      request.user = data.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
