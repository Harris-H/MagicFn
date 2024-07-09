export interface Form {
    // 定义你的表单字段和类型
    prefix: string; 
    suffix: string; 
    method: string;
    selectedFileTypes: string[]; // 选择的文件类型
    // 添加更多字段
}