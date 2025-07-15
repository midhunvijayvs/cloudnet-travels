import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./UserPermissions.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

const UserPermissions = ({ userData }) => {
  const navigate = useNavigate()
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionList, setPermissionList] = useState([]);
  const [initialPermissions, setInitialPermissions] = useState([]);
  const [isEdit, setIsEdit] = useState(false);


  const loadPermissionData = () => {
    setIsLoading(true);
    API.get(`user/assign_permissions/${userData.id}/`)
      .then(response => {
        setPermissionList(response.data.permissions);
        setInitialPermissions(response.data.permissions);
        if (response.data.permissions.length > 0) {
          setIsEdit(true)
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadPermissionData();
  }, []);

  // Permission Data-List
  const backendTables = [
    { name: 'cuisine', label: 'Cuisines' },
    { name: 'deliveryperson', label: 'Drivers' },
    // { name: 'menuitem', label: 'Foods' },
    { name: 'unit', label: 'Menu Units' },
    { name: 'invoice', label: 'Invoice' },
    { name: 'menucategory', label: 'Menu Categories' },
    { name: 'order', label: 'Orders' },
    { name: 'restaurant', label: 'Restaurants' },
    { name: 'review', label: 'Reviews' },
    { name: 'ticket', label: 'Tickets' },
    { name: 'customuser', label: 'Users' },
  ];

  const permissionMap = backendTables.reduce((map, table) => {
    map[`modify_${table.name}`] = `view_${table.name}`;
    return map;
  }, {});

  // Function to update permission list (Add the missing view permission if modify)
  const updatePermissionList = (permissions, map) => {
    const updatedPermissions = [...permissions]; // Create a copy of the original permissions array
    Object.entries(map).forEach(([modifyPermission, viewPermission]) => {
      if (permissions.includes(modifyPermission) && !permissions.includes(viewPermission)) {
        updatedPermissions.push(viewPermission); // Add the missing view permission
      }
    });
    updatedPermissions.sort(); // Sort the updated permissions
    return updatedPermissions;
  };

  // Handle checkbox change
  const handleCheckBoxChange = (permission) => {
    let updatedPermissions = [...permissionList];

    if (permission.startsWith('modify_')) {
      // Toggle modify permission
      if (updatedPermissions.includes(permission)) {
        updatedPermissions = updatedPermissions.filter(p => p !== permission);
      } else {
        updatedPermissions.push(permission);
      }

      // Toggle corresponding view permission
      const viewPermission = permissionMap[permission];
      if (viewPermission) {
        if (updatedPermissions.includes(permission)) {
          // If modify permission is selected, ensure view permission is also selected
          if (!updatedPermissions.includes(viewPermission)) {
            updatedPermissions.push(viewPermission);
          }
        } else {
          // If modify permission is deselected, deselect view permission if no other modify is selected
          const otherModifyPermissions = Object.keys(permissionMap).filter(key => key.startsWith('modify_') && key !== permission);
          const isOtherModifySelected = otherModifyPermissions.some(modify => updatedPermissions.includes(modify));
          if (!isOtherModifySelected) {
            updatedPermissions = updatedPermissions.filter(p => p !== viewPermission);
          }
        }
      }
    }

    if (permission.startsWith('view_')) {
      // Toggle view permission
      if (updatedPermissions.includes(permission)) {
        updatedPermissions = updatedPermissions.filter(p => p !== permission);
      } else {
        updatedPermissions.push(permission);
      }
    }
    updatedPermissions.sort();
    setPermissionList(updatedPermissions);
  };


  const handleSubmit = () => {
    const formData = { permissions: updatePermissionList(permissionList, permissionMap) }
    const method = isEdit ? 'put' : 'post';
    // console.log(formData,method);
    setIsLoading(true);
    API[method](`user/assign_permissions/${userData.id}/`, formData)
      .then((response) => {
        setIsLoading(false);
        setIsMessageModalOpen(true);
        setMessage(isEdit ? 'User permissions updated successfully.' : 'User permissions added successfully.')
        loadPermissionData();
      })
      .catch((error) => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
      });
  }

  // to check if any changes
  const isSaveDisabled = JSON.stringify(permissionList.sort()) === JSON.stringify(initialPermissions.sort());

  return (
    <>
      <div className="users-permission-page">
        <div className="card permissions">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4 ">
              <div className="fw-600 ">Permissions</div>
              <div className="d-flex">
                {/* <button className="btn cancel-btn me-3" onClick={() => loadPermissionData()} >Cancel</button> */}
                <button className="btn btn-primary" onClick={handleSubmit} disabled={isSaveDisabled}>Save Changes</button>
              </div>
            </div>
            <div className='region-table mt-3'>
              <table className="table table-bordered" aria-label="TABLE">
                <thead>
                  <tr role="row" className='f-14 clr-565B67'>
                    <th className='f-14 clr-565B67 p-0' role="columnheader" scope="col" tabIndex="0">Pages</th>
                    <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">View</th>
                    <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">Modify</th>
                  </tr>
                </thead>
                <tbody>
                  {backendTables.map(({ name, label }) => (
                    <tr role="row" className="black-clr f-14 fw-500" key={name}>
                      <td>{label}</td>
                      <td>
                        <input
                          className="custom-checkbox"
                          type="checkbox"
                          name="text"
                          id={`view_${name}`}
                          checked={permissionList.includes(`view_${name}`)}
                          onClick={() => handleCheckBoxChange(`view_${name}`)}
                        />
                      </td>
                      <td>
                        <input
                          className="custom-checkbox"
                          type="checkbox"
                          name="text"
                          id={`modify_${name}`}
                          checked={permissionList.includes(`modify_${name}`)}
                          onClick={() => handleCheckBoxChange(`modify_${name}`)}
                          disabled= {['menuitem', 'customuser'].includes(name)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
        {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
        {isLoading && <FixedOverlayLoadingSpinner />}
      </div >

    </>
  )
}


export default UserPermissions