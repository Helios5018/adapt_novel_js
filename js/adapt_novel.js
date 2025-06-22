import { replace_sensitive_words } from "./replace_sensitive_words.js";
import {
  rewrite_perspective,
  rewrite_main_roles_name,
  rewrite_novel,
  add_opening,
} from "./adapt_novel_by_llm.js";

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
  let adapted_novel_text = novel_text;

  if (rewrite_main_roles_name_or_not) {
    adapted_novel_text = await rewrite_main_roles_name(
      adapted_novel_text,
      novel_name,
      adapted_novel_name
    );
  }

  if (rewrite_perspective_or_not) {
    adapted_novel_text = await rewrite_perspective(
      adapted_novel_text,
      perspective_num
    );
  }

  if (add_opening_or_not) {
    adapted_novel_text = await add_opening(adapted_novel_text);
  }

  if (rewrite_novel_or_not) {
    adapted_novel_text = await rewrite_novel(adapted_novel_text);
  }

  if (replace_sensitive_words_or_not) {
    adapted_novel_text = replace_sensitive_words(
      adapted_novel_text,
      replace_way
    );
  }

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
  if (select_way.value === "*") {
    replace_way = "symbol";
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
