// frontend/src/components/FileGallery.tsx
import React, { useState } from 'react';
import type { File } from '../api/api';

interface FileGalleryProps {
    files: File[];
    onDeleteFiles: (fileIds: number[]) => void;
    onBack: () => void;
}

const FileGallery: React.FC<FileGalleryProps> = ({ files, onDeleteFiles, onBack }) => {
    const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());

    const toggleFileSelection = (fileId: number) => {
        const newSelection = new Set(selectedFiles);
        if (newSelection.has(fileId)) {
            newSelection.delete(fileId);
        } else {
            newSelection.add(fileId);
        }
        setSelectedFiles(newSelection);
    };

    const handleDeleteSelected = () => {
        if (selectedFiles.size === 0) return;
        if (confirm(`Delete ${selectedFiles.size} selected file(s)?`)) {
            onDeleteFiles(Array.from(selectedFiles));
            setSelectedFiles(new Set());
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'photo':
                return '🖼️';
            case 'video':
                return '🎥';
            case 'audio':
                return '🎵';
            case 'document':
                return '📄';
            default:
                return '📎';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center hover:bg-blue-600 px-3 py-2 rounded"
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
                {selectedFiles.size > 0 && (
                    <button
                        onClick={handleDeleteSelected}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium"
                    >
                        🗑️ Delete ({selectedFiles.size})
                    </button>
                )}
            </div>

            {/* File Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg className="w-20 h-20 mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-lg">No files in this folder</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => toggleFileSelection(file.id)}
                                className={`relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden ${selectedFiles.has(file.id) ? 'ring-4 ring-blue-500' : ''
                                    }`}
                            >
                                {/* Selection Checkbox */}
                                <div className="absolute top-2 right-2 z-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedFiles.has(file.id)}
                                        onChange={() => toggleFileSelection(file.id)}
                                        className="w-5 h-5 cursor-pointer"
                                        aria-label={`Select ${file.name}`}
                                        title={`Select ${file.name}`}
                                    />

                                </div>

                                {/* File Preview */}
                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    <span className="text-6xl">{getFileIcon(file.type)}</span>
                                </div>

                                {/* File Info */}
                                <div className="p-3">
                                    <p className="text-sm font-medium text-gray-800 truncate" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileGallery;
