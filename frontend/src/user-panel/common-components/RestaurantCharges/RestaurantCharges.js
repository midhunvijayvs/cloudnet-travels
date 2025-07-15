import React from 'react'
import './RestaurantCharges.scss'

const RestaurantCharges = ({ data, handleInputChange, errors, saveFunction }) => {
  return (
    <div className='restaurant-charges'>
      <div className='top-sec'>
        <div className='title'>Delivery Settings</div>
        <div className='sub-text'>Add the restaurant delivery limit and the corresponding charges here.</div>
      </div>
      <div className="form-sec">
        <div className='row'>
          <div className='input-grp-title'>
            <label>1.Set the Radius Range</label>
            {/* <img className='info' src='/images/icons/svg/info.svg'></img> */}
          </div>
          {/* min_delivery_distance */}
          <div className="col-md-6">
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="min_delivery_distance"
                  value={data.charges.min_delivery_distance}
                  onChange={handleInputChange('charges')}
                />
                <span className="unit miles">miles</span>
                <span className="input-placeholder">Min Delivery Radius</span>
              </div>
              {errors.min_delivery_distance && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.min_delivery_distance}</div>}
            </div>
          </div>
          {/* max_delivery_radius */}
          <div className="col-md-6">
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="max_delivery_radius"
                  value={data.charges.max_delivery_radius}
                  onChange={handleInputChange('charges')}
                />
                <span className="unit miles">miles</span>
                <span className="input-placeholder">Delivery Radius Limit</span>
              </div>
              {errors.max_delivery_radius && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.max_delivery_radius}</div>}
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='input-grp-title'>
            <label>2.Set the Delivery Charge</label>
            {/* <img className='info' src='/images/icons/svg/info.svg'></img> */}
          </div>
          {/* min_delivery_charge */}
          <div className="col-md-6">
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="min_delivery_charge"
                  value={data.charges.min_delivery_charge}
                  onChange={handleInputChange('charges')}
                />
                <span className="unit price">GBP</span>
                <span className="input-placeholder">Min. Charge (within min radius)</span>
              </div>
              {errors.min_delivery_charge && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.min_delivery_charge}</div>}
            </div>
          </div>
          {/* delivery_charge_per_mile */}
          <div className="col-md-6">
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="delivery_charge_per_mile"
                  value={data.charges.delivery_charge_per_mile}
                  onChange={handleInputChange('charges')}
                />
                <span className="unit price">GBP</span>
                <span className="input-placeholder">Delivery Charges(Per Mile)</span>
              </div>
              {errors.delivery_charge_per_mile && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.delivery_charge_per_mile}</div>}
            </div>
          </div>
        </div>
        <div className='row'>
          {/* is_delivering_to_outside_limit */}
          <div className='input-grp-title'>
            <label>3.Are you willing to deliver beyond the radius limit?</label>
            <div className='radio-btn-group'>
              <label>
                <input type='radio' name='is_delivering_to_outside_limit'
                  checked={data.charges.is_delivering_to_outside_limit === true}
                  value={true}
                  onChange={handleInputChange('charges')}
                  className='custom-radio' />
                Yes
              </label>
              <label>
                <input type='radio' name='is_delivering_to_outside_limit'
                  checked={data.charges.is_delivering_to_outside_limit === false}
                  value={false}
                  onChange={handleInputChange('charges')}
                  className='custom-radio' />
                No
              </label>
            </div>
          </div>

          {data.charges.is_delivering_to_outside_limit === true &&
            <>
              {/* outside_limit_radius */}
              <div className="col-md-6">
                <div className="input-box">
                  <div className="input-container">
                    <input
                      type="text"
                      name="outside_limit_radius"
                      value={data.charges.outside_limit_radius}
                      onChange={handleInputChange('charges')}
                    />
                    <span className="unit miles">miles</span>
                    <span className="input-placeholder">Max delivery radius</span>
                  </div>
                  {errors.outside_limit_radius && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.outside_limit_radius}</div>}
                </div>
              </div>
              {/* outside_delivery_charge_per_mile */}
              <div className="col-md-6">
                <div className="input-box">
                  <div className="input-container">
                    <input
                      type="text"
                      name="outside_delivery_charge_per_mile"
                      value={data.charges.outside_delivery_charge_per_mile}
                      onChange={handleInputChange('charges')}
                    />
                    <span className="unit price">GBP</span>
                    <span className="input-placeholder">Delivery Charges(Per Mile)</span>
                  </div>
                  {errors.outside_delivery_charge_per_mile && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.outside_delivery_charge_per_mile}</div>}
                </div>
              </div>
            </>
          }
        </div>
        <div className='row'>
          <label>4.Additional Restaurant Charges</label>
          {/* tax_rate */}
          <div className="col-md-6">
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="tax_rate"
                  value={data.charges.tax_rate}
                  onChange={handleInputChange('charges')}
                />
                <span className="unit percent">%</span>
                <span className="input-placeholder">VAT</span>
              </div>
              {errors.tax_rate && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.tax_rate}</div>}
            </div>
          </div>
          {/* min_order_amount */}
          <div className="col-md-6">
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="min_order_amount"
                  value={data.charges.min_order_amount}
                  onChange={handleInputChange('charges')}
                />
                <span className="unit price">GBP</span>
                <span className="input-placeholder">Minimum Order Amount</span>
              </div>
              {errors.min_order_amount && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.min_order_amount}</div>}
            </div>
          </div>

          {/* preparation_time_required */}
          <div className="col-12 mt-2">
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="preparation_time_required"
                  value={data.charges.preparation_time_required}
                  onChange={handleInputChange('charges')}
                />
                <span className="unit time">Minutes</span>
                <span className="input-placeholder">
                  Maximum Order Preparation Time (Estimated time)
                  </span>
              </div>
              {errors.preparation_time_required && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.preparation_time_required}</div>}
            </div>
          </div>
          {/* min_order_amount_for_free_delivery */}
          <div className="col-12 mt-2">
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="min_order_amount_for_free_delivery"
                  value={data.charges.min_order_amount_for_free_delivery}
                  onChange={handleInputChange('charges')}
                />
                <span className="unit price">GBP</span>
                <span className="input-placeholder">
                  Minimum Order Amount for Free Delivery 
                  {/* (To avail free delivery.) */}
                  </span>
              </div>
              {errors.min_order_amount_for_free_delivery && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.min_order_amount_for_free_delivery}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="row d-flex justify-content-center mb-2">
        <button onClick={saveFunction} className="btn restaurant-button mt-1">Save and Proceed</button>
      </div>
    </div>
  )
}

export default RestaurantCharges