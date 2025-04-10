"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import {getClassMaterialsByBatchId} from "../../../../apiCalls/manageClassMaterials"
import {
    FileText,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    View
} from 'lucide-react';

interface Material {
    _id: string;
    material_id: string;
    title: string;
    description: string;
    file_url: string;
    created_at: string;
    updated_at: string;
}

interface MetaData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}


const ClassMaterialsPage: React.FC = () => {
    const router = useRouter();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [meta, setMeta] = useState<MetaData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const limit = 10;

    // Parse user cookie to get batchId
    const getUserBatchId = (): string | null => {
        try {
            const user = Cookies.get("user") || "";
            if (!user) {
                router.push("/login")
            }
            const parsedUser = JSON.parse(user)
            const batchId = parsedUser.batch;
            return batchId;

        } catch (err) {
            console.error('Error parsing user cookie:', err);
            return null;
        }
    };

    const fetchMaterials = async (page: number) => {
        try {
            setLoading(true);
            setError(null);

            const batchId = getUserBatchId();
            if (!batchId) {
                throw new Error('Batch ID not found in user data');
            }

            const result = await getClassMaterialsByBatchId(batchId, page, limit)

            setMaterials(result.materials);
            setMeta(result.meta);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch materials');
            console.error('Error fetching materials:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials(currentPage);
    }, [currentPage]);

    const handleDownload = (url: string, title: string) => {
        // Implement download logic
        const link = document.createElement('a');
        link.href = url;
        link.download = title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || (meta && newPage > meta.totalPages)) return;
        setCurrentPage(newPage);
    };

    if (loading && !materials.length) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                        <div>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold text-gray-800">Class Materials</h1>
                    <p className="text-gray-600 mt-1">
                        Access all learning materials shared for your batch
                    </p>
                </div>

                {/* Materials List */}
                <div className="divide-y divide-gray-200">
                    {materials.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No materials available for this batch
                        </div>
                    ) : (
                        materials.map((material) => (
                            <div key={material._id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-blue-50 p-3 rounded-lg">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {material.title}
                                            </h3>
                                            <button
                                                onClick={() => handleDownload(material.file_url, material.title)}
                                                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                <View className="h-4 w-4 mr-2" />
                                               View Material
                                            </button>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {material.description}
                                        </p>
                                        <div className="mt-2 text-xs text-gray-500">
                                            <span>Posted: {formatDate(material.created_at)}</span>
                                            {material.created_at !== material.updated_at && (
                                                <span className="ml-2">
                                                    (Updated: {formatDate(material.updated_at)})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing page {meta.page} of {meta.totalPages}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!meta.hasPreviousPage}
                                    className={`inline-flex items-center px-3 py-1 rounded-md border ${meta.hasPreviousPage ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!meta.hasNextPage}
                                    className={`inline-flex items-center px-3 py-1 rounded-md border ${meta.hasNextPage ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassMaterialsPage;