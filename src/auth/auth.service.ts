import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async register(registerDto: RegisterDto) {
    try {
      const { email, password, name } = registerDto;
      
      const { data: authData, error: authError } = await this.supabaseService
        .getClient()
        .auth.signUp({
          email,
          password,
        });
  
      if (authError) {
        throw authError;
      }
  
      if (authData.user) {
        const { data: userData, error: userError } = await this.supabaseService
          .getClient()
          .from('users')
          .insert([
            {
              email,
              name,
              password,
            },
          ]);
  
        if (userError) {
          throw userError;
        }
  
        return {
          user: authData.user,
          userData,
          session: authData.session,
        };
      }
    } catch (error) {
      console.log("Erreur register auth.service.ts: ", error);
      throw new Error(error);
    };
  }

  async loginGoogle() {
    const {data, error} = await this.supabaseService.getClient().auth.signInWithOAuth({
      provider: 'google',
      
    })
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return data;
  }

  async logout(token: string) {
    const { error } = await this.supabaseService
      .getClient()
      .auth.signOut();

    if (error) {
      throw error;
    }

    return { success: true, message: 'Déconnecté avec succès' };
  }
  
  async getCurrentUser(jwt: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.getUser(jwt);

    if (error) {
      throw error;
    }

    return data;
  }
}
