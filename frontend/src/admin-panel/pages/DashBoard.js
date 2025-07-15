import React from "react";
import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminDashboardData } from "../constants/APITestData"
import "./AdminPanel.css"
const View = () => {

    let navigate = useNavigate();


    return (
        <>
            <div className="dashboard-sec-1 container">
                <div className="row justify-content-between">
                    <div className="col-md-4 d-flex justify-content-center">
                        <div className="card">
                            <img src="/images/admin-panel/dashboard/sec-1-1.svg"></img>
                            <div>
                                <h6>{adminDashboardData.new_order} new orders</h6>
                                <p>View all new orders</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 d-flex justify-content-center">
                        <div className="card">
                            <img src="/images/admin-panel/dashboard/sec-1-2.svg"></img>
                            <div>
                                <h6>{adminDashboardData.total_purchased} Total Purchased</h6>
                                <p>View all products</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 d-flex justify-content-center">
                        <div className="card">
                            <img src="/images/admin-panel/dashboard/sec-1-3.svg"></img>
                            <div>
                                <h6>{adminDashboardData.total_sale} Total Sale</h6>
                                <p>View all orders</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-sec-2 container">
                <div className="row g-3 ">
                    <div className=" col-4 col-lg-2">
                        <div className="card">
                            <span className="label">Best Seller</span>
                            <span className="number">{adminDashboardData.best_seller.value}</span>
                            <div className="tiny-chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        width={80}
                                        height={40}
                                        data={adminDashboardData.best_seller.data}
                                        margin={{ top: 0, left: -58, right: 0, bottom: -25 }}
                                    >

                                        <defs>
                                            <linearGradient id="color1" x1="1" y1="1" x2="0" y2="0">
                                                <stop offset="0%" stopColor="#F9F9F9" stopOpacity={1} />
                                                <stop offset="80%" stopColor="#325A3E" stopOpacity={0.5} />
                                            </linearGradient>

                                        </defs>

                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={false} />
                                        <YAxis tick={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#325A3E" fill="url(#color1)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                        </div>

                        <div className="card">
                            <span className="label">Active Users</span>
                            <span className="number">{adminDashboardData.active_users.value}/{adminDashboardData.active_users.total_users}</span>
                            <div className="tiny-chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        width={80}
                                        height={40}
                                        data={adminDashboardData.active_users.data}
                                        margin={{ top: 0, left: -58, right: 0, bottom: -25 }}
                                    >
                                    <defs>
                                        <linearGradient id="color2" x1="1" y1="1" x2="0" y2="0">
                                            <stop offset="0%" stopColor="#F9F9F9" stopOpacity={1} />
                                            <stop offset="80%" stopColor="#325A3E" stopOpacity={0.5} />
                                        </linearGradient>

                                    </defs>

                                    
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={false} />
                                        <YAxis tick={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#325A3E" fill="url(#color)2" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="col-4 col-lg-2">
                        <div className="card">
                            <span className="label">Top coupons</span>
                            <span className="number">{adminDashboardData.top_coupons.value}</span>
                            <div className="tiny-chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        width={80}
                                        height={40}
                                        data={adminDashboardData.top_coupons.data}
                                        margin={{ top: 0, left: -58, right: 0, bottom: -25 }}
                                    >
                                    <defs>
                                        <linearGradient id="color3" x1="1" y1="1" x2="0" y2="0">
                                            <stop offset="0%" stopColor="#F9F9F9" stopOpacity={1} />
                                            <stop offset="80%" stopColor="#FE9C85" stopOpacity={0.5} />
                                        </linearGradient>

                                    </defs>

                                    
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={false} />
                                        <YAxis tick={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#FE9C85" fill="url(#color3)"/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="card">
                            <span className="label">Out of stocks</span>
                            <span className="number">{adminDashboardData.out_of_stocks.value}</span>
                            <Link to="/admin/out-of-stock">View Items <span><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.4573 12.8977H3.45728" stroke="#325A3E" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M22.1 12.6833L18.6689 10.6247C18.1357 10.3047 17.4573 10.6888 17.4573 11.3107V14.4848C17.4573 15.1066 18.1357 15.4907 18.6689 15.1707L22.1 13.1121C22.2618 13.015 22.2618 12.7804 22.1 12.6833Z" fill="#325A3E" />
                            </svg>

                            </span></Link>
                        </div>
                    </div>

                    <div className="col-4  col-lg-2">
                        <div className="card">
                            <span className="label">Paying vs non paying</span>
                            <span className="number">{adminDashboardData.paying_versus_non_paying.value}</span>
                            <div className="tiny-chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        width={80}
                                        height={40}
                                        data={adminDashboardData.paying_versus_non_paying.data}
                                        margin={{ top: 0, left: -58, right: 0, bottom: -25 }}
                                    >
                                    <defs>
                                        <linearGradient id="color4" x1="1" y1="1" x2="0" y2="0">
                                            <stop offset="0%" stopColor="#F9F9F9" stopOpacity={1} />
                                            <stop offset="80%" stopColor="#325A3E" stopOpacity={0.5} />
                                        </linearGradient>

                                    </defs>

                                    
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={false} />
                                        <YAxis tick={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#325A3E" fill="url(#color4)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div></div>

                        <div className="card">
                            <span className="label">New customers+</span>
                            <span className="number">{adminDashboardData.new_customers.value}</span>
                            <div className="tiny-chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        width={80}
                                        height={40}
                                        data={adminDashboardData.new_customers.data}
                                        margin={{ top: 0, left: -58, right: 0, bottom: -25 }}
                                    >
                                    <defs>
                                        <linearGradient id="color5" x1="1" y1="1" x2="0" y2="0">
                                            <stop offset="0%" stopColor="#F9F9F9" stopOpacity={1} />
                                            <stop offset="80%" stopColor="#0BC529" stopOpacity={0.5} />
                                        </linearGradient>

                                    </defs>

                                    
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={false} />
                                        <YAxis tick={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#0BC529" fill="url(#color5)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-6">
                        <div className="barchart-container">
                            <div className="d-flex justify-content-between header">
                                <h4 className="title">Total sells </h4>
                                <select className="form-select" aria-label="Default select example">
                                    <option selected>Month</option>
                                    <option value="1">Year</option>
                                    <option value="2">Week</option>
                                   
                                </select>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    width={200}
                                    height={170}
                                    data={adminDashboardData.total_sells}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: -30,
                                        bottom: 20,
                                    }}
                                    barSize={10}
                                    barGap={0}
                                >
                                    <BarChart strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis dataKey="Sale" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Sale" fill="#018f26" />

                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>


            <div className="dashboard-sec-3 container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card new-customers">

                            <table>
                                <tr>

                                    <th colspan="2">New Customers</th>

                                    <th><button className="btn">Last Week</button></th>
                                    <th>Actions</th>
                                </tr>

                                {adminDashboardData.new_customers_table.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><img src={item.image_url}></img></td>
                                            <td><span className="name-span">{item.name}</span><br></br>
                                                {item.number_of_orders} products ordered
                                            </td>
                                            <td>{item.date_of_joining}</td>
                                            <td>View Details</td>
                                        </tr>
                                    )
                                })}
                            </table>

                            <div className="card-footer">
                                <span className="text">View All Customers</span>
                                <svg className="ms-2" width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.7974 0.620727L6.81343 4.98403C7.15922 5.28446 7.15922 5.77244 6.81343 6.07287L1.7974 10.4362C1.45161 10.7371 0.891327 10.7371 0.545537 10.4362C0.199746 10.1355 0.199746 9.64827 0.545537 9.34733L4.93578 5.52845L0.545537 1.70956C0.199746 1.40888 0.199746 0.921158 0.545537 0.620727C0.891327 0.319784 1.45161 0.319784 1.7974 0.620727Z" fill="#585858" />
                                </svg>

                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card upcoming-delivery">
                            <table>
                                <tr>

                                    <th colspan="2">Upcoming Delivery</th>

                                    <th>Date for Delivery</th>
                                    <th>Actions</th>
                                </tr>

                                {adminDashboardData.upcoming_delivery_table.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><img src="/images/admin-panel/dashboard/sec-3-star-icon.svg"></img></td>
                                            <td><span className="name-span">{item.name}</span><br></br>
                                                {item.number_of_orders} products ordered
                                            </td>
                                            <td>{item.date_for_delivery}</td>
                                            <td>View Details</td>
                                        </tr>
                                    )
                                })}
                            </table>

                            <div className="card-footer">
                                <span className="text">View All Customer Orders</span>
                                <svg className="ms-2" width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.7974 0.620727L6.81343 4.98403C7.15922 5.28446 7.15922 5.77244 6.81343 6.07287L1.7974 10.4362C1.45161 10.7371 0.891327 10.7371 0.545537 10.4362C0.199746 10.1355 0.199746 9.64827 0.545537 9.34733L4.93578 5.52845L0.545537 1.70956C0.199746 1.40888 0.199746 0.921158 0.545537 0.620727C0.891327 0.319784 1.45161 0.319784 1.7974 0.620727Z" fill="#585858" />
                                </svg>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default View;