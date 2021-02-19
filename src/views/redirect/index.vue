<script>
export default {
  name: 'Redirect',
  created () {
    const { query: page } = this.$route
    const { name, params, query } = page
    this.$router.replace({ name, params: { ...params, t: new Date() }, query })
  },
  render: function (h) {
    return h()
  }
}

</script>
