import React, { Component } from 'react'
import './Analytics.css'

import { Link } from 'react-router-dom';
import Chart from "react-apexcharts";

export class Analytics extends Component {
  
    constructor(props) {
        super(props);

        this.state = {
        
          series: [{
            name: 'Customer',
            data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5]
          }],
          options: {
            chart: {
              height: 350,
              type: 'line',
            },
            forecastDataPoints: {
              count: 7
            },
            stroke: {
              width: 5,
              curve: 'smooth'
            },
            xaxis: {
              type: 'datetime',
              categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000'],
              tickAmount: 10,
              labels: {
                formatter: function(value, timestamp, opts) {
                  return opts.dateFormatter(new Date(timestamp), 'dd MMM')
                }
              }
            },
            
            fill: {
              type: 'gradient',
              gradient: {
                shade: 'dark',
                gradientToColors: [ 'red'],
                shadeIntensity: 1,
                type: 'horizontal',
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100]
              },
            },
            yaxis: {
              min: 0,
              max: 60
            }
          },
        
        
        };
      }
  render() {
    return (
      <div className='analytics'>
        <div className='mb-4 fw-600 f-md'>Hi, Welcome back</div>
       
        <div className='d-flex w-100 justify-content-between flex-column flex-md-row'>
            <div className='d-flex w-50-resp-mob mb-3 mb-md-0'>
              <div className='sales-analytics-brick me-3 zoomoutonhover'>
                  <div className='round-bg mb-3'><i className="fa-solid fa-gift fa-2x"></i></div>
                  <div className='fw-600 f-xxl'>714k</div>
                  <div className='f-sm fw-500'>Weekly Sales</div>
              </div>
              <div className='sales-analytics-brick white me-3 zoomoutonhover bg-white'>
                  <div className='round-bg white mb-3'><i className="fa-solid fa-users fa-2x"></i></div>
                  <div className='fw-600 f-xxl'>1.3m</div>
                  <div className='f-sm fw-500'>New users</div>
              </div>
            </div>
            <div className='d-flex w-50-resp-mob'>
              <div className='sales-analytics-brick me-3 zoomoutonhover'>
                  <div className='round-bg mb-3'><i className="fa-solid fa-cart-shopping fa-2x"></i></div>
                  <div className='fw-600 f-xxl'>714k</div>
                  <div className='f-sm fw-500'>Item Orders</div>
              </div>
              <Link className='sales-analytics-brick white me-3 zoomoutonhover bg-white' role="button"to={'/admin/reviews/list'}>
                  <div className='round-bg white mb-3'><i className="fa-solid fa-star-half-stroke fa-2x"></i></div>
                  <div className='fw-600 f-xxl'>150</div>
                  <div className='f-sm fw-500'>Product Reviews</div>
              </Link>
            </div>  
        </div>
        <div className='w-100 mt-4 d-flex flex-column flex-md-row'>
            <div className='w-60-resp-mob box-shadow radius-11 bg-white p-4 me-3 mb-3 mb-md-0'>
                <div className='fw-600 f-md'>Website Visits</div>
                <div className='brick-clr f-xs fw-500 mb-4'>(+43%) than last year</div>
                <div className='fw-600 f-lg'>Website visited people</div>
                <div id="chart">
                        <Chart options={this.state.options} series={this.state.series} type="line" height={350} />
                    </div>
            </div>
            <div className='w-40-resp-mob bg-white box-shadow radius-11 p-4'>
                <div className='fw-600 f-md mb-3'>Traffic by Site</div>
                <div className='w-100 d-flex mb-2'>
                    <div className='w-50 me-2 ss-border'>
                        <img src="/images/Analytics/fb.svg" alt=''></img>
                        <div className='fw-600 brick-clr mt-3'>323.23k</div>
                        <div className='fw-600'>Facebook</div>
                    </div>
                    <div className='w-50 ss-border'>
                        <img src="/images/Analytics/google.svg" alt=''></img>
                        <div className='fw-600 brick-clr mt-3'>323.23k</div>
                        <div className='fw-600'>Google</div>
                    </div>
                </div>
                <div className='w-100 d-flex'>
                    <div className='w-50 me-2 ss-border'>
                        <img src="/images/Analytics/twitter.svg" alt=''></img>
                        <div className='fw-600 brick-clr mt-3'>323.23k</div>
                        <div className='fw-600'>Twitter</div>
                    </div>
                    <div className='w-50 ss-border'>
                        <img src="/images/Analytics/insta.svg" alt=''></img>
                        <div className='fw-600 brick-clr mt-3'>323.23k</div>
                        <div className='fw-600'>Instagram</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
  }
}

export default Analytics
