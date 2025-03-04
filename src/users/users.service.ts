import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .insert([createUserDto]);

    if (error) {
      throw error;
    }
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*');

    if (error) {
      throw error;
    }
    return data as User[];
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id);

    if (error) {
      throw error;
    }
    return data as User[];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .update(updateUserDto)
      .eq('id', id);

    if (error) {
      throw error;
    }
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
    return data;
  }
  async get() {}
}
