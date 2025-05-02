import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Image Upload Demo</h1>
        <div className="grid grid-cols-1 gap-8">
          <ImageUpload />
          <ImageGallery />
        </div>
      </div>
    </main>
  );
}