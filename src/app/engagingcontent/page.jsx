import Layout from "@/app/components/Layout";
import ImageUpload from '@/app/components/ImageUpload';
import EmbedVideo from '@/app/components/EmbedVideo';

export default function engagingcontent() {

    const handleImageUpload = (file) => {
        // Handle file upload here
        console.log('File uploaded:', file);
      };
      
  return (
    <main>
        <Layout>
        <div>
            <div className="text-4xl">Upload Image</div>
        </div>
        <div className="pt-10">
            <ImageUpload />
        </div>
        <div>
            <div className="text-4xl">Upload Video</div>
        </div>
        <div className="pt-10">
            <EmbedVideo />
        </div>
        </Layout>
    </main>
  );
}