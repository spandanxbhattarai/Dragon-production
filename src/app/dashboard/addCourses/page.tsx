
'use client';

import React, { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, Info, X, Book, Users, Clock, 
   Layout, ListChecks, 
  Check, ChevronLeft, ChevronRight, Save,
  Upload, Loader, Image as ImageIcon,
  Coins
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createCourse } from '../../../../apiCalls/addCourse';
import { Toaster } from 'react-hot-toast';
import { uploadFile } from '../../../../apiCalls/fileUpload';
import Image from 'next/image';

interface LearningFormat {
  name: string;
  description: string;
}

interface CurriculumItem {
  title: string;
  duration: number;
  description: string;
}

interface FormData {
  title: string;
  description: string[];
  teachersCount: number;
  courseHighlights: string[];
  overallHours: number;
  moduleLeader: string;
  category: string;
  learningFormat: LearningFormat[];
  price: number;
  curriculum: CurriculumItem[];
  featuredImage: string;
}

interface NavigationTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface FileUploadInputProps {
  id: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  accept?: string;
  label?: string;
}

export default function AddCourseForm() {
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: [''],
        teachersCount: 1,
        courseHighlights: [''],
        overallHours: 0,
        moduleLeader: '',
        category: '',
        learningFormat: [{ name: '', description: '' }],
        price: 0,
        curriculum: [{ title: '', duration: 0, description: '' }],
        featuredImage: '',
    });

    const [featuredImageUrl, setFeaturedImageUrl] = useState("");
    const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'teachersCount' || name === 'overallHours' || name === 'price'
                ? Number(value)
                : value
        });
    };

    const handleArrayChange = (field: keyof FormData, index: number, value: string) => {
        const newArray = [...formData[field] as string[]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: keyof FormData) => {
        setFormData({
            ...formData,
            [field]: [...formData[field] as string[], '']
        });
    };

    const removeArrayItem = (field: keyof FormData, index: number) => {
        const newArray = [...formData[field] as string[]];
        newArray.splice(index, 1);
        setFormData({ ...formData, [field]: newArray });
    };

    const handleLearningFormatChange = (index: number, field: keyof LearningFormat, value: string) => {
        const newFormats = [...formData.learningFormat];
        newFormats[index] = { ...newFormats[index], [field]: value };
        setFormData({ ...formData, learningFormat: newFormats });
    };

    const handleCurriculumChange = (index: number, field: keyof CurriculumItem, value: string) => {
        const newCurriculum = [...formData.curriculum];
        newCurriculum[index] = {
            ...newCurriculum[index],
            [field]: field === 'duration' ? Number(value) : value
        };
        setFormData({ ...formData, curriculum: newCurriculum });
    };

    const addLearningFormat = () => {
        setFormData({
            ...formData,
            learningFormat: [...formData.learningFormat, { name: '', description: '' }]
        });
    };

    const addCurriculumItem = () => {
        setFormData({
            ...formData,
            curriculum: [...formData.curriculum, { title: '', duration: 0, description: '' }]
        });
    };

    const removeLearningFormat = (index: number) => {
        const newFormats = [...formData.learningFormat];
        newFormats.splice(index, 1);
        setFormData({ ...formData, learningFormat: newFormats });
    };

    const removeCurriculumItem = (index: number) => {
        const newCurriculum = [...formData.curriculum];
        newCurriculum.splice(index, 1);
        setFormData({ ...formData, curriculum: newCurriculum });
    };

    const FileUploadInput: React.FC<FileUploadInputProps> = ({
        id,
        onChange,
        isUploading,
        accept = 'image/png, image/jpeg',
        label = 'Choose File',
    }) => (
        <div className="w-full">
            {isUploading ? (
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-3 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-blue-700">
                        <Loader className="h-5 w-5 animate-spin" />
                        <span className="font-Urbanist">Uploading...</span>
                    </div>
                </div>
            ) : (
                <Label htmlFor={id} className="cursor-pointer block w-full">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors flex flex-col items-center justify-center h-40">
                        <div className="flex flex-col items-center gap-2 text-gray-700 mb-2">
                            <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                                <Upload className="h-5 w-5 text-gray-600" />
                            </div>
                            <span className="font-Urbanist text-center">{label}</span>
                            <p className="text-xs text-gray-500 font-Urbanist text-center mt-1 max-w-xs">
                                Accepted formats: PNG, JPG (max 5MB)
                            </p>
                        </div>
                    </div>
                </Label>
            )}
            <Input
                id={id}
                type="file"
                accept={accept}
                onChange={onChange}
                className="hidden"
                disabled={isUploading}
            />
        </div>
    );

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(`File size exceeds 5MB limit`);
            return;
        }

        try {
            setUploadingFeaturedImage(true);
            
            console.log(`Uploading file:`, file.name);
            
            const result = await uploadFile(file);
            console.log("Upload result:", result);

            if (result.success) {
                setFeaturedImageUrl(result.data.url);
                setFormData(prev => ({
                    ...prev,
                    featuredImage: result.data.url
                }));
                toast.success('Featured image uploaded successfully!');
            } else {
                toast.error(result.message || 'Failed to upload file');
            }
        } catch (error) {
            console.error("Error in file upload:", error);
            toast.error('Failed to upload file: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setUploadingFeaturedImage(false);
            e.target.value = '';
        }
    };

    const validateForm = () => {
        if (activeSection === 'basic' && 
            (!formData.title.trim() || !formData.moduleLeader.trim() || !formData.category.trim())) {
            toast.error("Please fill all required fields in Basic Information");
            return false;
        }
        
        return true;
    };

    const navigationTabs: NavigationTab[] = [
        { id: 'basic', label: 'Basic Info', icon: <Book size={20} /> },
        { id: 'description', label: 'Description', icon: <Layout size={20} /> },
        { id: 'highlights', label: 'Highlights', icon: <ListChecks size={20} /> },
        { id: 'formats', label: 'Learning Formats', icon: <Users size={20} /> },
        { id: 'curriculum', label: 'Curriculum', icon: <Clock size={20} /> },
    ];

    const goToNextSection = () => {
        if (!validateForm()) return;
        
        const currentIndex = navigationTabs.findIndex(tab => tab.id === activeSection);
        if (currentIndex < navigationTabs.length - 1) {
            setActiveSection(navigationTabs[currentIndex + 1].id);
            window.scrollTo(0, 0);
        }
    };

    const goToPreviousSection = () => {
        const currentIndex = navigationTabs.findIndex(tab => tab.id === activeSection);
        if (currentIndex > 0) {
            setActiveSection(navigationTabs[currentIndex - 1].id);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);

        try {
            const payload = {
                ...formData,
                description: formData.description.filter(item => item.trim() !== ''),
                courseHighlights: formData.courseHighlights.filter(item => item.trim() !== ''),
                learningFormat: formData.learningFormat.filter(item => item.name.trim() !== ''),
                curriculum: formData.curriculum.filter(item => item.title.trim() !== ''),
                image: featuredImageUrl || formData.featuredImage
            };

            await createCourse(payload);
            toast.success("Course created successfully!");
            
            setFormData({
                title: '',
                description: [''],
                teachersCount: 1,
                courseHighlights: [''],
                overallHours: 0,
                moduleLeader: '',
                category: '',
                learningFormat: [{ name: '', description: '' }],
                price: 0,
                curriculum: [{ title: '', duration: 0, description: '' }],
                featuredImage: '',
            });
            setFeaturedImageUrl("");
            setActiveSection('basic');
        } catch (error) {
            console.error('Error creating course:', error);
            toast.error("Failed to create course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const progress = ((navigationTabs.findIndex(tab => tab.id === activeSection) + 1) / navigationTabs.length) * 100;

    return (
        <div className="w-full mx-auto py-8 px-10 bg-white">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-Urbanist font-bold text-black mb-2">Course Creator</h1>
                <p className="text-gray-700 font-Urbanist">Design and publish professional learning experiences for your students</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-Urbanist font-medium text-black">Progress</span>
                    <span className="text-sm font-Urbanist font-medium text-black">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-black h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
            
            <Card className="border shadow-lg rounded-xl overflow-hidden bg-white">
                <CardHeader className="border-b bg-white pb-4">
                    <CardTitle className="text-2xl font-Urbanist text-black">Create New Course</CardTitle>
                    <CardDescription className="text-gray-700 mb-6 font-Urbanist">
                        Fill in the details below to create a new course
                    </CardDescription>
                    
                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-1 mt-2 border-b overflow-x-auto no-scrollbar pb-1">
                        {navigationTabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-3 text-sm font-Urbanist transition-all rounded-t-lg whitespace-nowrap
                                ${activeSection === tab.id 
                                    ? 'text-black font-medium border-b-2 border-black bg-gray-50' 
                                    : index < navigationTabs.findIndex(t => t.id === activeSection)
                                        ? 'text-black bg-gray-50 opacity-90' 
                                        : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 mr-2">
                                    {index < navigationTabs.findIndex(t => t.id === activeSection)
                                        ? <Check size={14} className="text-green-600" />
                                        : tab.icon
                                    }
                                </div>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </CardHeader>
                
                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Section */}
                        {activeSection === 'basic' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="border-b pb-2 mb-6">
                                    <h2 className="text-xl font-Urbanist text-black mb-1">Basic Information</h2>
                                    <p className="text-sm font-Urbanist text-gray-600">Essential details about your course</p>
                                </div>
                            
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="title" className="text-black font-Urbanist font-medium flex items-center">
                                            Course Title <span className="text-red-500 ml-1">*</span>
                                            <div className="ml-2 cursor-help group relative">
                                                <Info size={14} className="text-gray-400" />
                                                <div className="absolute left-6 top-0 w-64 p-2 bg-black text-white text-xs font-Urbanist rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                                    Make it clear and compelling for better student engagement
                                                </div>
                                            </div>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                            placeholder="e.g., Advanced JavaScript Masterclass"
                                            required
                                        />
                                    </div>

                                    {/* Featured Image Upload Section */}
                                    <div className="space-y-3 col-span-2">
                                        <Label className="text-black font-Urbanist font-medium flex items-center">
                                            Featured Image <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        
                                        {featuredImageUrl ? (
                                            <div className="mt-3 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                                <div className="relative">
                                                    <div className="bg-white p-2 h-48 flex items-center justify-center overflow-hidden">
                                                        <Image
                                                            src={featuredImageUrl}
                                                            alt="Featured Preview"
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="absolute top-2 right-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setFeaturedImageUrl("");
                                                                setFormData(prev => ({ ...prev, featuredImage: "" }));
                                                            }}
                                                            className="bg-white/90 text-red-500 hover:text-red-700 hover:bg-white rounded-full h-8 w-8 p-0 flex items-center justify-center shadow-sm"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white border-t border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <ImageIcon className="h-4 w-4 text-gray-500" />
                                                            <p className="text-sm font-Urbanist text-gray-700 truncate">
                                                                {featuredImageUrl.split('/').pop()}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setFeaturedImageUrl("");
                                                                setFormData(prev => ({ ...prev, featuredImage: "" }));
                                                            }}
                                                            className="h-8 text-xs bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Replace
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <FileUploadInput
                                                id="featuredImage"
                                                onChange={handleFileUpload}
                                                isUploading={uploadingFeaturedImage}
                                                accept="image/*"
                                                label="Upload Course Image"
                                            />
                                        )}
                                        
                                        <p className="text-sm font-Urbanist text-gray-500 mt-1">Upload an eye-catching image that represents your course (recommended: 1200x630px)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="moduleLeader" className="text-black font-medium flex items-center">
                                            Module Leader <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Input
                                            id="moduleLeader"
                                            name="moduleLeader"
                                            value={formData.moduleLeader}
                                            onChange={handleInputChange}
                                            className="border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                            placeholder="Lead instructor's full name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-black font-medium flex items-center">
                                            Category <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Input
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                            placeholder="e.g., Programming, Business, Design"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="teachersCount" className="text-black font-medium">
                                            Number of Teachers
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="teachersCount"
                                                name="teachersCount"
                                                type="number"
                                                min="1"
                                                value={formData.teachersCount}
                                                onChange={handleInputChange}
                                                className="pl-10 border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                                required
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                <Users size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="overallHours" className="text-black font-medium">
                                            Total Hours
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="overallHours"
                                                name="overallHours"
                                                type="number"
                                                min="0"
                                                value={formData.overallHours}
                                                onChange={handleInputChange}
                                                className="pl-10 border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                                required
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                <Clock size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-black font-medium">
                                            Price (NRP)
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                className="pl-10 border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                                required
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                <Coins size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Description Section */}
                        {activeSection === 'description' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="border-b pb-2 mb-6">
                                    <h2 className="text-xl font-Urbanist text-black mb-1">Course Description</h2>
                                    <p className="text-sm font-Urbanist text-gray-600">What students will learn from this course</p>
                                </div>
                            
                                <div className="space-y-4">
                                    {formData.description.map((item, index) => (
                                        <div key={index} className="flex gap-2 group relative">
                                            <div className="flex-grow">
                                                <Textarea
                                                    value={item}
                                                    onChange={(e) => handleArrayChange('description', index, e.target.value)}
                                                    placeholder={`Description point ${index + 1} - What will students learn?`}
                                                    className="border-gray-300 focus:border-black focus:ring-black rounded-lg min-h-[120px] text-black"
                                                />
                                            </div>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeArrayItem('description', index)}
                                                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 bg-white rounded-full shadow-md h-8 w-8"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addArrayItem('description')}
                                        className="mt-2 border-dashed border-gray-300 text-black hover:bg-gray-50 transition-all group"
                                    >
                                        <Plus size={16} className="mr-2 group-hover:scale-125 transition-transform" /> Add Description Point
                                    </Button>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                                    <h3 className="text-sm font-Urbanist font-medium text-black mb-2 flex items-center">
                                        <Info size={16} className="mr-2 text-gray-500" /> Tips for great course descriptions
                                    </h3>
                                    <ul className="text-sm font-Urbanist text-gray-600 space-y-1 list-disc pl-5">
                                        <li>Focus on outcomes and what students will be able to accomplish</li>
                                        <li>Include specific skills they will develop</li>
                                        <li>Mention target audience and prerequisites</li>
                                        <li>Keep each point clear and concise</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Course Highlights */}
                        {activeSection === 'highlights' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="border-b pb-2 mb-6">
                                    <h2 className="text-xl font-Urbanist text-black mb-1">Course Highlights</h2>
                                    <p className="text-sm font-Urbanist text-gray-600">Key selling points that make your course special</p>
                                </div>
                            
                                <div className="space-y-4">
                                    {formData.courseHighlights.map((item, index) => (
                                        <div key={index} className="flex gap-2 group items-center relative">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-black font-medium">
                                                {index + 1}
                                            </div>
                                            <div className="flex-grow">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => handleArrayChange('courseHighlights', index, e.target.value)}
                                                    placeholder={`Highlight ${index + 1} - e.g., "24/7 Support" or "Industry Recognition"`}
                                                    className="border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                                />
                                            </div>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeArrayItem('courseHighlights', index)}
                                                    className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addArrayItem('courseHighlights')}
                                        className="mt-4 border-dashed border-gray-300 text-black hover:bg-gray-50 transition-all group"
                                    >
                                        <Plus size={16} className="mr-2 group-hover:scale-125 transition-transform" /> Add Highlight
                                    </Button>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
                                        <h3 className="text-sm font-Urbanist font-medium text-black mb-2">Highlight Examples</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-Urbanist text-gray-600">
                                            <div className="flex items-center">
                                                <Check size={14} className="mr-2 text-green-500" /> Certificate of Completion
                                            </div>
                                            <div className="flex items-center">
                                                <Check size={14} className="mr-2 text-green-500" /> 1-on-1 Mentoring
                                            </div>
                                            <div className="flex items-center">
                                                <Check size={14} className="mr-2 text-green-500" /> Real-world Projects
                                            </div>
                                            <div className="flex items-center">
                                                <Check size={14} className="mr-2 text-green-500" /> Lifetime Access
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Learning Formats */}
                        {activeSection === 'formats' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="border-b pb-2 mb-6">
                                    <h2 className="text-xl font-Urbanist text-black mb-1">Learning Formats</h2>
                                    <p className="text-sm font-Urbanist text-gray-600">How students will engage with your content</p>
                                </div>
                            
                                <div className="space-y-6">
                                    {formData.learningFormat.map((format, index) => (
                                        <div 
                                            key={index} 
                                            className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-300 group relative"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-Urbanist text-lg text-black">Format {index + 1}</h3>
                                                {index > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeLearningFormat(index)}
                                                        className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-red-500 hover:bg-red-50 rounded-full shadow-md h-8 w-8 p-0"
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-black font-Urbanist">Format Name</Label>
                                                    <Input
                                                        value={format.name}
                                                        onChange={(e) => handleLearningFormatChange(index, 'name', e.target.value)}
                                                        placeholder="e.g., Video Lectures, Live Workshops"
                                                        className="border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-black font-Urbanist">Format Description</Label>
                                                    <Input
                                                        value={format.description}
                                                        onChange={(e) => handleLearningFormatChange(index, 'description', e.target.value)}
                                                        placeholder="Brief description of this learning format"
                                                        className="border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addLearningFormat}
                                        className="mt-2 border-dashed border-gray-300 text-black hover:bg-gray-50 transition-all w-full py-6 group"
                                    >
                                        <Plus size={18} className="mr-2 group-hover:scale-125 transition-transform" /> Add Learning Format
                                    </Button>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h3 className="text-sm font-Urbanist font-medium text-black mb-2">Common Learning Formats</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm font-Urbanist">
                                            <div>
                                                <p className="font-medium text-black">Video Lectures</p>
                                                <p className="text-gray-600">Pre-recorded lessons students can watch anytime</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-black">Live Workshops</p>
                                                <p className="text-gray-600">Real-time interactive sessions</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-black">Practical Assignments</p>
                                                <p className="text-gray-600">Hands-on projects to apply knowledge</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-black">Group Discussions</p>
                                                <p className="text-gray-600">Collaborative learning opportunities</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Curriculum */}
                        {activeSection === 'curriculum' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="border-b pb-2 mb-6">
                                    <h2 className="text-xl text-black mb-1">Course Curriculum</h2>
                                    <p className="text-sm text-gray-600">Structure your course content</p>
                                </div>
                            
                                <div className="space-y-6">
                                    {formData.curriculum.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-300 group relative"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 text-white font-medium">
                                                        {index + 1}
                                                    </div>
                                                    <h3 className="font-medium text-lg text-black ml-3">Module {index + 1}</h3>
                                                </div>
                                                {index > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeCurriculumItem(index)}
                                                        className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-red-500 hover:bg-red-50 rounded-full shadow-md h-8 w-8 p-0"
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-black">Module Title</Label>
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => handleCurriculumChange(index, 'title', e.target.value)}
                                                        placeholder="e.g., Introduction to JavaScript Fundamentals"
                                                        className="border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-black font-Urbanist">Duration (hours)</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={item.duration}
                                                            onChange={(e) => handleCurriculumChange(index, 'duration', e.target.value)}
                                                            placeholder="Duration in hours"
                                                            className="pl-10 border-gray-300 focus:border-black focus:ring-black rounded-lg text-black"
                                                        />
                                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                            <Clock size={18} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="text-black font-Urbanist">Module Description</Label>
                                                    <Textarea
                                                        value={item.description}
                                                        onChange={(e) => handleCurriculumChange(index, 'description', e.target.value)}
                                                        placeholder="Describe what students will learn in this module"
                                                        className="border-gray-300 focus:border-black focus:ring-black rounded-lg min-h-[80px] text-black"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addCurriculumItem}
                                        className="mt-2 border-dashed border-gray-300 text-black hover:bg-gray-50 transition-all w-full py-6 group"
                                    >
                                        <Plus size={18} className="mr-2 group-hover:scale-125 transition-transform" /> Add Curriculum Module
                                    </Button>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h3 className="text-sm font-Urbanist font-medium text-black mb-2 flex items-center">
                                            <Info size={16} className="mr-2 text-gray-500" /> Tips for structuring your curriculum
                                        </h3>
                                        <ul className="text-sm font-Urbanist text-gray-600 space-y-1 list-disc pl-5">
                                            <li>Start with foundational concepts before advanced topics</li>
                                            <li>Keep module durations manageable (1-2 hours is often ideal)</li>
                                            <li>Include practical exercises with each module</li>
                                            <li>End each module with a summary or assessment</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Controls - Always visible */}
                        <div className="flex justify-between items-center pt-8 border-t mt-8">
                            <div className="text-sm font-medium text-black">
                                {activeSection !== navigationTabs[0].id && (
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={goToPreviousSection}
                                        className="mr-4 border-gray-300 hover:border-black hover:bg-gray-50 text-black transition-all"
                                    >
                                        <ChevronLeft size={16} className="mr-2" /> Previous
                                    </Button>
                                )}
                                
                                {activeSection !== navigationTabs[navigationTabs.length - 1].id && (
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={goToNextSection}
                                        className="border-gray-300 hover:border-black hover:bg-gray-50 text-black transition-all"
                                    >
                                        Next <ChevronRight size={16} className="ml-2" />
                                    </Button>
                                )}
                            </div>
                            
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="bg-black hover:bg-gray-800 text-white px-6 shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                            >
                                {loading ? (
                                    <>Creating Course<span className="loading-dots ml-2"></span></>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        Create Course
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            
            {/* Custom Styling */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                @keyframes dots {
                    0%, 20% { content: '.'; }
                    40% { content: '..'; }
                    60%, 100% { content: '...'; }
                }
                
                .loading-dots::after {
                    content: '.';
                    animation: dots 1.5s linear infinite;
                }
            `}</style>
            
            <Toaster  />
        </div>
    );
}