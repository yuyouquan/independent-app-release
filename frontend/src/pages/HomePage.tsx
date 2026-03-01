import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  mockApplications, 
  mockTodos, 
  mockKanbanData, 
  mockKanbanShuttleView, 
  mockKanbanProductView, 
  mockKanbanStatusView,
  mockAPKProcess,
  shuttleOptions, 
  tosVersionOptions, 
  apkStatusOptions
} from '../data/mockData';
import { CreateApplicationModal } from '../components/CreateApplicationModal';
import APKDetailPage from './APKDetailPage';
import type { KanbanData, APKProcess } from '../types';

// 状态颜色映射 (符合PRD)
const statusColors = {
  success: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  processing: 'bg-blue-100 text-blue-800',
  total: 'bg-gray-100 text-gray-800',
};

// 看板视角类型
type KanbanView = 'overview' | 'shuttle' | 'product' | 'status';

// 状态显示映射
const statusLabels = {
  success: '成功',
  rejected: '拒绝',
  processing: '进行中',
  total: '总数',
};

// 节点状态颜色
const nodeStatusColors = {
  '待处理': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  '进行中': 'bg-blue-100 text-blue-800 border-blue-200',
  '已完成': 'bg-green-100 text-green-800 border-green-200',
  '已拒绝': 'bg-red-100 text-red-800 border-red-200',
};

// 节点图标映射
const nodeIcons: Record<string, string> = {
  '通道发布申请': '📝',
  '通道发布审核': '✅',
  '物料上传': '📤',
  '物料审核': '🔍',
  '应用上架': '📱',
  '业务内测': '🧪',
  '灰度监控': '📊',
};

// ==================== 申请列表组件 ====================
const ApplicationList: React.FC<{ onViewDetail: (id: string) => void; onOpenModal: () => void }> = ({ onViewDetail, onOpenModal }) => {
  const [searchShuttle, setSearchShuttle] = useState('');
  const [searchTos, setSearchTos] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchApplicant, setSearchApplicant] = useState('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  const filteredApps = mockApplications.filter((app) => {
    const appDate = new Date(app.applyTime.replace(/[:\s]/g, '-'));
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    
    const isInDateRange = (!startDate || appDate >= startDate) && (!endDate || appDate <= endDate);
    
    return (
      isInDateRange &&
      (searchShuttle === '' || app.shuttleName.includes(searchShuttle)) &&
      (searchTos === '' || app.tosVersion.includes(searchTos)) &&
      (searchStatus === '' || app.apkStatus === searchStatus) &&
      (searchApplicant === '' || app.applicant.includes(searchApplicant))
    );
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">独立三方应用发布流程申请列表</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={onOpenModal}
        >
          新建申请
        </button>
      </div>

      {/* 筛选条件 - 符合PRD字段 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
        {/* 班车名称筛选 */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={searchShuttle}
          onChange={(e) => setSearchShuttle(e.target.value)}
        >
          <option value="">全部班车</option>
          {shuttleOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        
        {/* tOS版本筛选 */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={searchTos}
          onChange={(e) => setSearchTos(e.target.value)}
        >
          <option value="">全部tOS版本</option>
          {tosVersionOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        
        {/* APK状态筛选 */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">全部状态</option>
          {apkStatusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        {/* 申请人筛选 */}
        <input
          type="text"
          placeholder="申请人"
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={searchApplicant}
          onChange={(e) => setSearchApplicant(e.target.value)}
        />

        {/* 申请时间筛选 - 日期范围 */}
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={dateRange.start}
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          placeholder="开始日期"
        />
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={dateRange.end}
          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          placeholder="结束日期"
        />
      </div>

      {/* 快捷筛选按钮 */}
      <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              const today = new Date();
              const weekAgo = new Date(today);
              weekAgo.setDate(today.getDate() - 7);
              setDateRange({ 
                start: weekAgo.toISOString().split('T')[0], 
                end: today.toISOString().split('T')[0] 
              });
            }}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
          >
            近7天
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const monthAgo = new Date(today);
              monthAgo.setDate(today.getDate() - 30);
              setDateRange({ 
                start: monthAgo.toISOString().split('T')[0], 
                end: today.toISOString().split('T')[0] 
              });
            }}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
          >
            近30天
          </button>
          <button
            onClick={() => setDateRange({ start: '', end: '' })}
            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
          >
            清除
          </button>
      </div>

      {/* 表格 - 符合PRD字段 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">班车名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">tOS版本</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APK状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请人</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.shuttleName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.tosVersion}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.apkStatus]}`}>
                      {app.apkStatus === 'success' && '✅ '}
                      {app.apkStatus === 'rejected' && '❌ '}
                      {app.apkStatus === 'processing' && '🔵 '}
                      {statusLabels[app.apkStatus]}
                    </span>
                    {/* 显示详细统计 */}
                    {app.appCount && (
                      <span className="text-xs text-gray-400">
                        (成功{app.completedCount}/进行中{app.processingCount}/拒绝{app.rejectedCount})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applicant}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applyTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => onViewDetail(app.id)}
                  >
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== 待办组件 - 符合PRD ====================
const TodoSection: React.FC<{ onNavigateToPipeline: (appId: string, node: string) => void }> = ({ onNavigateToPipeline }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'rejected'>('all');
  const [selectedTodo, setSelectedTodo] = useState<string | null>(null);

  const filteredTodos = mockTodos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'pending') return todo.nodeStatus === '待处理';
    if (filter === 'processing') return todo.nodeStatus === '进行中';
    if (filter === 'rejected') return todo.nodeStatus === '已拒绝';
    return true;
  });

  const pendingCount = mockTodos.filter(t => t.nodeStatus === '待处理').length;
  const processingCount = mockTodos.filter(t => t.nodeStatus === '进行中').length;
  const rejectedCount = mockTodos.filter(t => t.nodeStatus === '已拒绝').length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">待办事项</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部 ({mockTodos.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            待处理 ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              filter === 'processing' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            进行中 ({processingCount})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            已拒绝 ({rejectedCount})
          </button>
        </div>
      </div>

      {/* 统计摘要 - 符合PRD */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-xs text-yellow-700">待处理</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{processingCount}</div>
          <div className="text-xs text-blue-700">进行中</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          <div className="text-xs text-red-700">已拒绝</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{mockTodos.length}</div>
          <div className="text-xs text-green-700">总计</div>
        </div>
      </div>

      {/* 待办卡片列表 - 符合PRD格式 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div 
              key={todo.id} 
              className={`border-2 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                selectedTodo === todo.id 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTodo(selectedTodo === todo.id ? null : todo.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* 班车名称 + 应用名称 - 符合PRD */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{nodeIcons[todo.node] || '⚪'}</span>
                    <span className="text-sm text-gray-500">{todo.shuttleName}</span>
                    <span className="text-gray-300">|</span>
                    <span className="font-medium text-gray-900">{todo.appName}</span>
                    {todo.packageName && (
                      <span className="text-xs text-gray-400">({todo.packageName})</span>
                    )}
                  </div>
                  
                  {/* 流程节点 + 状态 - 符合PRD */}
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">节点:</span>
                    <span className="text-blue-600 font-medium">{todo.node}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${nodeStatusColors[todo.nodeStatus]}`}>
                      {todo.nodeStatus}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500 text-xs">处理人: {todo.handler}</span>
                    {todo.createTime && (
                      <>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500 text-xs">创建时间: {todo.createTime}</span>
                      </>
                    )}
                  </div>
                  
                  {/* 拒绝原因 - 符合PRD (当被后续节点拒绝回退时显示) */}
                  {todo.rejectReason && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                      ⚠️ 拒绝原因: {todo.rejectReason}
                    </div>
                  )}
                  
                  {/* 展开详情 */}
                  {selectedTodo === todo.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>班车: {todo.shuttleName}</div>
                        <div>应用: {todo.appName}</div>
                        {todo.packageName && <div>包名: {todo.packageName}</div>}
                        <div>当前节点: {todo.node}</div>
                        <div>处理人: {todo.handler}</div>
                        {todo.createTime && <div>创建时间: {todo.createTime}</div>}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 去处理按钮 - 符合PRD */}
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors ml-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToPipeline(todo.id, todo.node);
                  }}
                >
                  去处理
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            暂无待办事项
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== 看板组件 - 符合PRD ====================
const KanbanSection: React.FC = () => {
  const [view, setView] = useState<KanbanView>('overview');
  const data = mockKanbanData as KanbanData;
  
  // 总览视角
  const overviewItems = [
    { title: '班车数量', value: data.shuttleCount, color: 'bg-blue-500' },
    { title: '产品数量', value: data.productCount, color: 'bg-green-500' },
    { title: '进行中', value: data.processingCount, color: 'bg-yellow-500' },
    { title: '已完成', value: data.completedCount, color: 'bg-purple-500' },
  ];

  const viewTabs = [
    { id: 'overview', label: '总览' },
    { id: 'shuttle', label: '班车视角' },
    { id: 'product', label: '产品视角' },
    { id: 'status', label: '状态视角' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">看板概览</h2>
        {/* 视角切换标签 */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {viewTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as KanbanView)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 总览视角 */}
      {view === 'overview' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {overviewItems.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className={`${item.color} text-white rounded-lg py-2 px-4 mb-2`}>
                {item.title}
              </div>
              <div className="text-3xl font-bold text-gray-900">{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* 班车视角 - 符合PRD格式 */}
      {view === 'shuttle' && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-500 uppercase bg-gray-50 p-2 rounded">
            <div>班车名称</div>
            <div>月份</div>
            <div>覆盖产品</div>
            <div>产品数量</div>
            <div>状态</div>
          </div>
          {mockKanbanShuttleView.map((shuttle, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 text-sm p-3 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="font-medium text-gray-900">{shuttle.name}</div>
              <div className="text-gray-600">{shuttle.month}</div>
              <div className="text-gray-600 truncate">
                {shuttle.products.slice(0, 3).join('、')}
                {shuttle.products.length > 3 && `等${shuttle.products.length}个`}
              </div>
              <div className="text-gray-600">{shuttle.productCount}个</div>
              <div>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  shuttle.status === '进行中' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {shuttle.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 产品视角 - 符合PRD格式 */}
      {view === 'product' && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500 uppercase bg-gray-50 p-2 rounded">
            <div>产品名称</div>
            <div>发布次数</div>
            <div>最近发布版本</div>
            <div>状态</div>
          </div>
          {mockKanbanProductView.map((product, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 text-sm p-3 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="font-medium text-gray-900">{product.name}</div>
              <div className="text-gray-600">{product.releaseCount}次</div>
              <div className="text-gray-600">
                {product.releases[0]?.version || '-'}
                {product.releases.length > 1 && (
                  <span className="text-xs text-gray-400 ml-1">(+{product.releases.length - 1})</span>
                )}
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                  {product.releases[0]?.status || '-'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 状态视角 - 符合PRD格式 */}
      {view === 'status' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{mockKanbanStatusView.进行中}</div>
              <div className="text-sm text-blue-700">进行中产品</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{mockKanbanStatusView.已完成}</div>
              <div className="text-sm text-green-700">已完成产品</div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{mockKanbanStatusView.升级任务数}</div>
            <div className="text-sm text-purple-700">升级任务总数</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== 首页主组件 ====================
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [selectedAPK, setSelectedAPK] = useState<APKProcess | null>(null);
  const [searchApp, setSearchApp] = useState('');

  const handleViewDetail = (id: string) => {
    navigate(`/application/${id}`);
  };

  const handleNavigateToPipeline = (todoId: string, node: string) => {
    navigate(`/application/${todoId}?node=${encodeURIComponent(node)}`);
  };

  const handleViewAPKDetail = (apk: APKProcess) => {
    setSelectedAPK(apk);
  };

  const handleBackToList = () => {
    setSelectedAPK(null);
  };

  // 模拟该流程单下的应用列表（实际应该从API获取）
  const applicationApps: APKProcess[] = [
    mockAPKProcess,
    { ...mockAPKProcess, id: '2', appName: 'Telegram', packageName: 'org.telegram', versionCode: '22651', status: 'completed' as const, nodes: [
      { name: '通道发布申请', status: 'completed' },
      { name: '通道发布审核', status: 'completed' },
      { name: '物料上传', status: 'completed' },
      { name: '物料审核', status: 'completed' },
      { name: '应用上架', status: 'completed' },
      { name: '业务内测', status: 'completed' },
      { name: '灰度监控', status: 'completed' },
    ]},
    { ...mockAPKProcess, id: '3', appName: 'Facebook', packageName: 'com.facebook', versionCode: '22651', status: 'failed' as const, nodes: [
      { name: '通道发布申请', status: 'completed' },
      { name: '通道发布审核', status: 'completed' },
      { name: '物料上传', status: 'rejected', rejectReason: '物料不符合要求' },
      { name: '物料审核', status: 'pending' },
      { name: '应用上架', status: 'pending' },
      { name: '业务内测', status: 'pending' },
      { name: '灰度监控', status: 'pending' },
    ]},
  ];

  // 过滤应用
  const filteredApps = applicationApps.filter(app => 
    searchApp === '' || 
    app.appName.toLowerCase().includes(searchApp.toLowerCase()) ||
    app.packageName.toLowerCase().includes(searchApp.toLowerCase())
  );

  // 如果选择了APK详情，显示APK详情页
  if (selectedAPK) {
    return <APKDetailPage apkProcess={selectedAPK} onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">独立三方应用发布系统</h1>
              <span className="ml-2 text-xs text-gray-500">v2.5</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <span className="text-sm">通知</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <span className="text-sm">设置</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* 应用卡片列表视图 - 符合PRD */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">该流程单下的应用列表</h2>
            <div className="flex items-center gap-4">
              {/* 搜索框 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索应用名称/包名"
                  className="border border-gray-300 rounded-lg px-4 py-2 pl-10 w-64"
                  value={searchApp}
                  onChange={(e) => setSearchApp(e.target.value)}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {/* 视图切换 */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  列表
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  卡片
                </button>
              </div>
              {/* 添加应用按钮 */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                添加应用
              </button>
            </div>
          </div>

          {/* 卡片视图 */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApps.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => handleViewAPKDetail(app)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{app.appIcon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{app.appName}</h3>
                      <p className="text-sm text-gray-500 truncate">{app.packageName}</p>
                      <p className="text-sm text-gray-400">{app.appType} · v{app.versionCode}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      app.status === 'completed' ? 'bg-green-100 text-green-700' :
                      app.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {app.status === 'completed' ? '已完成' : app.status === 'failed' ? '失败' : '进行中'}
                    </div>
                  </div>
                  
                  {/* 当前节点 */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">当前节点</span>
                      <span className="font-medium">{app.nodes[app.currentNode]?.name || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-500">操作人</span>
                      <span>{app.nodes[app.currentNode]?.operator || '-'}</span>
                    </div>
                    {app.nodes[app.currentNode]?.rejectReason && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
                        拒绝原因: {app.nodes[app.currentNode].rejectReason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 列表视图 */}
          {viewMode === 'list' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">应用</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">包名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">版本</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前节点</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作人</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApps.map((app) => (
                    <tr 
                      key={app.id} 
                      onClick={() => handleViewAPKDetail(app)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{app.appIcon}</span>
                          <span className="font-medium text-gray-900">{app.appName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.packageName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.appType}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">v{app.versionCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.nodes[app.currentNode]?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          app.status === 'completed' ? 'bg-green-100 text-green-700' :
                          app.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {app.status === 'completed' ? '已完成' : app.status === 'failed' ? '失败' : '进行中'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.nodes[app.currentNode]?.operator || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">2026-03-01</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 分页 */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>上一页</button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded">1</span>
              <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>下一页</button>
            </div>
          </div>
        </div>
        
        <ApplicationList 
          onViewDetail={handleViewDetail} 
          onOpenModal={() => setIsModalOpen(true)} 
        />
        
        <TodoSection onNavigateToPipeline={handleNavigateToPipeline} />
        
        <KanbanSection />
      </div>

      {/* 创建申请Modal */}
      <CreateApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          setIsModalOpen(false);
          console.log('提交申请:', data);
        }}
      />
    </div>
  );
};

export default HomePage;
