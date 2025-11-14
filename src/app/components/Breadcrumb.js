"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb = ({ items }) => {
  const pathname = usePathname();

  // If no items provided, generate from pathname
  const breadcrumbItems = items || (() => {
    const paths = pathname.split('/').filter(Boolean);
    const generated = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      generated.push({ label, href: currentPath });
    });
    
    return generated;
  })();

  return (
    <nav className="flex items-center" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span
                className="mx-2 text-[#282828]"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                }}
              >
                /
              </span>
            )}
            {index === breadcrumbItems.length - 1 ? (
              <span
                className="text-[#282828]"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                }}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-[#282828] hover:text-gray-900"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                }}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

