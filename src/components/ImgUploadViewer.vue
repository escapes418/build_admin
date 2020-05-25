<template>
  <div>
    <el-upload
      class="multiple-img-uploader"
      :class="{ hidePlus: hidePlus }"
      :ref="uploadref"
      list-type="picture-card"
      :file-list="imgFileList"
      :limit="limit"
      :action="uploadAction"
      :headers="uploadHeader"
      :before-upload="beforeUpload"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <div v-if="!hidetip" class="mt-10 font-size13 font-gray">
      请选择
      <span class="font-red">jpg,png,jpeg</span>格式的照片上传,图片质量最大为
      <span class="font-red">{{ imgSize }}M</span>
    </div>

    <!-- 查看图片viewer -->
    <fe-viewer ref="viewerPreviewImg" :title="viewerTitle" :source="previewImgList"></fe-viewer>
  </div>
</template>
<script>
import api from '@/api/base.api.js';
import Validator from '@/utils/Validator';
import utils from '@/utils/utils';
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    },
    viewerTitle: {
      type: String,
      default: ''
    },
    defaultFiles: {
      type: Array
    },
    hidetip: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      uploadAction: api.upload,
      uploadHeader: {
        Authorization: localStorage.getItem('Authorization') || ''
      },
      imgFileList: [],
      imgSize: Validator.imgLimit,
      previewImgList: []
    };
  },
  computed: {
    // 达到最大上传数量 隐藏上传按钮
    hidePlus() {
      return this.imgFileList.length >= this.limit;
    },
    uploadref() {
      return 'upload' + utils.randomName();
    }
  },
  watch: {
    defaultFiles: function(newValue, oldValue) {
      this.imgFileList = [...this.onFormatFiles()];
    }
  },
  created() {
    this.imgFileList = [...this.onFormatFiles()];
  },
  methods: {
    // 默认文件结构转换
    onFormatFiles() {
      const defaultFiles = this.defaultFiles || [];
      return defaultFiles.map(el => {
        return { name: el, url: el };
      });
    },
    // 图片预览
    handlePreview(file) {
      const fileList = this.getUploadFiles(true);
      if (fileList.length > 0) {
        this.previewImgList = fileList.map(el => {
          return { url: el, title: '' };
        });
        let index = fileList.indexOf(file.url);
        index = index > -1 ? index : 0;
        this.$nextTick(() => {
          this.$refs.viewerPreviewImg.show({ initialViewIndex: index });
        });
      } else {
        return;
      }
    },
    // 图片上传前钩子
    beforeUpload(file) {
      // 上传之前 验证文件格式
      const isImage = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';

      const isSize = file.size / 1024 / 1024 < this.imgSize;

      if (!isImage) this.$message.error('上传图片只能是 jpg,png,jpeg 格式!');
      if (!isSize) this.$message.error(`上传图片大小不能超过 ${this.imgSize}MB!`);
      return isImage && isSize;
    },
    // 上传超过限制
    handleExceed(files, fileList) {
      this.$message.error(`最多只能上传${this.limit}张图片凭证！`);
    },
    // 图片移除成功钩子
    handleRemove(file, fileList) {
      this.imgFileList = fileList;
      let removeFile = null;
      if (file.response) {
        removeFile = file.response.data.fileUri;
      } else {
        removeFile = file.url;
      }
      this.$emit('remove', removeFile, this.getUploadFiles());
    },
    // 图片上传出错钩子
    handleError(err, file, fileList) {
      this.imgFileList = [...this.imgFileList];
      this.$message.error('发生错误，上传失败');
    },
    // 图片上传成功钩子
    handleSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.imgFileList = fileList;
        this.$emit('success', response.data.fileUri, this.getUploadFiles());
      } else {
        this.imgFileList = [...this.imgFileList];
        this.$message.error(response.message || '上传失败');
      }
    },
    handleChange(file, fileList) {
      // 目前需要页面自己提交时校验文件  message弹出消息
      // 如果做到form表单校验  页面自己处理保存文件信息 相对麻烦暂时不做
      // this.$emit('change', file.response.data.fileUri, this.getUploadFiles());
    },
    // 获取upload表单中的上传文件信息
    getUploadFiles(isloc = false) {
      const fileArray = this.$refs[this.uploadref].uploadFiles || [];
      return fileArray.map(item => {
        // 新上传的图片 取response里服务器返回的路径
        if (item.response) {
          if (isloc) {
            return item.url; // 取本地blod路径
          } else {
            return item.response.data.fileUri; // 取服务器返回的路径
          }
        } else {
          // 已上传 未更改的图片 取原路径
          return item.url;
        }
      });
    },
    // 清除上传图片缓存
    clearImgFileList() {
      this.imgFileList = [];
    }
  }
};
</script>
<style lang="postcss">
.multiple-img-uploader .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 106px;
  border-radius: 2px;
}
.multiple-img-uploader {
  .el-upload-list--picture-card {
    .el-progress {
      width: 80px !important;
    }
    .el-progress-circle {
      width: 80px !important;
    }
    .el-progress {
      top: 75%;
    }
    .el-progress .el-progress__text {
      top: 30%;
    }
    .el-upload-list__item {
      width: 100px;
      height: 100px;
      border-radius: 2px;
      transition: none !important;
    }
  }
}
.multiple-img-uploader.hidePlus {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
