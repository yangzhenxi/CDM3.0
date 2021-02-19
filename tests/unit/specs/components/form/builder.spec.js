import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { mount } from '@vue/test-utils'
import { FormBuilder } from '@/components/Form/Builder'

const TestComponent = {
  template: `
    <div>
      <form-builder :items="[]">
      </form-builder>
    </div>
  `,
  components: {
    FormBuilder
  },
  setup () {
  }
}

let wrapper = null
let vm = ''
console.log(vm)

beforeEach(() => {
  wrapper = mount(TestComponent)
  vm = wrapper.vm
})

afterEach(() => {
  wrapper.destroy()
})

beforeAll(() => {
  Vue.use(VueCompositionAPI)
  Vue.prototype.$t = () => {}
})

describe('vue plugin', () => {
  test('use form builder', () => {
  })
  test('use ant design adaptor', () => {
    // const component = Vue.component('form-adaptor')

    // expect(component).toBeDefined()
  })
})
