import React, { useState } from 'react';

interface SidebarMenuProps {
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ activeTab, onSelectTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Danh sách đầy đủ các mục trong Web App CoreZ
  const menuItems = [
    { id: 'space4d', label: 'Không Gian 4D', icon: '🌐' },
    { id: 'self_discovery', label: 'Trắc Nghiệm Bản Ngã', icon: '⚡' },
    { id: 'mood', label: 'Nhật Ký Cảm Xúc', icon: '📈' },
    { id: 'journaling', label: 'Góc Phản Tư', icon: '📖' },
    { id: 'gamification', label: 'Kỷ Luật CoreZ', icon: '🛡️' },
    { id: 'mentor', label: 'AI Mentor & Bí Kíp', icon: '💡' },
    { id: 'gocbinhyen', label: 'Góc Bình Yên', icon: '💖' },
    { id: 'profile', label: 'Hồ Sơ Cá Nhân', icon: '👤' },
  ];

  const handleItemClick = (id: string) => {
    if (onSelectTab) onSelectTab(id);
    setIsOpen(false); // Tự động đóng menu sau khi chọn
  };

  return (
    <>
      {/* 1. NÚT 3 GẠCH CỐ ĐỊNH GÓC TRÁI MÀN HÌNH */}
      <button 
        className="fixed-menu-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Mở mục lục"
        aria-label="Mục lục"
      >
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </button>

      {/* 2. LỚP MỜ NỀN KHI MỞ MENU */}
      {isOpen && (
        <div className="menu-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* 3. KHUNG MỤC LỤC TRƯỢT TỪ BÊN TRÁI SANG */}
      <aside className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-badge">✨ CoreZ Navigation</div>
          <h3>Mục Lục Ứng Dụng</h3>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="item-icon">{item.icon}</span>
              <span className="item-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SidebarMenu;
