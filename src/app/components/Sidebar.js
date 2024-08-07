import Link from 'next/link';
// import styles from './Sidebar.module.css';

const Sidebar = () => {
  

  return (
    <div className="flex flex-col h-screen bg-background text-foreground mt-16">
    <div className="flex flex-1">
        <nav className="w-64 bg-card p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <ul className="space-y-2">
                <li><a href="/dashboard" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Home</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Chat Data</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Calculator</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Reports</a></li>
                <li><a href="/lms" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">LMS</a></li>
                <li><a href="/engagingcontent" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Engaging Content</a></li>
            </ul>
        </nav>
    </div>
</div>
  );
};

export default Sidebar;