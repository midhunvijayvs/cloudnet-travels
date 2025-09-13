import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import './LeftNavbar.scss';
import API from '../../../API';
//import 'simplebar-react/dist/simplebar.min.css';
import '..//css/vendors/scrollbar.css'


export default function LeftNavbar({ isLoggedIn }) {

  const navigate = useNavigate();
  const location = useLocation();

  const [navList, setNavList] = useState([])
  const [structuredNavList, setStructuredNavList] = useState([]);

  const [navListOpen, setNavListOpen] = useState(false)
  const [activeItemId, setActiveItemId] = useState(null);
  const [activeSubItemId, setActiveSubItemId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({
    Restaurant: true,
    Grocery: true,
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };


  // const loadData = () => {
  //   if (isLoggedIn) {
  //     API.get(`/user/frontend-categories/`)
  //       .then(response => {
  //         const responseNavList = response.data
  //         setNavList(responseNavList);
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   } else {
  //     setNavList([])
  //   }

  // }
  const loadData = () => {
    setNavList([
      { label: "Bookings", icon_class: "ri-calendar-check-line", items: [{ id: 1, label: "Booking list", frontend_url: "/admin/booking/list" }] },
      { label: "Agencies", icon_class: "ri-user-line", items: [{ label: "Agency List", frontend_url: "/admin/agency/list" }, { label: "Create New Agency", frontend_url: "/admin/agency/create" }] },
      { label: "Settings", icon_class: "ri-settings-3-line", items: [{ label: "General Settings", frontend_url: "/admin/settings/general-settings" }, ] },

    ])
  }
  useEffect(() => {
    loadData();
  }, [isLoggedIn])

  // Check if the current URL matches the item's URL
  const normalizePath = (path) => path.replace(/\/+$/, ''); // Remove trailing slashes

  const isActive = (itemUrl) => {
    if (!itemUrl) return false;
    return normalizePath(location.pathname) === normalizePath(itemUrl);
  };

  const isSubItemActive = (subItems = []) => {
    return subItems.some(subItem => isActive(subItem.frontend_url));
  };


  const handleNavClick = (navItem, navId) => {
    if (navItem.items && navItem.items.length > 0) {
      const newActiveItemId = navId === activeItemId ? null : navId;
      setActiveItemId(newActiveItemId);
      setActiveSubItemId(null);
    } else {
      navigate(navItem.frontend_url);
      setActiveItemId(navId);
      setActiveSubItemId(null);
    }
  };


  const handleSubNavClick = (subItem) => {
    setActiveSubItemId(subItem.id);
    navigate(subItem.frontend_url);
  };

  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 992);  // Track if leftnavbar is collapsed
  // Apply class to parent element when isCollapsed changes
  useEffect(() => {
    const bodyWrapper = document.querySelector('.admin-layout');
    const sidebarWrapper = document.querySelector('.left-navbar');

    // console.log('isCollapsed inside useEffect:', isCollapsed);  // Log here

    if (bodyWrapper) {
      if (isCollapsed) {
        bodyWrapper.classList.add('collapsed-sidebar');
      } else {
        bodyWrapper.classList.remove('collapsed-sidebar');
      }
    }

    if (sidebarWrapper) {
      if (isCollapsed) {
        sidebarWrapper.classList.add('collapsed');
      } else {
        sidebarWrapper.classList.remove('collapsed');
      }
    }
  }, [isCollapsed, navListOpen]);



  const generateNavId = (navItem, index) => navItem.id || `${navItem.label}-${index}`;


  useEffect(() => {
    console.log("navList", navList)
  }, [navList])

  return (

    <div className={`left-navbar ${isCollapsed ? 'collapsed' : ''}`} onMouseEnter={() => {
      if (window.innerWidth > 992 && isCollapsed) {
        setIsCollapsed(false);
      }
    }} >

      <div className="logo-wrapper">
        <a href="/admin" data-bs-original-title="" title="">
          <img className="img-fluid for-white full-logo" src="/images/admin-panel/logo/full-white.png" alt="logo"></img>
        </a>

        <div className="navbar-toggle-button" onClick={() => setIsCollapsed(!isCollapsed)} >
          {isCollapsed ?
            <img className="img-fluid main-logo" src="/images/admin-panel/logo/logo.svg" alt="logo"></img>
            :
            <i className="ri-apps-2-line status_toggle middle sidebar-toggle"></i>
          }
        </div>
      </div>



      <ul className="menu-list">
        {navList.map((navItem, index) => {
          const navId = generateNavId(navItem, index);

          return (
            <li key={navId} className={`menu-item ${isActive(navItem.frontend_url) || isSubItemActive(navItem.items) ? 'active' : ''}`}
              onClick={() => handleNavClick(navItem, navId)}>
            
              <div className='main'>
                <i class={`icon ${navItem.icon_class} `}></i>
                <span className="label">{navItem.label}</span>
                {navItem.items?.length > 0 && (
                  <i className={`ri-arrow-${(isActive(navItem.frontend_url) || isSubItemActive(navItem.items)) ? 'down' : 'right'}-s-line dropdown-button`}></i>
                )}
              </div>


              {navItem.items && (
                <ul className={`submenu-list ${activeItemId === navId ? "open" : ""}`}>
                  {navItem.items.map((subItem) => (
                    <li key={subItem.id}  className={`submenu-item ${isActive(subItem.frontend_url) ? 'active' : ''}`}
                        onClick={() => handleSubNavClick(subItem)}>
                  <i className={`ri-checkbox-blank-circle-line icon`}></i>
                      <div className='label'>{subItem.label}</div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })
        }


      </ul>


      <div className="right-arrow" id="right-arrow">
        <i data-feather="arrow-right"></i>
      </div>


    </div>

  )
}
