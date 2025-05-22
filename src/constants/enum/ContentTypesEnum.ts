class ContentTypesEnum {
  constructor(
    public readonly code: number,
    public readonly describe: string,
  ) {}

  static readonly RECIPE = new ContentTypesEnum(0, '菜谱')

  // 可选：添加toString方法便于调试
  toString(): string {
    return `ErrorCode[code=${this.code}, describe=${this.describe}]`
  }
}

// 导出单例
export default ContentTypesEnum
