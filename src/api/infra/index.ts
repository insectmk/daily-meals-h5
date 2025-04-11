import request from '@/utils/request'
import type { FileUploadReq } from '@/api/infra/type'
import { getFormData } from '@/utils/form-util'

/**
 * 上传文件
 * @param param
 * return 返回文件URL路径
 */
export function uploadFile(param: FileUploadReq) {
  return request.postForm<string>('/infra/file/upload', getFormData(param))
}

/**
 * 获取文件预签名地址
 * @param path
 */
export function getFilePresignedUrl(path: string) {
  return request.get('/infra/file/presigned-url', {
    path,
  })
}

/**
 * 创建文件
 * @param data
 */
export function createFile(data: any) {
  return request.post('/infra/file/create', data)
}
