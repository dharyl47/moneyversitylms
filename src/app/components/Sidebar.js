import Link from 'next/link';
// import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
        
    <div className="flex flex-1 ">
        <nav className="w-64 bg-card p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <ul className="space-y-2">
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Dashboard</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Inbox</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Users</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Pages</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Docs</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Components</a></li>
                <li><a href="#" className="block p-2 rounded hover:bg-secondary text-secondary-foreground">Help</a></li>
            </ul>
        </nav>

        <main className="flex-1 p-4">
            
        </main>
    </div>
</div>
  );
};

export default Sidebar;