import type { Application, Todo, APKProcess, KanbanData } from '../types';

// ==================== 看板数据类型 ====================
export interface KanbanShuttle {
  name: string;
  tosVersion: string;
  appCount: number;
  completedCount: number;
  processingCount: number;
}

export interface KanbanProduct {
  name: string;
  packageName: string;
  releaseCount: number;
  latestVersion: string;
  status: 'active' | 'inactive';
}

export interface KanbanStatus {
  name: string;
  count: number;
  color: string;
}

// 模拟看板数据 - 班车视角
export const mockKanbanShuttle: KanbanShuttle[] = [
  { name: '班车-20260228-001', tosVersion: 'tOS 16.1.0', appCount: 5, completedCount: 2, processingCount: 3 },
  { name: '班车-20260227-003', tosVersion: 'tOS 16.0.5', appCount: 3, completedCount: 3, processingCount: 0 },
  { name: '班车-20260227-002', tosVersion: 'tOS 16.0.5', appCount: 4, completedCount: 1, processingCount: 3 },
  { name: '班车-20260226-001', tosVersion: 'tOS 15.5.0', appCount: 2, completedCount: 2, processingCount: 0 },
];

// 模拟看板数据 - 产品视角
export const mockKanbanProduct: KanbanProduct[] = [
  { name: 'WhatsApp', packageName: 'com.whatsapp', releaseCount: 12, latestVersion: '2.26.1.15', status: 'active' },
  { name: 'Telegram', packageName: 'org.telegram', releaseCount: 8, latestVersion: '10.5.0', status: 'active' },
  { name: 'Facebook', packageName: 'com.facebook', releaseCount: 15, latestVersion: '450.0.0', status: 'active' },
  { name: 'Instagram', packageName: 'com.instagram', releaseCount: 10, latestVersion: '320.0.0', status: 'active' },
  { name: 'TikTok', packageName: 'com.zhiliaoapp', releaseCount: 6, latestVersion: '32.5.0', status: 'inactive' },
];

// 模拟看板数据 - 状态视角
export const mockKanbanStatus: KanbanStatus[] = [
  { name: '通道发布申请', count: 3, color: 'bg-blue-500' },
  { name: '通道发布审核', count: 5, color: 'bg-yellow-500' },
  { name: '物料上传', count: 4, color: 'bg-purple-500' },
  { name: '物料审核', count: 2, color: 'bg-orange-500' },
  { name: '应用上架', count: 6, color: 'bg-cyan-500' },
  { name: '业务内测', count: 3, color: 'bg-pink-500' },
  { name: '灰度监控', count: 8, color: 'bg-green-500' },
];

// 模拟申请列表数据
export const mockApplications: Application[] = [
  {
    id: '1',
    shuttleName: '班车-20260228-001',
    tosVersion: 'tOS 16.1.0',
    apkStatus: 'processing',
    applicant: '张三',
    applyTime: '2026-02-28 10:30:00',
    status: 'processing',
  },
  {
    id: '2',
    shuttleName: '班车-20260227-003',
    tosVersion: 'tOS 16.0.5',
    apkStatus: 'success',
    applicant: '李四',
    applyTime: '2026-02-27 15:20:00',
    status: 'completed',
  },
  {
    id: '3',
    shuttleName: '班车-20260227-002',
    tosVersion: 'tOS 16.0.5',
    apkStatus: 'rejected',
    applicant: '王五',
    applyTime: '2026-02-27 09:15:00',
    status: 'rejected',
  },
  {
    id: '4',
    shuttleName: '班车-20260226-001',
    tosVersion: 'tOS 15.5.0',
    apkStatus: 'success',
    applicant: '赵六',
    applyTime: '2026-02-26 14:00:00',
    status: 'completed',
  },
  {
    id: '5',
    shuttleName: '班车-20260225-002',
    tosVersion: 'tOS 15.5.0',
    apkStatus: 'total',
    applicant: '钱七',
    applyTime: '2026-02-25 11:30:00',
    status: 'processing',
  },
];

// 模拟待办数据
export const mockTodos: Todo[] = [
  {
    id: '1',
    shuttleName: '班车-20260228-001',
    appName: 'WhatsApp',
    node: '通道发布审核',
    nodeStatus: '待处理',
    handler: '审核人A',
  },
  {
    id: '2',
    shuttleName: '班车-20260228-001',
    appName: 'Telegram',
    node: '物料审核',
    nodeStatus: '待处理',
    handler: '运营B',
    rejectReason: '物料不符合要求',
  },
  {
    id: '3',
    shuttleName: '班车-20260227-003',
    appName: 'Facebook',
    node: '业务内测',
    nodeStatus: '进行中',
    handler: '测试C',
  },
];

// 模拟APK流程数据
export const mockAPKProcess: APKProcess = {
  id: '1',
  appIcon: 'https://via.placeholder.com/80',
  appName: 'WhatsApp',
  packageName: 'com.whatsapp',
  versionCode: '2.26.1.15',
  status: 'processing',
  currentNode: 2,
  nodes: [
    { name: '通道发布申请', status: 'completed', operator: '张三', operatorTime: '2026-02-28 10:00' },
    { name: '通道发布审核', status: 'processing', operator: '审核人A' },
    { name: '物料上传', status: 'pending' },
    { name: '物料审核', status: 'pending' },
    { name: '应用上架', status: 'pending' },
    { name: '业务内测', status: 'pending' },
    { name: '灰度监控', status: 'pending' },
  ],
};

// 模拟看板数据
export const mockKanbanData: KanbanData = {
  shuttleCount: 12,
  productCount: 45,
  processingCount: 8,
  completedCount: 37,
};

// 搜索和筛选选项
export const shuttleOptions = [
  '班车-20260228-001',
  '班车-20260227-003',
  '班车-20260227-002',
  '班车-20260226-001',
];

export const tosVersionOptions = [
  'tOS 16.1.0',
  'tOS 16.0.5',
  'tOS 15.5.0',
  'tOS 15.0.0',
];

export const apkStatusOptions = [
  { label: '成功', value: 'success', color: 'green' },
  { label: '拒绝', value: 'rejected', color: 'red' },
  { label: '进行中', value: 'processing', color: 'blue' },
  { label: '总数', value: 'total', color: 'black' },
];
