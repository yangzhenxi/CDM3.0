<template>
  <a-upload-dragger
    :showUploadList="false"
    :fileList="fileList"
    :beforeUpload="beforeUpload"
  >
    <p class="ant-upload-drag-icon">
      <a-icon type="file-text" />
    </p>
    <div v-if="fileList.length" style="text-align: center">
      <p v-if="suffix === 'license'">{{ name }}</p>
      <div v-else>
        <del>{{ name }}</del>
        <p style="color: red">文件必须是以 <i>.license</i> 结尾</p>
      </div>
    </div>
    <div v-else>
      <p>点击区域或拖拽导入证书</p>
    </div>
  </a-upload-dragger>
</template>

<script>
import { uploadLicense } from '@/api/system/license'
export default {
  data () {
    return {
      fileList: [],
      name: null,
      suffix: null
    }
  },
  methods: {
    beforeUpload (file) {
      this.fileList = [file]
      this.name = file.name
      this.suffix = file.name.split('.').pop()
      return false
    },
    onOk () {
      return new Promise(async (resolve, reject) => {
        if (!this.fileList.length) {
          this.$message.info('请选择需要上传的文件！')
          reject(new Error())
          return
        }
        if (this.suffix !== 'license') {
          this.$message.info('请选择后缀为 .license 的文件！')
          reject(new Error())
          return
        }
        const formData = new FormData()
        formData.append('file', this.fileList[0])
        try {
          await uploadLicense(formData)
          this.$message.success('上传成功！')
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
</script>
