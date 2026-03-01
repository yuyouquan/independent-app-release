// 独立三方应用发布系统 - 模拟数据

// 节点状态类型
export type NodeStatus = 'completed' | 'processing' | 'rejected' | 'pending';

// 流程节点
export interface ProcessNode {
  name: string;
  status: NodeStatus;
  operator?: string;
  operatorTime?: string;
  rejectReason?: string;
}

export interface APKItem {
  id: string;
  appIcon: string;
  appName: string;
  packageName: string;
  appType: string;
  versionCode: string;
  nodes: ProcessNode[];
  status: 'success' | 'failed' | 'processing';
  operator: string;
  rejectReason?: string;
  createTime: string;
}

export interface Application {
  id: string;
  shuttleName: string;
  tosVersion: string;
  status: 'success' | 'failed' | 'processing';
  applicant: string;
  applyTime: string;
  apps: APKItem[];
}

// 模拟申请列表数据
export const mockApplications: Application[] = [
  {
    id: '1',
    shuttleName: '班车20260301',
    tosVersion: 'tOS 16.1.0',
    status: 'processing',
    applicant: '张三',
    applyTime: '2026-03-01 10:00:00',
    apps: [
      {
        id: '1',
        appIcon: '🎵',
        appName: 'Spotify',
        packageName: 'com.spotify.music',
        appType: 'Music',
        versionCode: '22651',
        status: 'processing',
        operator: '张三',
        createTime: '2026-03-01 10:00:00',
        nodes: [
          { name: '通道发布申请', status: 'completed', operator: '张三', operatorTime: '2026-03-01 10:00:00' },
          { name: '通道发布审核', status: 'processing', operator: '李四' },
          { name: '物料上传', status: 'pending' },
          { name: '物料审核', status: 'pending' },
          { name: '应用上架', status: 'pending' },
          { name: '业务内测', status: 'pending' },
          { name: '灰度监控', status: 'pending' },
        ]
      },
      {
        id: '2',
        appIcon: '💬',
        appName: 'Telegram',
        packageName: 'org.telegram',
        appType: 'Social',
        versionCode: '22650',
        status: 'success',
        operator: '张三',
        createTime: '2026-03-01 10:00:00',
        nodes: [
          { name: '通道发布申请', status: 'completed', operator: '张三', operatorTime: '2026-03-01 10:00:00' },
          { name: '通道发布审核', status: 'completed', operator: '李四', operatorTime: '2026-03-01 11:00:00' },
          { name: '物料上传', status: 'completed', operator: '张三', operatorTime: '2026-03-01 12:00:00' },
          { name: '物料审核', status: 'completed', operator: '王五', operatorTime: '2026-03-01 13:00:00' },
          { name: '应用上架', status: 'completed', operator: '赵六', operatorTime: '2026-03-01 14:00:00' },
          { name: '业务内测', status: 'completed', operator: '赵六', operatorTime: '2026-03-01 15:00:00' },
          { name: '灰度监控', status: 'completed', operator: '赵六', operatorTime: '2026-03-01 16:00:00' },
        ]
      },
      {
        id: '3',
        appIcon: '📸',
        appName: 'Instagram',
        packageName: 'com.instagram.android',
        appType: 'Social',
        versionCode: '22651',
        status: 'failed',
        operator: '张三',
        createTime: '2026-03-01 10:00:00',
        rejectReason: '物料不符合要求',
        nodes: [
          { name: '通道发布申请', status: 'completed', operator: '张三', operatorTime: '2026-03-01 10:00:00' },
          { name: '通道发布审核', status: 'completed', operator: '李四', operatorTime: '2026-03-01 11:00:00' },
          { name: '物料上传', status: 'rejected', operator: '张三', operatorTime: '2026-03-01 12:00:00', rejectReason: '物料不符合要求' },
          { name: '物料审核', status: 'pending' },
          { name: '应用上架', status: 'pending' },
          { name: '业务内测', status: 'pending' },
          { name: '灰度监控', status: 'pending' },
        ]
      }
    ]
  },
  {
    id: '2',
    shuttleName: '班车20260228',
    tosVersion: 'tOS 16.0.5',
    status: 'success',
    applicant: '李四',
    applyTime: '2026-02-28 09:00:00',
    apps: []
  },
  {
    id: '3',
    shuttleName: '班车20260225',
    tosVersion: 'tOS 16.0.5',
    status: 'failed',
    applicant: '王五',
    applyTime: '2026-02-25 14:00:00',
    apps: []
  }
];

// 待办事项数据
export interface TodoItem {
  id: string;
  appId: string;
  shuttleName: string;
  appName: string;
  currentNode: string;
  nodeStatus: 'processing' | 'rejected';
  operator: string;
  rejectReason?: string;
}

export const mockTodos: TodoItem[] = [
  {
    id: '1',
    appId: '1',
    shuttleName: '班车20260301',
    appName: 'Spotify',
    currentNode: '通道发布审核',
    nodeStatus: 'processing',
    operator: '李四',
  },
  {
    id: '2',
    appId: '3',
    shuttleName: '班车20260301',
    appName: 'Instagram',
    currentNode: '物料上传',
    nodeStatus: 'rejected',
    operator: '张三',
    rejectReason: '物料不符合要求',
  }
];

// 班车选项
export const shuttleOptions = [
  { value: '班车20260301', label: '班车20260301' },
  { value: '班车20260228', label: '班车20260228' },
  { value: '班车20260225', label: '班车20260225' },
];

// tOS版本选项
export const tosVersionOptions = [
  { value: 'tOS 16.1.0', label: 'tOS 16.1.0' },
  { value: 'tOS 16.0.5', label: 'tOS 16.0.5' },
  { value: 'tOS 15.5.0', label: 'tOS 15.5.0' },
];

// APK状态选项
export const apkStatusOptions = [
  { value: 'success', label: '成功', color: 'green' },
  { value: 'failed', label: '拒绝', color: 'red' },
  { value: 'processing', label: '进行中', color: 'blue' },
];
