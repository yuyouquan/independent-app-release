import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  Play,
} from 'lucide-react';
import type { APKProcess, ProcessNode } from '../types';
import { mockOperationRecords } from '../data/mockData';

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
              <img 
                src={apkProcess.appIcon} 
                alt={apkProcess.appName}
                className="w-12 h-12 rounded-lg"
              />
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
              <div className="flex items-center justify-between">
                {apkProcess.nodes.map((node, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setSelectedNode(index)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium transition-all hover:scale-110 ${
                          getNodeStatusColor(node.status)
                        } ${
                          node.status !== 'pending' ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                        disabled={node.status === 'pending'}
                      >
                        {node.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : node.status === 'rejected' ? (
                          <XCircle className="w-6 h-6" />
                        ) : node.status === 'processing' ? (
                          <Play className="w-6 h-6" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </button>
                      <span className="mt-2 text-sm text-gray-600 max-w-[80px] text-center">
                        {NODE_NAMES[index]}
                      </span>
                      <span className={`text-xs mt-1 ${
                        node.status === 'completed' ? 'text-green-600' :
                        node.status === 'rejected' ? 'text-red-600' :
                        node.status === 'processing' ? 'text-blue-600' :
                        'text-gray-400'
                      }`}>
                        {getNodeStatusText(node.status)}
                      </span>
                    </div>
                    {index < apkProcess.nodes.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        apkProcess.nodes[index + 1].status !== 'pending' 
                          ? getNodeStatusColor(node.status) 
                          : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 节点详情 */}
            {selectedNode !== null && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{NODE_NAMES[selectedNode]}</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">状态:</span>
                    <span className={`ml-2 font-medium ${
                      apkProcess.nodes[selectedNode].status === 'completed' ? 'text-green-600' :
                      apkProcess.nodes[selectedNode].status === 'rejected' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {getNodeStatusText(apkProcess.nodes[selectedNode].status)}
                    </span>
                  </div>
                  {apkProcess.nodes[selectedNode].operator && (
                    <div>
                      <span className="text-gray-500">操作人:</span>
                      <span className="ml-2">{apkProcess.nodes[selectedNode].operator}</span>
                    </div>
                  )}
                  {apkProcess.nodes[selectedNode].operatorTime && (
                    <div>
                      <span className="text-gray-500">操作时间:</span>
                      <span className="ml-2">{apkProcess.nodes[selectedNode].operatorTime}</span>
                    </div>
                  )}
                  {apkProcess.nodes[selectedNode].rejectReason && (
                    <div className="col-span-2">
                      <span className="text-gray-500">拒绝原因:</span>
                      <span className="ml-2 text-red-600">{apkProcess.nodes[selectedNode].rejectReason}</span>
                    </div>
                  )}
                </div>
                {apkProcess.nodes[selectedNode].status !== 'completed' && (
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    编辑节点
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">历史操作记录</h2>
              <div className="space-y-4">
                {mockOperationRecords.map((record) => (
                  <div key={record.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
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
    </div>
  );
};

export default APKDetailPage;
