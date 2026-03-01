// 申请流程单类型
export interface Application {
  id: string;
  shuttleName: string; // 班车名称 (格式: 班车 YYYY-MM-DD HH:mm:ss)
  tosVersion: string; // tOS版本 (格式: tOS 16.1.0)
  apkStatus: 'success' | 'rejected' | 'processing' | 'total';
  applicant: string; // 申请人
  applyTime: string; // 申请时间
  status: 'processing' | 'completed' | 'rejected';
  // 扩展字段
  appCount?: number; // 该班车的应用数量
  completedCount?: number; // 成功数量
  rejectedCount?: number; // 拒绝数量
  processingCount?: number; // 进行中数量
}

// 待办事项类型
export interface Todo {
  id: string;
  shuttleName: string; // 班车名称
  appName: string; // 应用名称
  packageName?: string; // 应用包名
  node: string; // 当前流程节点
  nodeStatus: '待处理' | '进行中' | '已完成' | '已拒绝';
  handler: string; // 处理人
  rejectReason?: string; // 拒绝原因 (当被后续节点拒绝回退时显示)
  createTime?: string; // 创建时间
}

// APK发布流程类型
export interface APKProcess {
  id: string;
  appIcon: string;
  appName: string;
  packageName: string;
  versionCode: string;
  versionName?: string; // 版本名称
  appType?: string; // 应用类型
  status: 'processing' | 'completed' | 'failed';
  currentNode: number;
  nodes: ProcessNode[];
  // 7大节点的详细信息
  channelApply?: ChannelApplyData; // 通道发布申请
  channelReview?: ChannelReviewData; // 通道发布审核
  materialUpload?: MaterialUploadData; // 物料上传
  materialReview?: MaterialReviewData; // 物料审核
  appPublish?: AppPublishData; // 应用上架
  betaTest?: BetaTestData; // 业务内测
  grayMonitor?: GrayMonitorData; // 灰度监控
}

// 流程节点
export interface ProcessNode {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  operator?: string;
  operatorTime?: string;
  rejectReason?: string;
  // 责任人
  owner?: string;
  // 协作人
  collaborators?: string[];
}

// 通道发布申请数据
export interface ChannelApplyData {
  // 基础信息
  appName: string;
  packageName: string;
  appType: string;
  versionCode: string;
  versionName: string;
  apkUrl: string;
  testPassReport?: string;
  appCategory: string;
  isSystemApp: boolean;
  // 发布范围
  countryType: 'all' | 'include' | 'exclude';
  countries?: string[];
  brandType: 'all' | 'include' | 'exclude';
  brands?: string[];
  deviceType: 'all' | 'include' | 'exclude';
  devices?: string[];
  betaDeviceType: 'all' | 'include' | 'exclude';
  betaDevices?: string[];
  androidVersionType: 'all' | 'include' | 'exclude';
  androidVersions?: string[];
  tosVersionType: 'all' | 'include' | 'exclude';
  tosVersions?: string[];
  filterIndia: boolean;
  // PA应用更新
  isPAUpdate: boolean;
  grayScaleLevel?: number;
  effectiveTime?: { start: string; end: string };
  // 物料信息 (多语言)
  materials: AppMaterial[];
  // 状态
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  operator?: string;
  operatorTime?: string;
  rejectReason?: string;
}

// 应用物料 (多语言)
export interface AppMaterial {
  language: string; // 语言代码: en, ru, pt, es, ar, ko, zh
  languageName: string; // 语言名称: 英语, 俄语, 葡萄牙语, 西班牙语, 阿语, 韩语, 中文
  appName: string;
  shortDescription: string;
  productDetail: string;
  updateDescription: string;
  keywords: string[];
  icon?: string;
  heroImage?: string;
  screenshots?: string[];
  isGP上架: boolean;
  gpLink?: string;
}

// 通道发布审核数据
export interface ChannelReviewData {
  reviewResult: 'pass' | 'reject';
  rejectReason?: string;
  reviewDetails: ChannelApplyData; // 通道发布申请的所有内容
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  operator?: string;
  operatorTime?: string;
}

// 物料上传数据 (与通道发布申请字段一致，但全部必填)
export interface MaterialUploadData extends ChannelApplyData {
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  operator?: string;
  operatorTime?: string;
  rejectReason?: string;
}

// 物料审核数据
export interface MaterialReviewData {
  operatorReviewResult: 'pass' | 'reject';
  operatorRejectReason?: string;
  operatorReviewTime?: string;
  bossReviewResult?: 'pass' | 'reject';
  bossRejectReason?: string;
  bossReviewTime?: string;
  materialDetails: MaterialUploadData;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  operator?: string;
  operatorTime?: string;
}

// 应用上架数据 (来自第三方平台)
export interface AppPublishData {
  status: '生效中' | '已停用';
  appName: string;
  taskName: string;
  packageName: string;
  country: string;
  brand: string;
  device: string;
  language: string;
  androidVersion: string;
  tosVersion: string;
  grayScaleLevel: number;
  category: string;
  effectiveTime: { start: string; end: string };
  lastUpdateTime?: string;
}

// 业务内测数据 (来自第三方平台)
export interface BetaTestData {
  status: '生效中' | '已停用';
  appName: string;
  taskName: string;
  packageName: string;
  country: string;
  brand: string;
  device: string;
  language: string;
  androidVersion: string;
  tosVersion: string;
  grayScaleLevel: number;
  category: string;
  effectiveTime: { start: string; end: string };
  lastUpdateTime?: string;
  // 第三方平台拒绝
  externalRejectReason?: string;
}

// 灰度监控数据 (来自第三方平台)
export interface GrayMonitorData {
  appName: string;
  packageName: string;
  taskName: string;
  effectiveTime: { start: string; end: string };
  grayScaleLevel: string; // 格式: xx/xx
  progress: { current: number; total: number };
  status: '进行中' | '已停用';
  createTime: string;
}

// 历史操作记录
export interface OperationRecord {
  id: string;
  operateTime: string;
  operator: string;
  action: string;
  detail?: string;
  nodeName?: string;
}

// 可添加的应用 (用于添加应用Modal)
export interface AvailableApp {
  id: string;
  appIcon: string;
  appName: string;
  packageName: string;
  appType: string;
}

// 看板数据
export interface KanbanData {
  shuttleCount: number;
  productCount: number;
  processingCount: number;
  completedCount: number;
}

// 班车视角看板
export interface KanbanShuttleView {
  name: string;
  month: string;
  products: string[];
  productCount: number;
  status: '进行中' | '已完成';
}

// 产品视角看板
export interface KanbanProductView {
  name: string;
  releaseCount: number;
  releases: {
    version: string;
    date: string;
    status: string;
  }[];
}

// 状态视角看板
export interface KanbanStatusView {
  进行中: number;
  已完成: number;
  升级任务数?: number;
}
