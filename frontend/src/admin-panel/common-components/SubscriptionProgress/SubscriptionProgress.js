import React from 'react';
import './SubscriptionProgress.scss';

const SubscriptionProgress = ({ totalSales, tiers, currentTier }) => {
  const sortedTiers = [...tiers].sort((a, b) => parseFloat(a.required_sales) - parseFloat(b.required_sales));

  const nextTier = sortedTiers.find(tier => parseFloat(tier.required_sales) > totalSales);

  let progress = 100;
  if (nextTier && currentTier) {
    const current = parseFloat(currentTier?.tier_details?.required_sales);
    const next = parseFloat(nextTier.required_sales);
    progress = ((totalSales - current) / (next - current)) * 100;
  }

  const currentTierId = currentTier?.tier_details?.id;

  const getStatus = (tier) => {
    if (tier.id === currentTierId) return 'current';
    if (totalSales >= tier.required_sales) return 'completed';
    return 'upcoming';
  };

  const progressPercent = Math.min(
    (totalSales / sortedTiers[sortedTiers.length - 1].required_sales) * 100,
    100
  );


  return (
    <div className="subscription-progress-container">
      <h2 className="title">Subscription Progress</h2>

      <div className="sales-info">
        <p>Current Sales: <strong>£{totalSales.toFixed(2)}</strong> </p>
        {/* <p>Current Tier: <strong>{currentTier?.tier_details?.subscription_name || 'None'}</strong></p>
        {nextTier ? (
          <p>Next Tier: <strong>{nextTier.subscription_name} £{nextTier.required_sales}</strong></p>
        ) : (
          <p className="max-tier">🎉 Max Tier Achieved!</p>
        )} */}
      </div>

      {/* <div className="progress-bar d-none">
        <div
          className="progress"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div> */}
      <div className="subscription-progress-v2">
        {/* <h2>Subscription Tiers</h2> */}
        <div className="tier-cards">
          {sortedTiers.map((tier) => {
            const status = getStatus(tier);
            return (
              <div key={tier.id} className={`tier-card ${status}`}>
                <div className="tier-name">{tier.subscription_name}</div>
                <div className="tier-sales">£{tier.required_sales.toLocaleString()}</div>
                <div className={`status ${status}`}>{status.toUpperCase()}</div>
              </div>
            );
          })}
        </div>

        <div className="overall-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          {/* <div className="progress-label">Overall Progress: {Math.floor(progressPercent)}%</div> */}
        </div>
      </div>

      <div className="tiers-container">
        {tiers.map(tier => {
          const isCurrent = currentTier?.tier === tier.id;
          return (
            <div
              key={tier.id}
              className={`tier-card ${isCurrent ? 'current-tier' : tier.subscription_name?.toLowerCase()}`}
            >
              <h3>{tier.subscription_name}</h3>
              <p>Required: £{tier.required_sales}</p>
              <p>Price: £{tier.base_price}</p>
              <p>Duration: {tier.duration_in_days} days</p> {/* Added Duration */}
              {/* {isCurrent && <div className="current-tier-label">Current Tier</div>} */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionProgress;
