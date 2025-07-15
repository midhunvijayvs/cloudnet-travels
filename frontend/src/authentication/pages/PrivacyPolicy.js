import React from 'react'
import AuthBanner from './AuthBanner'
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <>
        <div className='auth-container privacy'>
            <AuthBanner
                pageName={"privacy-policy"}
                titleWeb={"<b>Cloudnet Travels</b><br/>Restaurant"}
                titleTab={"<b>Cloudnet Travels</b> Restaurant"}
                titleMob={"<b>Cloudnet Travels</b><br/>Restaurant"}
                paraWeb={""}
                paraTab={""}
                paraMob={""}
                buttonText=""
                buttonOnClick=''
                iconTopWeb={'50%'}
        iconLeftWeb={'50%'}
        iconTopTab={'47%'}
        iconLeftTab={"64%"}
        iconTopMob={'21%'}
        iconLeftMob={'50%'}
                iconRotationWeb={29}
                iconRotationTab={-33}
                iconRotationMob={30}
            />
            <div className='policy card'>
                <div className='content'>
                    <h1 className='title only-web'>Thank you for your<br/>interest in Cloudnet Travels</h1>
                    <h1 className='title only-tab'>Thank you for your<br/>interest in Cloudnet Travels</h1>
                    <h1 className='title only-mob'>Thank you for your interest in Cloudnet Travels</h1>
                    <p className='note'>Note: You must AGREE to proceed.</p>
                    <p className='note'>This privacy disclaimer is issued by Cloudnet Travels ("Cloudnet Travels", "We").</p>
                    <p>
                        In the Cloudnet Travels application, we gather and handle certain personal information. This includes personal details such as your title, name, gender, and language. We also collect birth and family details, such as your birth date and nationality. Furthermore, we require your physical and electronic address data, including your personal phone number, private email, and private address information. Your professional profile, encompassing career details, curriculum vitae, and professional qualifications, is also part of the information we process.
                        <br/>
                        <br/>
                        Additionally, we may collect data regarding your racial or ethnic origin. Suppose you opt for social login as your authentication method. In that case, we will process a Specific Access Token from the social media platform you use solely to authenticate your account.
                        <br/>
                        <br/>
                        We collect information pertaining to whether you, any of your relatives, associates or spouse/partner have previously worked or are currently employed by Cloudnet Travels ("Personal Data"). In the process of your application, we gather and handle your Personal Data for the specific purpose of recruiting and managing applications (referred to as the "Purpose"). While sharing your Personal Data is optional, please note that without providing this information, we may be unable to proceed with processing your application.
                        <br/>
                        <br/>
                        Our recruitment process may involve automated decisions that use your Personal Data. This could include assigning your application to a member of our team who specialises in finding roles that fit your experience. However, if you don't meet certain essential criteria for a position, such as having a permit to work in a particular country or a specific degree, your application may be rejected.
                        <br/>
                        <br/>
                        We further keep your CV for future consideration. We may place your application in a talent pool to match you with the most suitable roles based on your preferences. Our software analyses your resume to ensure it aligns with the job description. However, final decisions on the progress of your application are made by the hiring manager and HR. Your Personal Data will be securely retained for the duration required to fulfil the intended Purpose.
                        <br/>
                        <br/>
                        At Cloudnet Travels, we take data processing and protection seriously. For further details on how we oversee your information and ensure the protection of your rights regarding your data, kindly refer to our Privacy Notice.
                        <br/>
                        <br/>
                        For administrative inquiries, please contact admin@zogglobal.com or for data protection-specific questions, contact connect@zogglobal.com.
                        <br/>
                        <br/>
                        
                        By clicking the button below to finish the profile setup, you agree to the following:
                        <ul>
                            <li><p>Cloudnet Travels is processing your Personal Data in connection with your application as described above</p></li>
                            <li><p>The processing of your application may involve automated decision-making, as described above</p></li>
                        </ul>
                    </p>
                </div>

                <div className='footer'>
                    <button className='btn-auth-dark disagree' onClick={() => navigate('/login')}>DISAGREE</button>
                    <button className='btn-auth-dark' onClick={() => navigate('/sign-up')}>I AGREE</button>
                </div>
                    
            </div>
        </div>

    </>
  )
}

export default PrivacyPolicy