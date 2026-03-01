import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  Play,
  X,
  Upload,
  FileText,
  Tag,
  AlertTriangle
} from 'lucide-react';
import type { APKProcess, ProcessNode } from '../types';
import { mockOperationRecords, languageOptions, appCategoryOptions } from '../data/mockData';

// 流程节点名称
const NODE_NAMES = [
  '通道发布申请',
  '通道发布审核', 
  '物料上传',
  '物料审核',
  '应用上架',
  '业务内测',
  '灰度监控'
];

// 节点状态颜色
const getNodeStatusColor = (status: ProcessNode['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    case 'processing': return 'bg-blue-500';
    default: return 'bg-gray-300';
  }
};

const getNodeStatusText = (status: ProcessNode['status']) => {
  switch (status) {
    case 'completed': return '已完成';
    case 'rejected': return '已拒绝';
    case 'processing': return '进行中';
    default: return '待处理';
  }
};

// 应用状态颜色
const getAppStatusColor = (status: APKProcess['status']) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50';
    case 'failed': return 'text-red-600 bg-red-50';
    case 'processing': return 'text-blue-600 bg-blue-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

// ==================== 节点Modal组件 ====================
interface NodeModalProps {
  nodeIndex: number;
  node: ProcessNode;
  apkProcess: APKProcess;
  onClose: () => void;
  onSave: (data: any) => void;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
}

const NodeModal: React.FC<NodeModalProps> = ({ nodeIndex, node, apkProcess, onClose, onSave, onApprove, onReject }) => {
  const [formData] = useState<any>({});
  const [rejectReason] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'material'>('basic');
  const [activeLang, setActiveLang] = useState('en');
  
  const isViewOnly = node.status === 'completed';
  const isRejected = node.status === 'rejected';

  // 渲染通道发布申请/物料上传表单
  const renderChannelApplyForm = () => (
    <div className="space-y-6">
      {/* 基础信息 */}
      <div>
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          基础信息
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">应用名称</label>
            <input type="text" value={apkProcess.appName} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">应用包名</label>
            <input type="text" value={apkProcess.packageName} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">应用类型</label>
            <input type="text" value={apkProcess.appType || 'Social'} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">应用版本号</label>
            <select className="w-full border rounded px-3 py-2" disabled={isViewOnly}>
              <option value="">选择版本</option>
              <option value="22651">v22651 - 2.26.1.15</option>
              <option value="22650">v22650 - 2.26.1.14</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">应用APK</label>
            <input type="text" value="https://example.com/apk" disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">应用分类</label>
            <select className="w-full border rounded px-3 py-2" disabled={isViewOnly}>
              {appCategoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">系统应用</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="systemApp" value="yes" disabled={isViewOnly} /> 是
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="systemApp" value="no" defaultChecked disabled={isViewOnly} /> 否
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">是否需要过滤印度</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="filterIndia" value="yes" disabled={isViewOnly} /> 是
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="filterIndia" value="no" defaultChecked disabled={isViewOnly} /> 否
              </label>
            </div>
          </div>
        </div>
        
        {/* 发布范围 */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">发布国家</label>
            <select className="w-full border rounded px-3 py-2 mb-2" disabled={isViewOnly}>
              <option value="all">全部</option>
              <option value="include">包含</option>
              <option value="exclude">不包含</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">发布品牌</label>
            <select className="w-full border rounded px-3 py-2 mb-2" disabled={isViewOnly}>
              <option value="all">全部</option>
              <option value="include">包含</option>
              <option value="exclude">不包含</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">发布机型</label>
            <select className="w-full border rounded px-3 py-2 mb-2" disabled={isViewOnly}>
              <option value="all">全部</option>
              <option value="include">包含</option>
              <option value="exclude">不包含</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内测机型</label>
            <select className="w-full border rounded px-3 py-2 mb-2" disabled={isViewOnly}>
              <option value="all">全部</option>
              <option value="include">包含</option>
              <option value="exclude">不包含</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">适用安卓版本</label>
            <select className="w-full border rounded px-3 py-2 mb-2" disabled={isViewOnly}>
              <option value="all">全部</option>
              <option value="include">包含</option>
              <option value="exclude">不包含</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">适用tOS版本</label>
            <select className="w-full border rounded px-3 py-2 mb-2" disabled={isViewOnly}>
              <option value="all">全部</option>
              <option value="include">包含</option>
              <option value="exclude">不包含</option>
            </select>
          </div>
        </div>
      </div>

      {/* PA应用更新 */}
      <div>
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          PA应用更新
        </h4>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="isPAUpdate" value="yes" defaultChecked disabled={isViewOnly} /> 是
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="isPAUpdate" value="no" disabled={isViewOnly} /> 否
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">灰度量级（x/天）</label>
            <input type="number" min="1" max="100000" defaultValue="1000" disabled={isViewOnly} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">生效时间</label>
            <input type="datetime-local" disabled={isViewOnly} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染物料表单
  const renderMaterialForm = () => (
    <div>
      {/* 语言Tab */}
      <div className="flex border-b mb-4">
        {languageOptions.map(lang => (
          <button
            key={lang.code}
            onClick={() => setActiveLang(lang.code)}
            className={`px-4 py-2 -mb-px ${activeLang === lang.code ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            {lang.name}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">应用名称</label>
          <input type="text" placeholder="请输入应用名称" disabled={isViewOnly} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">一句话描述</label>
          <textarea rows={2} placeholder="请输入一句话描述" disabled={isViewOnly} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">产品详情</label>
          <textarea rows={4} placeholder="请输入产品详情" disabled={isViewOnly} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">关键词</label>
          <input type="text" placeholder="请输入关键词（至少1个，最多5个）" disabled={isViewOnly} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">应用图标</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">点击上传图片（jpg/png，尺寸≥180x180px）</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">置顶大图</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">点击上传图片（1080x594px，≤2MB）</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">详情截图（3-5张）</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">点击上传截图（竖图480x854/横图854x480）</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">是否GP上架</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="isGP" value="yes" disabled={isViewOnly} /> 是
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="isGP" value="no" defaultChecked disabled={isViewOnly} /> 否
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染通道发布审核表单
  const renderChannelReviewForm = () => (
    <div className="space-y-6">
      {/* 审核结果 - 固定在最上方 */}
      <div className="bg-gray-50 p-4 rounded-lg sticky top-0">
        <h4 className="font-medium mb-4">审核结果</h4>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="reviewResult" value="pass" disabled={isViewOnly} />
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>通过</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="reviewResult" value="reject" disabled={isViewOnly} />
            <XCircle className="w-5 h-5 text-red-500" />
            <span>不通过</span>
          </label>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">不通过理由</label>
          <textarea rows={3} placeholder="请输入不通过理由" disabled={isViewOnly} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      {/* 通道发布详情 */}
      <div>
        <h4 className="font-medium mb-4">通道发布详情</h4>
        {renderChannelApplyForm()}
      </div>
    </div>
  );

  // 渲染物料审核表单
  const renderMaterialReviewForm = () => (
    <div className="space-y-6">
      {/* 运营人员审核 - 固定在最上方 */}
      <div className="bg-gray-50 p-4 rounded-lg sticky top-0">
        <h4 className="font-medium mb-4">运营人员审核结果</h4>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="operatorReviewResult" value="pass" disabled={isViewOnly} />
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>通过</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="operatorReviewResult" value="reject" disabled={isViewOnly} />
            <XCircle className="w-5 h-5 text-red-500" />
            <span>不通过</span>
          </label>
        </div>
      </div>

      {/* 老板审核 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-4">老板审核结果</h4>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="bossReviewResult" value="pass" disabled={isViewOnly} />
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>通过</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="bossReviewResult" value="reject" disabled={isViewOnly} />
            <XCircle className="w-5 h-5 text-red-500" />
            <span>不通过</span>
          </label>
        </div>
      </div>

      {/* 物料详情 */}
      <div>
        <h4 className="font-medium mb-4">物料上传详情</h4>
        {renderMaterialForm()}
      </div>
    </div>
  );

  // 渲染第三方平台数据（应用上架/业务内测/灰度监控）
  const renderPlatformData = (type: 'appPublish' | 'betaTest' | 'grayMonitor') => {
    const data = {
      appPublish: {
        title: '应用上架数据',
        fields: [
          { label: '状态', value: '生效中' },
          { label: '应用名称', value: apkProcess.appName },
          { label: '升级任务名称', value: 'WhatsApp_Upgrade_v22651' },
          { label: '应用包名', value: apkProcess.packageName },
          { label: '发布国家', value: '全部' },
          { label: '品牌', value: 'Tecno, Infinix' },
          { label: '机型', value: 'X6841_H6941, X6858_H8917' },
          { label: '语言', value: '英语, 俄语' },
          { label: '安卓版本', value: 'Android 14, 15' },
          { label: 'tOS版本', value: 'tOS 16.1.0' },
          { label: '灰度量级', value: '1000/天' },
          { label: '分类', value: 'Social' },
          { label: '生效时间', value: '2026-03-01 ~ 2026-06-01' },
        ]
      },
      betaTest: {
        title: '业务内测数据',
        fields: [
          { label: '状态', value: '生效中' },
          { label: '应用名称', value: apkProcess.appName },
          { label: '升级任务名称', value: 'WhatsApp_Beta_v22651' },
          { label: '应用包名', value: apkProcess.packageName },
          { label: '发布国家', value: '全部' },
          { label: '品牌', value: 'Tecno' },
          { label: '机型', value: 'X6841_H6941' },
          { label: '语言', value: '英语' },
          { label: '安卓版本', value: 'Android 14' },
          { label: 'tOS版本', value: 'tOS 16.1.0' },
          { label: '灰度量级', value: '500/天' },
          { label: '分类', value: 'Social' },
          { label: '生效时间', value: '2026-03-01 ~ 2026-03-31' },
        ]
      },
      grayMonitor: {
        title: '灰度监控数据',
        fields: [
          { label: '应用名称', value: apkProcess.appName },
          { label: '应用包名', value: apkProcess.packageName },
          { label: '任务名称', value: 'WhatsApp_Gray_v22651' },
          { label: '生效时间', value: '2026-03-01 ~ 2026-06-01' },
          { label: '灰度量级', value: '1000/10000' },
          { label: '现状/总计', value: '3500/10000' },
          { label: '状态', value: '进行中' },
          { label: '创建时间', value: '2026-03-01 10:00:00' },
        ]
      }
    };

    const info = data[type];

    return (
      <div className="space-y-4">
        {info.fields.map((field, idx) => (
          <div key={idx} className="flex">
            <span className="w-32 text-sm text-gray-500">{field.label}</span>
            <span className="text-sm font-medium">{field.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // 根据节点类型渲染不同内容
  const renderNodeContent = () => {
    switch (nodeIndex) {
      case 0: // 通道发布申请
      case 2: // 物料上传
        return (
          <div>
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2 -mb-px ${activeTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                基础信息
              </button>
              <button
                onClick={() => setActiveTab('material')}
                className={`px-4 py-2 -mb-px ${activeTab === 'material' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                所需物料
              </button>
            </div>
            {activeTab === 'basic' ? renderChannelApplyForm() : renderMaterialForm()}
          </div>
        );
      case 1: // 通道发布审核
        return renderChannelReviewForm();
      case 3: // 物料审核
        return renderMaterialReviewForm();
      case 4: // 应用上架
        return renderPlatformData('appPublish');
      case 5: // 业务内测
        return renderPlatformData('betaTest');
      case 6: // 灰度监控
        return renderPlatformData('grayMonitor');
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">{NODE_NAMES[nodeIndex]}</h2>
            <p className="text-sm text-gray-500">
              状态: <span className={
                node.status === 'completed' ? 'text-green-600' :
                node.status === 'rejected' ? 'text-red-600' :
                'text-blue-600'
              }>{getNodeStatusText(node.status)}</span>
              {isRejected && node.rejectReason && (
                <span className="ml-2 text-red-500">- {node.rejectReason}</span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal内容 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderNodeContent()}
        </div>

        {/* Modal底部 */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div>
            {isRejected && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">被拒绝: {node.rejectReason}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              取消
            </button>
            {!isViewOnly && (
              <>
                {nodeIndex === 1 || nodeIndex === 3 ? (
                  <>
                    <button onClick={onApprove} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      审核通过
                    </button>
                    <button onClick={() => onReject?.(rejectReason)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      审核拒绝
                    </button>
                  </>
                ) : (
                  <button onClick={() => onSave(formData)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    保存
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== APK详情页主组件 ====================
interface APKDetailPageProps {
  apkProcess: APKProcess;
  onBack: () => void;
}

const APKDetailPage: React.FC<APKDetailPageProps> = ({ apkProcess, onBack }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'history'>('pipeline');
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  // 计算应用状态
  const getOverallStatus = () => {
    const hasRejected = apkProcess.nodes.some(n => n.status === 'rejected');
    const hasProcessing = apkProcess.nodes.some(n => n.status === 'processing');
    const allCompleted = apkProcess.nodes.every(n => n.status === 'completed');
    
    if (hasRejected) return 'failed';
    if (hasProcessing) return 'processing';
    if (allCompleted) return 'completed';
    return 'processing';
  };

  const overallStatus = getOverallStatus();

  const handleSaveNode = (data: any) => {
    console.log('保存节点数据:', data);
    setSelectedNode(null);
  };

  const handleApproveNode = () => {
    console.log('审核通过');
    setSelectedNode(null);
  };

  const handleRejectNode = (reason: string) => {
    console.log('审核拒绝:', reason);
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-3">
              <span className="text-4xl">{apkProcess.appIcon}</span>
              <div>
                <h1 className="text-xl font-semibold">{apkProcess.appName}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{apkProcess.packageName}</span>
                  <span>v{apkProcess.versionCode}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full font-medium ${getAppStatusColor(overallStatus)}`}>
            {overallStatus === 'completed' ? '已完成' : overallStatus === 'failed' ? '失败' : '进行中'}
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-4 px-2 border-b-2 font-medium ${
              activeTab === 'pipeline'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            流水线
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-2 border-b-2 font-medium ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            历史操作记录
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {activeTab === 'pipeline' ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* 流水线可视化 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-6">发布流程</h2>
              <div className="flex items-center justify-between overflow-x-auto pb-4">
                {apkProcess.nodes.map((node, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center min-w-[100px]">
                      <button
                        onClick={() => setSelectedNode(index)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-medium transition-all hover:scale-110 shadow-md ${
                          getNodeStatusColor(node.status)
                        } ${
                          node.status !== 'pending' ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                        disabled={node.status === 'pending'}
                      >
                        {node.status === 'completed' ? (
                          <CheckCircle className="w-7 h-7" />
                        ) : node.status === 'rejected' ? (
                          <XCircle className="w-7 h-7" />
                        ) : node.status === 'processing' ? (
                          <Play className="w-7 h-7" />
                        ) : (
                          <span className="text-lg">{index + 1}</span>
                        )}
                      </button>
                      <span className="mt-3 text-sm font-medium text-gray-700 max-w-[90px] text-center">
                        {NODE_NAMES[index]}
                      </span>
                      <span className={`text-xs mt-1 font-medium ${
                        node.status === 'completed' ? 'text-green-600' :
                        node.status === 'rejected' ? 'text-red-600' :
                        node.status === 'processing' ? 'text-blue-600' :
                        'text-gray-400'
                      }`}>
                        {getNodeStatusText(node.status)}
                      </span>
                    </div>
                    {index < apkProcess.nodes.length - 1 && (
                      <div className={`flex-1 h-1.5 mx-2 rounded ${
                        apkProcess.nodes[index + 1].status !== 'pending' 
                          ? getNodeStatusColor(node.status) 
                          : 'bg-gray-200'
                      }`} style={{ minWidth: '20px' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 点击提示 */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center text-blue-700">
              <p>💡 点击上方任意节点可查看详情或进行编辑</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">历史操作记录</h2>
              <div className="space-y-4">
                {mockOperationRecords.map((record) => (
                  <div key={record.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <div className="flex-1 w-px bg-gray-200 my-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{record.operator}</span>
                          <span className="text-gray-400">执行了</span>
                          <span className="text-blue-600 font-medium">{record.action}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {record.operateTime}
                        </div>
                      </div>
                      {record.detail && (
                        <p className="mt-2 text-sm text-gray-500 pl-6">{record.detail}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 节点Modal弹窗 */}
      {selectedNode !== null && apkProcess.nodes[selectedNode] && (
        <NodeModal
          nodeIndex={selectedNode}
          node={apkProcess.nodes[selectedNode]}
          apkProcess={apkProcess}
          onClose={() => setSelectedNode(null)}
          onSave={handleSaveNode}
          onApprove={handleApproveNode}
          onReject={handleRejectNode}
        />
      )}
    </div>
  );
};

export default APKDetailPage;
