import React, { useState } from 'react';
import type { ChannelApplyData, AppMaterial } from '../types';

// 语言选项
const languageOptions = [
  { code: 'en', name: '英语', required: true },
  { code: 'ru', name: '俄语', required: false },
  { code: 'pt', name: '葡萄牙语', required: false },
  { code: 'es', name: '西班牙语', required: false },
  { code: 'ar', name: '阿语', required: false },
  { code: 'ko', name: '韩语', required: false },
];

// 关键词选项
const keywordOptions = [
  'chat', 'social', 'video', 'music', 'payment', 'shopping', 'news',
  'weather', 'map', 'camera', 'security', 'cleaner', 'game', 'reading',
  'messenger', 'call', 'photo', 'shopping', 'lifestyle'
];

// 物料上传Modal - 与通道发布申请类似，但物料字段全部必填
interface MaterialUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChannelApplyData) => void;
  initialData?: ChannelApplyData | null;
}

export const MaterialUploadModal: React.FC<MaterialUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [activeTab, setActiveTab] = useState('en');
  const [formData, setFormData] = useState<ChannelApplyData>(
    initialData || {
      appName: '',
      packageName: '',
      appType: '',
      versionCode: '',
      versionName: '',
      apkUrl: '',
      appCategory: '',
      isSystemApp: false,
      countryType: 'all',
      countries: [],
      brandType: 'all',
      brands: [],
      deviceType: 'all',
      devices: [],
      betaDeviceType: 'all',
      betaDevices: [],
      androidVersionType: 'all',
      androidVersions: [],
      tosVersionType: 'all',
      tosVersions: [],
      filterIndia: false,
      isPAUpdate: false,
      status: 'pending',
      materials: [
        { language: 'en', languageName: '英语', appName: '', shortDescription: '', productDetail: '', updateDescription: '', keywords: [], isGP上架: false }
      ]
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const currentMaterial = formData.materials?.find(m => m.language === activeTab) || formData.materials?.[0];
  const currentMaterialIndex = formData.materials?.findIndex(m => m.language === activeTab) ?? 0;

  const updateMaterial = (field: keyof AppMaterial, value: any) => {
    const newMaterials = [...(formData.materials || [])];
    if (currentMaterial) {
      newMaterials[currentMaterialIndex] = { ...currentMaterial, [field]: value };
      setFormData({ ...formData, materials: newMaterials });
    }
  };

  const addLanguage = (langCode: string) => {
    const lang = languageOptions.find(l => l.code === langCode);
    if (lang && !formData.materials?.find(m => m.language === langCode)) {
      const newMaterials = [
        ...(formData.materials || []),
        { 
          language: langCode, 
          languageName: lang.name, 
          appName: '', 
          shortDescription: '', 
          productDetail: '', 
          updateDescription: '', 
          keywords: [], 
          isGP上架: false 
        }
      ];
      setFormData({ ...formData, materials: newMaterials });
      setActiveTab(langCode);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 验证默认语言（英语）必填
    const defaultMaterial = formData.materials?.[0];
    if (!defaultMaterial?.appName?.trim()) newErrors.appName = '请输入应用名称';
    if (!defaultMaterial?.shortDescription?.trim()) newErrors.shortDescription = '请输入一句话描述';
    if (!defaultMaterial?.productDetail?.trim()) newErrors.productDetail = '请输入产品详情';
    if (!defaultMaterial?.updateDescription?.trim()) newErrors.updateDescription = '请输入更新说明';
    if (!defaultMaterial?.keywords?.length) newErrors.keywords = '请选择关键词(1-5个)';
    if (defaultMaterial?.isGP上架 && !defaultMaterial.gpLink?.trim()) newErrors.gpLink = '请输入GP链接';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">物料上传 (全部必填)</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">✕</button>
          </div>

          {/* 语言Tab */}
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2 overflow-x-auto">
            {languageOptions.map(lang => (
              <button
                key={lang.code}
                onClick={() => setActiveTab(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === lang.code 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {lang.name}
                {lang.required && <span className="text-red-400 ml-1">*</span>}
              </button>
            ))}
            
            {/* 添加更多语言 */}
            <div className="relative group">
              <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-600 hover:bg-gray-300">
                + 添加语言
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg hidden group-hover:block z-10 min-w-32">
                {languageOptions
                  .filter(l => !formData.materials?.find(m => m.language === l.code))
                  .map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => addLanguage(lang.code)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                    >
                      {lang.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* 内容区 */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {currentMaterial && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ 请上传物料素材，所有标记 * 的字段为必填项。（英语为默认语言，必须填写）
                  </p>
                </div>

                {/* 应用名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    应用名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentMaterial.appName || ''}
                    onChange={(e) => updateMaterial('appName', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      errors.appName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="应用商店展示的应用名称"
                  />
                  {errors.appName && <p className="text-red-500 text-xs mt-1">{errors.appName}</p>}
                </div>

                {/* 一句话描述 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    一句话描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={currentMaterial.shortDescription || ''}
                    onChange={(e) => updateMaterial('shortDescription', e.target.value)}
                    rows={2}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="一句话介绍你的应用（建议20字以内）"
                  />
                  {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
                </div>

                {/* 产品详情 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    产品详情 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={currentMaterial.productDetail || ''}
                    onChange={(e) => updateMaterial('productDetail', e.target.value)}
                    rows={4}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      errors.productDetail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="详细描述应用功能和特点"
                  />
                  {errors.productDetail && <p className="text-red-500 text-xs mt-1">{errors.productDetail}</p>}
                </div>

                {/* 更新说明 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    更新说明 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={currentMaterial.updateDescription || ''}
                    onChange={(e) => updateMaterial('updateDescription', e.target.value)}
                    rows={3}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      errors.updateDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="本次更新内容"
                  />
                  {errors.updateDescription && <p className="text-red-500 text-xs mt-1">{errors.updateDescription}</p>}
                </div>

                {/* 关键词 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    关键词 <span className="text-red-500">*</span> (1-5个)
                  </label>
                  <div className={`border rounded-lg p-2 max-h-32 overflow-y-auto ${
                    errors.keywords ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}>
                    {keywordOptions.map(kw => (
                      <label key={kw} className="inline-flex items-center mr-4 mb-1">
                        <input
                          type="checkbox"
                          checked={currentMaterial.keywords?.includes(kw) || false}
                          onChange={(e) => {
                            const current = currentMaterial.keywords || [];
                            if (e.target.checked && current.length < 5) {
                              updateMaterial('keywords', [...current, kw]);
                            } else if (!e.target.checked) {
                              updateMaterial('keywords', current.filter(k => k !== kw));
                            }
                          }}
                          disabled={!currentMaterial.keywords?.includes(kw) && (currentMaterial.keywords?.length || 0) >= 5}
                          className="mr-1"
                        />
                        {kw}
                      </label>
                    ))}
                  </div>
                  {errors.keywords && <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>}
                </div>

                {/* 图片上传 */}
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-700 border-b pb-2">📸 素材上传</div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* 应用图标 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        应用图标 <span className="text-red-500">*</span>
                        <span className="text-gray-400 text-xs ml-1">(1:1, ≥180x180px)</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400">
                        {currentMaterial.icon ? (
                          <div className="space-y-2">
                            <img 
                              src={currentMaterial.icon} 
                              alt="应用图标预览" 
                              className="w-16 h-16 mx-auto object-cover rounded-lg border"
                            />
                            <div className="text-sm text-green-600">✓ 已上传</div>
                          </div>
                        ) : (
                          <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                            点击上传
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  updateMaterial('icon', URL.createObjectURL(file));
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* 置顶大图 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        置顶大图 <span className="text-red-500">*</span>
                        <span className="text-gray-400 text-xs ml-1">(1080x594px, ≤2MB)</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400">
                        {currentMaterial.heroImage ? (
                          <div className="space-y-2">
                            <img 
                              src={currentMaterial.heroImage} 
                              alt="置顶大图预览" 
                              className="w-full h-16 mx-auto object-cover rounded-lg border"
                            />
                            <div className="text-sm text-green-600">✓ 已上传</div>
                          </div>
                        ) : (
                          <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                            点击上传
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  updateMaterial('heroImage', URL.createObjectURL(file));
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* 详情截图 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        详情截图 <span className="text-red-500">*</span>
                        <span className="text-gray-400 text-xs ml-1">(3-5张)</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400">
                        {currentMaterial.screenshots?.length ? (
                          <div className="space-y-1">
                            <div className="text-sm text-green-600">✓ 已上传 {currentMaterial.screenshots.length} 张</div>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {currentMaterial.screenshots.slice(0, 3).map((src, idx) => (
                                <img 
                                  key={idx}
                                  src={src} 
                                  alt={`截图${idx + 1}`}
                                  className="w-8 h-8 object-cover rounded border"
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                            点击上传
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files) {
                                  const urls = Array.from(files).map(f => URL.createObjectURL(f));
                                  updateMaterial('screenshots', urls);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* GP上架选项 */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700 border-b pb-2">🌐 GP上架</div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={currentMaterial.isGP上架 === true}
                        onChange={() => updateMaterial('isGP上架', true)}
                        className="mr-2"
                      />
                      是，需要上架到Google Play
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={currentMaterial.isGP上架 === false}
                        onChange={() => updateMaterial('isGP上架', false)}
                        className="mr-2"
                      />
                      否
                    </label>
                  </div>
                  {currentMaterial.isGP上架 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GP链接 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={currentMaterial.gpLink || ''}
                        onChange={(e) => updateMaterial('gpLink', e.target.value)}
                        placeholder="https://play.google.com/store/apps/details?id=..."
                        className={`w-full border rounded-lg px-3 py-2 ${
                          errors.gpLink ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.gpLink && <p className="text-red-500 text-xs mt-1">{errors.gpLink}</p>}
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
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              确认提交
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
