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
  
  // 评论相关操作
  comments: {
    // 获取所有评论，包含用户信息和回复
    getAll: async () => {
      try {
        // 先获取所有评论
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (commentsError) throw commentsError;
        
        // 如果没有评论，直接返回空数组
        if (!commentsData || commentsData.length === 0) {
          return { data: [], error: null };
        }
        
        // 获取所有评论作者的用户信息
        const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('user_profiles')
          .select('id, username, full_name')
          .in('id', userIds);
        
        if (profilesError) throw profilesError;
        
        // 创建用户ID到用户信息的映射
        const userMap = {};
        if (profilesData) {
          profilesData.forEach(profile => {
            userMap[profile.id] = profile;
          });
        }
        
        // 将评论按照父子关系组织
        const topLevelComments = [];
        const repliesMap = {};
        
        // 首先将所有评论按照父子关系分类
        commentsData.forEach(comment => {
          // 添加用户信息
          const enrichedComment = {
            ...comment,
            user_profiles: userMap[comment.user_id] || null,
            replies: []
          };
          
          if (!comment.parent_id) {
            // 这是一个顶级评论
            topLevelComments.push(enrichedComment);
          } else {
            // 这是一个回复
            if (!repliesMap[comment.parent_id]) {
              repliesMap[comment.parent_id] = [];
            }
            repliesMap[comment.parent_id].push(enrichedComment);
          }
        });
        
        // 将回复添加到对应的父评论中
        topLevelComments.forEach(comment => {
          if (repliesMap[comment.id]) {
            comment.replies = repliesMap[comment.id].sort((a, b) => 
              new Date(a.created_at) - new Date(b.created_at)
            );
          }
        });
        
        return { data: topLevelComments, error: null };
      } catch (error) {
        console.error('Error fetching comments:', error);
        return { data: null, error };
      }
    },
    
    // 添加新评论或回复
    add: async (userId, content, parentId = null) => {
      try {
        console.log('开始添加评论或回复，参数:', { userId, content, parentId });
        
        if (!userId) {
          console.error('缺少用户ID');
          return { data: null, error: new Error('必须登录才能发表评论') };
        }
        
        if (!content || content.trim() === '') {
          console.error('评论内容为空');
          return { data: null, error: new Error('评论内容不能为空') };
        }
        
        // 如果是回复，验证父评论是否存在
        if (parentId) {
          const { data: parentComment, error: parentError } = await supabase
            .from('comments')
            .select('id')
            .eq('id', parentId)
            .single();
          
          console.log('检查父评论结果:', { parentComment, parentError });
          
          if (parentError || !parentComment) {
            console.error('父评论不存在:', parentError);
            return { data: null, error: new Error('回复的评论不存在') };
          }
        }
        
        // 检查comments表是否存在
        try {
          const { count, error: tableCheckError } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true });
          
          console.log('表检查结果:', { count, error: tableCheckError });
          
          if (tableCheckError) {
            console.error('表检查错误:', tableCheckError);
            if (tableCheckError.code === '42P01') { // 表不存在的错误代码
              return { data: null, error: new Error('评论表不存在，请先创建表') };
            }
          }
        } catch (tableCheckErr) {
          console.error('检查表时出错:', tableCheckErr);
        }
        
        const newComment = {
          user_id: userId,
          content: content.trim(),
          likes: 0,
          created_at: new Date().toISOString(),
          parent_id: parentId // 如果是回复，设置父评论 ID
        };
        
        console.log('准备添加的评论数据:', newComment);
        
        // 添加新评论或回复
        const { data: insertedComment, error: insertError } = await supabase
          .from('comments')
          .insert([newComment])
          .select('*');
        
        console.log('插入评论响应:', { insertedComment, insertError });
        
        if (insertError) {
          console.error('插入评论错误:', insertError);
          throw insertError;
        }
        
        if (!insertedComment || insertedComment.length === 0) {
          console.error('插入成功但没有返回数据');
          throw new Error('评论添加失败');
        }
        
        console.log('评论插入成功:', insertedComment[0]);
        
        // 获取用户信息
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('id, username, full_name')
          .eq('id', userId)
          .single();
        
        console.log('获取用户信息响应:', { userData, userError });
        
        if (userError && userError.code !== 'PGRST116') { // PGRST116 means no rows returned
          console.error('获取用户信息错误:', userError);
          throw userError;
        }
        
        // 如果是回复，获取父评论的信息
        let parentCommentData = null;
        if (parentId) {
          const { data: parent, error: parentFetchError } = await supabase
            .from('comments')
            .select('*, user_profiles:user_id(username, full_name)')
            .eq('id', parentId)
            .single();
          
          if (!parentFetchError && parent) {
            parentCommentData = parent;
          }
        }
        
        // 将用户信息添加到评论中
        const enrichedComment = {
          ...insertedComment[0],
          user_profiles: userData || null,
          replies: [],
          parent_comment: parentCommentData
        };
        
        console.log('最终返回的带用户信息的评论:', enrichedComment);
        
        return { data: enrichedComment, error: null };
      } catch (error) {
        console.error('添加评论时出错:', error);
        return { data: null, error };
      }
    },
    
    // 点赞评论
    like: async (commentId, userId) => {
      try {
        if (!userId) {
          return { data: null, error: new Error('必须登录才能点赞') };
        }
        
        // 首先检查用户是否已经点赞过该评论
        const { data: existingLike, error: checkError } = await supabase
          .from('comment_likes')
          .select('*')
          .eq('comment_id', commentId)
          .eq('user_id', userId)
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw checkError;
        }
        
        // 如果用户已经点赞过，则取消点赞
        if (existingLike) {
          // 删除点赞记录
          const { error: unlikeError } = await supabase
            .from('comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', userId);
          
          if (unlikeError) throw unlikeError;
          
          // 先获取当前评论的点赞数
          const { data: currentComment, error: getError } = await supabase
            .from('comments')
            .select('likes')
            .eq('id', commentId)
            .single();
            
          if (getError) throw getError;
          
          // 将评论的点赞数-1
          const newLikes = Math.max(0, (currentComment?.likes || 1) - 1);
          const { data: updatedComment, error: updateError } = await supabase
            .from('comments')
            .update({ likes: newLikes })
            .eq('id', commentId)
            .select();
          
          if (updateError) throw updateError;
          
          return { data: { ...updatedComment[0], liked: false }, error: null };
        } else {
          // 添加点赞记录
          const { error: likeError } = await supabase
            .from('comment_likes')
            .insert([{ comment_id: commentId, user_id: userId }]);
          
          if (likeError) throw likeError;
          
          // 先获取当前评论的点赞数
          const { data: currentComment, error: getError } = await supabase
            .from('comments')
            .select('likes')
            .eq('id', commentId)
            .single();
            
          if (getError) throw getError;
          
          // 将评论的点赞数+1
          const newLikes = (currentComment?.likes || 0) + 1;
          const { data: updatedComment, error: updateError } = await supabase
            .from('comments')
            .update({ likes: newLikes })
            .eq('id', commentId)
            .select();
          
          if (updateError) throw updateError;
          
          return { data: { ...updatedComment[0], liked: true }, error: null };
        }
      } catch (error) {
        console.error('Error liking/unliking comment:', error);
        return { data: null, error };
      }
    },
    
    // 检查用户是否已经点赞过评论
    checkLiked: async (commentIds, userId) => {
      try {
        if (!userId || !commentIds || commentIds.length === 0) {
          return { data: {}, error: null };
        }
        
        const { data, error } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', userId)
          .in('comment_id', commentIds);
        
        if (error) throw error;
        
        // 将结果转换为映射对象，便于查询
        const likedMap = {};
        data.forEach(like => {
          likedMap[like.comment_id] = true;
        });
        
        return { data: likedMap, error: null };
      } catch (error) {
        console.error('Error checking liked comments:', error);
        return { data: {}, error };
      }
    }
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
