import React, { useState } from 'react';

// ==================== 版本选择器组件（带搜索） ====================
interface VersionSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}

const VersionSelect: React.FC<VersionSelectProps> = ({ value, onChange, options, placeholder, error }) => {
  const [search, setSearch] = useState('');
  
  const filteredOptions = options.filter(v => 
    v.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="relative">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={value || placeholder}
        className={`w-full border rounded-lg px-3 py-2 pr-8 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        onFocus={(e) => {
          e.target.select();
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            setSearch('');
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
      {search && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <div
                key={opt}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                onClick={() => {
                  onChange(opt);
                  setSearch(opt);
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400 text-sm">无匹配版本</div>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== 类型定义 ====================

// 应用类型选项
export const appTypeOptions = [
  '社交', '工具', '娱乐', '购物', '旅游', '教育', '金融', '健康', '新闻', '其他'
];

// 应用分类选项
export const appCategoryOptions = [
  'Travel & Local', 'Shopping', 'Social', 'Communication', 
  'Productivity', 'Entertainment', 'News & Magazines', 
  'Games', 'Finance', 'Health & Fitness'
];

// 品牌选项
export const brandOptions = ['Tecno', 'Infinix', 'itel', 'Oppo', 'Xiaomi', 'Samsung'];

// 机型选项（示例）
export const modelOptions = [
  'X6841_H6941', 'X6825_H6825', 'X688B_X688B', 
  'INFINIX-X6837B', 'itel-I6611', 'TECNO-KG5'
];

// 安卓版本选项
export const androidVersionOptions = [
  'Android 16', 'Android 15', 'Android 14', 
  'Android 13', 'Android 12', 'Android 11'
];

// tOS版本选项
export const tosVersionList = [
  'tOS 16.1.0', 'tOS 16.0.5', 'tOS 16.0.0', 
  'tOS 15.5.0', 'tOS 15.0.0', 'tOS 14.5.0'
];

// 国家选项
export const countryOptions = [
  { code: 'all', name: '全部' },
  { code: 'NG', name: '尼日利亚' },
  { code: 'KE', name: '肯尼亚' },
  { code: 'GH', name: '加纳' },
  { code: 'TZ', name: '坦桑尼亚' },
  { code: 'EG', name: '埃及' },
  { code: 'SA', name: '沙特阿拉伯' },
  { code: 'AE', name: '阿联酋' },
  { code: 'IN', name: '印度' },
  { code: 'PK', name: '巴基斯坦' },
  { code: 'BD', name: '孟加拉国' },
  { code: 'ID', name: '印尼' },
  { code: 'PH', name: '菲律宾' },
];

// APK制品列表（示例）
export const apk制品List = [
  { id: '1', name: 'WhatsApp_v2.26.1.15.apk', url: 'https://制品库/whatsapp/v2.26.1.15.apk' },
  { id: '2', name: 'Telegram_v10.5.0.apk', url: 'https://制品库/telegram/v10.5.0.apk' },
  { id: '3', name: 'Facebook_v450.0.0.apk', url: 'https://制品库/facebook/v450.0.0.apk' },
  { id: '4', name: 'Instagram_v320.0.0.apk', url: 'https://制品库/instagram/v320.0.0.apk' },
];

// 版本号选项（示例）- 从PRD要求的下拉单选
export const versionCodeOptions = [
  '1.0.0', '1.0.1', '1.0.2', '1.1.0', '1.1.1', '2.0.0', '2.0.1', '2.1.0', '3.0.0'
];

// 关键词选项
export const keywordOptions = [
  '聊天', '社交', '视频', '音乐', '支付', '购物', '新闻', 
  '天气', '地图', '相机', '安全', '清理', '游戏', '阅读'
];

// ==================== 班车申请Modal组件 ====================

interface ShuttleFormData {
  shuttleName: string;
  tosVersion: string;
}

interface AppFormData {
  appType: string;
  appName: string;
  packageName: string;
  versionCode: string;
  apkId: string;
  testReport: File | null;
  appCategory: string;
  isSystemApp: 'yes' | 'no';
  publishCountryType: 'all' | 'include' | 'exclude'; // 全部/包含/不包含
  publishCountryDetail: string[];  // 具体选择的国家
  publishBrand: string[];
  publishModel: string[];
  testModel: string[];  // 内测机型 - 新增
  androidVersion: string;
  tosVersion: string;
  filterIndia: 'yes' | 'no';
  isPAUpdate: 'yes' | 'no';
  grayScaleLevel: string;
  effectiveTime: string;
}

interface MaterialFormData {
  appName: string;
  shortDescription: string;
  productDetail: string;
  updateNotes: string;
  keywords: string[];
  appIcon: File | null;
  heroImage: File | null;
  screenshots: File[];
  isGP上架: 'yes' | 'no';
  gpLink: string;
}

interface CreateApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateApplicationModal: React.FC<CreateApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [step, setStep] = useState(1);
  const [shuttleData, setShuttleData] = useState<ShuttleFormData>({
    shuttleName: '',
    tosVersion: ''
  });
  const [appData, setAppData] = useState<AppFormData>({
    appType: '',
    appName: '',
    packageName: '',
    versionCode: '',
    apkId: '',
    testReport: null,
    appCategory: '',
    isSystemApp: 'no',
    publishCountryType: 'all',
    publishCountryDetail: [],
    publishBrand: [],
    publishModel: [],
    testModel: [],
    androidVersion: '',
    tosVersion: '',
    filterIndia: 'no',
    isPAUpdate: 'no',
    grayScaleLevel: '',
    effectiveTime: ''
  });
  const [materialData, setMaterialData] = useState<MaterialFormData>({
    appName: '',
    shortDescription: '',
    productDetail: '',
    updateNotes: '',
    keywords: [],
    appIcon: null,
    heroImage: null,
    screenshots: [],
    isGP上架: 'no',
    gpLink: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // 自动生成班车名称（时间戳格式）
  const generateShuttleName = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
    return `班车-${dateStr}-${timeStr}`;
  };

  // 验证步骤1 - 班车信息
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!shuttleData.shuttleName.trim()) {
      newErrors.shuttleName = '请输入班车名称';
    }
    if (!shuttleData.tosVersion) {
      newErrors.tosVersion = '请选择tOS版本';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 验证步骤2 - 应用信息
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!appData.appType) newErrors.appType = '请选择应用类型';
    if (!appData.appName.trim()) newErrors.appName = '请输入应用名称';
    if (!appData.packageName.trim()) newErrors.packageName = '请输入应用包名';
    if (!appData.versionCode) newErrors.versionCode = '请选择版本号';
    if (!appData.apkId) newErrors.apkId = '请选择APK制品';
    if (!appData.appCategory) newErrors.appCategory = '请选择应用分类';
    if (appData.publishCountryType !== 'all' && appData.publishCountryDetail.length === 0) {
      newErrors.publishCountryDetail = '请选择具体国家';
    }
    if (!appData.androidVersion) newErrors.androidVersion = '请选择安卓版本';
    if (!appData.tosVersion) newErrors.tosVersion = '请选择tOS版本';
    if (appData.testModel.length === 0) newErrors.testModel = '请选择内测机型(至少1个)';
    
    if (appData.isPAUpdate === 'yes') {
      if (!appData.grayScaleLevel) newErrors.grayScaleLevel = '请输入灰度量级';
      if (!appData.effectiveTime) newErrors.effectiveTime = '请选择生效时间';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 验证步骤3 - 物料信息
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!materialData.shortDescription.trim()) newErrors.shortDescription = '请输入一句话描述';
    if (!materialData.productDetail.trim()) newErrors.productDetail = '请输入产品详情';
    if (!materialData.updateNotes.trim()) newErrors.updateNotes = '请输入更新说明';
    if (materialData.keywords.length === 0) newErrors.keywords = '请选择关键词(1-5个)';
    if (!materialData.appIcon) newErrors.appIcon = '请上传应用图标';
    if (!materialData.heroImage) newErrors.heroImage = '请上传置顶大图';
    if (materialData.screenshots.length === 0) newErrors.screenshots = '请上传详情截图(3-5张)';
    if (materialData.isGP上架 === 'yes' && !materialData.gpLink.trim()) {
      newErrors.gpLink = '请输入GP链接';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep3()) {
      onSubmit({
        shuttle: shuttleData,
        app: appData,
        material: materialData
      });
      onClose();
      // 重置表单
      setStep(1);
      setShuttleData({ shuttleName: '', tosVersion: '' });
      setAppData({
        appType: '', appName: '', packageName: '', versionCode: '', apkId: '',
        testReport: null, appCategory: '', isSystemApp: 'no', publishCountryType: 'all',
        publishCountryDetail: [], publishBrand: [], publishModel: [], testModel: [],
        androidVersion: '', tosVersion: '', filterIndia: 'no', isPAUpdate: 'no',
        grayScaleLevel: '', effectiveTime: ''
      });
      setMaterialData({
        appName: '', shortDescription: '', productDetail: '', updateNotes: '',
        keywords: [], appIcon: null, heroImage: null, screenshots: [],
        isGP上架: 'no', gpLink: ''
      });
    }
  };

  const handleAPKChange = (apkId: string) => {
    const apk = apk制品List.find(a => a.id === apkId);
    setAppData(prev => ({
      ...prev,
      apkId,
      appName: apk ? apk.name.split('_')[0] : '',
      versionCode: apk ? apk.name.split('_')[1]?.replace('.apk', '') : ''
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />
      
      {/* Modal主体 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          {/* 头部 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              新建应用发布申请
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 步骤指示器 */}
          <div className="bg-gray-50 px-6 py-3 border-b">
            <div className="flex items-center justify-center gap-4">
              {[
                { num: 1, label: '班车信息' },
                { num: 2, label: '应用信息' },
                { num: 3, label: '物料信息' }
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`ml-2 text-sm ${step >= s.num ? 'text-gray-900' : 'text-gray-500'}`}>
                    {s.label}
                  </span>
                  {idx < 2 && (
                    <div className={`w-12 h-0.5 mx-4 ${step > s.num ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 内容区 */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* 步骤1: 班车信息 */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    💡 提示：请先填写班车信息，一个班车可以包含多个应用发布任务。
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      班车名称 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shuttleData.shuttleName}
                        onChange={(e) => setShuttleData(prev => ({ ...prev, shuttleName: e.target.value }))}
                        placeholder="如: 班车-20260228-1430"
                        className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.shuttleName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShuttleData(prev => ({ ...prev, shuttleName: generateShuttleName() }))}
                        className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm whitespace-nowrap"
                      >
                        自动生成
                      </button>
                    </div>
                    {errors.shuttleName && <p className="text-red-500 text-xs mt-1">{errors.shuttleName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      tOS版本 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={shuttleData.tosVersion}
                      onChange={(e) => setShuttleData(prev => ({ ...prev, tosVersion: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.tosVersion ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">请选择tOS版本</option>
                      {tosVersionList.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                    {errors.tosVersion && <p className="text-red-500 text-xs mt-1">{errors.tosVersion}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* 步骤2: 应用信息 */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 请填写应用的基础发布信息，带 * 的为必填项。
                  </p>
                </div>

                {/* 第一行 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      应用类型 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={appData.appType}
                      onChange={(e) => setAppData(prev => ({ ...prev, appType: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.appType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">请选择</option>
                      {appTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      应用名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={appData.appName}
                      onChange={(e) => setAppData(prev => ({ ...prev, appName: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.appName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      应用包名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={appData.packageName}
                      onChange={(e) => setAppData(prev => ({ ...prev, packageName: e.target.value }))}
                      placeholder="com.example.app"
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.packageName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* 第二行 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      版本号 <span className="text-red-500">*</span>
                    </label>
                    <VersionSelect
                      value={appData.versionCode}
                      onChange={(val) => setAppData(prev => ({ ...prev, versionCode: val }))}
                      options={versionCodeOptions}
                      placeholder="请选择版本号"
                      error={errors.versionCode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      APK制品 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={appData.apkId}
                      onChange={(e) => handleAPKChange(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.apkId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">请选择APK</option>
                      {apk制品List.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      测试PASS报告 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setAppData(prev => ({ 
                        ...prev, 
                        testReport: e.target.files ? e.target.files[0] : null 
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>

                {/* 第三行 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      应用分类 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={appData.appCategory}
                      onChange={(e) => setAppData(prev => ({ ...prev, appCategory: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.appCategory ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">请选择</option>
                      {appCategoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      系统应用 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isSystemApp"
                          value="yes"
                          checked={appData.isSystemApp === 'yes'}
                          onChange={(e) => setAppData(prev => ({ ...prev, isSystemApp: e.target.value as 'yes' | 'no' }))}
                          className="mr-1"
                        />
                        是
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isSystemApp"
                          value="no"
                          checked={appData.isSystemApp === 'no'}
                          onChange={(e) => setAppData(prev => ({ ...prev, isSystemApp: e.target.value as 'yes' | 'no' }))}
                          className="mr-1"
                        />
                        否
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      发布国家 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={appData.publishCountryType}
                      onChange={(e) => setAppData(prev => ({ ...prev, publishCountryType: e.target.value as 'all' | 'include' | 'exclude' }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                    >
                      <option value="all">全部国家</option>
                      <option value="include">包含以下国家</option>
                      <option value="exclude">不包含以下国家</option>
                    </select>
                    {appData.publishCountryType !== 'all' && (
                      <div className={`border rounded-lg p-2 max-h-24 overflow-y-auto ${errors.publishCountryDetail ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                        {countryOptions.filter(c => c.code !== 'all').map(c => (
                          <label key={c.code} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              checked={appData.publishCountryDetail.includes(c.code)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setAppData(prev => ({ ...prev, publishCountryDetail: [...prev.publishCountryDetail, c.code] }));
                                } else {
                                  setAppData(prev => ({ ...prev, publishCountryDetail: prev.publishCountryDetail.filter(code => code !== c.code) }));
                                }
                              }}
                              className="mr-2"
                            />
                            {c.name}
                          </label>
                        ))}
                      </div>
                    )}
                    {errors.publishCountryDetail && <p className="text-red-500 text-xs mt-1">{errors.publishCountryDetail}</p>}
                  </div>
                </div>

                {/* 第四行 - 品牌和机型 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">发布品牌</label>
                    <div className="border border-gray-300 rounded-lg p-2 max-h-24 overflow-y-auto">
                      {brandOptions.map(brand => (
                        <label key={brand} className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            checked={appData.publishBrand.includes(brand)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAppData(prev => ({ ...prev, publishBrand: [...prev.publishBrand, brand] }));
                              } else {
                                setAppData(prev => ({ ...prev, publishBrand: prev.publishBrand.filter(b => b !== brand) }));
                              }
                            }}
                            className="mr-2"
                          />
                          {brand}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">发布机型</label>
                    <div className="border border-gray-300 rounded-lg p-2 max-h-24 overflow-y-auto">
                      {modelOptions.map(model => (
                        <label key={model} className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            checked={appData.publishModel.includes(model)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAppData(prev => ({ ...prev, publishModel: [...prev.publishModel, model] }));
                              } else {
                                setAppData(prev => ({ ...prev, publishModel: prev.publishModel.filter(m => m !== model) }));
                              }
                            }}
                            className="mr-2"
                          />
                          {model}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">内测机型 <span className="text-red-500">*</span></label>
                    <div className={`border rounded-lg p-2 max-h-24 overflow-y-auto ${errors.testModel ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                      {modelOptions.map(model => (
                        <label key={`test-${model}`} className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            checked={appData.testModel.includes(model)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAppData(prev => ({ ...prev, testModel: [...prev.testModel, model] }));
                              } else {
                                setAppData(prev => ({ ...prev, testModel: prev.testModel.filter(m => m !== model) }));
                              }
                            }}
                            className="mr-2"
                          />
                          {model}
                        </label>
                      ))}
                    </div>
                    {errors.testModel && <p className="text-red-500 text-xs mt-1">{errors.testModel}</p>}
                  </div>
                </div>

                {/* 第五行 - 版本信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      适用安卓版本 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={appData.androidVersion}
                      onChange={(e) => setAppData(prev => ({ ...prev, androidVersion: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.androidVersion ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">请选择</option>
                      {androidVersionOptions.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      适用tOS版本 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={appData.tosVersion}
                      onChange={(e) => setAppData(prev => ({ ...prev, tosVersion: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.tosVersion ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">请选择</option>
                      {tosVersionList.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                {/* 第六行 - 其他选项 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">是否过滤印度</label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="filterIndia"
                          value="yes"
                          checked={appData.filterIndia === 'yes'}
                          onChange={(e) => setAppData(prev => ({ ...prev, filterIndia: e.target.value as 'yes' | 'no' }))}
                          className="mr-1"
                        />
                        是
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="filterIndia"
                          value="no"
                          checked={appData.filterIndia === 'no'}
                          onChange={(e) => setAppData(prev => ({ ...prev, filterIndia: e.target.value as 'yes' | 'no' }))}
                          className="mr-1"
                        />
                        否
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      是否PA应用更新
                    </label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isPAUpdate"
                          value="yes"
                          checked={appData.isPAUpdate === 'yes'}
                          onChange={(e) => setAppData(prev => ({ ...prev, isPAUpdate: e.target.value as 'yes' | 'no' }))}
                          className="mr-1"
                        />
                        是
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isPAUpdate"
                          value="no"
                          checked={appData.isPAUpdate === 'no'}
                          onChange={(e) => setAppData(prev => ({ ...prev, isPAUpdate: e.target.value as 'yes' | 'no' }))}
                          className="mr-1"
                        />
                        否
                      </label>
                    </div>
                  </div>
                </div>

                {/* PA更新条件字段 */}
                {appData.isPAUpdate === 'yes' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
                    <div className="text-sm font-medium text-yellow-800">PA更新配置（条件必填）</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          灰度量级(天) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={appData.grayScaleLevel}
                          onChange={(e) => setAppData(prev => ({ ...prev, grayScaleLevel: e.target.value }))}
                          placeholder="1-100000"
                          className={`w-full border rounded-lg px-3 py-2 ${
                            errors.grayScaleLevel ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          生效时间 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={appData.effectiveTime}
                          onChange={(e) => setAppData(prev => ({ ...prev, effectiveTime: e.target.value }))}
                          className={`w-full border rounded-lg px-3 py-2 ${
                            errors.effectiveTime ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 步骤3: 物料信息 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 请上传应用商店展示所需的物料素材。
                  </p>
                </div>

                {/* 基本信息 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      应用名称(展示用) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={materialData.appName}
                      onChange={(e) => setMaterialData(prev => ({ ...prev, appName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      一句话描述 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={materialData.shortDescription}
                      onChange={(e) => setMaterialData(prev => ({ ...prev, shortDescription: e.target.value }))}
                      rows={2}
                      placeholder="一句话介绍你的应用（建议20字以内）"
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      产品详情 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={materialData.productDetail}
                      onChange={(e) => setMaterialData(prev => ({ ...prev, productDetail: e.target.value }))}
                      rows={4}
                      placeholder="详细描述应用功能和特点"
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.productDetail ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      更新说明 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={materialData.updateNotes}
                      onChange={(e) => setMaterialData(prev => ({ ...prev, updateNotes: e.target.value }))}
                      rows={3}
                      placeholder="本次更新内容"
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.updateNotes ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      关键词 <span className="text-red-500">*</span> (1-5个)
                    </label>
                    <div className="border border-gray-300 rounded-lg p-2 max-h-24 overflow-y-auto">
                      {keywordOptions.map(kw => (
                        <label key={kw} className="inline-flex items-center mr-4 mb-1">
                          <input
                            type="checkbox"
                            checked={materialData.keywords.includes(kw)}
                            onChange={(e) => {
                              if (e.target.checked && materialData.keywords.length < 5) {
                                setMaterialData(prev => ({ ...prev, keywords: [...prev.keywords, kw] }));
                              } else if (!e.target.checked) {
                                setMaterialData(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== kw) }));
                              }
                            }}
                            disabled={!materialData.keywords.includes(kw) && materialData.keywords.length >= 5}
                            className="mr-1"
                          />
                          {kw}
                        </label>
                      ))}
                    </div>
                    {errors.keywords && <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>}
                  </div>
                </div>

                {/* 图片上传 */}
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-700 border-b pb-2">素材上传</div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* 应用图标 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        应用图标 <span className="text-red-500">*</span>
                        <span className="text-gray-400 text-xs ml-1">(1:1, ≥180x180px)</span>
                      </label>
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        errors.appIcon ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}>
                        {materialData.appIcon ? (
                          <div className="space-y-2">
                            <img 
                              src={URL.createObjectURL(materialData.appIcon)} 
                              alt="应用图标预览" 
                              className="w-16 h-16 mx-auto object-cover rounded-lg border"
                            />
                            <div className="text-sm text-green-600">✓ {materialData.appIcon.name}</div>
                            <button 
                              onClick={() => setMaterialData(prev => ({ ...prev, appIcon: null }))}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              重新上传
                            </button>
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setMaterialData(prev => ({ 
                                ...prev, 
                                appIcon: e.target.files ? e.target.files[0] : null 
                              }))}
                              className="hidden"
                              id="appIcon-upload"
                            />
                            <label htmlFor="appIcon-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                              点击上传
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 置顶大图 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        置顶大图 <span className="text-red-500">*</span>
                        <span className="text-gray-400 text-xs ml-1">(1080x594px, ≤2MB)</span>
                      </label>
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        errors.heroImage ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}>
                        {materialData.heroImage ? (
                          <div className="space-y-2">
                            <img 
                              src={URL.createObjectURL(materialData.heroImage)} 
                              alt="置顶大图预览" 
                              className="w-full h-20 mx-auto object-cover rounded-lg border"
                            />
                            <div className="text-sm text-green-600">✓ {materialData.heroImage.name}</div>
                            <button 
                              onClick={() => setMaterialData(prev => ({ ...prev, heroImage: null }))}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              重新上传
                            </button>
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setMaterialData(prev => ({ 
                                ...prev, 
                                heroImage: e.target.files ? e.target.files[0] : null 
                              }))}
                              className="hidden"
                              id="heroImage-upload"
                            />
                            <label htmlFor="heroImage-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                              点击上传
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 详情截图 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        详情截图 <span className="text-red-500">*</span>
                        <span className="text-gray-400 text-xs ml-1">(3-5张, ≤2MB/张)</span>
                      </label>
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        errors.screenshots ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => setMaterialData(prev => ({ 
                            ...prev, 
                            screenshots: e.target.files ? Array.from(e.target.files) : []
                          }))}
                          className="hidden"
                          id="screenshots-upload"
                        />
                        <label htmlFor="screenshots-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                          点击上传
                        </label>
                        {materialData.screenshots.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="text-sm text-green-600">✓ 已选择 {materialData.screenshots.length} 张</div>
                            <div className="flex flex-wrap gap-1 justify-center mt-1">
                              {materialData.screenshots.slice(0, 3).map((file, idx) => (
                                <img 
                                  key={idx}
                                  src={URL.createObjectURL(file)} 
                                  alt={`截图${idx + 1}`}
                                  className="w-10 h-10 object-cover rounded border"
                                />
                              ))}
                              {materialData.screenshots.length > 3 && (
                                <span className="text-xs text-gray-500 self-center">+{materialData.screenshots.length - 3}张</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* GP上架选项 */}
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-700 border-b pb-2">GP上架（可选）</div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isGP上架"
                        value="yes"
                        checked={materialData.isGP上架 === 'yes'}
                        onChange={(e) => setMaterialData(prev => ({ ...prev, isGP上架: e.target.value as 'yes' | 'no' }))}
                        className="mr-1"
                      />
                      是，需要上架到Google Play
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isGP上架"
                        value="no"
                        checked={materialData.isGP上架 === 'no'}
                        onChange={(e) => setMaterialData(prev => ({ ...prev, isGP上架: e.target.value as 'yes' | 'no' }))}
                        className="mr-1"
                      />
                      否
                    </label>
                  </div>

                  {materialData.isGP上架 === 'yes' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GP链接 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={materialData.gpLink}
                        onChange={(e) => setMaterialData(prev => ({ ...prev, gpLink: e.target.value }))}
                        placeholder="https://play.google.com/store/apps/details?id=..."
                        className={`w-full border rounded-lg px-3 py-2 ${
                          errors.gpLink ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 底部按钮 */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  上一步
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  下一步
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  提交申请
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateApplicationModal;
