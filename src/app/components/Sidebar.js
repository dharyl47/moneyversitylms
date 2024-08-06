import Link from 'next/link';
// import styles from './Sidebar.module.css';

const Sidebar = () => {
  

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
        
    <div className="flex flex-1 ">
        <nav className="w-64 bg-card p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <ul className="space-y-2">
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Home</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Home</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Chat Data</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Calculator</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Reports</a></li>
                <li>
            <Link href="#" className="block p-2 rounded hover:bg-gray-200">
              LMS
            </Link>
          </li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Engaging Content</a></li>
            </ul>
        </nav>

        <main className="flex-1 p-4">
            
        </main>
    </div>
</div>
  );
};

export default Sidebar;