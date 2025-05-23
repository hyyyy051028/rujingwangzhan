import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端
// 在Vite中使用import.meta.env来访问环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY 

// 创建Supabase客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据库操作相关函数
export const db = {
  // 将用户信息保存到数据库
  saveUserProfile: async (userId, userData) => {
    console.log('Saving user profile to database:', { userId, userData });
    try {
      // 在Supabase中，user_profiles表的id列是一个外键，引用auth.users表的主键
      // 所以我们必须使用用户的认证ID作为id列的值
      
      // 首先获取当前用户的认证信息
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Error getting current user:', authError);
        return { data: null, error: authError };
      }
      
      if (!authData || !authData.user) {
        console.error('No authenticated user found');
        return { data: null, error: new Error('No authenticated user found') };
      }
      
      console.log('Current authenticated user:', authData.user);
      
      // 直接使用传入的userId，而不是从认证信息中获取
      const profileData = {
        id: userId, // 使用传入的userId作为id列的值
        username: userData.username || '',
        full_name: userData.full_name || '',
        email: userData.email || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: userId,
        password: userData.password || '',
      };
      
      console.log('Creating user profile with ID:', userId);
      
      // 不再需要user_id字段，因为id已经是用户ID
      
      console.log('Trying to save profile data with auth user ID:', profileData);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert([profileData]);
      
      if (error) {
        console.error('Error saving user profile:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (e) {
      console.error('Exception saving user profile:', e);
      return { data: null, error: e };
    }
  },
  
  // 获取用户信息
  getUserProfile: async (userId) => {
    try {
      console.log('Getting user profile for ID:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error getting user profile:', error);
      } else {
        console.log('Found user profile:', data);
      }
      
      return { data, error };
    } catch (e) {
      console.error('Exception getting user profile:', e);
      return { data: null, error: e };
    }
  },
  
  // 更新用户信息
  updateUserProfile: async (userId, updates) => {
    try {
      console.log('Updating user profile for ID:', userId, 'with updates:', updates);
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId); 
      
      if (error) {
        console.error('Error updating user profile:', error);
      } else {
        console.log('User profile updated successfully');
      }
      
      return { data, error };
    } catch (e) {
      console.error('Exception updating user profile:', e);
      return { data: null, error: e };
    }
  },
  
  // 获取表中的所有数据
  getAll: async (table) => {
    const { data, error } = await supabase
      .from(table)
      .select('*');
    return { data, error };
  },

  // 根据条件获取数据
  getBy: async (table, column, value) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq(column, value);
    return { data, error };
  },

  // 插入数据
  insert: async (table, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    return { data: result, error };
  },

  // 更新数据
  update: async (table, column, value, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq(column, value)
      .select();
    return { data: result, error };
  },

  // 删除数据
  delete: async (table, column, value) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq(column, value);
    return { data, error };
  }
};

// 身份验证相关函数
export const auth = {
  // 注册新用户
  signUp: async (email, password, options = {}) => {
    console.log('Supabase signUp called with:', { email, password, options });
    try {
      // 确保邮箱格式正确
      if (!email || !email.includes('@') || !email.includes('.')) {
        return { data: null, error: new Error('邮箱格式不正确') };
      }
      
      // 使用用户实际输入的邮箱
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password,
        options: options
      });
      console.log('Supabase反馈:', { data, error });
      return { data, error };
    } catch (e) {
      console.error('Supabase 报错:', e);
      return { data: null, error: e };
    }
  },

  // 登录
  signIn: async (email, password) => {
    console.log('Supabase signIn called with:', { email });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      console.log('Supabase signIn response:', { data: data ? 'data exists' : 'no data', error });
      return { data, error };
    } catch (e) {
      console.error('Supabase signIn error:', e);
      return { data: null, error: e };
    }
  },

  // 登出
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // 获取当前用户
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // 获取会话
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  }
};

// 存储相关函数
export const storage = {
  // 上传文件
  uploadFile: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    return { data, error };
  },

  // 获取文件URL
  getFileUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // 删除文件
  deleteFile: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { data, error };
  }
};

export default supabase;
