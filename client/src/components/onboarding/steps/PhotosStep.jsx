import { useRef, useState } from "react";
import { useUploadImageMutation } from "../../../features/api/apiSlice";
import { Loader2, UploadCloud, X, Camera, AlertCircle, CheckCircle2 } from "lucide-react";

const MAX_PHOTOS = 6;

const PhotosStep = ({ data, onChange }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadImageMutation] = useUploadImageMutation();

  const photos = data.photos || [];

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read image."));
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setError("");

    if (photos.length + files.length > MAX_PHOTOS) {
      setError(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      event.target.value = "";
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) {
      setError("Only image files (JPG, PNG, WEBP) are allowed.");
    }

    if (validFiles.length === 0) {
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      // 1. Convert files to Base64
      const base64List = await Promise.all(
        validFiles.map((file) => convertFileToBase64(file))
      );

      // 2. Upload each to Cloudinary via backend API
      const uploadedUrls = [];
      for (const base64 of base64List) {
        const res = await uploadImageMutation({ image: base64 }).unwrap();
        if (res?.url) {
          uploadedUrls.push(res.url);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange({
          photos: [...photos, ...uploadedUrls],
        });
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setError("Failed to upload photos to Cloudinary. Please check your connection and try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removePhoto = (index) => {
    const updated = photos.filter((_, photoIndex) => photoIndex !== index);
    onChange({
      photos: updated,
    });
    setError("");
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="relative">
        <span className="pointer-events-none absolute -top-3 right-0 text-4xl opacity-10 select-none sm:text-5xl">
          📸
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-600 ring-1 ring-inset ring-rose-100">
          <span>☁️</span> Cloudinary Secure Storage
        </span>

        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Add Your Photos
        </h3>

        <p className="mt-1.5 text-sm text-slate-500">
          Upload up to {MAX_PHOTOS} photos. Images are automatically optimized and securely hosted on Cloudinary CDN.
        </p>
      </div>

      {/* Upload Box */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
          disabled={uploading || photos.length >= MAX_PHOTOS}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || photos.length >= MAX_PHOTOS}
          className="cursor-pointer flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-rose-200 bg-gradient-to-br from-rose-50/70 via-pink-50/50 to-fuchsia-50/70 px-6 py-10 text-center transition hover:border-rose-400 hover:shadow-inner disabled:pointer-events-none disabled:opacity-50 sm:py-12 group"
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-pink-600 animate-spin mb-3" />
              <p className="text-sm font-bold text-slate-800">
                Uploading photos to Cloudinary...
              </p>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                Optimizing high-resolution images &amp; generating secure CDN links
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-500 text-white shadow-lg shadow-rose-500/30 group-hover:scale-105 transition">
                <UploadCloud size={28} />
              </div>

              <p className="text-sm font-bold text-slate-800">
                Click to Upload Photos
              </p>

              <p className="mt-1 text-xs text-slate-500">
                PNG, JPG or WEBP (Max {MAX_PHOTOS} photos) • Auto-saved to Cloudinary
              </p>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-semibold text-red-600">
          <AlertCircle size={17} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Grid */}
      {photos.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
              <Camera size={16} className="text-pink-500" />
              <span>Your Photos</span>
            </p>

            <p className="rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-xs font-bold text-rose-600">
              {photos.length} / {MAX_PHOTOS}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {photos.map((photo, index) => (
              <div
                key={`${photo}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 shadow-xs transition hover:shadow-lg"
              >
                <img
                  src={photo}
                  alt={`Profile photo ${index + 1}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />

                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="cursor-pointer absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur-sm transition hover:bg-red-600 shadow-sm"
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <X size={15} />
                </button>

                {index === 0 && (
                  <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                    <CheckCircle2 size={11} />
                    <span>Main Profile Photo</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosStep;