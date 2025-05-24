import React, { useState, useEffect, useRef } from 'react';
import { db, supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null); // 当前正在回复的评论ID
  const [replyContent, setReplyContent] = useState(''); // 回复内容
  const replyInputRef = useRef(null); // 回复输入框的引用
  const navigate = useNavigate();

  // 获取当前用户
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data && data.user) {
        setUser(data.user);
        
        // 获取用户点赞过的评论
        if (comments.length > 0) {
          const commentIds = comments.map(comment => comment.id);
          const { data: likedData } = await db.comments.checkLiked(commentIds, data.user.id);
          setLikedComments(likedData || {});
        }
      }
    };
    
    checkUser();
  }, [comments.length]);

  // 获取评论
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await db.comments.getAll();
        if (error) throw error;
        
        setComments(data || []);
        
        // 如果用户已登录，检查点赞状态
        if (user && data && data.length > 0) {
          const commentIds = data.map(comment => comment.id);
          const { data: likedData } = await db.comments.checkLiked(commentIds, user.id);
          setLikedComments(likedData || {});
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('获取评论时出错');
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
    
    // 设置实时订阅，当有新评论时自动更新
    const commentsSubscription = supabase
      .channel('public:comments')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'comments' 
      }, fetchComments)
      .subscribe();
      
    return () => {
      supabase.removeChannel(commentsSubscription);
    };
  }, [user]);

  // 提交评论
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      // 如果用户未登录，跳转到登录页面
      navigate('/login', { state: { message: '请先登录后再发表评论' } });
      return;
    }
    
    if (!newComment.trim()) {
      setError('评论内容不能为空');
      return;
    }
    
    try {
      console.log('尝试添加评论，用户ID:', user.id);
      console.log('评论内容:', newComment);
      
      const { data, error } = await db.comments.add(user.id, newComment);
      
      console.log('添加评论响应:', { data, error });
      
      if (error) {
        console.error('添加评论错误:', error);
        throw error;
      }
      
      // 添加新评论到列表
      if (data) {
        console.log('评论添加成功:', data);
        setComments(prevComments => [data, ...prevComments]);
        setNewComment(''); // 清空输入框
      } else {
        console.warn('评论添加成功但没有返回数据');
      }
    } catch (err) {
      console.error('添加评论时出错:', err);
      setError(err.message || '发表评论时出错');
    }
  };
  
  // 开始回复评论
  const handleStartReply = (commentId) => {
    if (!user) {
      navigate('/login', { state: { message: '请先登录后再回复评论' } });
      return;
    }
    
    setReplyingTo(commentId);
    setReplyContent('');
    
    // 使用setTimeout确保在DOM更新后聚焦输入框
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 100);
  };
  
  // 取消回复
  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };
  
  // 提交回复
  const handleSubmitReply = async (commentId) => {
    if (!user) {
      navigate('/login', { state: { message: '请先登录后再回复评论' } });
      return;
    }
    
    if (!replyContent.trim()) {
      setError('回复内容不能为空');
      return;
    }
    
    try {
      console.log('尝试添加回复，父评论ID:', commentId);
      console.log('回复内容:', replyContent);
      
      const { data, error } = await db.comments.add(user.id, replyContent, commentId);
      
      console.log('添加回复响应:', { data, error });
      
      if (error) {
        console.error('添加回复错误:', error);
        throw error;
      }
      
      // 添加回复到父评论的回复列表中
      if (data) {
        console.log('回复添加成功:', data);
        
        // 更新评论列表，将回复添加到父评论的replies数组中
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), data]
              };
            }
            return comment;
          })
        );
        
        // 清空回复内容并退出回复模式
        setReplyContent('');
        setReplyingTo(null);
      } else {
        console.warn('回复添加成功但没有返回数据');
      }
    } catch (err) {
      console.error('添加回复时出错:', err);
      setError(err.message || '发表回复时出错');
    }
  };

  // 点赞评论或回复
  const handleLikeComment = async (commentId) => {
    if (!user) {
      navigate('/login', { state: { message: '请先登录后再点赞' } });
      return;
    }
    
    // 先立即更新UI，提供即时反馈
    const isCurrentlyLiked = likedComments[commentId];
    
    // 查找评论（可能是顶级评论或回复）
    let commentToUpdate = null;
    let isReply = false;
    let parentCommentId = null;
    
    // 先在顶级评论中查找
    const topLevelComment = comments.find(c => c.id === commentId);
    if (topLevelComment) {
      commentToUpdate = topLevelComment;
    } else {
      // 如果不是顶级评论，在回复中查找
      for (const comment of comments) {
        if (comment.replies && comment.replies.length > 0) {
          const reply = comment.replies.find(r => r.id === commentId);
          if (reply) {
            commentToUpdate = reply;
            isReply = true;
            parentCommentId = comment.id;
            break;
          }
        }
      }
    }
    
    if (!commentToUpdate) {
      console.error('找不到要点赞的评论:', commentId);
      return;
    }
    
    // 计算乐观更新的点赞数
    const optimisticLikeCount = isCurrentlyLiked
      ? Math.max(0, (commentToUpdate.likes || 1) - 1)
      : (commentToUpdate.likes || 0) + 1;
    
    // 乐观更新点赞状态
    setLikedComments(prev => ({
      ...prev,
      [commentId]: !isCurrentlyLiked
    }));
    
    // 更新评论列表
    setComments(prevComments => {
      if (!isReply) {
        // 如果是顶级评论
        return prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: optimisticLikeCount } 
            : comment
        );
      } else {
        // 如果是回复
        return prevComments.map(comment => {
          if (comment.id === parentCommentId) {
            // 更新父评论中的回复
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId
                  ? { ...reply, likes: optimisticLikeCount }
                  : reply
              )
            };
          }
          return comment;
        });
      }
    });
    
    try {
      console.log('尝试点赞/取消点赞:', { 
        commentId, 
        userId: user.id, 
        isReply, 
        parentCommentId,
        currentStatus: isCurrentlyLiked ? '已点赞' : '未点赞' 
      });
      
      const { data, error } = await db.comments.like(commentId, user.id);
      
      if (error) {
        console.error('点赞操作错误:', error);
        throw error;
      }
      
      console.log('点赞操作响应:', data);
      
      if (data) {
        // 使用服务器返回的数据更新状态
        setComments(prevComments => {
          if (!isReply) {
            // 如果是顶级评论
            return prevComments.map(comment => 
              comment.id === commentId 
                ? { ...comment, likes: data.likes } 
                : comment
            );
          } else {
            // 如果是回复
            return prevComments.map(comment => {
              if (comment.id === parentCommentId) {
                // 更新父评论中的回复
                return {
                  ...comment,
                  replies: comment.replies.map(reply => 
                    reply.id === commentId
                      ? { ...reply, likes: data.likes }
                      : reply
                  )
                };
              }
              return comment;
            });
          }
        });
        
        setLikedComments(prev => ({
          ...prev,
          [commentId]: data.liked
        }));
      }
    } catch (err) {
      console.error('点赞操作失败:', err);
      
      // 操作失败时回滚状态
      setComments(prevComments => {
        if (!isReply) {
          // 如果是顶级评论
          return prevComments.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes: isCurrentlyLiked ? comment.likes + 1 : Math.max(0, comment.likes - 1) } 
              : comment
          );
        } else {
          // 如果是回复
          return prevComments.map(comment => {
            if (comment.id === parentCommentId) {
              // 更新父评论中的回复
              return {
                ...comment,
                replies: comment.replies.map(reply => 
                  reply.id === commentId
                    ? { ...reply, likes: isCurrentlyLiked ? reply.likes + 1 : Math.max(0, reply.likes - 1) }
                    : reply
                )
              };
            }
            return comment;
          });
        }
      });
      
      setLikedComments(prev => ({
        ...prev,
        [commentId]: isCurrentlyLiked
      }));
      
      setError(err.message || '点赞操作失败，请稍后再试');
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">旅行者评论</h2>
        
        {/* 评论表单 */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">分享您的旅行体验</h3>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {error}
              <button 
                className="float-right text-red-500 hover:text-red-700"
                onClick={() => setError(null)}
              >
                ×
              </button>
            </div>
          )}
          <form onSubmit={handleSubmitComment}>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder={user ? "分享您的旅行体验和建议..." : "请先登录后再发表评论"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user}
            ></textarea>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  user 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!user}
              >
                发表评论
              </button>
            </div>
          </form>
        </div>
        
        {/* 评论列表 */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">加载评论中...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 bg-white shadow rounded-lg">
              <p className="text-gray-500">暂无评论，成为第一个分享体验的人吧！</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {comment.user_profiles?.username?.charAt(0)?.toUpperCase() || '游'}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">
                        {comment.user_profiles?.username || '匿名用户'}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{comment.content}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <button 
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                          likedComments[comment.id] 
                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                            : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100'
                        }`}
                        onClick={() => handleLikeComment(comment.id)}
                        title={likedComments[comment.id] ? "取消点赞" : "点赞"}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 transition-transform duration-300 ${likedComments[comment.id] ? 'scale-110' : ''}`} 
                          fill={likedComments[comment.id] ? "currentColor" : "none"} 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={likedComments[comment.id] ? 2 : 1.5} 
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
                          />
                        </svg>
                        <span className="font-medium">{comment.likes || 0}</span>
                      </button>
                      
                      <button 
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 transition-all duration-300"
                        onClick={() => handleStartReply(comment.id)}
                        title="回复"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <span>回复</span>
                      </button>
                    </div>
                    
                    {/* 回复输入框 */}
                    {replyingTo === comment.id && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="text-sm text-gray-600 font-medium">
                            回复 {comment.user_profiles?.username || '匿名用户'}:
                          </span>
                        </div>
                        <textarea
                          ref={replyInputRef}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="2"
                          placeholder="输入回复内容..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        ></textarea>
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            className="px-3 py-1.5 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
                            onClick={handleCancelReply}
                          >
                            取消
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
                            onClick={() => handleSubmitReply(comment.id)}
                          >
                            发表回复
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* 回复列表 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-100">
                        <h5 className="text-sm font-medium text-gray-500 mb-2">全部{comment.replies.length}条回复</h5>
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="mb-3 bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-sm">
                                  {reply.user_profiles?.username?.charAt(0)?.toUpperCase() || '游'}
                                </div>
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium text-sm">
                                      {reply.user_profiles?.username || '匿名用户'}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                      {formatDate(reply.created_at)}
                                    </span>
                                  </div>
                                </div>
                                <p className="mt-1 text-sm text-gray-700">{reply.content}</p>
                                <div className="mt-2 flex items-center gap-2">
                                  <button 
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                                      likedComments[reply.id] 
                                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                                        : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100'
                                    }`}
                                    onClick={() => handleLikeComment(reply.id)}
                                    title={likedComments[reply.id] ? "取消点赞" : "点赞"}
                                  >
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      className={`h-5 w-5 transition-transform duration-300 ${likedComments[reply.id] ? 'scale-110' : ''}`} 
                                      fill={likedComments[reply.id] ? "currentColor" : "none"} 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={likedComments[reply.id] ? 2 : 1.5} 
                                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
                                      />
                                    </svg>
                                    <span className="font-medium">{reply.likes || 0}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
