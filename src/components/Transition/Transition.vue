<template functional>
  <transition-group
    tag="div"
    class="transition-group-container"
    @leave="(el, done) => $options[props.animate].leave(el, done)"
    @beforeEnter="(el) => $options[props.animate].beforeEnter(el)"
    @enter="(el, done) => $options[props.animate].enter(el, done)"
  >
    <slot></slot>
  </transition-group>
</template>

<script>

function getDomNodeIndex (el) {
  let node = el
  let index = 0
  while (node.previousSibling) { // 不断去访问前一个兄弟节点
    index += 1
    node = node.previousSibling
  }
  return index
}

export default {
  slideLeft: {
    beforeEnter (el) {
      el.style.opacity = 0
      el.style.transform = 'translateX(-50%)'
      el.style.transition = 'all 1s'
    },
    enter (el, done) {
      const delay = getDomNodeIndex(el) * 200
      setTimeout(() => {
        el.style.opacity = 1
        el.style.transform = 'translateX(0%)'
        el.addEventListener('transitionend', done)
      }, delay)
    },
    leave (el, done) {
      const delay = getDomNodeIndex(el) * 200
      setTimeout(() => {
        el.style.opacity = 0
        el.style.transform = 'translateX(50%)'
        el.addEventListener('transitionend', done)
      }, delay)
    }
  },
  slideRight: {
    beforeEnter (el) {
      el.style.opacity = 0
      el.style.transform = 'translateX(50%)'
      el.style.transition = 'all 1s'
    },
    enter (el, done) {
      const delay = getDomNodeIndex(el) * 200
      setTimeout(() => {
        el.style.opacity = 1
        el.style.transform = 'translateX(0%)'
        el.addEventListener('transitionend', done)
      }, delay)
    }
  },
  slideUp: {
    beforeEnter (el) {
      el.style.opacity = 0
      el.style.transform = 'translateY(-50%)'
      el.style.transition = 'all 1s'
    },
    enter (el, done) {
      const delay = getDomNodeIndex(el) * 200
      setTimeout(() => {
        el.style.opacity = 1
        el.style.transform = 'translateY(0%)'
        el.addEventListener('transitionend', done)
      }, delay)
    }

  },
  slideDown: {
    beforeEnter (el) {
      el.style.opacity = 0
      el.style.transform = 'translateY(50%)'
      el.style.transition = 'all 1s'
    },
    enter (el, done) {
      const delay = getDomNodeIndex(el) * 200
      setTimeout(() => {
        el.style.opacity = 1
        el.style.transform = 'translateY(0%)'
        el.addEventListener('transitionend', done)
      }, delay)
    }
  },
  fadeIn: {
    beforeEnter (el) {
      el.style.opacity = 0
      el.style.transition = 'all 1s'
    },
    enter (el, done) {
      const delay = getDomNodeIndex(el) * 200
      setTimeout(() => {
        el.style.opacity = 1
        el.addEventListener('transitionend', done)
      }, delay)
    }
  }
}
</script>
