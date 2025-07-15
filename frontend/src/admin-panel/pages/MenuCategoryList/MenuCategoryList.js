import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./MenuCategoryList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import '../../common-components/SingleImageUploader/SingleImageUploader.scss'

import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import SingleImageUploader from "../../common-components/SingleImageUploader/SingleImageUploader";


const MenuCategoryList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ search_key: null });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState({})
  const [isFormPopupOpen, showFormPopup] = useState(false)

  const [imageError, setImageError] = useState(null);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])


  useEffect(() => {
    loadTableData();
  }, [page, pageSize, filters]);


  const deleteItem = () => {
    setIsLoading(true)
    API.delete(`/restaurants/menu-categories/${selectedItem.id}`)
      .then(response => {
        setMessage("Item deleted successfully.");
        setIsMessageModalOpen(true)
    setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
    setIsLoading(false)
      });
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image_url' && files.length > 0) {
      const file = files[0];
      // Check image dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const validAspectRatio = aspectRatio >= 0.9 && aspectRatio <= 1.1;
        if (img.width <= 400 && img.height <= 400 && validAspectRatio) {
          if (file.size <= 300 * 1024) {
            setSelectedItem({ ...selectedItem, [name]: file });
          } else {
            setMessage('Image file size is too large.');
            setIsErrorModalOpen(true)
          }
        } else {
          setMessage('Image dimensions are not within the specified limits.');
          setIsErrorModalOpen(true)
        }
      }

    }
    else {
      setSelectedItem({ ...selectedItem, [name]: value });
    }

  };


  const loadTableData = () => {
    setData(null);
    setIsMessageModalOpen(false);
    let apiUrl = `/restaurants/menu-categories/?page=${page}&page_size=${pageSize}`;

    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in filters) {
      if (filters[filter] !== null) {
        apiUrl += `&${filter}=${filters[filter]}`;
      }
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setData(response.data);
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)

      });
  }


  const save = () => {

    if (selectedItem.image_url && !(selectedItem.image_url instanceof File)) {
      delete selectedItem.image_url;
    }
    if (!selectedItem.name) {
      setMessage("Category name is required.");
      setIsErrorModalOpen(true)
      return;
    }
 if (!selectedItem.image_url&&mode=='add') {
      setMessage("Image is required.");
      setIsErrorModalOpen(true)
      return;
    }
    setIsLoading(true);
    if (mode == "add") {
      if (!selectedItem.image_url) {
        setIsLoading(false);
        return;
      }
      API.post('/restaurants/menu-categories/', selectedItem,
        { headers: { 'Content-Type': 'multipart/form-data', } })
        .then((response) => {
          setSelectedItem({});
          showFormPopup(false)
          loadTableData();
    setIsLoading(false)
        })
        .catch((error) => {
          setIsLoading(false)
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        })
    }

    else {
    setIsLoading(true)
      API.put(`/restaurants/menu-categories/${selectedItem.id}/`, selectedItem)
        .then(response => {
          setSelectedItem({});
          showFormPopup(false)
          setIsLoading(false)

          loadTableData()
        })
        .catch(error => {
          console.error('Error updating data:', error);
          setIsLoading(false)
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        });
    }
  }



  const handleImageSelect = (event) => {
    const file = event.target.files[0];

    // Check image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const validAspectRatio = aspectRatio >= 0.9 && aspectRatio <= 1.1;

      if (img.width <= 400 && img.height <= 400 && validAspectRatio) {
        if (file.size <= 300 * 1024) { // Max size in bytes (300 KB)
          setImageError(null)
          setIsImgLoading(true);
          setPreviewImage(URL.createObjectURL(file));

          const formData = new FormData();
          formData.append('image_url', file);
          API.put(`/restaurants/menu-categories/${selectedItem.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          })
            .then((response) => {
              setMessage("Image updated Successfully.")
              setIsMessageModalOpen(true)
              setIsImgLoading(false);
            })
            .catch((error) => {
              setIsImgLoading(false);
              setMessage(error.response?.data?.message || error.message);
              setIsErrorModalOpen(true);
            })

        }
        else {
          setImageError('Image file size is too large.');
        }
      } else {
        setImageError('Image dimensions are not within the specified limits.');
      }
    };
  };

  return (
    <div className="admin-list-page menu-category-list">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>All Category</h5>
                    {localStorage.getItem('userRole') !== 'restaurant' &&
                      <form className="d-inline-flex">
                        <button onClick={() => { setMode("add"); showFormPopup(true); setSelectedItem({}); setPreviewImage(null) }} className="btn-primary" type="button">
                          <PlusSquare />Add New
                        </button>
                      </form>
                    }
                  </div>
                  <div className="table-responsive theme-scrollbar">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter">
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Categories'
                              id='search' onKeyUp={(e) => setFilters(prevFilters => ({
                                ...prevFilters, search_key: e.target.value
                              }))}
                            />
                          </label>
                        </div>
                        <table className="table category-table" id="table_id">
                          <thead>

                            <tr>
                              {/* <th><input id="checkall" className="custom-checkbox" type="checkbox" name="text" />
                              </th> */}
                              <th className="text-center">Category Image</th>
                              <th>Category Name</th>
                              <th>Option</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((category) => (
                              <tr>
                                {/* <td>
                                <input className="custom-checkbox" type="checkbox" name="text" />
                              </td> */}

                                <td className="text-center">
                                  <div className="table-image">
                                    <img src={category.image_url} className="img-fluid"
                                      alt="" />
                                  </div>
                                </td>
                                <td>{category.name}</td>
                                <td>
                                  <ul
                                    className="d-flex align-items-center  justify-content-center">
                                    {/* <li>
                                      <a href="order-detail.html">
                                        <i className="ri-eye-line"></i>
                                      </a>
                                    </li> */}

                                    <li>
                                      <button onClick={() => { setMode("edit"); showFormPopup(true); setSelectedItem(category); setPreviewImage(category.image_url) }}>
                                        <i className="ri-pencil-line"></i>
                                      </button>
                                    </li>

                                    <li>
                                      <button className="" onClick={() => { setSelectedItem(category); setIsDeleteConfModalOpen(true) }}>
                                        <i className="ri-delete-bin-line"></i>
                                      </button>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {data &&
                    <Pagination
                      totalItems={data.count}
                      pageSize={pageSize}
                      currentPage={page}
                      setCurrentPage={setPage}
                      selectPageSize={selectPageSize}
                    >

                    </Pagination>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {isFormPopupOpen &&
        <div className='custom-modal'>

          <div className='card'>
            <div className='main'>
              <button type="button" className="close" onClick={() => showFormPopup(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
              <form>
                <div className='mb-2'>
                  <label>Category Name</label>
                  <div><input className='inp-F0F0F0 w-100 p-2 fw-500' placeholder='Add Category Name'
                    name='name'
                    value={selectedItem.name}
                    onChange={handleInputChange}
                  ></input>
                  
                  </div>
                </div>
                
                
                
                <input type='hidden' name='id'></input>
               
               
                  <label>Category Image</label>
                {
                  mode === 'edit' ? (
                    <SingleImageUploader selectedItem={selectedItem} />

                  ) :
                    <>
                      <input className="btn btn-secondary image-input-button w-100 text-black mb-2" type="file"
                        accept="image/*" name="image_url"
                        onChange={handleInputChange}
                      />
                      <div className="">
                        {imageError && <p className="img-error-msg">{imageError}</p>}
                        <p className="image-instruction text-center">
                          File size should be less than 300kB<br></br>
                          File resolution Max height: 400px and Max width:400px, in a square aspect ratio.
                        </p>
                      </div>

                    </>


                }



                <button type='button' className='btn-primary' onClick={save}>
                  Save/Edit
                </button>
              </form>
              <div>


              </div>
            </div>
          </div>
        </div>
      }


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadTableData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'cuisine'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default MenuCategoryList