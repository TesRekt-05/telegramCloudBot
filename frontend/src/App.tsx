// frontend/src/App.tsx
import { useState, useEffect } from 'react';
import FolderGrid from './components/FolderGrid';
import FileGallery from './components/FileGallery';
import { getFolders, getFolderFiles, deleteFile, deleteFolder, Folder, File } from './api/api';

function App() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from URL parameter (passed from Telegram)
  const getUserId = (): number => {
    const params = new URLSearchParams(window.location.search);
    const userIdFromUrl = params.get('userId');

    if (userIdFromUrl) {
      return parseInt(userIdFromUrl);
    }

    // Fallback to your test user ID for local development
    return 7053775316; // Replace with your actual user ID
  };

  const userId = getUserId();

  // Load folders on mount
  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFolders(userId);
      setFolders(data);
    } catch (err) {
      // If failed, show helpful message about cold start
      setError('Loading... Backend is waking up (free tier). Please wait 30 seconds and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleFolderClick = async (folderId: number) => {
    try {
      setLoading(true);
      setError(null);
      const files = await getFolderFiles(folderId);
      setCurrentFiles(files);
      setCurrentFolder(folderId);
    } catch (err) {
      setError('Failed to load files');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await deleteFolder(folderId);
      await loadFolders();
    } catch (err) {
      alert('Failed to delete folder');
      console.error(err);
    }
  };

  const handleDeleteFiles = async (fileIds: number[]) => {
    try {
      await Promise.all(fileIds.map(id => deleteFile(id)));
      // Reload files
      if (currentFolder) {
        const files = await getFolderFiles(currentFolder);
        setCurrentFiles(files);
      }
    } catch (err) {
      alert('Failed to delete files');
      console.error(err);
    }
  };

  const handleBack = () => {
    setCurrentFolder(null);
    setCurrentFiles([]);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">☁️ Telegram Cloud Storage</h1>
        <p className="text-sm text-blue-100">Organize your files with unlimited storage</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {currentFolder === null ? (
              <FolderGrid
                folders={folders}
                onFolderClick={handleFolderClick}
                onDeleteFolder={handleDeleteFolder}
              />
            ) : (
              <FileGallery
                files={currentFiles}
                onDeleteFiles={handleDeleteFiles}
                onBack={handleBack}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
