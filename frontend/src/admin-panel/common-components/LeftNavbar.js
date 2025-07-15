import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import './LeftNavbar.scss';
import API from '../../API';
//import 'simplebar-react/dist/simplebar.min.css';
import '../common-components/css/vendors/scrollbar.css'


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


  const loadData = () => {
    if (isLoggedIn) {
      API.get(`/user/frontend-categories/`)
        .then(response => {
          const responseNavList = response.data
          setNavList(responseNavList);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      setNavList([])
    }

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

  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 992);  // Track if sidebar is collapsed
  // Apply class to parent element when isCollapsed changes
  useEffect(() => {
    const bodyWrapper = document.querySelector('.admin-layout');
    const sidebarWrapper = document.querySelector('.left-navbar.sidebar-wrapper');

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


useEffect(()=>{
  console.log("navList",navList)
},[navList])
  return (

    <div className={`left-navbar sidebar-wrapper ${isCollapsed ? 'collapsed' : ''}`} >
      <div>
        <div className="logo-wrapper logo-wrapper-center">
          <a href="/admin" data-bs-original-title="" title="">
            <img className="img-fluid for-white full-logo" src="/images/admin-panel/logo/full-white.svg" alt="logo"></img>
          </a>
          <div className="back-btn"
            onClick={() => {
              console.log('clicked');
              setNavListOpen(!navListOpen)
            }} >
            <i className="fa fa-angle-left"></i>
          </div>
          <div className="toggle-sidebar" onClick={() => setIsCollapsed(!isCollapsed)} >
            {isCollapsed ?
              <img className="img-fluid main-logo" src="/images/admin-panel/logo/logo.svg" alt="logo"></img>
              :
              <i className="ri-apps-2-line status_toggle middle sidebar-toggle"></i>
            }
          </div>
        </div>
        <div className="logo-icon-wrapper">
          <a href="/admin">
            <img className="img-fluid main-logo" src="/images/admin-panel/logo/logo.png" alt="logo"></img>
          </a>
        </div>
        <nav className="sidebar-main"
          onMouseEnter={() => {
            if (window.innerWidth > 992 && isCollapsed) {
              setIsCollapsed(false);
            }
          }}
        >
          <div className="left-arrow" id="left-arrow">
            <i data-feather="arrow-left"></i>
          </div>

          <div id="sidebar-menu" className=''>
            <ul className="sidebar-links" id="simple-bar">
              <li className="back-btn"></li>

              {navList.map((navItem, index) => {
                      const navId = generateNavId(navItem, index);

                      return (
                        <li key={navId} className={`sidebar-list`}>
                          <a
                            className={`sidebar-link sidebar-title link-na ${isActive(navItem.frontend_url) || isSubItemActive(navItem.items) ? 'active' : ''}`}
                            onClick={() => handleNavClick(navItem, navId)}
                          >
                            <img src={navItem.icon_image_url} alt="" className="sidebar-icon" />
                            <span className="menu-label">{navItem.label}</span>
                            {navItem.items?.length > 0 && (
                              <div className="according-menu">
                                <i className={`ri-arrow-${(isActive(navItem.frontend_url) || isSubItemActive(navItem.items)) ? 'down' : 'right'}-s-line`}></i>
                              </div>
                            )}
                          </a>

                          {navItem.items && activeItemId === navId && (
                            <ul className="sidebar-submenu">
                              {navItem.items.map((subItem) => (
                                <li key={subItem.id}>
                                  <a
                                    className={isActive(subItem.frontend_url) ? 'active' : ''}
                                    onClick={() => handleSubNavClick(subItem)}
                                  >
                                    {subItem.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })
}
               
            
            </ul>
          </div>

          <div className="right-arrow" id="right-arrow">
            <i data-feather="arrow-right"></i>
          </div>
        </nav>
      </div>
    </div>





  )
}
