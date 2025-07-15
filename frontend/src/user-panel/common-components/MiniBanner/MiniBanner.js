import React, { useContext, useEffect, useState } from 'react'

import './MiniBanner.scss'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../authentication/pages/UserContext.js';

import API from "../../../API.js"
const MiniBanner = ({ title, breadcrumb }) => {
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    setIsLoading(true)

  }, [])

  const { loginLogo, setLoginlogo, setIsLoggedIn, isLoggedIn } = useContext(UserContext);


  return (
    <section className="mini-banner">
      <div className="inner">
        <h2>{title}</h2>
        <ol className='breadcrumb' aria-label="breadcrumb">
          <li className="breadcrumb-item">
            <a onClick={() => navigate(breadcrumb[0].link)}><i className="ri-home-line"></i>{breadcrumb[0].name}</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <a onClick={() => navigate(breadcrumb[1].link)}><i className="ri-home-line"></i>{breadcrumb[1].name}</a>

          </li>
        </ol>
      </div>
    </section>
  )
}
export default MiniBanner