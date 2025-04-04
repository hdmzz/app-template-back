import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async register(registerDto: RegisterDto) {
    try {
      const { email, password, name } = registerDto;

      //if (!email || !password || password.length < 8 || !password.split("").some(char => !isNaN(Number(char)))) {
      //  throw new BadRequestException("Email où mot de passe invalide, le mot de passe doit contenir des chiffres et des caracteres speciaux ET faire au moins 8 caracteres");
      //}
      
      const { data: authData, error: authError } = await this.supabaseService
        .getClient()
        .auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`, // URL pour confirmation email
            data: {
              name, // Données personnalisées stockées dans auth.users
            },
          }
        });
      
      if (authError) {
        console.log("Erreur register function auth.service: ", authError);
        throw new UnauthorizedException(authError.message);
      }
  
      if (authData.user) {  
        return {
          user: authData.user,
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
      console.log("Erreur auth.service.ts login fonction:", error);
      throw new UnauthorizedException(error.message);
    }
    console.log("login function: ", data);

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
