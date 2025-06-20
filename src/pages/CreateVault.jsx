import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const themeColors = [
  { name: 'Sepia', value: 'sepia' },
  { name: 'Vintage Rose', value: 'vintage' },
  { name: 'Sage', value: 'sage' },
  { name: 'Ocean', value: 'ocean' },
];

function CreateVault() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [themeColor, setThemeColor] = useState('sepia');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('themeColor', themeColor);
    if (coverPhoto) {
      formData.append('coverPhoto', coverPhoto);
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/vaults`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Vault created successfully!');
      navigate(`/vaults/${response.data.vault._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create vault');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="vintage-title mb-2">Create a New Vault</h1>
          <p className="handwritten-text text-vintage-600">
            A new chapter of memories awaits
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-vintage-800 mb-1">
              Vault Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-vintage-800 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-vintage-800 mb-1">
              Theme Color
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setThemeColor(color.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    themeColor === color.value
                      ? `border-${color.value}-500 bg-${color.value}-50`
                      : 'border-transparent hover:border-vintage-200'
                  }`}
                >
                  <div className={`h-4 w-full rounded bg-${color.value}-500 mb-2`} />
                  <span className="text-sm text-vintage-800">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-vintage-800 mb-1">
              Cover Photo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-vintage-200 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Cover preview"
                      className="mx-auto h-32 w-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverPhoto(null);
                        setPreviewUrl('');
                      }}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <PhotoIcon className="mx-auto h-12 w-12 text-vintage-400" />
                    <div className="flex text-sm text-vintage-600">
                      <label
                        htmlFor="cover-photo"
                        className="relative cursor-pointer rounded-md font-medium text-sepia-500 hover:text-sepia-600"
                      >
                        <span>Upload a photo</span>
                        <input
                          id="cover-photo"
                          name="cover-photo"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handlePhotoChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-vintage-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Creating vault...' : 'Create Vault'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateVault; 