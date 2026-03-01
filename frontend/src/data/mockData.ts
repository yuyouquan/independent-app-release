import type { Application, Todo, APKProcess, KanbanData, KanbanShuttleView, KanbanProductView, KanbanStatusView, AvailableApp } from '../types';

// ==================== 枚举数据 ====================

// 班车名称选项
export const shuttleOptions = [
  '班车 2026-03-01 10:00:00',
  '班车 2026-02-28 15:30:00',
  '班车 2026-02-28 10:00:00',
  '班车 2026-02-27 15:00:00',
  '班车 2026-02-27 10:00:00',
  '班车 2026-02-26 15:00:00',
  '班车 2026-02-26 10:00:00',
];

// tOS版本选项
export const tosVersionOptions = [
  'tOS 16.1.0',
  'tOS 16.0.5',
  'tOS 15.5.0',
  'tOS 15.4.0',
  'tOS 15.3.0',
];

// APK状态选项
export const apkStatusOptions = [
  { value: 'success', label: '成功' },
  { value: 'rejected', label: '拒绝' },
  { value: 'processing', label: '进行中' },
  { value: 'total', label: '总数' },
];

// 应用分类
export const appCategoryOptions = [
  'Travel & Local',
  'Shopping',
  'Entertainment',
  'Finance',
  'Business',
  'Weather',
  'Social',
  'Education',
  'Medical',
  'Auto & Vehicles',
];

// 发布国家
export const countryOptions = [
  { value: 'NG', label: '尼日利亚' },
  { value: 'KE', label: '肯尼亚' },
  { value: 'GH', label: '加纳' },
  { value: 'EG', label: '埃及' },
  { value: 'SA', label: '沙特阿拉伯' },
  { value: 'AE', label: '阿联酋' },
  { value: 'IN', label: '印度' },
  { value: 'BD', label: '孟加拉' },
  { value: 'PK', label: '巴基斯坦' },
  { value: 'ID', label: '印尼' },
  { value: 'PH', label: '菲律宾' },
  { value: 'TH', label: '泰国' },
  { value: 'VN', label: '越南' },
  { value: 'BR', label: '巴西' },
  { value: 'MX', label: '墨西哥' },
  { value: 'CO', label: '哥伦比亚' },
];

// 发布品牌
export const brandOptions = [
  'Tecno',
  'Infinix',
  'itel',
];

// 发布机型/内测机型
export const deviceOptions = [
  'X6841_H6941',
  'X6858_H8917(Android 16)',
  'KO5_H8925',
  'X6835_H6825',
  'X6823_H6823',
];

// 适用安卓版本
export const androidVersionOptions = [
  'Android 16',
  'Android 15',
  'Android 14',
  'Android 13',
  'Android 12',
  'Android 11',
];

// 适用tOS版本 (根据安卓版本动态筛选)
export const tosVersionMapping: Record<string, string[]> = {
  'Android 16': ['tOS 16.1.0', 'tOS 16.0.5'],
  'Android 15': ['tOS 15.5.0', 'tOS 15.4.0', 'tOS 15.3.0'],
  'Android 14': ['tOS 15.5.0', 'tOS 15.4.0', 'tOS 15.3.0'],
  'Android 13': ['tOS 15.4.0', 'tOS 15.3.0'],
  'Android 12': ['tOS 15.3.0'],
  'Android 11': ['tOS 15.3.0'],
};

// 语言选项
export const languageOptions = [
  { code: 'en', name: '英语' },
  { code: 'zh', name: '中文' },
  { code: 'ru', name: '俄语' },
  { code: 'pt', name: '葡萄牙语' },
  { code: 'es', name: '西班牙语' },
  { code: 'ar', name: '阿语' },
  { code: 'ko', name: '韩语' },
];

// ==================== 看板数据类型 ====================

// 模拟看板数据 - 班车视角 (符合PRD格式)
export const mockKanbanShuttleView: KanbanShuttleView[] = [
  { 
    name: '班车 2026-03-01 10:00:00', 
    month: '3月',
    products: ['WhatsApp', 'Telegram', 'Facebook', 'Instagram', 'TikTok'],
    productCount: 5,
    status: '进行中'
  },
  { 
    name: '班车 2026-02-28 15:30:00', 
    month: '2月',
    products: ['WhatsApp', 'Telegram', 'Facebook'],
    productCount: 3,
    status: '已完成'
  },
  { 
    name: '班车 2026-02-28 10:00:00', 
    month: '2月',
    products: ['Instagram', 'TikTok', 'Spotify', 'Netflix'],
    productCount: 4,
    status: '进行中'
  },
  { 
    name: '班车 2026-02-27 15:00:00', 
    month: '2月',
    products: ['WhatsApp', 'Telegram'],
    productCount: 2,
    status: '已完成'
  },
];

// 模拟看板数据 - 产品视角 (符合PRD格式)
export const mockKanbanProductView: KanbanProductView[] = [
  { 
    name: 'WhatsApp', 
    releaseCount: 12,
    releases: [
      { version: '2.26.1.15', date: '2026-03-01', status: '进行中' },
      { version: '2.26.1.14', date: '2026-02-28', status: '已完成' },
      { version: '2.26.1.13', date: '2026-02-27', status: '已完成' },
    ]
  },
  { 
    name: 'Telegram', 
    releaseCount: 8,
    releases: [
      { version: '10.5.0', date: '2026-02-28', status: '已完成' },
      { version: '10.4.5', date: '2026-02-25', status: '已完成' },
    ]
  },
  { 
    name: 'Facebook', 
    releaseCount: 15,
    releases: [
      { version: '450.0.0', date: '2026-03-01', status: '进行中' },
      { version: '449.0.0', date: '2026-02-27', status: '已完成' },
    ]
  },
  { 
    name: 'Instagram', 
    releaseCount: 10,
    releases: [
      { version: '320.0.0', date: '2026-02-26', status: '已完成' },
    ]
  },
  { 
    name: 'TikTok', 
    releaseCount: 6,
    releases: [
      { version: '32.5.0', date: '2026-02-25', status: '已完成' },
    ]
  },
];

// 模拟看板数据 - 状态视角 (符合PRD格式)
export const mockKanbanStatusView: KanbanStatusView = {
  进行中: 8,
  已完成: 15,
  升级任务数: 23,
};

// 模拟申请列表数据
export const mockApplications: Application[] = [
  {
    id: '1',
    shuttleName: '班车 2026-03-01 10:00:00',
    tosVersion: 'tOS 16.1.0',
    apkStatus: 'processing',
    applicant: '张三',
    applyTime: '2026-03-01 10:00:00',
    status: 'processing',
    appCount: 5,
    completedCount: 2,
    rejectedCount: 0,
    processingCount: 3,
  },
  {
    id: '2',
    shuttleName: '班车 2026-02-28 15:30:00',
    tosVersion: 'tOS 16.0.5',
    apkStatus: 'success',
    applicant: '李四',
    applyTime: '2026-02-28 15:30:00',
    status: 'completed',
    appCount: 3,
    completedCount: 3,
    rejectedCount: 0,
    processingCount: 0,
  },
  {
    id: '3',
    shuttleName: '班车 2026-02-28 10:00:00',
    tosVersion: 'tOS 16.0.5',
    apkStatus: 'rejected',
    applicant: '王五',
    applyTime: '2026-02-28 10:00:00',
    status: 'rejected',
    appCount: 4,
    completedCount: 1,
    rejectedCount: 1,
    processingCount: 2,
  },
  {
    id: '4',
    shuttleName: '班车 2026-02-27 15:00:00',
    tosVersion: 'tOS 15.5.0',
    apkStatus: 'success',
    applicant: '赵六',
    applyTime: '2026-02-27 15:00:00',
    status: 'completed',
    appCount: 2,
    completedCount: 2,
    rejectedCount: 0,
    processingCount: 0,
  },
  {
    id: '5',
    shuttleName: '班车 2026-02-27 10:00:00',
    tosVersion: 'tOS 15.5.0',
    apkStatus: 'total',
    applicant: '钱七',
    applyTime: '2026-02-27 10:00:00',
    status: 'processing',
    appCount: 6,
    completedCount: 3,
    rejectedCount: 1,
    processingCount: 2,
  },
  {
    id: '6',
    shuttleName: '班车 2026-02-26 15:00:00',
    tosVersion: 'tOS 15.4.0',
    apkStatus: 'success',
    applicant: '孙八',
    applyTime: '2026-02-26 15:00:00',
    status: 'completed',
    appCount: 4,
    completedCount: 4,
    rejectedCount: 0,
    processingCount: 0,
  },
  {
    id: '7',
    shuttleName: '班车 2026-02-26 10:00:00',
    tosVersion: 'tOS 15.3.0',
    apkStatus: 'processing',
    applicant: '周九',
    applyTime: '2026-02-26 10:00:00',
    status: 'processing',
    appCount: 3,
    completedCount: 1,
    rejectedCount: 0,
    processingCount: 2,
  },
];

// 模拟待办事项数据 (符合PRD格式)
export const mockTodos: Todo[] = [
  {
    id: '1',
    shuttleName: '班车 2026-03-01 10:00:00',
    appName: 'WhatsApp',
    packageName: 'com.whatsapp',
    node: '通道发布审核',
    nodeStatus: '待处理',
    handler: '张三',
    createTime: '2026-03-01 10:00:00',
  },
  {
    id: '2',
    shuttleName: '班车 2026-03-01 10:00:00',
    appName: 'Telegram',
    packageName: 'org.telegram',
    node: '物料上传',
    nodeStatus: '进行中',
    handler: '张三',
    createTime: '2026-03-01 10:05:00',
  },
  {
    id: '3',
    shuttleName: '班车 2026-03-01 10:00:00',
    appName: 'Facebook',
    packageName: 'com.facebook.katana',
    node: '物料审核',
    nodeStatus: '待处理',
    handler: '李四',
    createTime: '2026-03-01 10:10:00',
  },
  {
    id: '4',
    shuttleName: '班车 2026-02-28 10:00:00',
    appName: 'Instagram',
    packageName: 'com.instagram.android',
    node: '物料上传',
    nodeStatus: '已拒绝',
    handler: '王五',
    rejectReason: '应用图标尺寸不符合要求，请上传1:1比例的图片',
    createTime: '2026-02-28 14:00:00',
  },
  {
    id: '5',
    shuttleName: '班车 2026-02-28 10:00:00',
    appName: 'TikTok',
    packageName: 'com.zhiliaoapp.musically',
    node: '通道发布申请',
    nodeStatus: '进行中',
    handler: '王五',
    createTime: '2026-02-28 10:30:00',
  },
  {
    id: '6',
    shuttleName: '班车 2026-02-27 10:00:00',
    appName: 'Spotify',
    packageName: 'com.spotify.music',
    node: '灰度监控',
    nodeStatus: '待处理',
    handler: '赵六',
    createTime: '2026-02-27 16:00:00',
  },
  {
    id: '7',
    shuttleName: '班车 2026-02-26 10:00:00',
    appName: 'Netflix',
    packageName: 'com.netflix.mediaclient',
    node: '业务内测',
    nodeStatus: '已拒绝',
    handler: '孙八',
    rejectReason: '内测机型测试未通过，部分机型出现崩溃',
    createTime: '2026-02-26 15:30:00',
  },
];

// 模拟可添加的应用列表 (用于添加应用Modal)
export const mockAvailableApps: AvailableApp[] = [
  { id: 'a1', appIcon: '📱', appName: 'WhatsApp', packageName: 'com.whatsapp', appType: 'Social' },
  { id: 'a2', appIcon: '💬', appName: 'Telegram', packageName: 'org.telegram', appType: 'Social' },
  { id: 'a3', appIcon: '📘', appName: 'Facebook', packageName: 'com.facebook.katana', appType: 'Social' },
  { id: 'a4', appIcon: '📷', appName: 'Instagram', packageName: 'com.instagram.android', appType: 'Social' },
  { id: 'a5', appIcon: '🎵', appName: 'TikTok', packageName: 'com.zhiliaoapp.musically', appType: 'Entertainment' },
  { id: 'a6', appIcon: '🎧', appName: 'Spotify', packageName: 'com.spotify.music', appType: 'Entertainment' },
  { id: 'a7', appIcon: '🎬', appName: 'Netflix', packageName: 'com.netflix.mediaclient', appType: 'Entertainment' },
  { id: 'a8', appIcon: '🛒', appName: 'Shopee', packageName: 'com.shopee.id', appType: 'Shopping' },
  { id: 'a9', appIcon: '🚗', appName: 'Gojek', packageName: 'com.gojek.app', appType: 'Travel & Local' },
  { id: 'a10', appIcon: '💳', appName: 'PayPal', packageName: 'com.paypal.android.p2pmobile', appType: 'Finance' },
  { id: 'a11', appIcon: '🌤️', appName: 'Weather', packageName: 'com.weather.weather', appType: 'Weather' },
  { id: 'a12', appIcon: '🏥', appName: 'Halodoc', packageName: 'com.halodoc.halodoc', appType: 'Medical' },
];

// 模拟看板总览数据
export const mockKanbanData: KanbanData = {
  shuttleCount: 7,
  productCount: 12,
  processingCount: 8,
  completedCount: 15,
};

// 模拟APK流程数据 (用于详情页)
export const mockAPKProcess: APKProcess = {
  id: '1',
  appIcon: '📱',
  appName: 'WhatsApp',
  packageName: 'com.whatsapp',
  versionCode: '22651',
  versionName: '2.26.1.15',
  appType: 'Social',
  status: 'processing',
  currentNode: 1,
  nodes: [
    { name: '通道发布申请', status: 'completed', operator: '张三', operatorTime: '2026-03-01 10:00:00' },
    { name: '通道发布审核', status: 'processing', operator: '李四' },
    { name: '物料上传', status: 'pending' },
    { name: '物料审核', status: 'pending' },
    { name: '应用上架', status: 'pending' },
    { name: '业务内测', status: 'pending' },
    { name: '灰度监控', status: 'pending' },
  ],
};

// 模拟历史操作记录
export const mockOperationRecords = [
  {
    id: '1',
    operateTime: '2026-03-01 10:00:00',
    operator: '张三',
    action: '提交通道发布申请',
    nodeName: '通道发布申请',
    detail: '提交了应用 WhatsApp 的通道发布申请',
  },
  {
    id: '2',
    operateTime: '2026-03-01 10:05:00',
    operator: '李四',
    action: '审核通过',
    nodeName: '通道发布审核',
    detail: '通道发布申请已通过审核',
  },
  {
    id: '3',
    operateTime: '2026-03-01 10:10:00',
    operator: '张三',
    action: '提交物料',
    nodeName: '物料上传',
    detail: '已上传应用物料信息',
  },
  {
    id: '4',
    operateTime: '2026-03-01 10:15:00',
    operator: '王五',
    action: '审核拒绝',
    nodeName: '物料审核',
    detail: '物料不符合要求，请重新上传',
  },
];
