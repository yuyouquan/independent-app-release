import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Search, Plus, Eye, ChevronDown, ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { mockApplications, mockTodos, shuttleOptions, tosVersionOptions, apkStatusOptions, Application, APKItem, TodoItem } from './data/mockData';

// 状态颜色映射
const statusColors = {
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  processing: 'bg-blue-100 text-blue-700',
};

const nodeStatusColors = {
  completed: 'bg-green-500',
  processing: 'bg-blue-500',
  rejected: 'bg-red-500',
  pending: 'bg-gray-300',
};

const statusLabels = {
  success: '成功',
  failed: '拒绝',
  processing: '进行中',
};

// ==================== 主页组件 ====================
function HomePage() {
  const navigate = useNavigate();
  const [applications] = useState<Application[]>(mockApplications);
  const [todos] = useState<TodoItem[]>(mockTodos);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterShuttle, setFilterShuttle] = useState('');
  const [filterTos, setFilterTos] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [kanbanView, setKanbanView] = useState<'shuttle' | 'product' | 'status'>('shuttle');

  // 看板数据 - 班车视角
  const shuttleKanban = [
    { shuttleName: '班车20260301', month: '2026年3月', products: ['Spotify', 'Telegram', 'Instagram'], count: 3 },
    { shuttleName: '班车20260228', month: '2026年2月', products: ['WhatsApp', 'Facebook'], count: 2 },
    { shuttleName: '班车20260221', month: '2026年2月', products: ['YouTube', 'Twitter', 'Snapchat', 'LinkedIn'], count: 4 },
  ];

  // 看板数据 - 产品视角
  const productKanban = [
    { productName: 'Spotify', releaseCount: 12 },
    { productName: 'Telegram', releaseCount: 8 },
    { productName: 'Instagram', releaseCount: 6 },
  ];

  // 看板数据 - 状态视角
  const statusKanban = {
    processing: 3,
    completed: 15,
    totalTasks: 28,
  };

  // 筛选过滤
  const filteredApps = applications.filter(app => {
    const matchKeyword = searchKeyword === '' || 
      app.shuttleName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      app.applicant.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchShuttle = filterShuttle === '' || app.shuttleName === filterShuttle;
    const matchTos = filterTos === '' || app.tosVersion === filterTos;
    const matchStatus = filterStatus === '' || app.status === filterStatus;
    return matchKeyword && matchShuttle && matchTos && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">独立三方应用发布系统</h1>
              <span className="ml-2 text-xs text-gray-500">v1.0</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 text-sm">通知</button>
              <button className="text-gray-500 hover:text-gray-700 text-sm">设置</button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* 申请列表区域 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">独立三方应用发布流程申请列表</h2>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              申请
            </button>
          </div>

          {/* 筛选搜索栏 */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索班车名称、申请人..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <select
                className="bg-white border border-gray-300 rounded-lg px-4 py-2"
                value={filterShuttle}
                onChange={(e) => setFilterShuttle(e.target.value)}
              >
                <option value="">班车名称</option>
                {shuttleOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <select
                className="bg-white border border-gray-300 rounded-lg px-4 py-2"
                value={filterTos}
                onChange={(e) => setFilterTos(e.target.value)}
              >
                <option value="">tOS版本</option>
                {tosVersionOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <select
                className="bg-white border border-gray-300 rounded-lg px-4 py-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">APK状态</option>
                {apkStatusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {(searchKeyword || filterShuttle || filterTos || filterStatus) && (
                <button
                  onClick={() => { setSearchKeyword(''); setFilterShuttle(''); setFilterTos(''); setFilterStatus(''); }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  重置
                </button>
              )}
            </div>
          </div>

          {/* 申请列表表格 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">班车名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">tOS版本</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">APK状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请人</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.shuttleName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.tosVersion}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applicant}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applyTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => navigate(`/application/${app.id}`)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredApps.length === 0 && (
              <div className="text-center py-12 text-gray-500">暂无数据</div>
            )}
          </div>
        </div>

        {/* 待办区域 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">待办</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todos.map((todo) => (
              <div key={todo.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs text-gray-500">{todo.shuttleName}</div>
                    <div className="font-medium text-gray-900">{todo.appName}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    todo.nodeStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {todo.nodeStatus === 'rejected' ? '已拒绝' : '待处理'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">当前节点: {todo.currentNode}</div>
                  <div className="text-sm text-gray-500">处理人: {todo.operator}</div>
                </div>
                {todo.rejectReason && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
                    拒绝原因: {todo.rejectReason}
                  </div>
                )}
                <button 
                  onClick={() => navigate(`/application/${todo.id.split('-')[0]}?appId=${todo.appId}&node=${todo.currentNode}`)}
                  className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  去处理
                </button>
              </div>
            ))}
          </div>
          {todos.length === 0 && (
            <div className="text-center py-8 text-gray-500">暂无待办事项</div>
          )}
        </div>

        {/* 看板区域 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">看板</h2>
          
          {/* 看板Tab切换 */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setKanbanView('shuttle')}
              className={`px-4 py-2 -mb-px ${kanbanView === 'shuttle' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            >
              班车视角
            </button>
            <button
              onClick={() => setKanbanView('product')}
              className={`px-4 py-2 -mb-px ${kanbanView === 'product' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            >
              产品视角
            </button>
            <button
              onClick={() => setKanbanView('status')}
              className={`px-4 py-2 -mb-px ${kanbanView === 'status' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            >
              状态视角
            </button>
          </div>

          {/* 班车视角 */}
          {kanbanView === 'shuttle' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shuttleKanban.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="font-medium text-gray-900 mb-2">{item.shuttleName}</div>
                  <div className="text-sm text-gray-500 mb-2">{item.month}</div>
                  <div className="text-sm">
                    覆盖: {item.products.join('、')} 等{item.count}个产品
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 产品视角 */}
          {kanbanView === 'product' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {productKanban.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="font-medium text-gray-900 mb-2">{item.productName}</div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{item.releaseCount}</div>
                  <div className="text-sm text-gray-500">发布次数</div>
                </div>
              ))}
            </div>
          )}

          {/* 状态视角 */}
          {kanbanView === 'status' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="text-3xl font-bold text-blue-600">{statusKanban.processing}</div>
                <div className="text-sm text-gray-600">进行中</div>
                <div className="text-xs text-gray-500 mt-2">个产品</div>
              </div>
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="text-3xl font-bold text-green-600">{statusKanban.completed}</div>
                <div className="text-sm text-gray-600">已完成</div>
                <div className="text-xs text-gray-500 mt-2">个产品</div>
              </div>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-3xl font-bold text-gray-600">{statusKanban.totalTasks}</div>
                <div className="text-sm text-gray-600">升级任务</div>
                <div className="text-xs text-gray-500 mt-2">已完成</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 申请Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">申请独立三方应用发布流程</h3>
            <p className="text-gray-500">申请功能开发中...</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 申请详情页 ====================
function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = mockApplications.find(a => a.id === id) || mockApplications[0];
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // 搜索过滤
  const filteredApps = app.apps.filter(apk => 
    searchKeyword === '' ||
    apk.appName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    apk.packageName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 分页
  const totalPages = Math.ceil(filteredApps.length / pageSize);
  const paginatedApps = filteredApps.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          <h1 className="text-xl font-bold text-gray-900">申请详情</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 基础信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">基础信息</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-xs text-gray-500">班车名称</div>
              <div className="font-medium">{app.shuttleName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">tOS版本</div>
              <div className="font-medium">{app.tosVersion}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">申请人</div>
              <div className="font-medium">{app.applicant}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">申请时间</div>
              <div className="font-medium">{app.applyTime}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">状态</div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[app.status]}`}>
                {statusLabels[app.status]}
              </span>
            </div>
          </div>
        </div>

        {/* 应用卡片列表 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">应用列表</h2>
            <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              + 添加应用
            </button>
          </div>

          {/* 搜索框 */}
          <div className="mb-4">
            <div className="relative max-w-xs">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索应用名称、包名..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={searchKeyword}
                onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedApps.map((apk) => (
              <div key={apk.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {apk.appIcon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{apk.appName}</div>
                    <div className="text-sm text-gray-500">{apk.packageName}</div>
                    <div className="text-sm text-gray-500">{apk.appType} | v{apk.versionCode}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    apk.status === 'success' ? 'bg-green-100 text-green-700' :
                    apk.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {apk.status === 'success' ? '成功' : apk.status === 'failed' ? '失败' : '进行中'}
                  </span>
                </div>
                
                {/* 流程节点 */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {apk.nodes.slice(0, 4).map((node, idx) => (
                    <span key={idx} className={`px-2 py-0.5 text-xs rounded ${nodeStatusColors[node.status]} text-white`}>
                      {node.name.slice(0, 4)}
                    </span>
                  ))}
                  {apk.nodes.length > 4 && (
                    <span className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-600">
                      +{apk.nodes.length - 4}
                    </span>
                  )}
                </div>

                {apk.rejectReason && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
                    拒绝原因: {apk.rejectReason}
                  </div>
                )}

                <button 
                  onClick={() => navigate(`/apk/${apk.id}`)}
                  className="mt-3 w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  查看详情
                </button>
              </div>
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                上一页
              </button>
              <span className="px-3 py-1">
                {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 添加应用Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">添加应用到当前班车</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="搜索可添加的应用..."
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
              {['WhatsApp', 'Facebook', 'YouTube', 'Twitter', 'Snapchat'].map(name => (
                <div key={name} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">📱</div>
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-gray-500">com.example.{name.toLowerCase()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">确认添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== APK详情页 ====================
function APKDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 找到对应的APK
  let targetAPK: APKItem | undefined;
  let parentApp: Application | undefined;
  
  for (const app of mockApplications) {
    const found = app.apps.find(a => a.id === id);
    if (found) {
      targetAPK = found;
      parentApp = app;
      break;
    }
  }
  
  const apk = targetAPK || mockApplications[0].apps[0];

  // 找到当前进行中的节点
  const currentNodeIndex = apk.nodes.findIndex(n => n.status === 'processing' || n.status === 'rejected');
  const currentNode = apk.nodes[currentNodeIndex] || apk.nodes[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          <h1 className="text-xl font-bold text-gray-900">{apk.appName} - 发布流程详情</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">APK基本信息</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
              {apk.appIcon}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              <div>
                <div className="text-xs text-gray-500">应用名称</div>
                <div className="font-medium">{apk.appName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">应用包名</div>
                <div className="font-medium">{apk.packageName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">应用类型</div>
                <div className="font-medium">{apk.appType}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">版本号</div>
                <div className="font-medium">{apk.versionCode}</div>
              </div>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${
              apk.status === 'success' ? 'bg-green-100 text-green-700' :
              apk.status === 'failed' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {apk.status === 'success' ? '已完成' : apk.status === 'failed' ? '失败' : '进行中'}
            </span>
          </div>
        </div>

        {/* 流水线 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">发布流程</h2>
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {apk.nodes.map((node, idx) => (
              <div key={idx} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${nodeStatusColors[node.status]}`}>
                    {node.status === 'completed' ? <CheckCircle className="w-6 h-6" /> :
                     node.status === 'rejected' ? <XCircle className="w-6 h-6" /> :
                     node.status === 'processing' ? <Clock className="w-6 h-6" /> :
                     <Clock className="w-6 h-6" />}
                  </div>
                  <div className="mt-2 text-xs text-center max-w-[80px]">{node.name}</div>
                  {node.operator && (
                    <div className="text-xs text-gray-500">{node.operator}</div>
                  )}
                </div>
                {idx < apk.nodes.length - 1 && (
                  <div className={`w-8 h-0.5 ${idx < currentNodeIndex ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <AlertCircle className="w-5 h-5" />
            <span>点击流程节点可查看详情并进行操作</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 主应用 ====================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/application/:id" element={<ApplicationDetailPage />} />
        <Route path="/apk/:id" element={<APKDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
