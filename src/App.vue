<template>
  <a-config-provider :locale="locale" :transformCellText="transformCellText">
    <template #renderEmpty>
      <empty-state-item />
    </template>
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { EmptyStateItem } from '@/components'
import { EMPTY_VALUE } from '@/config/constant.config'
import { i18nRender } from '@/locales'
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { isEmpty } from '@/utils/util'

export default {
  components: {
    EmptyStateItem
  },
  data () {
    return {
      transformCellText: ({ text, column, record, index }) => {
        // 展开行不需要设置
        if (column?.key === 'expand-icon-placeholder') {
          return text
        }
        return isEmpty(text) ? EMPTY_VALUE : text
      }
    }
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>
