import React, { useState } from 'react';
import { FiHome, FiSearch, FiList, FiRadio, FiSettings, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { usePathname } from 'next/navigation'
 
/* npm install react-icons --save */

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };


  function GetURL() {
    const pathname = usePathname()
    return pathname;
  }

  let homeSelect = '', dbSelect = '', schSelect = '', logSelect = '';
  if(GetURL() == '/'){  homeSelect = 'bg-blue-700';  }
  if(GetURL() == '/setting'){  dbSelect = 'bg-blue-700';  }
  if(GetURL() == '/logs'){ logSelect = 'bg-blue-700';   }
  if(GetURL() == '/schedule'){ schSelect = 'bg-blue-700';  }

  const menuItems = [
    { id: 'home', icon: <FiHome />, label: 'Home', url: '/', highlight: homeSelect },
    { id: 'dbsetting', icon: <FiSettings />, label: 'Database Settings', url: '/setting', highlight: dbSelect },
    { id: 'schedulesetting', icon: <FiSettings />, label: 'Schedule Setting', url: '/schedule', highlight: schSelect },
    { id: 'logrecords', icon: <FiList />, label: 'Log records', url: '/logs', highlight: logSelect },    
  ];




  return (
    <div
      className={`bg-gray-900 text-white absolute h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
     >
      <div className="flex justify-end p-4">
        <button
          onClick={toggleSidebar}
          className="text-neon-blue hover:text-neon-pink transition-colors duration-200"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      <nav>
        <ul className="space-y-4">
          {menuItems.map((item, index) => ( 
            
            <li key={index}>
              <a id={item.id} 
                href={item.url}
                className={`flex items-center px-4 py-2 text-sm font-medium ${item.highlight} rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-neon-blue transition-colors duration-200 ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                }`}
              >
                <span className="text-xl text-neon-blue">{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-neon-pink">{item.label}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
