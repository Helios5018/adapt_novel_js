/**
 * 后端API接口调用模块
 * 提供小说重写系统的各种功能接口
 */

// API基础配置
const API_BASE_URL = 'https://xgztnvbuukdc.sealosbja.site';
const API_BASE_PATH = '/rewrite-novel';

/**
 * 通用的API请求函数
 * @param {string} endpoint - API端点路径
 * @param {object} data - 请求数据
 * @returns {Promise<object>} API响应数据
 */
async function api_request(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_BASE_PATH}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}

/**
 * 替换敏感词函数
 * @param {string} novel_text - 需要替换敏感词的小说文本
 * @param {string} replace_way - 替换方式："symbol"(符号替换)、"pinyin_one"(拼音首字母)、"pinyin_all"(完整拼音)
 * @returns {Promise<string>} 替换敏感词后的文本
 */
async function replace_sensitive_words(novel_text, replace_way) {
  const data = {
    novelText: novel_text,
    replaceWay: replace_way
  };
  
  const result = await api_request('/replace-sensitive-words', data);
  return result.novelTextWithReplaced;
}

/**
 * 重写视角函数
 * @param {string} novel_text - 原始小说文本
 * @param {number} perspective_num - 目标人称编号（1=第一人称，2=第二人称）
 * @returns {Promise<string>} 改写后的小说内容
 */
async function rewrite_perspective(novel_text, perspective_num) {
  const data = {
    novelText: novel_text,
    perspectiveNum: perspective_num
  };
  
  const result = await api_request('/rewrite-perspective', data);
  return result.rewrittenPerspective;
}

/**
 * 重写主角名字函数
 * @param {string} novel_text - 原始小说文本
 * @param {Array<Object>} novel_name - 原始角色名称列表，格式：[{id, name}]
 * @param {Array<Object>} adapted_novel_name - 用户指定的新角色名称列表，格式：[{id, name}]（可选）
 * @returns {Promise<string>} 改写后的小说内容
 */
async function rewrite_main_roles_name(novel_text, novel_name, adapted_novel_name = []) {
  const data = {
    novelText: novel_text,
    novelName: novel_name
  };
  
  // 如果提供了新角色名称，则添加到请求数据中
  if (adapted_novel_name && adapted_novel_name.length > 0) {
    data.adaptedNovelName = adapted_novel_name;
  }
  
  const result = await api_request('/rewrite-main-roles-name', data);
  return result.rewrittenMainRolesName;
}

/**
 * 重写小说内容函数（降重改写）
 * @param {string} novel_text - 原始小说文本
 * @returns {Promise<string>} 降重改写后的小说内容
 */
async function rewrite_novel(novel_text) {
  const data = {
    novelText: novel_text
  };
  
  const result = await api_request('/rewrite-novel-content', data);
  return result.rewrittenNovelContent;
}

/**
 * 添加开头函数
 * @param {string} novel_text - 原始小说文本
 * @returns {Promise<string>} 添加开头后的完整小说内容
 */
async function add_opening(novel_text) {
  const data = {
    novelText: novel_text
  };
  
  const result = await api_request('/add-opening', data);
  return result.novelWithOpening;
}

/**
 * 检测敏感词函数（额外提供的功能）
 * @param {string} novel_text - 需要检测的小说文本
 * @returns {Promise<Array<string>>} 检测到的敏感词数组
 */
async function detect_sensitive_words(novel_text) {
  const data = {
    novelText: novel_text
  };
  
  const result = await api_request('/detect-sensitive-words', data);
  return result.sensitiveWordArray;
}

// ES6 模块导出（用于现代浏览器和模块系统）
export {
  replace_sensitive_words,
  rewrite_perspective,
  rewrite_main_roles_name,
  rewrite_novel,
  add_opening,
  detect_sensitive_words
};

// 兼容性导出：支持传统的模块系统
if (typeof module !== 'undefined' && module.exports) {
  // Node.js环境
  module.exports = {
    replace_sensitive_words,
    rewrite_perspective,
    rewrite_main_roles_name,
    rewrite_novel,
    add_opening,
    detect_sensitive_words
  };
} else if (typeof window !== 'undefined') {
  // 浏览器环境，将函数添加到全局作用域（作为备用方案）
  window.replace_sensitive_words = replace_sensitive_words;
  window.rewrite_perspective = rewrite_perspective;
  window.rewrite_main_roles_name = rewrite_main_roles_name;
  window.rewrite_novel = rewrite_novel;
  window.add_opening = add_opening;
  window.detect_sensitive_words = detect_sensitive_words;
}