import Modal from 'ant-design-vue/es/modal'

export default (Vue) => {
  function dialog (component, componentProps, modalProps) {
    const _vm = this
    modalProps = modalProps || {}
    if (!_vm || !_vm._isVue) {
      return
    }
    let dialogDiv = document.querySelector('body>div[type=dialog]')
    if (!dialogDiv) {
      dialogDiv = document.createElement('div')
      dialogDiv.setAttribute('type', 'dialog')
      document.body.appendChild(dialogDiv)
    }

    const dialogInstance = new Vue({
      data () {
        return {
          width: 550,
          visible: true,
          confirmLoading: false,
          destroyOnClose: true
        }
      },
      router: _vm.$router,
      store: _vm.$store,
      i18n: _vm.$i18n,
      mounted () {
        this.$on('close', (v) => {
          this.handleClose()
        })
      },
      methods: {
        handle (checkFunction, afterHandel) {
          if (checkFunction instanceof Function) {
            const res = checkFunction()
            if (res instanceof Promise) {
              this.confirmLoading = true
              res.then(c => {
                this.confirmLoading = false
                c && afterHandel()
              }).catch(e => {
                this.confirmLoading = false
              })
            } else {
              res && afterHandel()
            }
          } else {
            checkFunction || afterHandel()
          }
        },
        handleClose () {
          this.handle(this.$refs._component.onCancel, () => {
            this.visible = false
            this.$refs._component.$emit('close')
            this.$refs._component.$emit('cancel')
            dialogInstance.$destroy()
          })
        },
        handleOk () {
          this.handle(this.$refs._component.onOK || this.$refs._component.onOk, () => {
            this.visible = false
            this.$refs._component.$emit('close')
            this.$refs._component.$emit('ok')
            dialogInstance.$destroy()
          })
        }
      },
      render: function (h) {
        const that = this
        const modalModel = modalProps && modalProps.model
        if (modalModel) {
          delete modalProps.model
        }
        const ModalProps = Object.assign({}, modalModel && { model: modalModel } || {}, {
          attrs: Object.assign({
            width: this.width,
            okText: this.$t('layouts.modal.submit'),
            cancelText: this.$t('layouts.modal.cancel'),
            destroyOnClose: this.destroyOnClose
          }, {
            ...(modalProps.attrs || modalProps)
          }, {
            visible: this.visible,
            confirmLoading: this.confirmLoading
          }),
          on: Object.assign({}, {
            ...(modalProps.on || modalProps)
          }, {
            ok: () => {
              that.handleOk()
            },
            cancel: () => {
              that.handleClose()
            }
          })
        })

        const componentModel = componentProps && componentProps.model
        if (componentModel) {
          delete componentProps.model
        }
        const ComponentProps = Object.assign({}, componentModel && { model: componentModel } || {}, {
          ref: '_component',
          attrs: Object.assign({}, {
            ...((componentProps && componentProps.attrs) || componentProps)
          }),
          on: Object.assign({}, {
            ...((componentProps && componentProps.on) || componentProps)
          })
        })

        return h(Modal, ModalProps, [h(component, ComponentProps)])
      }
    }).$mount(dialogDiv)
  }

  Object.defineProperty(Vue.prototype, '$dialog', {
    get: () => {
      return function () {
        dialog.apply(this, arguments)
      }
    }
  })
}
