import {
  replace_sensitive_words,
  rewrite_perspective,
  rewrite_main_roles_name,
  rewrite_novel,
  add_opening
} from "./get_backend_data.js";

/**
 * @description 主函数，根据传入的选项对小说文本进行改编
 * @param {string} novel_text - 原始小说文本
 * @param {boolean} rewrite_perspective_or_not - 是否重写视角
 * @param {number} perspective_num - 视角编号 (例如 1 代表第一人称, 3 代表第三人称)
 * @param {boolean} rewrite_main_roles_name_or_not - 是否重写主角名
 * @param {string} novel_name - 原始小说名
 * @param {string} adapted_novel_name - 改编后的小说名
 * @param {boolean} rewrite_novel_or_not - 是否重写小说内容
 * @param {boolean} add_opening_or_not - 是否添加开头
 * @param {boolean} replace_sensitive_words_or_not - 是否替换敏感词
 * @param {string} replace_way - 敏感词替换方式
 * @returns {Promise<string>} - 返回改编后的小说文本
 */
async function adapt_novel_main(
  novel_text,
  rewrite_perspective_or_not,
  perspective_num,
  rewrite_main_roles_name_or_not,
  novel_name,
  adapted_novel_name,
  rewrite_novel_or_not,
  add_opening_or_not,
  replace_sensitive_words_or_not,
  replace_way
) {
  // 初始化改编后的小说文本为原始文本
  let adapted_novel_text = novel_text;

  // 检查是否需要重写主角名
  if (rewrite_main_roles_name_or_not) {
    // 调用函数重写主角名
    adapted_novel_text = await rewrite_main_roles_name(
      adapted_novel_text,
      novel_name,
      adapted_novel_name
    );
  }

  // 检查是否需要重写视角
  if (rewrite_perspective_or_not) {
    // 调用函数重写小说视角
    adapted_novel_text = await rewrite_perspective(
      adapted_novel_text,
      perspective_num
    );
  }

  // 检查是否需要添加开头
  if (add_opening_or_not) {
    // 调用函数添加开头
    adapted_novel_text = await add_opening(adapted_novel_text);
  }

  // 检查是否需要重写小说
  if (rewrite_novel_or_not) {
    // 调用函数重写小说
    adapted_novel_text = await rewrite_novel(adapted_novel_text);
  }

  // 检查是否需要替换敏感词
  if (replace_sensitive_words_or_not) {
    // 调用函数替换敏感词
    adapted_novel_text = await replace_sensitive_words(
      adapted_novel_text,
      replace_way
    );
  }

  // 返回最终改编后的小说文本
  return adapted_novel_text;
}

// 角色名改写区域的显示控制
let character_adapt = document.getElementById("character_adapt");
let character_group = document.getElementById("character_group");

// 初始化显示状态
character_group.style.display = character_adapt.checked ? "block" : "none";

character_adapt.addEventListener("change", function () {
  character_group.style.display = this.checked ? "block" : "none";
});

// 人称改写区域的显示控制
let perspective_adapt = document.getElementById("perspective_adapt");
let perspective_group = document.getElementById("perspective_group");

// 初始化显示状态
perspective_group.style.display = perspective_adapt.checked ? "block" : "none";

perspective_adapt.addEventListener("change", function () {
  perspective_group.style.display = this.checked ? "block" : "none";
});

// 敏感词替换区域的显示控制
let sensitive_adapt = document.getElementById("sensitive_adapt");
let sensitive_group = document.getElementById("sensitive_group");

// 初始化显示状态
sensitive_group.style.display = sensitive_adapt.checked ? "block" : "none";

sensitive_adapt.addEventListener("change", function () {
  sensitive_group.style.display = this.checked ? "block" : "none";
});

// 获取小说输入框
let novel_input = document.getElementById("novel_input");

// 获取是否改写角色名
let character_adapt_or_not = document.getElementById("character_adapt");

// 获取原角色名和新角色名输入框
let original_char_1 = document.getElementById("original_char_1");
let new_char_1 = document.getElementById("new_char_1");
let original_char_2 = document.getElementById("original_char_2");
let new_char_2 = document.getElementById("new_char_2");
let original_char_3 = document.getElementById("original_char_3");
let new_char_3 = document.getElementById("new_char_3");

// 获取是否改写人称
let perspective_adapt_or_not = document.getElementById("perspective_adapt");

// 获取人称选择
let first_person = document.getElementById("first_person");
let second_person = document.getElementById("second_person");

// 默认选中第一人称
first_person.checked = true;

// 获取是否增加精彩开头
let opening_adapt_or_not = document.getElementById("opening_adapt");

// 获取是否降重改写
let rewrite_adapt_or_not = document.getElementById("rewrite_adapt");

// 获取是否进行敏感词替换
let sensitive_adapt_or_not = document.getElementById("sensitive_adapt");

// 获取敏感词替换方式
let select_way = document.getElementById("select");

// 获取开始改写按钮
let adapt_btn = document.getElementById("adapt_btn");
let output = document.getElementById("output");

/**
 * @description 当点击“开始改写”按钮时触发的事件
 */
adapt_btn.addEventListener("click", async function () {
  // 1. 获取小说原文
  let novel_text = novel_input.value;

  // 1.1 检查小说原文是否为空
  if (!novel_text) {
    alert("请输入小说原文");
    return;
  }

  // 1.2 检查输入是否超过50个字，小于6000个字
  if (novel_text.length < 50) {
    alert("小说原文不能少于50个字");
    return;
  }
  if (novel_text.length > 6000) {
    alert("小说原文不能超过6000个字");
    return;
  }

  // 2. 获取角色名改写选项
  let rewrite_main_roles_name_or_not = character_adapt_or_not.checked;
  let novel_name = [];
  let adapted_novel_name = [];

  if (rewrite_main_roles_name_or_not) {
    // 2.1 判断原角色名是否为空
    if (
      !original_char_1.value &&
      !original_char_2.value &&
      !original_char_3.value
    ) {
      alert("请输入原角色名");
      return;
    }
    // 原名
    if (original_char_1.value) {
      novel_name.push({ id: 1, name: original_char_1.value });
    }
    if (original_char_2.value) {
      novel_name.push({ id: 2, name: original_char_2.value });
    }
    if (original_char_3.value) {
      novel_name.push({ id: 3, name: original_char_3.value });
    }
    // 改名
    if (new_char_1.value) {
      adapted_novel_name.push({ id: 1, name: new_char_1.value });
    }
    if (new_char_2.value) {
      adapted_novel_name.push({ id: 2, name: new_char_2.value });
    }
    if (new_char_3.value) {
      adapted_novel_name.push({ id: 3, name: new_char_3.value });
    }
  }

  // 3. 获取人称改写选项
  let rewrite_perspective_or_not = perspective_adapt_or_not.checked;
  let perspective_num = 0;
  if (rewrite_perspective_or_not) {
    if (first_person.checked) {
      perspective_num = 1;
    } else if (second_person.checked) {
      perspective_num = 2;
    }
  }

  // 4. 获取其他改写选项
  let add_opening_or_not = opening_adapt_or_not.checked;
  let rewrite_novel_or_not = rewrite_adapt_or_not.checked;

  // 5. 获取敏感词替换选项
  let replace_sensitive_words_or_not = sensitive_adapt_or_not.checked;
  let replace_way = "";
  if (select_way.value === "symbol") {
    replace_way = "symbol";
  } else if (select_way.value === "pinyin_one") {
    replace_way = "pinyin_one";
  } else if (select_way.value === "pinyin_all") {
    replace_way = "pinyin_all";
  }

  // 5.5 判断是否没有选中任何一个改写选项
  if (
    !rewrite_main_roles_name_or_not &&
    !rewrite_perspective_or_not &&
    !rewrite_novel_or_not &&
    !add_opening_or_not &&
    !replace_sensitive_words_or_not
  ) {
    alert("请至少选择一种改写选项");
    return;
  }

  // 显示提示信息，并禁用按钮
  output.value = "正在改写中，请稍候...";
  adapt_btn.disabled = true;
  adapt_btn.innerText = "改写中...";

  try {
    // 6. 调用主函数进行改写
    let adapted_novel_text = await adapt_novel_main(
      novel_text,
      rewrite_perspective_or_not,
      perspective_num,
      rewrite_main_roles_name_or_not,
      novel_name,
      adapted_novel_name,
      rewrite_novel_or_not,
      add_opening_or_not,
      replace_sensitive_words_or_not,
      replace_way
    );

    // 7. 将结果显示在输出框
    output.value = adapted_novel_text;
    
    // 手动触发输出区域字数统计更新
  const output_word_count_span = document.getElementById("output_word_count");
  const output_word_count_display = document.getElementById("output_word_count_display");
  if (output_word_count_span && output_word_count_display) {
    const word_count = adapted_novel_text.length;
    output_word_count_span.textContent = word_count;
    if (word_count > 0) {
      output_word_count_display.style.display = "block";
    } else {
      output_word_count_display.style.display = "none";
    }
  }
  
  // 手动触发去除换行按钮状态更新
  const remove_linebreak_btn = document.getElementById("remove_linebreak_btn");
  if (remove_linebreak_btn) {
    if (adapted_novel_text.trim() === "") {
      remove_linebreak_btn.disabled = true;
    } else {
      remove_linebreak_btn.disabled = false;
    }
  }
  } catch (error) {
    console.error("改写小说时发生错误:", error);
    output.value = "改写失败，请检查控制台错误信息。";
  } finally {
    // 无论成功或失败，都重新启用按钮
    adapt_btn.disabled = false;
    adapt_btn.innerText = "开始改写";
  }
});

/**
 * 字数统计功能
 * 实时监听输入框内容变化，更新字数显示
 * 当字数小于50或大于6000时显示警告样式
 */
function init_word_count_module() {
  // 获取相关DOM元素
  const novel_input = document.getElementById("novel_input");
  const word_count_display = document.getElementById("word_count_display");
  const word_count_span = document.getElementById("word_count");

  /**
   * 更新字数显示
   * @param {string} text - 输入的文本内容
   */
  function update_word_count(text) {
    const word_count = text.length;
    word_count_span.textContent = word_count;

    // 检查字数是否在合理范围内
    if (word_count > 6000) {
      // 添加警告样式
      word_count_display.classList.add("word_count_warning");
    } else {
      // 移除警告样式
      word_count_display.classList.remove("word_count_warning");
    }
  }

  // 监听输入框内容变化事件
  novel_input.addEventListener("input", function () {
    update_word_count(this.value);
  });

  // 监听输入框粘贴事件
  novel_input.addEventListener("paste", function () {
    // 使用setTimeout确保粘贴内容已经更新到输入框中
    setTimeout(() => {
      update_word_count(this.value);
    }, 0);
  });

  // 初始化字数显示
  update_word_count(novel_input.value);
}

// 页面加载完成后初始化字数统计模块
document.addEventListener("DOMContentLoaded", function () {
  init_word_count_module();
});

// 如果页面已经加载完成，直接初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init_word_count_module);
} else {
  init_word_count_module();
}

/**
 * 初始化清空按钮功能
 * 点击清空按钮时清空输入框内容
 */
function init_clear_button() {
  const clear_input_btn = document.getElementById("clear_input_btn");
  const novel_input = document.getElementById("novel_input");
  const word_count_span = document.getElementById("word_count");
  const word_count_display = document.getElementById("word_count_display");

  clear_input_btn.addEventListener("click", function() {
    // 清空输入框内容
    novel_input.value = "";
    // 更新字数显示
    word_count_span.textContent = "0";
    // 移除警告样式
    word_count_display.classList.remove("word_count_warning");
    // 聚焦到输入框
    novel_input.focus();
  });
}

/**
 * 初始化输出区域字数统计功能
 * 监听输出框内容变化，实时更新字数统计
 * 当输出框为空时隐藏字数统计，有内容时显示
 */
function init_output_word_count_module() {
  const output = document.getElementById("output");
  const output_word_count_span = document.getElementById("output_word_count");
  const output_word_count_display = document.getElementById("output_word_count_display");

  /**
   * 更新输出区域字数统计显示
   * @param {string} text - 要统计字数的文本
   */
  function update_output_word_count(text) {
    const word_count = text.length;
    output_word_count_span.textContent = word_count;

    // 根据是否有内容决定是否显示字数统计
    if (word_count > 0) {
      output_word_count_display.style.display = "block";
    } else {
      output_word_count_display.style.display = "none";
    }
  }

  // 监听输出框内容变化事件
  output.addEventListener("input", function () {
    update_output_word_count(this.value);
  });

  // 使用MutationObserver监听输出框value属性的变化
  const observer = new MutationObserver(function() {
    update_output_word_count(output.value);
  });

  // 观察输出框的属性变化
  observer.observe(output, {
    attributes: true,
    attributeFilter: ['value']
  });

  // 使用定时器定期检查输出框内容变化（确保能捕获到所有变化）
  let last_output_value = output.value;
  setInterval(function() {
    if (output.value !== last_output_value) {
      last_output_value = output.value;
      update_output_word_count(output.value);
    }
  }, 100);

  // 初始化字数显示
  update_output_word_count(output.value);
}

/**
 * 初始化去除换行按钮功能
 * 点击按钮时去除输出框中的所有换行符
 * 当输出框为空时，按钮置灰不可点击
 */
function init_remove_linebreak_button() {
  const remove_linebreak_btn = document.getElementById("remove_linebreak_btn");
  const output = document.getElementById("output");

  /**
   * 更新去除换行按钮状态
   * 根据输出框是否有内容来启用或禁用按钮
   */
  function update_remove_linebreak_button_state() {
    if (output.value.trim() === "") {
      remove_linebreak_btn.disabled = true;
    } else {
      remove_linebreak_btn.disabled = false;
    }
  }

  // 监听输出框内容变化
  output.addEventListener('input', update_remove_linebreak_button_state);
  
  // 使用定时器定期检查输出框内容变化（作为备用方案）
  let last_output_value = output.value;
  setInterval(function() {
    if (output.value !== last_output_value) {
      last_output_value = output.value;
      update_remove_linebreak_button_state();
    }
  }, 500);

  // 去除换行按钮点击事件
  remove_linebreak_btn.addEventListener("click", function() {
    if (output.value.trim() !== "") {
      // 去除所有换行符（包括\n、\r\n、\r）
      const text_without_linebreaks = output.value.replace(/[\r\n]+/g, '');
      output.value = text_without_linebreaks;
      
      // 手动触发输出区域字数统计更新
      const output_word_count_span = document.getElementById("output_word_count");
      const output_word_count_display = document.getElementById("output_word_count_display");
      if (output_word_count_span && output_word_count_display) {
        const word_count = text_without_linebreaks.length;
        output_word_count_span.textContent = word_count;
        if (word_count > 0) {
          output_word_count_display.style.display = "block";
        } else {
          output_word_count_display.style.display = "none";
        }
      }
      
      // 更新按钮状态
      update_remove_linebreak_button_state();
    }
  });

  // 初始化按钮状态
  update_remove_linebreak_button_state();
}

/**
 * 初始化复制按钮功能
 * 点击复制按钮时将输出框内容复制到剪切板
 * 当输出框为空时，复制按钮置灰不可点击
 */
function init_copy_button() {
  const copy_output_btn = document.getElementById("copy_output_btn");
  const output = document.getElementById("output");

  /**
   * 更新复制按钮状态
   * 根据输出框是否有内容来启用或禁用复制按钮
   */
  function update_copy_button_state() {
    if (output.value.trim() === "") {
      copy_output_btn.disabled = true;
    } else {
      copy_output_btn.disabled = false;
    }
  }

  // 监听输出框内容变化
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        update_copy_button_state();
      }
    });
  });

  // 监听输出框value属性变化
  output.addEventListener('input', update_copy_button_state);
  
  // 使用定时器定期检查输出框内容变化（作为备用方案）
  let last_output_value = output.value;
  setInterval(function() {
    if (output.value !== last_output_value) {
      last_output_value = output.value;
      update_copy_button_state();
    }
  }, 500);

  // 复制按钮点击事件
   copy_output_btn.addEventListener("click", async function() {
     try {
       // 选中输出框内容
       output.select();
       output.setSelectionRange(0, 99999); // 兼容移动设备
       
       // 尝试使用现代的 Clipboard API
       if (navigator.clipboard && window.isSecureContext) {
         await navigator.clipboard.writeText(output.value);
       } else {
         // 降级到传统的 execCommand 方法
         document.execCommand('copy');
       }
       
     } catch (err) {
       console.error('复制失败:', err);
       alert('复制失败，请手动选择文本进行复制');
     }
   });

  // 初始化按钮状态
  update_copy_button_state();
}

// 页面加载完成后初始化所有功能
document.addEventListener("DOMContentLoaded", function () {
  init_word_count_module();
  init_clear_button();
  init_copy_button();
  init_output_word_count_module();
  init_remove_linebreak_button();
});

// 如果页面已经加载完成，直接初始化所有功能
if (document.readyState !== "loading") {
  init_word_count_module();
  init_clear_button();
  init_copy_button();
  init_output_word_count_module();
  init_remove_linebreak_button();
}
