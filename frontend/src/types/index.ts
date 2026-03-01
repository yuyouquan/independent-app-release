// 独立三方应用发布系统 - 类型定义

// 流程单状态
export type FlowStatus = 'success' | 'failed' | 'processing';

// 应用状态
export type AppStatus = 'success' | 'failed' | 'processing';

// 节点状态
export type NodeStatus = 'completed' | 'processing' | 'rejected' | 'pending';

// 7大流程节点
export type ProcessNodeName = 
  | '通道发布申请'
  | '通道发布审核'
  | '物料上传'
  | '物料审核'
  | '应用上架'
  | '业务内测'
  | '灰度监控';

// 条件选择类型
export type ConditionType = '全部' | '包含' | '不包含';

// 应用分类
export type AppCategory = 
  | 'Travel & Local'
  | 'Shopping'
  | 'Entertainment'
  | 'Finance'
  | 'Business'
  | 'Weather'
  | 'Social'
  | 'Education'
  | 'Medical'
  | 'Auto & Vehicles';

// 发布品牌
export type Brand = 'Tecno' | 'Infinix' | 'itel';

// 机型
export type PhoneModel = 
  | 'X6841_H6941'
  | 'X6858_H8917(Android 16)'
  | 'KO5_H8925'
  | '其他';

// 安卓版本
export type AndroidVersion = 
  | 'Android 11'
  | 'Android 12'
  | 'Android 13'
  | 'Android 14'
  | 'Android 15'
  | 'Android 16';

// tOS版本
export type TosVersion = 
  | 'tOS 16.1.0'
  | 'tOS 16.0.5'
  | 'tOS 15.5.0'
  | 'tOS 15.2.0';

// 国家
export type Country = 
  | '印度'
  | '印尼'
  | '巴基斯坦'
  | '孟加拉'
  | '尼日利亚'
  | '肯尼亚'
  | '埃塞俄比亚'
  | '其他';

// 流程单
export interface Flow {
  id: string;
  shuttleName: string;
  tosVersion: string;
  status: FlowStatus;
  applicant: string;
  applyTime: string;
  apps: APK[];
}

// 应用
export interface APK {
  id: string;
  appIcon: string;
  appName: string;
  packageName: string;
  appType: string;
  versionCode: string;
  nodes: ProcessNode[];
  status: AppStatus;
  operator: string;
  rejectReason?: string;
  createTime: string;
  
  // 通道发布申请信息
  basicInfo?: BasicInfo;
  materials?: Materials;
  paUpdate?: PAUpdate;
}

// 流程节点
export interface ProcessNode {
  name: ProcessNodeName;
  status: NodeStatus;
  operator?: string;
  operatorTime?: string;
  rejectReason?: string;
  data?: any;
}

// 基础信息
export interface BasicInfo {
  appName: string;
  packageName: string;
  appType: string;
  versionCode: string;
  apkUrl: string;
  testReport?: string;
  category: AppCategory;
  isSystemApp: boolean;
  publishCountries: {
    type: ConditionType;
    countries: Country[];
  };
  publishBrands: {
    type: ConditionType;
    brands: Brand[];
  };
  publishModels: {
    type: ConditionType;
    models: PhoneModel[];
  };
  testModels: {
    type: ConditionType;
    models: PhoneModel[];
  };
  androidVersions: {
    type: ConditionType;
    versions: AndroidVersion[];
  };
  tosVersions: {
    type: ConditionType;
    versions: TosVersion[];
  };
  filterIndia: boolean;
}

// 物料信息（按语言）
export interface MaterialLanguage {
  language: string;
  appName: string;
  shortDescription: string;
  productDetails: string;
  updateNotes: string;
  keywords: string[];
  appIcon?: string;
  heroImage?: string;
  screenshots?: string[];
  isGP上架: boolean;
  gpLink?: string;
}

// 物料
export interface Materials {
  languages: MaterialLanguage[];
}

// PA更新
export interface PAUpdate {
  isPAUpdate: boolean;
  grayScale?: number;
  effectiveTime?: string;
}

// 枚举值
export const appCategoryOptions: { value: AppCategory; label: string }[] = [
  { value: 'Travel & Local', label: 'Travel & Local' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Business', label: 'Business' },
  { value: 'Weather', label: 'Weather' },
  { value: 'Social', label: 'Social' },
  { value: 'Education', label: 'Education' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Auto & Vehicles', label: 'Auto & Vehicles' },
];

export const brandOptions: { value: Brand; label: string }[] = [
  { value: 'Tecno', label: 'Tecno' },
  { value: 'Infinix', label: 'Infinix' },
  { value: 'itel', label: 'itel' },
];

export const phoneModelOptions: { value: PhoneModel; label: string }[] = [
  { value: 'X6841_H6941', label: 'X6841_H6941' },
  { value: 'X6858_H8917(Android 16)', label: 'X6858_H8917(Android 16)' },
  { value: 'KO5_H8925', label: 'KO5_H8925' },
  { value: '其他', label: '其他' },
];

export const androidVersionOptions: { value: AndroidVersion; label: string }[] = [
  { value: 'Android 11', label: 'Android 11' },
  { value: 'Android 12', label: 'Android 12' },
  { value: 'Android 13', label: 'Android 13' },
  { value: 'Android 14', label: 'Android 14' },
  { value: 'Android 15', label: 'Android 15' },
  { value: 'Android 16', label: 'Android 16' },
];

export const tosVersionOptions: { value: TosVersion; label: string }[] = [
  { value: 'tOS 16.1.0', label: 'tOS 16.1.0' },
  { value: 'tOS 16.0.5', label: 'tOS 16.0.5' },
  { value: 'tOS 15.5.0', label: 'tOS 15.5.0' },
  { value: 'tOS 15.2.0', label: 'tOS 15.2.0' },
];

export const countryOptions: { value: Country; label: string }[] = [
  { value: '印度', label: '印度' },
  { value: '印尼', label: '印尼' },
  { value: '巴基斯坦', label: '巴基斯坦' },
  { value: '孟加拉', label: '孟加拉' },
  { value: '尼日利亚', label: '尼日利亚' },
  { value: '肯尼亚', label: '肯尼亚' },
  { value: '埃塞俄比亚', label: '埃塞俄比亚' },
  { value: '其他', label: '其他' },
];

// 关键词选项
export const keywordOptions = [
  'music', 'video', 'streaming', 'social', 'chat', 'camera',
  'photo', 'editor', 'game', 'news', 'weather', 'shopping',
  'food', 'travel', 'fitness', 'health', 'education', 'business',
  'productivity', 'finance', 'entertainment'
];
