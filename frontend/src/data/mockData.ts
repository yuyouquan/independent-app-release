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

// 物料信息（按语言）
export interface MaterialInfo {
  appName: string;
  shortDescription: string;
  productDetail: string;
  updateDescription: string;
  keywords: string[];
  isGP上架: boolean;
  gpLink?: string;
  icon?: string;
  heroImage?: string;
  screenshots?: string[];
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
  
  // 通道发布申请填写的详细信息
  applyInfo?: {
    versionCode: string;
    appCategory: string;
    systemApp: string;
    filterIndia: string;
    countryType: string;
    countryList: string[];
    brandType: string;
    brandList: string[];
    deviceType: string;
    deviceList: string[];
    betaDeviceType: string;
    betaDeviceList: string[];
    androidVersionType: string;
    androidVersionList: string[];
    tosVersionType: string;
    tosVersionList: string[];
    isPAUpdate: string;
    grayScaleLevelMin: number;
    grayScaleLevelMax: number;
    effectiveTimeStart: string;
    effectiveTimeEnd: string;
    materials: Record<string, MaterialInfo>;
  };
  
  // 物料上传填写的详细信息
  uploadInfo?: {
    versionCode: string;
    appCategory: string;
    systemApp: string;
    filterIndia: string;
    countryType: string;
    countryList: string[];
    brandType: string;
    brandList: string[];
    deviceType: string;
    deviceList: string[];
    betaDeviceType: string;
    betaDeviceList: string[];
    androidVersionType: string;
    androidVersionList: string[];
    tosVersionType: string;
    tosVersionList: string[];
    isPAUpdate: string;
    grayScaleLevelMin: number;
    grayScaleLevelMax: number;
    effectiveTimeStart: string;
    effectiveTimeEnd: string;
    materials: Record<string, MaterialInfo>;
  };
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
          { name: '通道发布审核', status: 'processing', operator: '李四', operatorTime: '2026-03-01 10:30:00' },
          { name: '物料上传', status: 'pending' },
          { name: '物料审核', status: 'pending' },
          { name: '应用上架', status: 'pending' },
          { name: '业务内测', status: 'pending' },
          { name: '灰度监控', status: 'pending' },
        ],
        // 通道发布申请填写的详细信息
        applyInfo: {
          versionCode: '22651',
          appCategory: 'Social',
          systemApp: 'no',
          filterIndia: 'no',
          countryType: 'include',
          countryList: ['USA', 'UK', 'Germany'],
          brandType: 'include',
          brandList: ['Tecno', 'Infinix'],
          deviceType: 'include',
          deviceList: ['X6841_H6941', 'X6858_H8917'],
          betaDeviceType: 'all',
          betaDeviceList: [],
          androidVersionType: 'include',
          androidVersionList: ['Android 14', 'Android 15'],
          tosVersionType: 'include',
          tosVersionList: ['tOS 15.2.0', 'tOS 16.1.0'],
          isPAUpdate: 'yes',
          grayScaleLevelMin: 1000,
          grayScaleLevelMax: 50000,
          effectiveTimeStart: '2026-03-05',
          effectiveTimeEnd: '2026-03-31',
          materials: {
            en: {
              appName: 'Spotify Music',
              shortDescription: 'Music streaming app',
              productDetail: 'Listen to music offline',
              updateDescription: 'Bug fixes',
              keywords: ['music', 'streaming', 'audio'],
              isGP上架: true,
              gpLink: 'https://play.google.com/store/apps/details?id=com.spotify.music',
              icon: 'https://placehold.co/128x128/1DB954/ffffff?text=Spotify',
              heroImage: 'https://placehold.co/400x200/1DB954/ffffff?text=Spotify+Hero',
              screenshots: [
                'https://placehold.co/200x400/1DB954/ffffff?text=Screen1',
                'https://placehold.co/200x400/1DB954/ffffff?text=Screen2',
                'https://placehold.co/200x400/1DB954/ffffff?text=Screen3',
                'https://placehold.co/200x400/1DB954/ffffff?text=Screen4',
                'https://placehold.co/200x400/1DB954/ffffff?text=Screen5'
              ]
            }
          }
        }
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
        ],
        applyInfo: {
          versionCode: '22650',
          appCategory: 'Social',
          systemApp: 'no',
          filterIndia: 'no',
          countryType: 'all',
          countryList: [],
          brandType: 'all',
          brandList: [],
          deviceType: 'all',
          deviceList: [],
          betaDeviceType: 'all',
          betaDeviceList: [],
          androidVersionType: 'all',
          androidVersionList: [],
          tosVersionType: 'all',
          tosVersionList: [],
          isPAUpdate: 'no',
          grayScaleLevelMin: 0,
          grayScaleLevelMax: 0,
          effectiveTimeStart: '',
          effectiveTimeEnd: '',
          materials: {
            en: {
              appName: 'Telegram',
              shortDescription: 'Messaging app',
              productDetail: 'Fast messaging',
              updateDescription: 'New features',
              keywords: ['message', 'chat'],
              isGP上架: false,
              icon: 'https://placehold.co/128x128/26A5E4/ffffff?text=TG',
              heroImage: 'https://placehold.co/400x200/26A5E4/ffffff?text=Telegram+Hero',
              screenshots: [
                'https://placehold.co/200x400/26A5E4/ffffff?text=Chat1',
                'https://placehold.co/200x400/26A5E4/ffffff?text=Chat2',
                'https://placehold.co/200x400/26A5E4/ffffff?text=Chat3',
                'https://placehold.co/200x400/26A5E4/ffffff?text=Chat4',
                'https://placehold.co/200x400/26A5E4/ffffff?text=Chat5'
              ]
            }
          }
        },
        uploadInfo: {
          versionCode: '22650',
          appCategory: 'Social',
          systemApp: 'no',
          filterIndia: 'no',
          countryType: 'all',
          countryList: [],
          brandType: 'all',
          brandList: [],
          deviceType: 'all',
          deviceList: [],
          betaDeviceType: 'all',
          betaDeviceList: [],
          androidVersionType: 'all',
          androidVersionList: [],
          tosVersionType: 'all',
          tosVersionList: [],
          isPAUpdate: 'no',
          grayScaleLevelMin: 0,
          grayScaleLevelMax: 0,
          effectiveTimeStart: '',
          effectiveTimeEnd: '',
          materials: {
            en: {
              appName: 'Telegram',
              shortDescription: 'Messaging app upload',
              productDetail: 'Fast messaging upload',
              updateDescription: 'New features upload',
              keywords: ['message', 'chat', 'upload'],
              isGP上架: false,
              icon: 'https://placehold.co/128x128/26A5E4/ffffff?text=TG+U',
              heroImage: 'https://placehold.co/400x200/26A5E4/ffffff?text=Telegram+Upload',
              screenshots: [
                'https://placehold.co/200x400/26A5E4/ffffff?text=Upload1',
                'https://placehold.co/200x400/26A5E4/ffffff?text=Upload2',
                'https://placehold.co/200x400/26A5E4/ffffff?text=Upload3',
                'https://placehold.co/200x400/26A5E4/ffffff?text=Upload4',
                'https://placehold.co/200x400/26A5E4/ffffff?text=Upload5'
              ]
            }
          }
        }
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
          { name: '物料上传', status: 'rejected', operator: '张三', operatorTime: '2026-03-01 12:00:00', rejectReason: '物料不符合要求：截图尺寸不符合规范' },
          { name: '物料审核', status: 'pending' },
          { name: '应用上架', status: 'pending' },
          { name: '业务内测', status: 'pending' },
          { name: '灰度监控', status: 'pending' },
        ]
      },
      {
        id: '4',
        appIcon: '🎬',
        appName: 'YouTube',
        packageName: 'com.google.android.youtube',
        appType: 'Video',
        versionCode: '22652',
        status: 'processing',
        operator: '王五',
        createTime: '2026-03-02 09:00:00',
        nodes: [
          { name: '通道发布申请', status: 'completed', operator: '王五', operatorTime: '2026-03-02 09:00:00' },
          { name: '通道发布审核', status: 'completed', operator: '李四', operatorTime: '2026-03-02 09:30:00' },
          { name: '物料上传', status: 'completed', operator: '王五', operatorTime: '2026-03-02 10:00:00' },
          { name: '物料审核', status: 'processing', operator: '赵六', operatorTime: '2026-03-02 10:30:00' },
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
    apps: [
      {
        id: '5',
        appIcon: '🛒',
        appName: 'Shopee',
        packageName: 'com.shopee.id',
        appType: 'Shopping',
        versionCode: '22640',
        status: 'success',
        operator: '李四',
        createTime: '2026-02-28 09:00:00',
        nodes: [
          { name: '通道发布申请', status: 'completed', operator: '李四', operatorTime: '2026-02-28 09:00:00' },
          { name: '通道发布审核', status: 'completed', operator: '王五', operatorTime: '2026-02-28 10:00:00' },
          { name: '物料上传', status: 'completed', operator: '李四', operatorTime: '2026-02-28 11:00:00' },
          { name: '物料审核', status: 'completed', operator: '赵六', operatorTime: '2026-02-28 12:00:00' },
          { name: '应用上架', status: 'completed', operator: '赵六', operatorTime: '2026-02-28 13:00:00' },
          { name: '业务内测', status: 'completed', operator: '赵六', operatorTime: '2026-02-28 14:00:00' },
          { name: '灰度监控', status: 'completed', operator: '赵六', operatorTime: '2026-02-28 15:00:00' },
        ]
      }
    ]
  },
  {
    id: '3',
    shuttleName: '班车20260225',
    tosVersion: 'tOS 16.0.5',
    status: 'failed',
    applicant: '王五',
    applyTime: '2026-02-25 14:00:00',
    apps: [
      {
        id: '6',
        appIcon: '🎮',
        appName: 'PUBG Mobile',
        packageName: 'com.tencent.ig',
        appType: 'Game',
        versionCode: '22630',
        status: 'failed',
        operator: '王五',
        createTime: '2026-02-25 14:00:00',
        rejectReason: '应用分类不符合要求',
        nodes: [
          { name: '通道发布申请', status: 'completed', operator: '王五', operatorTime: '2026-02-25 14:00:00' },
          { name: '通道发布审核', status: 'rejected', operator: '李四', operatorTime: '2026-02-25 15:00:00', rejectReason: '应用分类不符合目标市场要求' },
          { name: '物料上传', status: 'pending' },
          { name: '物料审核', status: 'pending' },
          { name: '应用上架', status: 'pending' },
          { name: '业务内测', status: 'pending' },
          { name: '灰度监控', status: 'pending' },
        ]
      }
    ]
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
    rejectReason: '物料不符合要求：截图尺寸不符合规范',
  },
  {
    id: '3',
    appId: '4',
    shuttleName: '班车20260301',
    appName: 'YouTube',
    currentNode: '物料审核',
    nodeStatus: 'processing',
    operator: '赵六',
  },
  {
    id: '4',
    appId: '6',
    shuttleName: '班车20260225',
    appName: 'PUBG Mobile',
    currentNode: '通道发布申请',
    nodeStatus: 'rejected',
    operator: '王五',
    rejectReason: '应用分类不符合目标市场要求',
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
