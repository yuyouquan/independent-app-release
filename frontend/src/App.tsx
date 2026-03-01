import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Search, Plus, Eye, ChevronDown, ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle, FileText, Upload, X } from 'lucide-react';
import { mockApplications, mockTodos, shuttleOptions, tosVersionOptions, apkStatusOptions, Application, APKItem, TodoItem, ProcessNode } from './data/mockData';

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

// 流程节点名称
const NODE_NAMES = [
  '通道发布申请',
  '通道发布审核',
  '物料上传',
  '物料审核',
  '应用上架',
  '业务内测',
  '灰度监控',
];

// 语言选项
const languageOptions = [
  { code: 'en', name: '英语' },
  { code: 'zh', name: '中文' },
  { code: 'th', name: '泰语' },
  { code: 'id', name: '印尼语' },
  { code: 'pt', name: '葡萄牙语' },
];

// 应用分类选项
const appCategoryOptions = [
  'Social', 'Music', 'Video', 'Shopping', 'Finance', 
  'Travel', 'Weather', 'Education', 'Game', 'Business'
];

// 国家选项
const countryOptions = [
  '美国', '英国', '德国', '法国', '西班牙', '意大利', '巴西', '印度',
  '印尼', '泰国', '越南', '菲律宾', '马来西亚', '新加坡', '日本', '韩国'
];

// 品牌选项
const brandOptions = ['Tecno', 'Infinix', 'itel'];

// 机型选项
const deviceOptions = ['X6841_H6941', 'X6858_H8917', 'KO5_H8925', 'Pova'];

// ==================== 通道发布审核Modal ====================
function ChannelAuditModal({
  isOpen,
  onClose,
  apk,
  onPass,
  onReject
}: {
  isOpen: boolean;
  onClose: () => void;
  apk: APKItem;
  onPass: () => void;
  onReject: (reason: string) => void;
}) {
  const [auditResult, setAuditResult] = useState<'pass' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (auditResult === 'pass') {
      onPass();
    } else if (auditResult === 'reject' && rejectReason) {
      onReject(rejectReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">{NODE_NAMES[1]}</h2>
            <p className="text-sm text-gray-500">{apk.appName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 审核结果 - 固定在最上方 */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h4 className="font-medium mb-3">审核结果 <span className="text-red-500">*</span></h4>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="auditResult"
                checked={auditResult === 'pass'}
                onChange={() => setAuditResult('pass')}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-green-700 font-medium">通过</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="auditResult"
                checked={auditResult === 'reject'}
                onChange={() => setAuditResult('reject')}
                className="w-4 h-4 text-red-600"
              />
              <span className="text-red-700 font-medium">不通过</span>
            </label>
          </div>
          {auditResult === 'reject' && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">拒绝原因 <span className="text-red-500">*</span></label>
              <textarea
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                placeholder="请填写拒绝原因"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 通道发布详情 - 只读 - 完整展示 */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            通道发布详情
          </h4>
          
          {/* 基础信息 */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">基础信息</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">应用名称</div>
                <div className="font-medium">{apk.appName}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">应用包名</div>
                <div className="font-medium">{apk.packageName}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">应用类型</div>
                <div className="font-medium">{apk.appType}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">版本号</div>
                <div className="font-medium">v{apk.versionCode}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">应用分类</div>
                <div className="font-medium">Social</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">系统应用</div>
                <div className="font-medium">否</div>
              </div>
            </div>
          </div>

          {/* 发布范围 */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">发布范围</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">发布国家</div>
                <div className="font-medium">全部</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">发布品牌</div>
                <div className="font-medium">全部</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">发布机型</div>
                <div className="font-medium">全部</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">内测机型</div>
                <div className="font-medium">全部</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">适用安卓版本</div>
                <div className="font-medium">全部</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">适用tOS版本</div>
                <div className="font-medium">全部</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">过滤印度</div>
                <div className="font-medium">否</div>
              </div>
            </div>
          </div>

          {/* PA更新 */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">PA更新</h5>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">是否PA更新</div>
                <div className="font-medium">是</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">灰度量级</div>
                <div className="font-medium">1000/天</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">生效时间</div>
                <div className="font-medium">2026-03-02 00:00:00</div>
              </div>
            </div>
          </div>

          {/* 物料信息 */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">物料信息 (英语)</h5>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">应用名称</div>
                <div className="font-medium">Spotify Music</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">一句话描述</div>
                <div className="font-medium">音乐播放器</div>
              </div>
              <div className="p-3 bg-gray-50 rounded col-span-2">
                <div className="text-gray-500">关键词</div>
                <div className="font-medium">music, streaming, audio</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">是否GP上架</div>
                <div className="font-medium">是</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">GP链接</div>
                <div className="font-medium text-blue-600">https://play.google.com/...</div>
              </div>
            </div>
          </div>

          {/* 操作信息 */}
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">申请人</div>
                <div className="font-medium">张三</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-gray-500">申请时间</div>
                <div className="font-medium">2026-03-01 10:00:00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">取消</button>
          <button
            onClick={handleSubmit}
            disabled={!auditResult || (auditResult === 'reject' && !rejectReason)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 物料上传Modal ====================
function MaterialUploadModal({
  isOpen,
  onClose,
  apk,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  apk: APKItem;
  onSave: (data: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<'basic' | 'material'>('basic');
  const [activeLang, setActiveLang] = useState('en');
  const [availableLangs, setAvailableLangs] = useState(['en']); // 默认只有英语
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    versionCode: '',
    appCategory: 'Social',
    systemApp: 'no',
    filterIndia: 'no',
    countryType: 'all',
    countryList: [] as string[],
    brandType: 'all',
    brandList: [] as string[],
    deviceType: 'all',
    deviceList: [] as string[],
    betaDeviceType: 'all',
    betaDeviceList: [] as string[],
    androidVersionType: 'all',
    androidVersionList: [] as string[],
    tosVersionType: 'all',
    tosVersionList: [] as string[],
    isPAUpdate: 'yes',
    grayScaleLevel: 1000,
    effectiveTime: '',
    materials: {
      en: { appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [] as string[], isGP上架: false, gpLink: '' },
      zh: { appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [] as string[], isGP上架: false, gpLink: '' },
      th: { appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [] as string[], isGP上架: false, gpLink: '' },
      id: { appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [] as string[], isGP上架: false, gpLink: '' },
      pt: { appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [] as string[], isGP上架: false, gpLink: '' },
    }
  });

  if (!isOpen) return null;

  // 验证物料必填字段
  const validateMaterial = () => {
    const newErrors: Record<string, string> = {};
    const mat = formData.materials[activeLang as keyof typeof formData.materials];
    
    if (!mat.appName.trim()) newErrors.appName = '请输入应用名称';
    if (!mat.shortDescription.trim()) newErrors.shortDescription = '请输入一句话描述';
    if (!mat.productDetail.trim()) newErrors.productDetail = '请输入产品详情';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    // 物料Tab需要验证必填字段
    if (activeTab === 'material') {
      if (!validateMaterial()) {
        return; // 验证不通过，不关闭弹窗
      }
    }
    onSave(formData);
    onClose();
  };

  const handleTabChange = (tab: 'basic' | 'material') => {
    // 切换到物料Tab时先验证基础信息
    if (activeTab === 'basic' && tab === 'material') {
      const newErrors: Record<string, string> = {};
      if (!formData.versionCode) newErrors.versionCode = '请选择应用版本号';
      if (!formData.appCategory) newErrors.appCategory = '请选择应用分类';
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    setActiveTab(tab);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">{NODE_NAMES[2]}</h2>
            <p className="text-sm text-gray-500">{apk.appName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab切换 */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex gap-4">
            <button
              onClick={() => handleTabChange('basic')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'basic' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            >
              基础信息 <span className="text-red-500 ml-1">*</span>
            </button>
            <button
              onClick={() => handleTabChange('material')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'material' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            >
              所需物料 <span className="text-red-500 ml-1">*</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  应用基本信息
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用名称</label>
                    <input type="text" value={apk.appName} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用包名</label>
                    <input type="text" value={apk.packageName} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用类型</label>
                    <input type="text" value={apk.appType} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用版本号 <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={formData.versionCode}
                      onChange={(e) => setFormData({...formData, versionCode: e.target.value})}
                    >
                      <option value="">选择版本</option>
                      <option value="22651">v22651 - 2.26.1.15</option>
                      <option value="22650">v22650 - 2.26.1.14</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用分类 <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={formData.appCategory}
                      onChange={(e) => setFormData({...formData, appCategory: e.target.value})}
                    >
                      {appCategoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">系统应用</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="systemApp" value="yes" checked={formData.systemApp === 'yes'} onChange={(e) => setFormData({...formData, systemApp: e.target.value})} />
                        是
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="systemApp" value="no" checked={formData.systemApp === 'no'} onChange={(e) => setFormData({...formData, systemApp: e.target.value})} />
                        否
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'material' && (
            <div className="space-y-4">
              <div className="flex border-b">
                {languageOptions.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setActiveLang(lang.code)}
                    className={`px-4 py-2 -mb-px ${activeLang === lang.code ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">应用名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className={`w-full border rounded px-3 py-2 ${errors.appName ? 'border-red-500' : ''}`} 
                    placeholder="请输入应用名称" 
                  />
                  {errors.appName && <p className="text-red-500 text-xs mt-1">{errors.appName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">一句话描述 <span className="text-red-500">*</span></label>
                  <textarea 
                    className={`w-full border rounded px-3 py-2 ${errors.shortDescription ? 'border-red-500' : ''}`} 
                    rows={2} 
                    placeholder="请输入一句话描述" 
                  />
                  {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">产品详情 <span className="text-red-500">*</span></label>
                  <textarea 
                    className={`w-full border rounded px-3 py-2 ${errors.productDetail ? 'border-red-500' : ''}`} 
                    rows={4} 
                    placeholder="请输入产品详情" 
                  />
                  {errors.productDetail && <p className="text-red-500 text-xs mt-1">{errors.productDetail}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">更新说明</label>
                  <textarea className="w-full border rounded px-3 py-2" rows={2} placeholder="请输入更新说明" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">关键词 <span className="text-red-500">*</span> (1-5个)</label>
                  <input type="text" className="w-full border rounded px-3 py-2" placeholder="请输入关键词，用逗号分隔" />
                  <p className="text-xs text-gray-500 mt-1">提示：输入关键词后按回车添加</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">应用图标 <span className="text-red-500">*</span> (≥180x180px)</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-1">点击上传图标 (jpg/png)</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">置顶大图 <span className="text-red-500">*</span> (1080x594px, ≤2MB)</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-1">点击上传置顶大图</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">详情截图 <span className="text-red-500">*</span> (3-5张)</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-1">点击上传详情截图 (需要3-5张)</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">支持竖屏480x854或横屏854x480</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">是否GP上架</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="isGP" value="yes" />
                      是
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="isGP" value="no" defaultChecked />
                      否
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">确认</button>
        </div>
      </div>
    </div>
  );
}

// ==================== 物料审核Modal ====================
function MaterialAuditModal({
  isOpen,
  onClose,
  apk,
  onOperatorPass,
  onOperatorReject,
  onBossPass,
  onBossReject
}: {
  isOpen: boolean;
  onClose: () => void;
  apk: APKItem;
  onOperatorPass: () => void;
  onOperatorReject: (reason: string) => void;
  onBossPass: () => void;
  onBossReject: (reason: string) => void;
}) {
  const [step, setStep] = useState<'operator' | 'boss'>('operator');
  const [operatorResult, setOperatorResult] = useState<'pass' | 'reject' | null>(null);
  const [bossResult, setBossResult] = useState<'pass' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen) return null;

  const handleOperatorSubmit = () => {
    if (operatorResult === 'pass') {
      setStep('boss');
    } else if (operatorResult === 'reject' && rejectReason) {
      onOperatorReject(rejectReason);
    }
  };

  const handleBossSubmit = () => {
    if (bossResult === 'pass') {
      onBossPass();
    } else if (bossResult === 'reject' && rejectReason) {
      onBossReject(rejectReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">{NODE_NAMES[3]}</h2>
            <p className="text-sm text-gray-500">{apk.appName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'operator' ? 'text-blue-600 font-medium' : 'text-green-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'operator' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                {step === 'boss' ? '✓' : '1'}
              </div>
              运营人员审核
            </div>
            <div className="flex-1 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === 'boss' ? 'text-blue-600 font-medium' : step === 'operator' ? 'text-gray-400' : 'text-green-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'boss' ? 'bg-blue-600 text-white' : step === 'operator' ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white'}`}>
                {step === 'operator' ? '2' : '✓'}
              </div>
              老板审核
            </div>
          </div>
        </div>

        {/* 审核表单 */}
        {step === 'operator' && (
          <>
            <div className="px-6 py-4 border-b">
              <h4 className="font-medium mb-3">运营人员审核结果 <span className="text-red-500">*</span></h4>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="operatorResult"
                    checked={operatorResult === 'pass'}
                    onChange={() => setOperatorResult('pass')}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-green-700 font-medium">通过</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="operatorResult"
                    checked={operatorResult === 'reject'}
                    onChange={() => setOperatorResult('reject')}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-red-700 font-medium">不通过</span>
                </label>
              </div>
              {operatorResult === 'reject' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">拒绝原因 <span className="text-red-500">*</span></label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2"
                    rows={3}
                    placeholder="请填写拒绝原因"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="p-6 overflow-y-auto max-h-[40vh]">
              <h4 className="font-medium mb-4">物料上传详情 (只读)</h4>
              
              {/* 基础信息 */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">应用信息</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-gray-500">应用名称</div>
                    <div className="font-medium">{apk.appName}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-gray-500">应用包名</div>
                    <div className="font-medium">{apk.packageName}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-gray-500">版本号</div>
                    <div className="font-medium">v{apk.versionCode}</div>
                  </div>
                </div>
              </div>

              {/* 物料信息 */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">物料信息 (英语)</h5>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-gray-500">应用名称</div>
                    <div className="font-medium">Spotify Music</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-gray-500">一句话描述</div>
                    <div className="font-medium">音乐播放器</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded col-span-2">
                    <div className="text-gray-500">产品详情</div>
                    <div className="font-medium">音乐播放应用</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded col-span-2">
                    <div className="text-gray-500">关键词</div>
                    <div className="font-medium">music, streaming, audio, player</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-gray-500">是否GP上架</div>
                    <div className="font-medium">是</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-gray-500">GP链接</div>
                    <div className="font-medium text-blue-600">https://play.google.com/store/apps...</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">取消</button>
              <button
                onClick={handleOperatorSubmit}
                disabled={!operatorResult || (operatorResult === 'reject' && !rejectReason)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认
              </button>
            </div>
          </>
        )}

        {step === 'boss' && (
          <>
            <div className="px-6 py-4 border-b">
              <h4 className="font-medium mb-3">老板审核结果 <span className="text-red-500">*</span></h4>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bossResult"
                    checked={bossResult === 'pass'}
                    onChange={() => setBossResult('pass')}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-green-700 font-medium">通过</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bossResult"
                    checked={bossResult === 'reject'}
                    onChange={() => setBossResult('reject')}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-red-700 font-medium">不通过</span>
                </label>
              </div>
              {bossResult === 'reject' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">拒绝原因 <span className="text-red-500">*</span></label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2"
                    rows={3}
                    placeholder="请填写拒绝原因"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setStep('operator')} className="px-4 py-2 border rounded-lg hover:bg-gray-100">上一步</button>
              <button
                onClick={handleBossSubmit}
                disabled={!bossResult || (bossResult === 'reject' && !rejectReason)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ==================== 通道发布申请Modal ====================
function ChannelApplyModal({ 
  isOpen, 
  onClose, 
  apk,
  onSave,
  readOnly = false 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  apk: APKItem;
  onSave: (data: any) => void;
  readOnly?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'basic' | 'material'>('basic');
  const [activeLang, setActiveLang] = useState('en');
  const [availableLangs, setAvailableLangs] = useState(['en']); // 默认只有英语
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [showBetaDeviceDropdown, setShowBetaDeviceDropdown] = useState(false);
  const [showAndroidDropdown, setShowAndroidDropdown] = useState(false);
  const [showTosDropdown, setShowTosDropdown] = useState(false);
  const [formData, setFormData] = useState({
    versionCode: '',
    appCategory: 'Social',
    systemApp: 'no',
    filterIndia: 'no',
    countryType: 'all',
    countryList: [] as string[],
    brandType: 'all',
    brandList: [] as string[],
    deviceType: 'all',
    deviceList: [] as string[],
    betaDeviceType: 'all',
    betaDeviceList: [] as string[],
    androidVersionType: 'all',
    androidVersionList: [] as string[],
    tosVersionType: 'all',
    tosVersionList: [] as string[],
    isPAUpdate: 'yes',
    grayScaleLevel: 1000,
    effectiveTime: '',
    materials: {
      en: { appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [] as string[], isGP上架: false, gpLink: '' },
      zh: { appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [] as string[], isGP上架: false, gpLink: '' },
      th: { appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [] as string[], isGP上架: false, gpLink: '' },
      id: { appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [] as string[], isGP上架: false, gpLink: '' },
      pt: { appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [] as string[], isGP上架: false, gpLink: '' },
    }
  });

  // tOS版本根据安卓版本级联
  const getTosOptionsForAndroid = () => {
    const androidVersionMap: Record<string, string[]> = {
      'Android 16': ['tOS 16.1.0'],
      'Android 15': ['tOS 16.1.0', 'tOS 15.2.0'],
      'Android 14': ['tOS 15.2.0', 'tOS 14.1.0'],
      'Android 13': ['tOS 14.1.0', 'tOS 13.1.0'],
      'Android 12': ['tOS 13.1.0', 'tOS 12.1.0'],
      'Android 11': ['tOS 12.1.0'],
    };
    const selectedAndroid = formData.androidVersionList;
    if (selectedAndroid.length === 0) return [];
    const allTos = selectedAndroid.flatMap(v => androidVersionMap[v] || []);
    return [...new Set(allTos)];
  };

  // 多选切换
  const toggleMultiSelect = (field: string, value: string, currentList: string[]) => {
    const newList = currentList.includes(value)
      ? currentList.filter(v => v !== value)
      : [...currentList, value];
    setFormData({ ...formData, [field]: newList });
  };

  // 添加语言
  const addLanguage = (code: string) => {
    if (!availableLangs.includes(code)) {
      setAvailableLangs([...availableLangs, code]);
      setActiveLang(code);
    }
  };

  // 删除语言（英语不可删除）
  const removeLanguage = (code: string) => {
    if (code !== 'en' && availableLangs.includes(code)) {
      const newLangs = availableLangs.filter(l => l !== code);
      setAvailableLangs(newLangs);
      if (activeLang === code) {
        setActiveLang('en');
      }
    }
  };

  // 所有可选语言
  const allLanguages = [
    { code: 'zh', name: '中文' },
    { code: 'th', name: '泰语' },
    { code: 'id', name: '印尼语' },
    { code: 'pt', name: '葡萄牙语' },
    { code: 'ru', name: '俄语' },
    { code: 'es', name: '西班牙语' },
    { code: 'ar', name: '阿拉伯语' },
    { code: 'ko', name: '韩语' },
  ];

  // 验证基础信息必填字段
  const validateBasic = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.versionCode) newErrors.versionCode = '请选择应用版本号';
    if (!formData.appCategory) newErrors.appCategory = '请选择应用分类';
    if (formData.isPAUpdate === 'yes' && !formData.effectiveTime) newErrors.effectiveTime = '请选择生效时间';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 验证物料必填字段
  const validateMaterial = () => {
    const newErrors: Record<string, string> = {};
    const mat = formData.materials[activeLang as keyof typeof formData.materials];
    if (!mat.appName?.trim()) newErrors.matAppName = '请输入应用名称';
    if (!mat.shortDescription?.trim()) newErrors.matShortDesc = '请输入一句话描述';
    if (!mat.productDetail?.trim()) newErrors.matProductDetail = '请输入产品详情';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  const handleSave = () => {
    if (activeTab === 'basic') {
      if (!validateBasic()) return;
    } else {
      if (!validateMaterial()) return;
    }
    onSave(formData);
    onClose();
  };

  const handleTabChange = (tab: 'basic' | 'material') => {
    if (activeTab === 'basic' && tab === 'material') {
      if (!validateBasic()) return;
    }
    setActiveTab(tab);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">{NODE_NAMES[0]}</h2>
            <p className="text-sm text-gray-500">{apk.appName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab切换 */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'basic' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            >
              基础信息
            </button>
            <button
              onClick={() => setActiveTab('material')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'material' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            >
              所需物料
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* 应用基本信息 */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  应用基本信息
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用名称</label>
                    <input type="text" value={apk.appName} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用包名</label>
                    <input type="text" value={apk.packageName} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用类型</label>
                    <input type="text" value={apk.appType} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用版本号 <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={formData.versionCode}
                      onChange={(e) => setFormData({...formData, versionCode: e.target.value})}
                    >
                      <option value="">选择版本</option>
                      <option value="22651">v22651 - 2.26.1.15</option>
                      <option value="22650">v22650 - 2.26.1.14</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用APK</label>
                    <input type="text" value={`${apk.appName}.apk`} disabled className="w-full border rounded px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用测试PASS报告</label>
                    <div className="border-2 border-dashed rounded-lg p-3 text-center hover:bg-gray-50 cursor-pointer">
                      <Upload className="w-6 h-6 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 mt-1">点击上传测试报告</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">应用分类 <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={formData.appCategory}
                      onChange={(e) => setFormData({...formData, appCategory: e.target.value})}
                    >
                      {appCategoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">系统应用</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="systemApp" value="yes" checked={formData.systemApp === 'yes'} onChange={(e) => setFormData({...formData, systemApp: e.target.value})} />
                        是
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="systemApp" value="no" checked={formData.systemApp === 'no'} onChange={(e) => setFormData({...formData, systemApp: e.target.value})} />
                        否
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 发布范围 */}
              <div>
                <h4 className="font-medium mb-4">发布范围</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* 发布国家 */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">发布国家</label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={formData.countryType}
                      onChange={(e) => {
                        setFormData({...formData, countryType: e.target.value, countryList: []});
                        setShowCountryDropdown(e.target.value !== 'all');
                      }}
                    >
                      <option value="all">全部</option>
                      <option value="include">包含</option>
                      <option value="exclude">不包含</option>
                    </select>
                    {showCountryDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-auto p-2">
                        {countryOptions.map(c => (
                          <label key={c} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={formData.countryList.includes(c)} onChange={() => toggleMultiSelect('countryList', c, formData.countryList)} />
                            <span className="text-sm">{c}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {formData.countryType !== 'all' && formData.countryList.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">已选: {formData.countryList.join(', ')}</div>
                    )}
                  </div>

                  {/* 发布品牌 */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">发布品牌</label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={formData.brandType}
                      onChange={(e) => {
                        setFormData({...formData, brandType: e.target.value, brandList: []});
                        setShowBrandDropdown(e.target.value !== 'all');
                      }}
                    >
                      <option value="all">全部</option>
                      <option value="include">包含</option>
                      <option value="exclude">不包含</option>
                    </select>
                    {showBrandDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-auto p-2">
                        {brandOptions.map(b => (
                          <label key={b} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={formData.brandList.includes(b)} onChange={() => toggleMultiSelect('brandList', b, formData.brandList)} />
                            <span className="text-sm">{b}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {formData.brandType !== 'all' && formData.brandList.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">已选: {formData.brandList.join(', ')}</div>
                    )}
                  </div>

                  {/* 发布机型 */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">发布机型</label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={formData.deviceType}
                      onChange={(e) => {
                        setFormData({...formData, deviceType: e.target.value, deviceList: []});
                        setShowDeviceDropdown(e.target.value !== 'all');
                      }}
                    >
                      <option value="all">全部</option>
                      <option value="include">包含</option>
                      <option value="exclude">不包含</option>
                    </select>
                    {showDeviceDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-auto p-2">
                        {deviceOptions.map(d => (
                          <label key={d} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={formData.deviceList.includes(d)} onChange={() => toggleMultiSelect('deviceList', d, formData.deviceList)} />
                            <span className="text-sm">{d}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {formData.deviceType !== 'all' && formData.deviceList.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">已选: {formData.deviceList.join(', ')}</div>
                    )}
                  </div>

                  {/* 内测机型 */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">内测机型</label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={formData.betaDeviceType}
                      onChange={(e) => {
                        setFormData({...formData, betaDeviceType: e.target.value, betaDeviceList: []});
                        setShowBetaDeviceDropdown(e.target.value !== 'all');
                      }}
                    >
                      <option value="all">全部</option>
                      <option value="include">包含</option>
                      <option value="exclude">不包含</option>
                    </select>
                    {showBetaDeviceDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-auto p-2">
                        {deviceOptions.map(d => (
                          <label key={d} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={formData.betaDeviceList.includes(d)} onChange={() => toggleMultiSelect('betaDeviceList', d, formData.betaDeviceList)} />
                            <span className="text-sm">{d}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {formData.betaDeviceType !== 'all' && formData.betaDeviceList.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">已选: {formData.betaDeviceList.join(', ')}</div>
                    )}
                  </div>

                  {/* 适用安卓版本 */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">适用安卓版本</label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={formData.androidVersionType}
                      onChange={(e) => {
                        setFormData({...formData, androidVersionType: e.target.value, androidVersionList: [], tosVersionList: []});
                        setShowAndroidDropdown(e.target.value !== 'all');
                      }}
                    >
                      <option value="all">全部</option>
                      <option value="include">包含</option>
                      <option value="exclude">不包含</option>
                    </select>
                    {showAndroidDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-auto p-2">
                        {['Android 11', 'Android 12', 'Android 13', 'Android 14', 'Android 15', 'Android 16'].map(v => (
                          <label key={v} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={formData.androidVersionList.includes(v)} onChange={() => toggleMultiSelect('androidVersionList', v, formData.androidVersionList)} />
                            <span className="text-sm">{v}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {formData.androidVersionType !== 'all' && formData.androidVersionList.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">已选: {formData.androidVersionList.join(', ')}</div>
                    )}
                  </div>

                  {/* 适用tOS版本 - 根据安卓版本级联 */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">适用tOS版本</label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={formData.tosVersionType}
                      onChange={(e) => {
                        setFormData({...formData, tosVersionType: e.target.value, tosVersionList: []});
                        setShowTosDropdown(e.target.value !== 'all');
                      }}
                    >
                      <option value="all">全部</option>
                      <option value="include">包含</option>
                      <option value="exclude">不包含</option>
                    </select>
                    {showTosDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-auto p-2">
                        {getTosOptionsForAndroid().length > 0 ? getTosOptionsForAndroid().map(v => (
                          <label key={v} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={formData.tosVersionList.includes(v)} onChange={() => toggleMultiSelect('tosVersionList', v, formData.tosVersionList)} />
                            <span className="text-sm">{v}</span>
                          </label>
                        )) : (
                          <div className="p-2 text-xs text-gray-500">请先选择安卓版本</div>
                        )}
                      </div>
                    )}
                    {formData.tosVersionType !== 'all' && formData.tosVersionList.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">已选: {formData.tosVersionList.join(', ')}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* 过滤印度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">是否需要过滤印度</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="filterIndia" value="yes" checked={formData.filterIndia === 'yes'} onChange={(e) => setFormData({...formData, filterIndia: e.target.value})} />
                    是
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="filterIndia" value="no" checked={formData.filterIndia === 'no'} onChange={(e) => setFormData({...formData, filterIndia: e.target.value})} />
                    否
                  </label>
                </div>
              </div>

              {/* PA更新 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">是否PA应用更新</label>
                <div className="flex gap-4 items-center">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="isPAUpdate" value="yes" checked={formData.isPAUpdate === 'yes'} onChange={(e) => setFormData({...formData, isPAUpdate: e.target.value})} />
                      是
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="isPAUpdate" value="no" checked={formData.isPAUpdate === 'no'} onChange={(e) => setFormData({...formData, isPAUpdate: e.target.value})} />
                      否
                    </label>
                  </div>
                  {formData.isPAUpdate === 'yes' && (
                    <div className="flex gap-4 items-center">
                      <input 
                        type="number" 
                        placeholder="灰度量级" 
                        className="border rounded px-3 py-2 w-32"
                        value={formData.grayScaleLevel}
                        onChange={(e) => setFormData({...formData, grayScaleLevel: parseInt(e.target.value)})}
                      />
                      <span>/天</span>
                      <input 
                        type="datetime-local" 
                        className="border rounded px-3 py-2"
                        value={formData.effectiveTime}
                        onChange={(e) => setFormData({...formData, effectiveTime: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'material' && (
            <div className="space-y-4">
              {/* 语言Tab */}
              <div className="flex border-b items-center flex-wrap gap-1">
                {availableLangs.map(code => {
                  const lang = languageOptions.find(l => l.code === code);
                  return (
                    <button
                      key={code}
                      onClick={() => setActiveLang(code)}
                      className={`px-4 py-2 -mb-px flex items-center gap-1 ${activeLang === code ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
                    >
                      {lang?.name || code}
                      {code !== 'en' && (
                        <span 
                          onClick={(e) => { e.stopPropagation(); removeLanguage(code); }}
                          className="ml-1 text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          ×
                        </span>
                      )}
                    </button>
                  );
                })}
                {/* 添加语言按钮 */}
                {availableLangs.length < allLanguages.length && (
                  <div className="relative">
                    <button className="px-2 py-1 text-blue-500 hover:text-blue-700 text-sm">
                      + 添加语言
                    </button>
                  </div>
                )}
              </div>

              {/* 物料表单 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    应用名称 <span className="text-red-500">*</span> (英语必填)
                  </label>
                  <input 
                    type="text" 
                    className={`w-full border rounded px-3 py-2 ${errors.matAppName ? 'border-red-500' : ''}`} 
                    placeholder="请输入应用名称"
                    value={formData.materials[activeLang as keyof typeof formData.materials]?.appName || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      materials: {
                        ...formData.materials,
                        [activeLang]: { ...formData.materials[activeLang as keyof typeof formData.materials], appName: e.target.value }
                      }
                    })}
                  />
                  {errors.matAppName && <p className="text-red-500 text-xs mt-1">{errors.matAppName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    一句话描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className={`w-full border rounded px-3 py-2 ${errors.matShortDesc ? 'border-red-500' : ''}`} 
                    rows={2} 
                    placeholder="请输入一句话描述"
                    value={formData.materials[activeLang as keyof typeof formData.materials]?.shortDescription || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      materials: {
                        ...formData.materials,
                        [activeLang]: { ...formData.materials[activeLang as keyof typeof formData.materials], shortDescription: e.target.value }
                      }
                    })}
                  />
                  {errors.matShortDesc && <p className="text-red-500 text-xs mt-1">{errors.matShortDesc}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    产品详情 <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className={`w-full border rounded px-3 py-2 ${errors.matProductDetail ? 'border-red-500' : ''}`} 
                    rows={4} 
                    placeholder="请输入产品详情"
                    value={formData.materials[activeLang as keyof typeof formData.materials]?.productDetail || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      materials: {
                        ...formData.materials,
                        [activeLang]: { ...formData.materials[activeLang as keyof typeof formData.materials], productDetail: e.target.value }
                      }
                    })}
                  />
                  {errors.matProductDetail && <p className="text-red-500 text-xs mt-1">{errors.matProductDetail}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">更新说明</label>
                  <textarea 
                    className="w-full border rounded px-3 py-2" 
                    rows={2} 
                    placeholder="请输入更新说明"
                    value={formData.materials[activeLang as keyof typeof formData.materials]?.updateDescription || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      materials: {
                        ...formData.materials,
                        [activeLang]: { ...formData.materials[activeLang as keyof typeof formData.materials], updateDescription: e.target.value }
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">关键词 (1-5个)</label>
                  <input 
                    type="text" 
                    className="w-full border rounded px-3 py-2" 
                    placeholder="请输入关键词，用逗号分隔"
                    value={formData.materials[activeLang as keyof typeof formData.materials]?.keywords?.join(', ') || ''}
                    onChange={(e) => {
                      const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                      setFormData({
                        ...formData,
                        materials: {
                          ...formData.materials,
                          [activeLang]: { ...formData.materials[activeLang as keyof typeof formData.materials], keywords }
                        }
                      });
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">已选: {formData.materials[activeLang as keyof typeof formData.materials]?.keywords?.join(', ') || '无'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    应用图标 <span className="text-red-500">*</span> (≥180x180px, 1:1)
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-1">点击上传图标 (jpg/png, 尺寸≥180*180px)</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    置顶大图 <span className="text-red-500">*</span> (1080x594px, ≤2MB)
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-1">点击上传置顶大图 (1080*594px, ≤2MB)</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    详情截图 <span className="text-red-500">*</span> (3-5张)
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-1">点击上传详情截图 (需要3-5张)</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">支持竖屏480x854或横屏854x480</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">是否GP上架</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="isGP" 
                        value="yes"
                        checked={formData.materials[activeLang as keyof typeof formData.materials]?.isGP上架 === true}
                        onChange={() => setFormData({
                          ...formData,
                          materials: {
                            ...formData.materials,
                            [activeLang]: { ...formData.materials[activeLang as keyof typeof formData.materials], isGP上架: true }
                          }
                        })}
                      />
                      是
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="isGP" 
                        value="no"
                        checked={formData.materials[activeLang as keyof typeof formData.materials]?.isGP上架 !== true}
                        onChange={() => setFormData({
                          ...formData,
                          materials: {
                            ...formData.materials,
                            [activeLang]: { ...formData.materials[activeLang as keyof typeof formData.materials], isGP上架: false, gpLink: '' }
                          }
                        })}
                      />
                      否
                    </label>
                  </div>
                  {formData.materials[activeLang as keyof typeof formData.materials]?.isGP上架 && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">GP链接 <span className="text-red-500">*</span></label>
                      <input 
                        type="url" 
                        className="w-full border rounded px-3 py-2" 
                        placeholder="https://play.google.com/store/apps/details?id=..."
                        value={formData.materials[activeLang as keyof typeof formData.materials]?.gpLink || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          materials: {
                            ...formData.materials,
                            [activeLang]: { ...formData.materials[activeLang as keyof typeof formData.materials], gpLink: e.target.value }
                          }
                        })}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">确认</button>
        </div>
      </div>
    </div>
  );
}

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
              <span className="ml-2 text-xs text-gray-500">v1.1 (迭代增强版)</span>
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
                  onClick={() => navigate(`/apk/${todo.appId}?node=${todo.currentNode}`)}
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
  const [addModalSelected, setAddModalSelected] = useState<string | null>(null);
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
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
              {['WhatsApp', 'Facebook', 'YouTube', 'Twitter', 'Snapchat', 'LinkedIn', 'Telegram'].filter(name => 
                searchKeyword === '' || name.toLowerCase().includes(searchKeyword.toLowerCase())
              ).map(name => (
                <div 
                  key={name} 
                  onClick={() => setAddModalSelected(addModalSelected === name ? null : name)}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                    addModalSelected === name ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">📱</div>
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-gray-500">com.example.{name.toLowerCase()}</div>
                  </div>
                  {addModalSelected === name && (
                    <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowAddModal(false); setAddModalSelected(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              <button 
                onClick={() => { 
                  if (addModalSelected) {
                    alert(`已添加: ${addModalSelected}`);
                    setShowAddModal(false); 
                    setAddModalSelected(null); 
                  }
                }} 
                disabled={!addModalSelected}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认添加
              </button>
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'history'>('pipeline');
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);
  
  // 从URL参数获取节点名称，自动打开对应Modal
  useEffect(() => {
    const nodeName = searchParams.get('node');
    if (nodeName) {
      const nodeIndex = NODE_NAMES.findIndex(n => n === nodeName);
      if (nodeIndex >= 0) {
        setSelectedNodeIndex(nodeIndex);
        setShowNodeModal(true);
      }
    }
  }, [searchParams]);
  
  // 找到对应的APK
  let targetAPK: APKItem | undefined;
  
  for (const app of mockApplications) {
    const found = app.apps.find(a => a.id === id);
    if (found) {
      targetAPK = found;
      break;
    }
  }
  
  const apk = targetAPK || mockApplications[0].apps[0];

  // 找到当前进行中的节点
  const currentNodeIndex = apk.nodes.findIndex(n => n.status === 'processing' || n.status === 'rejected');
  
  // 模拟历史操作记录
  const historyRecords = [
    { time: '2026-03-01 16:00:00', operator: '赵六', action: '完成', detail: '灰度监控节点已完成' },
    { time: '2026-03-01 15:00:00', operator: '赵六', action: '完成', detail: '业务内测节点已完成' },
    { time: '2026-03-01 14:00:00', operator: '赵六', action: '完成', detail: '应用上架节点已完成' },
    { time: '2026-03-01 13:00:00', operator: '王五', action: '完成', detail: '物料审核节点已完成' },
    { time: '2026-03-01 12:00:00', operator: '张三', action: '完成', detail: '物料上传节点已完成' },
    { time: '2026-03-01 11:00:00', operator: '李四', action: '完成', detail: '通道发布审核节点已完成' },
    { time: '2026-03-01 10:00:00', operator: '张三', action: '提交', detail: '通道发布申请节点已提交' },
  ];

  const handleNodeClick = (index: number) => {
    setSelectedNodeIndex(index);
    setShowNodeModal(true);
  };

  const handleSaveNode = (data: any) => {
    console.log('保存节点数据:', data);
  };

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

        {/* Tab切换 */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-6 py-3 -mb-px ${activeTab === 'pipeline' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            >
              独立发布流程
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 -mb-px ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
            >
              历史操作记录
            </button>
          </div>

          {/* 流水线 */}
          {activeTab === 'pipeline' && (
            <div className="p-6">
              <div className="flex items-center justify-between overflow-x-auto pb-4">
                {apk.nodes.map((node, idx) => (
                  <div key={idx} className="flex items-center flex-shrink-0">
                    <div 
                      className={`flex flex-col items-center ${
                        node.status !== 'pending' 
                          ? 'cursor-pointer hover:opacity-80' 
                          : 'cursor-not-allowed opacity-50'
                      }`}
                      onClick={() => {
                        if (node.status !== 'pending') {
                          handleNodeClick(idx);
                        }
                      }}
                    >
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
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>点击流程节点可查看详情并进行操作</span>
                </div>
              </div>
            </div>
          )}

          {/* 历史记录 */}
          {activeTab === 'history' && (
            <div className="p-6">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">操作时间</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">操作人</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">操作动作</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">操作详情</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {historyRecords.map((record, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-gray-500">{record.time}</td>
                      <td className="px-4 py-3 text-sm font-medium">{record.operator}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{record.action}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{record.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 节点Modal - 根据节点类型显示 */}
      {showNodeModal && selectedNodeIndex === 0 && (
        <ChannelApplyModal 
          isOpen={showNodeModal} 
          onClose={() => setShowNodeModal(false)} 
          apk={apk}
          onSave={handleSaveNode}
        />
      )}

      {/* 节点Modal - 通道发布审核 */}
      {showNodeModal && selectedNodeIndex === 1 && apk.nodes[1].status !== 'completed' && (
        <ChannelAuditModal
          isOpen={showNodeModal}
          onClose={() => setShowNodeModal(false)}
          apk={apk}
          onPass={() => { console.log('审核通过'); setShowNodeModal(false); }}
          onReject={(reason) => { console.log('审核拒绝:', reason); setShowNodeModal(false); }}
        />
      )}

      {/* 节点Modal - 物料上传 */}
      {showNodeModal && selectedNodeIndex === 2 && apk.nodes[2].status !== 'completed' && (
        <MaterialUploadModal
          isOpen={showNodeModal}
          onClose={() => setShowNodeModal(false)}
          apk={apk}
          onSave={handleSaveNode}
        />
      )}

      {/* 节点Modal - 物料审核 */}
      {showNodeModal && selectedNodeIndex === 3 && apk.nodes[3].status !== 'completed' && (
        <MaterialAuditModal
          isOpen={showNodeModal}
          onClose={() => setShowNodeModal(false)}
          apk={apk}
          onOperatorPass={() => { console.log('运营通过'); setShowNodeModal(false); }}
          onOperatorReject={(reason) => { console.log('运营拒绝:', reason); setShowNodeModal(false); }}
          onBossPass={() => { console.log('老板通过'); setShowNodeModal(false); }}
          onBossReject={(reason) => { console.log('老板拒绝:', reason); setShowNodeModal(false); }}
        />
      )}

      {/* 节点Modal - 应用上架/业务内测/灰度监控 (只读展示) */}
      {showNodeModal && selectedNodeIndex >= 4 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">{NODE_NAMES[selectedNodeIndex]}</h2>
                <p className="text-sm text-gray-500">{apk.appName}</p>
              </div>
              <button onClick={() => setShowNodeModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>该节点数据来自第三方平台，仅供查看</span>
                </div>
              </div>

              {/* 应用上架 / 业务内测 数据展示 */}
              {(selectedNodeIndex === 4 || selectedNodeIndex === 5) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">状态</div>
                      <div className="font-medium text-green-600">生效中</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">升级任务名称</div>
                      <div className="font-medium">{apk.appName} - Google Play发布</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">应用包名</div>
                      <div className="font-medium">{apk.packageName}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">版本号</div>
                      <div className="font-medium">v{apk.versionCode}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">发布国家</div>
                      <div className="font-medium">印度, 印尼, 巴基斯坦</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">发布品牌</div>
                      <div className="font-medium">Tecno, Infinix, itel</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">发布机型</div>
                      <div className="font-medium">X6841, X6858, KO5</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">语言</div>
                      <div className="font-medium">英语, 印尼语, 泰语</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">安卓版本</div>
                      <div className="font-medium">Android 11-15</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">tOS版本</div>
                      <div className="font-medium">tOS 15.2.0+</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">灰度量级</div>
                      <div className="font-medium">1000/天</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">分类</div>
                      <div className="font-medium">Social</div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">生效时间</div>
                    <div className="font-medium">2026-03-01 12:00:00</div>
                  </div>
                </div>
              )}

              {/* 灰度监控数据展示 */}
              {selectedNodeIndex === 6 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">任务名称</div>
                      <div className="font-medium">{apk.appName} - 灰度发布</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">生效时间</div>
                      <div className="font-medium">2026-03-01 12:00:00</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">灰度量级</div>
                      <div className="font-medium">1000/天</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-2">现状/总计</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '65%' }} />
                      </div>
                      <div className="font-medium">650 / 1000</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">状态</div>
                      <div className="font-medium text-blue-600">进行中</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">创建时间</div>
                      <div className="font-medium">2026-03-01 10:00:00</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">完成时间</div>
                      <div className="font-medium text-gray-400">预计 2026-03-02</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setShowNodeModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">关闭</button>
            </div>
          </div>
        </div>
      )}
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
