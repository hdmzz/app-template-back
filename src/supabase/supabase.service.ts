import { Injectable, OnModuleInit } from '@nestjs/common';
import { supabase } from 'src/config/supabase.config';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private clientPub: SupabaseClient
  private clientAdmin: SupabaseClient

  constructor(private configService: ConfigService) {
    this.clientPub = createClient(
      this.configService.get<string>('SUPABASE_URL') as string,
      this.configService.get<string>('SUPABASE_KEY') as string,
    )
  }
  
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
