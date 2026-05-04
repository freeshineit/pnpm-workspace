<script setup lang="ts">
import "@ak2021/web-components/dist/style/css.css";
import "@ak2021/web-components";
</script>

<template>
  <div class="greetings">
    <wc-button>Web Component Button</wc-button>

    <wc-picker trigger="click" content='<div style="padding: 12px; background: #fff;">Picker Content</div>' placement="bottom"> <button>打开 Picker</button></wc-picker>

    <wc-popover
      content="这是一个 Popover 示例!"
      list='[
    {
      "value": 1,
      "label": "1x"
    },
    {
      "value": 2,
      "label": "2x"
    },
    {
      "value": 3,
      "label": "3x"
    },
    {
      "value": 4,
      "label": "4xxxxxxxxxxxxxxxxx"
    }
  ]'
      open="1">
      <wc-button>点击我</wc-button>
    </wc-popover>
  </div>
</template>
