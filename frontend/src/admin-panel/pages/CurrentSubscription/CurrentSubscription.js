import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './CurrentSubscription.scss'
import { formatDateTimeToMonthYear } from '../../../GeneralFunctions';
import SubscriptionProgress from '../../common-components/SubscriptionProgress/SubscriptionProgress';


const CurrentSubscription = ({ subscriptionHistory, loadSubscriptionHistory }) => {

  const subscriptionHistory2 = [
    {
      subscription_name: 'Starter',
      is_active: true,
      required_sales: 1999,
      duration_in_days: 15,
      base_price: 29.99,
      start_date: '2025-04-01',
      expiry_date: '2025-04-15'
    },
    {
      subscription_name: 'Standard',
      is_active: false,
      required_sales: 2999,
      duration_in_days: 30,
      base_price: 49.99,
      start_date: '2025-05-01',
      expiry_date: '2025-05-31'
    },
    // More plans...
  ];
  const currentPlan = subscriptionHistory?.subscription_history?.find(plan => plan.is_active);


  const allPlans1 = [
    { subscription_name: "Free", required_sales: "", duration_in_days: "", base_price: "" },
    { subscription_name: "Starter", required_sales: 100, duration_in_days: 30, base_price: 5 },
    { subscription_name: "Basic", required_sales: 500, duration_in_days: 30, base_price: 10 },
    { subscription_name: "Benefit", required_sales: 1000, duration_in_days: 30, base_price: 20 },
    { subscription_name: "Standard", required_sales: 2999, duration_in_days: 30, base_price: 49.99 },
    { subscription_name: "Elite", required_sales: 5000, duration_in_days: 30, base_price: 99.99 }
  ];

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allPlans, setAllPlans] = useState([]);


  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadData = () => {
    let apiUrl = `/payments/merchant-tiers/`;
    API.get(apiUrl)
      .then((response) => {
        const data = response.data || [];
        setAllPlans(data)
      })
      .catch(() => setIsLoading(false))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadSubscriptionHistory();
    loadData();
  }, []);




  return (
    <>
      <div className="admin-current-subscription page-body">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>
                Subscription Plan
              </h5>
            </div>
            <div className='card-body'>
              <div className="subscription-plan-page container">
                {/* Plan Summary Notice */}
                {currentPlan &&
                  <div className={`plan-summary ${currentPlan?.tier_details?.subscription_name?.toLowerCase()}`}>
                    <p>
                      You are currently on the <strong>{currentPlan?.tier_details?.subscription_name ?? '---'}</strong> plan.
                      Based on your sales, <strong>₹{currentPlan?.amount_paid}</strong> will be automatically deducted
                      from your account for this subscription cycle.
                    </p>
                  </div>
                }


                {/* Current Plan Card */}
                <div className={`plan-card d-none ${currentPlan?.tier_details?.subscription_name?.toLowerCase()}`}>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div className='d-flex justify-content-between align-items-center gap-3'>
                      <h3 className="plan-title">{currentPlan?.tier_details?.subscription_name} Plan</h3>
                      <span className={`status-badge ${currentPlan?.is_active ? 'active' : 'expired'}`}>
                        {currentPlan?.is_active ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    <p className="plan-status">
                      <span className="expiry-info">Expires on: {currentPlan?.expiry_date}</span>
                    </p>
                  </div>

                  <div className="plan-details">
                    <div className="detail-item">
                      <label>Minimum Sales Requirement:</label>
                      <span>₹{currentPlan?.required_sales}</span>
                    </div>
                    <div className="detail-item">
                      <label>Duration:</label>
                      <span>{currentPlan?.duration_in_days} Days</span>
                    </div>
                    <div className="detail-item">
                      <label>Price:</label>
                      <span>₹{currentPlan?.amount_paid}</span>
                    </div>
                    <div className="detail-item">
                      <label>Subscribed On:</label>
                      <span>{currentPlan?.start_date}</span>
                    </div>
                  </div>
                </div>
                {subscriptionHistory?.subscription_history?.length > 0 &&
                  <div className="subscription-history-section">
                    <h3>Subscription History</h3>
                    <div className="history-list">
                      {subscriptionHistory?.subscription_history?.map((plan, index) => (
                        <div
                          className={`history-card ${currentPlan?.tier_details?.subscription_name?.toLowerCase()} ${plan.is_active ? 'active' : ''}`}
                          key={index}
                        >
                          <div className="top">
                            <span className="plan-name">{plan?.tier_details?.subscription_name}</span>
                            {plan.is_active && <span className="badge">Active</span>}
                          </div>
                          <div className="details">
                            <p><strong>Start Date:</strong> {formatDateTimeToMonthYear(plan.start_date)}</p>
                            <p><strong>End Date:</strong> {formatDateTimeToMonthYear(plan.end_date)}</p>
                            <p><strong>Price:</strong> ₹{plan.amount_paid}</p>
                            <p><strong>Required Sales:</strong> ₹{plan?.tier_details?.required_sales}</p>
                            <p><strong>Duration:</strong> {plan.duration_in_days} days</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                }

                {/* Progress bar */}
                {
                  allPlans?.length > 0 &&
                  <SubscriptionProgress totalSales={subscriptionHistory?.total_sales ?? 0}
                    currentTier={currentPlan}
                    tiers={allPlans} />
                }

                {/* All Plans Table */}
                {allPlans?.length > 0 &&
                  <div className="all-plans-section d-none">
                    <h3 className="section-title">All Available Plans</h3>
                    <table className="plans-table">
                      <thead>
                        <tr>
                          <th>Plan Name</th>
                          <th>Required Sales</th>
                          <th>Duration</th>
                          <th className='text-center'>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allPlans?.map((plan, idx) => (
                          <tr key={idx} className={`plan-row ${plan.subscription_name.toLowerCase()}`}>
                            <td>
                              {plan.subscription_name}
                              {plan.subscription_name === currentPlan?.tier_details?.subscription_name
                                && <span className="active-badge">Current Plan</span>}
                            </td>
                            <td>{plan.required_sales ? `₹${plan.required_sales}` : 'N/A'}</td>
                            <td>{plan.duration_in_days ? `${plan.duration_in_days} Days` : 'N/A'}</td>
                            <td>{plan.base_price ? `₹${plan.base_price}` : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

      </div >



      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}

      {isLoading && <FixedOverlayLoadingSpinner />}
    </>

  )
}

export default CurrentSubscription