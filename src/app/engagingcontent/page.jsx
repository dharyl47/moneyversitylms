import Layout from "@/app/components/Layout";
import ImageUpload from '@/app/components/ImageUpload';
import EmbedVideo from '@/app/components/EmbedVideo';

export default function EngagingContent() {
    return (
        <main className="bg-gray-900 min-h-screen text-white">
            <Layout>
                <div className="max-w-7xl mx-auto p-6">
                    <div className="mb-8 flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
                            <ImageUpload />
                        </div>
                        <div className="w-full md:w-1/2">
                            <h2 className="text-2xl font-semibold mb-4">Image Preview</h2>
                            <div className="bg-gray-800 p-4 rounded-lg shadow-md h-72 flex items-center justify-center">
                                <img
                                    src="https://i.ibb.co/MDvDj7Y/your-image.jpg"
                                    alt="Default Preview"
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-8 flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-2xl font-semibold mb-4">Upload Video</h2>
                            <EmbedVideo />
                        </div>
                        <div className="w-full md:w-1/2">
                            <h2 className="text-2xl font-semibold mb-4">Video Preview</h2>
                            <div className="bg-gray-800 p-4 rounded-lg shadow-md h-72">
                                <iframe
                                    src="https://www.youtube.com/embed/cMoaGEpffds"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </main>
    );
}
