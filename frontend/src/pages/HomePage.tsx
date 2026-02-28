import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApplications, mockTodos, mockKanbanData, mockKanbanShuttle, mockKanbanProduct, mockKanbanStatus, shuttleOptions, tosVersionOptions, apkStatusOptions } from '../data/mockData';
import { CreateApplicationModal } from '../components/CreateApplicationModal';
import type { KanbanData } from '../types';

// 状态颜色映射
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

// 申请列表组件
const ApplicationList: React.FC<{ onViewDetail: (id: string) => void; onOpenModal: () => void }> = ({ onViewDetail, onOpenModal }) => {
  const [searchShuttle, setSearchShuttle] = useState('');
  const [searchTos, setSearchTos] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchApplicant, setSearchApplicant] = useState('');

  const filteredApps = mockApplications.filter((app) => {
    return (
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

      {/* 筛选条件 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
        <input
          type="text"
          placeholder="申请人"
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={searchApplicant}
          onChange={(e) => setSearchApplicant(e.target.value)}
        />
      </div>

      {/* 表格 */}
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.apkStatus]}`}>
                    {app.apkStatus === 'success' && '✅ '}
                    {app.apkStatus === 'rejected' && '❌ '}
                    {app.apkStatus === 'processing' && '🔵 '}
                    {statusLabels[app.apkStatus]}
                  </span>
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

// 待办组件 - 增强版
const TodoSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing'>('all');
  const [selectedTodo, setSelectedTodo] = useState<string | null>(null);

  const filteredTodos = mockTodos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'pending') return todo.nodeStatus === '待处理';
    if (filter === 'processing') return todo.nodeStatus === '进行中';
    return true;
  });

  const pendingCount = mockTodos.filter(t => t.nodeStatus === '待处理').length;
  const processingCount = mockTodos.filter(t => t.nodeStatus === '进行中').length;

  // 节点状态颜色映射
  const getNodeStatusColor = (status: string) => {
    if (status === '待处理') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (status === '进行中') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800';
  };

  // 节点图标映射
  const getNodeIcon = (node: string) => {
    const icons: Record<string, string> = {
      '通道发布申请': '📝',
      '通道发布审核': '✅',
      '物料上传': '📤',
      '物料审核': '🔍',
      '应用上架': '📱',
      '业务内测': '🧪',
      '灰度监控': '📊',
    };
    return icons[node] || '⚪';
  };

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
        </div>
      </div>

      {/* 统计摘要 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-xs text-yellow-700">待处理</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{processingCount}</div>
          <div className="text-xs text-blue-700">进行中</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{mockTodos.length}</div>
          <div className="text-xs text-green-700">总计</div>
        </div>
      </div>

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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getNodeIcon(todo.node)}</span>
                    <span className="text-sm text-gray-500">{todo.shuttleName}</span>
                    <span className="text-gray-300">|</span>
                    <span className="font-medium text-gray-900">{todo.appName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">节点:</span>
                    <span className="text-blue-600 font-medium">{todo.node}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getNodeStatusColor(todo.nodeStatus)}`}>
                      {todo.nodeStatus}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500 text-xs">处理人: {todo.handler}</span>
                  </div>
                  {todo.rejectReason && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
                      ⚠️ 拒绝原因: {todo.rejectReason}
                    </div>
                  )}
                  {/* 展开详情 */}
                  {selectedTodo === todo.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>班车: {todo.shuttleName}</div>
                        <div>应用: {todo.appName}</div>
                        <div>当前节点: {todo.node}</div>
                        <div>处理人: {todo.handler}</div>
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors ml-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`跳转到处理: ${todo.appName} - ${todo.node}`);
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

// 看板组件 - 多视角支持
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

      {/* 班车视角 */}
      {view === 'shuttle' && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500 uppercase bg-gray-50 p-2 rounded">
            <div>班车名称</div>
            <div>tOS版本</div>
            <div>应用数量</div>
            <div>进度</div>
          </div>
          {mockKanbanShuttle.map((shuttle, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 text-sm p-3 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="font-medium text-gray-900">{shuttle.name}</div>
              <div className="text-gray-600">{shuttle.tosVersion}</div>
              <div className="text-gray-600">{shuttle.appCount}个</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${(shuttle.completedCount / shuttle.appCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {shuttle.completedCount}/{shuttle.appCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 产品视角 */}
      {view === 'product' && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-500 uppercase bg-gray-50 p-2 rounded">
            <div>产品名称</div>
            <div>包名</div>
            <div>发布次数</div>
            <div>最新版本</div>
            <div>状态</div>
          </div>
          {mockKanbanProduct.map((product, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 text-sm p-3 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="font-medium text-gray-900">{product.name}</div>
              <div className="text-gray-600 text-xs truncate">{product.packageName}</div>
              <div className="text-gray-600">{product.releaseCount}次</div>
              <div className="text-gray-600">{product.latestVersion}</div>
              <div>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {product.status === 'active' ? '活跃' : '闲置'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 状态视角 */}
      {view === 'status' && (
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-2 text-xs font-medium text-gray-500 uppercase bg-gray-50 p-2 rounded">
            {mockKanbanStatus.map((s, idx) => (
              <div key={idx} className="text-center truncate">{s.name}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {mockKanbanStatus.map((s, idx) => (
              <div key={idx} className="text-center p-3 border rounded-lg">
                <div className={`${s.color} text-white rounded-lg py-1 px-2 mb-2 text-xs truncate`}>
                  {s.name}
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 首页主组件
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (id: string) => {
    navigate(`/application/${id}`);
  };

  const handleCreateApplication = (data: any) => {
    console.log('提交申请数据:', data);
    alert('申请提交成功！请在待办中查看审核状态。');
  };

  return (
    <div className="space-y-6">
      <ApplicationList onViewDetail={handleViewDetail} onOpenModal={() => setIsModalOpen(true)} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodoSection />
        <KanbanSection />
      </div>
      <CreateApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateApplication}
      />
    </div>
  );
};

export default HomePage;
