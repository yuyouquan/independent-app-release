import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Search, Plus, Eye, ChevronDown, ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle, Upload, X } from 'lucide-react';
import { mockApplications, mockTodos, shuttleOptions, tosVersionOptions, apkStatusOptions, Application, APKItem, TodoItem } from './data/mockData';
import { 
  appCategoryOptions, brandOptions, phoneModelOptions, 
  androidVersionOptions, tosVersionOptions as tosOpts, 
  countryOptions, keywordOptions, AppCategory, Brand, PhoneModel,
  AndroidVersion, TosVersion, Country, ConditionType
} from './types';

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

// ==================== 通道发布申请Modal ====================
interface ChannelApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

function ChannelApplyModal({ isOpen, onClose, onSubmit }: ChannelApplyModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'materials' | 'paUpdate'>('basic');
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [languages, setLanguages] = useState([{ 
    id: 1, 
    name: 'English', 
    appName: '', 
    shortDescription: '', 
    productDetails: '', 
    updateNotes: '', 
    keywords: [] as string[],
    isGP上架: false,
    gpLink: ''
  }]);

  // 基础信息
  const [basicInfo, setBasicInfo] = useState({
    versionCode: '',
    testReport: '',
    category: '' as AppCategory | '',
    isSystemApp: false,
    publishCountries: { type: '全部' as ConditionType, countries: [] as Country[] },
    publishBrands: { type: '全部' as ConditionType, brands: [] as Brand[] },
    publishModels: { type: '全部' as ConditionType, models: [] as PhoneModel[] },
    testModels: { type: '全部' as ConditionType, models: [] as PhoneModel[] },
    androidVersions: { type: '全部' as ConditionType, versions: [] as AndroidVersion[] },
    tosVersions: { type: '全部' as ConditionType, versions: [] as TosVersion[] },
    filterIndia: false,
  });

  // PA更新
  const [paUpdate, setPaUpdate] = useState({
    isPAUpdate: true,
    grayScale: 1000,
    effectiveTime: ''
  });

  const addLanguage = (lang: string) => {
    if (!['English', '俄语', '葡萄牙语', '西班牙语', '阿语', '韩语'].includes(lang)) return;
    const langMap: Record<string, string> = { '俄语': 'Russian', '葡萄牙语': 'Portuguese', '西班牙语': 'Spanish', '阿语': 'Arabic', '韩语': 'Korean' };
    setLanguages([...languages, { 
      id: Date.now(), 
      name: langMap[lang] || lang, 
      appName: '', 
      shortDescription: '', 
      productDetails: '', 
      updateNotes: '', 
      keywords: [],
      isGP上架: false,
      gpLink: ''
    }]);
  };

  const removeLanguage = (id: number) => {
    if (languages.length <= 1) return;
    setLanguages(languages.filter(l => l.id !== id));
    if (activeLanguage >= languages.length - 1) setActiveLanguage(0);
  };

  const handleSubmit = () => {
    onSubmit({
      basicInfo,
      materials: { languages },
      paUpdate
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">通道发布申请</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-3 ${activeTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
          >
            基础信息
          </button>
          <button 
            onClick={() => setActiveTab('materials')}
            className={`px-6 py-3 ${activeTab === 'materials' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
          >
            所需物料
          </button>
          <button 
            onClick={() => setActiveTab('paUpdate')}
            className={`px-6 py-3 ${activeTab === 'paUpdate' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
          >
            PA更新
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* 自动带出的字段 */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">应用名称</div>
                  <div className="font-medium">Spotify</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">应用包名</div>
                  <div className="font-medium">com.spotify.music</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">应用类型</div>
                  <div className="font-medium">Music</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">应用APK</div>
                  <div className="font-medium text-blue-600">spotify-22651.apk</div>
                </div>
              </div>

              {/* 可编辑字段 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">应用版本号 <span className="text-red-500">*</span></label>
                  <select 
                    className="w-full border rounded-lg px-3 py-2"
                    value={basicInfo.versionCode}
                    onChange={(e) => setBasicInfo({...basicInfo, versionCode: e.target.value})}
                  >
                    <option value="">请选择版本</option>
                    <option value="22651">v22651</option>
                    <option value="22650">v22650</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">应用分类 <span className="text-red-500">*</span></label>
                  <select 
                    className="w-full border rounded-lg px-3 py-2"
                    value={basicInfo.category}
                    onChange={(e) => setBasicInfo({...basicInfo, category: e.target.value as AppCategory})}
                  >
                    <option value="">请选择分类</option>
                    {appCategoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">应用测试PASS报告</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                    <Upload className="w-6 h-6 mx-auto text-gray-400" />
                    <div className="text-sm text-gray-500 mt-1">点击上传报告</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">系统应用</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        checked={basicInfo.isSystemApp === true}
                        onChange={() => setBasicInfo({...basicInfo, isSystemApp: true})}
                        className="mr-2" 
                      />
                      是
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        checked={basicInfo.isSystemApp === false}
                        onChange={() => setBasicInfo({...basicInfo, isSystemApp: false})}
                        className="mr-2" 
                      />
                      否
                    </label>
                  </div>
                </div>
              </div>

              {/* 条件选择字段 */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">发布国家</label>
                  <div className="flex gap-2">
                    <select 
                      className="border rounded-lg px-3 py-2 w-32"
                      value={basicInfo.publishCountries.type}
                      onChange={(e) => setBasicInfo({
                        ...basicInfo, 
                        publishCountries: {...basicInfo.publishCountries, type: e.target.value as ConditionType}
                      })}
                    >
                      <option value="全部">全部</option>
                      <option value="包含">包含</option>
                      <option value="不包含">不包含</option>
                    </select>
                    <div className="flex-1 border rounded-lg p-2 min-h-[42px] flex flex-wrap gap-1">
                      {countryOptions.map(opt => (
                        <label key={opt.value} className="flex items-center text-sm">
                          <input 
                            type="checkbox"
                            checked={basicInfo.publishCountries.countries.includes(opt.value as Country)}
                            onChange={(e) => {
                              const countries = e.target.checked
                                ? [...basicInfo.publishCountries.countries, opt.value as Country]
                                : basicInfo.publishCountries.countries.filter(c => c !== opt.value);
                              setBasicInfo({
                                ...basicInfo, 
                                publishCountries: {...basicInfo.publishCountries, countries}
                              });
                            }}
                            className="mr-1"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">发布品牌</label>
                  <div className="flex gap-2">
                    <select 
                      className="border rounded-lg px-3 py-2 w-32"
                      value={basicInfo.publishBrands.type}
                      onChange={(e) => setBasicInfo({
                        ...basicInfo, 
                        publishBrands: {...basicInfo.publishBrands, type: e.target.value as ConditionType}
                      })}
                    >
                      <option value="全部">全部</option>
                      <option value="包含">包含</option>
                      <option value="不包含">不包含</option>
                    </select>
                    <div className="flex-1 border rounded-lg p-2 min-h-[42px] flex flex-wrap gap-1">
                      {brandOptions.map(opt => (
                        <label key={opt.value} className="flex items-center text-sm">
                          <input 
                            type="checkbox"
                            checked={basicInfo.publishBrands.brands.includes(opt.value)}
                            onChange={(e) => {
                              const brands = e.target.checked
                                ? [...basicInfo.publishBrands.brands, opt.value]
                                : basicInfo.publishBrands.brands.filter(b => b !== opt.value);
                              setBasicInfo({
                                ...basicInfo, 
                                publishBrands: {...basicInfo.publishBrands, brands}
                              });
                            }}
                            className="mr-1"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">发布机型</label>
                  <div className="flex gap-2">
                    <select 
                      className="border rounded-lg px-3 py-2 w-32"
                      value={basicInfo.publishModels.type}
                      onChange={(e) => setBasicInfo({
                        ...basicInfo, 
                        publishModels: {...basicInfo.publishModels, type: e.target.value as ConditionType}
                      })}
                    >
                      <option value="全部">全部</option>
                      <option value="包含">包含</option>
                      <option value="不包含">不包含</option>
                    </select>
                    <div className="flex-1 border rounded-lg p-2 min-h-[42px] flex flex-wrap gap-1">
                      {phoneModelOptions.map(opt => (
                        <label key={opt.value} className="flex items-center text-sm">
                          <input 
                            type="checkbox"
                            checked={basicInfo.publishModels.models.includes(opt.value)}
                            onChange={(e) => {
                              const models = e.target.checked
                                ? [...basicInfo.publishModels.models, opt.value]
                                : basicInfo.publishModels.models.filter(m => m !== opt.value);
                              setBasicInfo({
                                ...basicInfo, 
                                publishModels: {...basicInfo.publishModels, models}
                              });
                            }}
                            className="mr-1"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">适用安卓版本</label>
                  <div className="flex gap-2">
                    <select 
                      className="border rounded-lg px-3 py-2 w-32"
                      value={basicInfo.androidVersions.type}
                      onChange={(e) => setBasicInfo({
                        ...basicInfo, 
                        androidVersions: {...basicInfo.androidVersions, type: e.target.value as ConditionType}
                      })}
                    >
                      <option value="全部">全部</option>
                      <option value="包含">包含</option>
                      <option value="不包含">不包含</option>
                    </select>
                    <div className="flex-1 border rounded-lg p-2 min-h-[42px] flex flex-wrap gap-1">
                      {androidVersionOptions.map(opt => (
                        <label key={opt.value} className="flex items-center text-sm">
                          <input 
                            type="checkbox"
                            checked={basicInfo.androidVersions.versions.includes(opt.value)}
                            onChange={(e) => {
                              const versions = e.target.checked
                                ? [...basicInfo.androidVersions.versions, opt.value]
                                : basicInfo.androidVersions.versions.filter(v => v !== opt.value);
                              setBasicInfo({
                                ...basicInfo, 
                                androidVersions: {...basicInfo.androidVersions, versions}
                              });
                            }}
                            className="mr-1"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">适用tOS版本</label>
                  <div className="flex gap-2">
                    <select 
                      className="border rounded-lg px-3 py-2 w-32"
                      value={basicInfo.tosVersions.type}
                      onChange={(e) => setBasicInfo({
                        ...basicInfo, 
                        tosVersions: {...basicInfo.tosVersions, type: e.target.value as ConditionType}
                      })}
                    >
                      <option value="全部">全部</option>
                      <option value="包含">包含</option>
                      <option value="不包含">不包含</option>
                    </select>
                    <div className="flex-1 border rounded-lg p-2 min-h-[42px] flex flex-wrap gap-1">
                      {tosOpts.map(opt => (
                        <label key={opt.value} className="flex items-center text-sm">
                          <input 
                            type="checkbox"
                            checked={basicInfo.tosVersions.versions.includes(opt.value)}
                            onChange={(e) => {
                              const versions = e.target.checked
                                ? [...basicInfo.tosVersions.versions, opt.value]
                                : basicInfo.tosVersions.versions.filter(v => v !== opt.value);
                              setBasicInfo({
                                ...basicInfo, 
                                tosVersions: {...basicInfo.tosVersions, versions}
                              });
                            }}
                            className="mr-1"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">是否需要过滤印度</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        checked={basicInfo.filterIndia === true}
                        onChange={() => setBasicInfo({...basicInfo, filterIndia: true})}
                        className="mr-2" 
                      />
                      是
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        checked={basicInfo.filterIndia === false}
                        onChange={() => setBasicInfo({...basicInfo, filterIndia: false})}
                        className="mr-2" 
                      />
                      否
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-4">
              {/* 语言Tab */}
              <div className="flex gap-2 border-b pb-2">
                {languages.map((lang, idx) => (
                  <div key={lang.id} className="flex items-center">
                    <button
                      onClick={() => setActiveLanguage(idx)}
                      className={`px-3 py-1 rounded ${activeLanguage === idx ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                    >
                      {lang.name}
                    </button>
                    {languages.length > 1 && idx > 0 && (
                      <button onClick={() => removeLanguage(lang.id)} className="ml-1 text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <div className="relative">
                  <select 
                    className="appearance-none bg-gray-100 px-3 py-1 rounded pr-6 text-sm cursor-pointer"
                    onChange={(e) => { if(e.target.value) { addLanguage(e.target.value); e.target.value = ''; } }}
                  >
                    <option value="">+ 添加语言</option>
                    {!languages.find(l => l.name === 'Russian') && <option value="俄语">俄语</option>}
                    {!languages.find(l => l.name === 'Portuguese') && <option value="葡萄牙语">葡萄牙语</option>}
                    {!languages.find(l => l.name === 'Spanish') && <option value="西班牙语">西班牙语</option>}
                    {!languages.find(l => l.name === 'Arabic') && <option value="阿语">阿语</option>}
                    {!languages.find(l => l.name === 'Korean') && <option value="韩语">韩语</option>}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 语言内容 */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">应用名称</label>
                    <input 
                      type="text" 
                      className="w-full border rounded-lg px-3 py-2"
                      value={languages[activeLanguage].appName}
                      onChange={(e) => {
                        const newLangs = [...languages];
                        newLangs[activeLanguage].appName = e.target.value;
                        setLanguages(newLangs);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">关键词 (1-5个)</label>
                    <div className="border rounded-lg p-2 min-h-[42px] flex flex-wrap gap-1">
                      {keywordOptions.slice(0, 10).map(kw => (
                        <label key={kw} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={languages[activeLanguage].keywords.includes(kw)}
                            onChange={(e) => {
                              const newLangs = [...languages];
                              if (e.target.checked) {
                                if (newLangs[activeLanguage].keywords.length < 5) {
                                  newLangs[activeLanguage].keywords.push(kw);
                                }
                              } else {
                                newLangs[activeLanguage].keywords = newLangs[activeLanguage].keywords.filter(k => k !== kw);
                              }
                              setLanguages(newLangs);
                            }}
                            className="mr-1"
                          />
                          {kw}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">一句话描述</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-lg px-3 py-2"
                    value={languages[activeLanguage].shortDescription}
                    onChange={(e) => {
                      const newLangs = [...languages];
                      newLangs[activeLanguage].shortDescription = e.target.value;
                      setLanguages(newLangs);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">产品详情</label>
                  <textarea 
                    className="w-full border rounded-lg px-3 py-2 h-24"
                    value={languages[activeLanguage].productDetails}
                    onChange={(e) => {
                      const newLangs = [...languages];
                      newLangs[activeLanguage].productDetails = e.target.value;
                      setLanguages(newLangs);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">更新说明</label>
                  <textarea 
                    className="w-full border rounded-lg px-3 py-2 h-20"
                    value={languages[activeLanguage].updateNotes}
                    onChange={(e) => {
                      const newLangs = [...languages];
                      newLangs[activeLanguage].updateNotes = e.target.value;
                      setLanguages(newLangs);
                    }}
                  />
                </div>

                {/* 图片上传 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">应用图标 (1:1, ≥180x180px)</label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                      <Upload className="w-6 h-6 mx-auto text-gray-400" />
                      <div className="text-xs text-gray-500 mt-1">点击上传</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">置顶大图 (1080x594px)</label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                      <Upload className="w-6 h-6 mx-auto text-gray-400" />
                      <div className="text-xs text-gray-500 mt-1">点击上传</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">详情截图 (3-5张)</label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                      <Upload className="w-6 h-6 mx-auto text-gray-400" />
                      <div className="text-xs text-gray-500 mt-1">点击上传</div>
                    </div>
                  </div>
                </div>

                {/* GP上架 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        checked={languages[activeLanguage].isGP上架 === true}
                        onChange={() => {
                          const newLangs = [...languages];
                          newLangs[activeLanguage].isGP上架 = true;
                          setLanguages(newLangs);
                        }}
                        className="mr-2" 
                      />
                      是GP上架
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        checked={languages[activeLanguage].isGP上架 === false}
                        onChange={() => {
                          const newLangs = [...languages];
                          newLangs[activeLanguage].isGP上架 = false;
                          newLangs[activeLanguage].gpLink = '';
                          setLanguages(newLangs);
                        }}
                        className="mr-2" 
                      />
                      否
                    </label>
                  </div>
                  {languages[activeLanguage].isGP上架 && (
                    <div>
                      <label className="block text-sm font-medium mb-1">GP链接</label>
                      <input 
                        type="text" 
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="https://play.google.com/store/apps/details?id=..."
                        value={languages[activeLanguage].gpLink}
                        onChange={(e) => {
                          const newLangs = [...languages];
                          newLangs[activeLanguage].gpLink = e.target.value;
                          setLanguages(newLangs);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'paUpdate' && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <label className="flex items-center mb-4">
                  <input 
                    type="radio" 
                    checked={paUpdate.isPAUpdate === true}
                    onChange={() => setPaUpdate({...paUpdate, isPAUpdate: true})}
                    className="mr-2" 
                  />
                  是PA应用更新
                </label>
                <label className="flex items-center mb-4">
                  <input 
                    type="radio" 
                    checked={paUpdate.isPAUpdate === false}
                    onChange={() => setPaUpdate({...paUpdate, isPAUpdate: false})}
                    className="mr-2" 
                  />
                  否
                </label>

                {paUpdate.isPAUpdate && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">灰度量级 (1-100000)</label>
                      <input 
                        type="number" 
                        className="w-full border rounded-lg px-3 py-2"
                        min={1}
                        max={100000}
                        value={paUpdate.grayScale}
                        onChange={(e) => setPaUpdate({...paUpdate, grayScale: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">生效时间</label>
                      <input 
                        type="datetime-local" 
                        className="w-full border rounded-lg px-3 py-2"
                        value={paUpdate.effectiveTime}
                        onChange={(e) => setPaUpdate({...paUpdate, effectiveTime: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            取消
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            确认提交
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 添加应用Modal ====================
interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (apps: string[]) => void;
}

function AddAppModal({ isOpen, onClose, onAdd }: AddAppModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const availableApps = [
    { id: 'app1', icon: '🎵', name: 'Spotify', package: 'com.spotify.music', type: 'Music' },
    { id: 'app2', icon: '💬', name: 'Telegram', package: 'org.telegram.messenger', type: 'Social' },
    { id: 'app3', icon: '📸', name: 'Instagram', package: 'com.instagram.android', type: 'Social' },
    { id: 'app4', icon: '📺', name: 'YouTube', package: 'com.google.android.youtube', type: 'Video' },
    { id: 'app5', icon: '🐦', name: 'Twitter', package: 'com.twitter.android', type: 'Social' },
    { id: 'app6', icon: '📘', name: 'Facebook', package: 'com.facebook.katana', type: 'Social' },
  ];

  const filteredApps = availableApps.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.package.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">添加应用</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索应用名称或包名..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredApps.map(app => (
              <div 
                key={app.id}
                onClick={() => toggleSelect(app.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border ${selected.includes(app.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                  {app.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{app.name}</div>
                  <div className="text-xs text-gray-500">{app.package}</div>
                </div>
                <div className="text-xs text-gray-400">{app.type}</div>
                {selected.includes(app.id) && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            取消
          </button>
          <button 
            onClick={() => { onAdd(selected); onClose(); }}
            disabled={selected.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            确认添加 ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== 节点详情Modal ====================
interface NodeDetailModalProps {
  node: { name: string; status: string; operator?: string; rejectReason?: string } | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

function NodeDetailModal({ node, onClose, onApprove, onReject }: NodeDetailModalProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!node) return null;

  const isCompleted = node.status === 'completed';
  const isRejected = node.status === 'rejected';
  const isProcessing = node.status === 'processing';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{node.name}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* 状态显示 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">状态:</span>
            <span className={`px-2 py-1 text-sm rounded-full ${
              isCompleted ? 'bg-green-100 text-green-700' :
              isRejected ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {isCompleted ? '已完成' : isRejected ? '已拒绝' : '进行中'}
            </span>
          </div>

          {/* 拒绝原因 */}
          {(isRejected || node.rejectReason) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm font-medium text-red-700">拒绝原因:</div>
              <div className="text-sm text-red-600">{node.rejectReason || rejectReason}</div>
            </div>
          )}

          {/* 详情内容 */}
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-2">详细信息</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">应用名称</span>
                <span className="text-sm font-medium">Spotify</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">应用包名</span>
                <span className="text-sm font-medium">com.spotify.music</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">版本号</span>
                <span className="text-sm font-medium">v22651</span>
              </div>
              {node.operator && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">操作人</span>
                  <span className="text-sm font-medium">{node.operator}</span>
                </div>
              )}
            </div>
          </div>

          {/* 审核操作 (仅进行中节点) */}
          {isProcessing && (
            <div className="space-y-3">
              {!showRejectInput ? (
                <div className="flex gap-3">
                  <button 
                    onClick={onApprove}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    通过
                  </button>
                  <button 
                    onClick={() => setShowRejectInput(true)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    拒绝
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    placeholder="请输入拒绝原因..."
                    className="w-full border rounded-lg px-3 py-2 h-20"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { onReject(rejectReason); setShowRejectInput(false); }}
                      disabled={!rejectReason.trim()}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
                    >
                      确认拒绝
                    </button>
                    <button 
                      onClick={() => setShowRejectInput(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
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

  const handleApplySubmit = (data: any) => {
    console.log('提交申请数据:', data);
    alert('申请已提交！');
  };

  const handleAddApps = (appIds: string[]) => {
    console.log('添加应用:', appIds);
    alert(`已添加 ${appIds.length} 个应用`);
  };

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
              onClick={() => setShowApplyModal(true)}
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

      {/* Modals */}
      <ChannelApplyModal 
        isOpen={showApplyModal} 
        onClose={() => setShowApplyModal(false)} 
        onSubmit={handleApplySubmit}
      />
      <AddAppModal 
        isOpen={showAddAppModal}
        onClose={() => setShowAddAppModal(false)}
        onAdd={handleAddApps}
      />
    </div>
  );
}

// ==================== 申请详情页 ====================
function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const app = mockApplications.find(a => a.id === id) || mockApplications[0];

  const handleAddApps = (appIds: string[]) => {
    console.log('添加应用:', appIds);
    alert(`已添加 ${appIds.length} 个应用到流程单`);
  };

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
            <button 
              onClick={() => setShowAddAppModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + 添加应用
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {app.apps.map((apk) => (
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
        </div>
      </div>

      {/* 添加应用Modal */}
      <AddAppModal 
        isOpen={showAddAppModal}
        onClose={() => setShowAddAppModal(false)}
        onAdd={handleAddApps}
      />
    </div>
  );
}

// ==================== APK详情页 ====================
function APKDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<{ name: string; status: string; operator?: string; rejectReason?: string } | null>(null);
  
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

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  const handleApprove = () => {
    console.log('审核通过');
    setSelectedNode(null);
    alert('审核已通过！');
  };

  const handleReject = (reason: string) => {
    console.log('审核拒绝:', reason);
    setSelectedNode(null);
    alert('已拒绝，理由: ' + reason);
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

        {/* 流水线 - 可点击 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">发布流程</h2>
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {apk.nodes.map((node, idx) => (
              <div key={idx} className="flex items-center flex-shrink-0">
                <div 
                  className="flex flex-col items-center cursor-pointer hover:opacity-80"
                  onClick={() => handleNodeClick(node)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${nodeStatusColors[node.status]} ${node.status === 'processing' ? 'ring-4 ring-blue-200' : ''}`}>
                    {node.status === 'completed' ? <CheckCircle className="w-6 h-6" /> :
                     node.status === 'rejected' ? <XCircle className="w-6 h-6" /> :
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

      {/* 节点详情Modal */}
      <NodeDetailModal 
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
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
