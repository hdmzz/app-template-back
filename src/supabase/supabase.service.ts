import { Injectable, OnModuleInit } from '@nestjs/common';
import { supabase } from 'src/config/supabase.config';

@Injectable()
export class SupabaseService implements OnModuleInit {
  onModuleInit() {
    if (!supabase) {
      throw new Error(
        'Supabase client not initialized. Check your environment variables.',
      );
    }
  }

  getClient() {
    if (!supabase) {
      throw new Error(
        'Supabase client not initialized. Check your environment variables.',
      );
    }
    return supabase;
  }

  async query(table: string) {
    return await supabase.from(table).select('*');
  }
}
