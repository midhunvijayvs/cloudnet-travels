import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./BlogAdd.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { MAIL_LIST_SUBJECTS } from "../../../Constants";
import RichTextEditor from "../../common-components/RichText/RichText";
import { isRichTextEmpty } from "../../common-functions/commonFunctions";
import ImgFileDropZone from "../../common-components/ImgFileDropZone/ImgFileDropZone";
import AddDataPopup from "../../common-components/AddDataPopup/AddDataPopup";

const BlogAdd = ({ mode }) => {

  const navigate = useNavigate()

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalTitle, setAddModalTitle] = useState('');
  const [addSectionAPI, setAddSectionAPI] = useState(""); // For Add modal list

  const [formData, setFormData] = useState({
    title: "",
    category: null,
    author: "",
    description: "",
    image: null,
  });

  // load categories'
  const loadCategories = () => {
    API.get(`/communication/blog-categories/?page_size=1000`)
      .then(response => {
        setCategories(response.data.results);
      })
      .catch(error => {
        console.error(error);
      });
  }
  useEffect(() => {
    loadCategories();
  }, [])


  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleImgFileSelect = (img) => {
    setFormData({
      ...formData,
      image: img,
    });
  }

  const handleDescriptionChange = (sectionId, content) => {
    setFormData({
      ...formData,
      description: content,
    });
  }

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadData = () => {
    if (mode === 'edit') {
      let apiUrl = `/communication/blogs/${localStorage.getItem('itemSelectedId')}`;
      setIsLoading(true)
      API.get(apiUrl)
        .then(response => {
          setFormData(response.data)
          setIsLoading(false)
        })
        .catch(error => {
          setIsLoading(false)
        });
    } else {
      setFormData({
        title: "",
        category: null,
        author: "",
        description: "",
        image: null,
      })
    }
  }
  useEffect(() => {
    loadData();
  }, [mode]);


  const convertToFormData = (formData) => {
    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formDataObj.append(key, value);
      } else if (key !== "image") {
        formDataObj.append(key, value);
      }
    });
    return formDataObj;
  };

  const validateForm = (data) => {
    const errors = {};
    // rich-text
    if (!data.description.trim() || (isRichTextEmpty && isRichTextEmpty(data.description))) {
      errors.description = "Required.";
    }
    if (!data.author || !data.author.trim()) {
      errors.author = "Required.";
    }
    if (!data.image_alt_text || !data.image_alt_text.trim()) {
      errors.image_alt_text = "Required.";
    }
    if (!data.title || !data.title.trim()) {
      errors.title = "Title is required.";
    } else if (data.title.length < 5) {
      errors.title = "Title must be at least 5 characters long.";
    } else if (data.title.length > 100) {
      errors.title = "Title cannot exceed 100 characters.";
    } else if (!/^[a-zA-Z0-9\s.,'-]+$/.test(data.title.trim())) {
      errors.title = "Title contains invalid characters.";
    }

    if (!data.category) {
      errors.category = "Required.";
    }
    if (!data.image) {
      errors.image = "Required.";
    }
    return errors;
  };

  const handleSubmit = (is_published) => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) {
      return;
    }
    // set confirmation popup
    if (is_published && !isConfirmModalOpen) {
      setIsConfirmModalOpen(true);
      return;
    }

    setIsLoading(true);
    formData.is_published = is_published;
    if (mode === 'edit') {
      delete formData['published_on']
    }

    const method = mode === 'edit' ? 'put' : 'post';
    const apiUrl = formData.id
      ? `/communication/blogs/${formData.id}/`
      : '/communication/blogs/';

    // convert to multipart formdata
    const payLoad = convertToFormData(formData)
    console.log(payLoad);


    API[method](apiUrl, payLoad, { headers: { "Content-Type": "multipart/form-data" } })
      .then(response => {
        setMessage(is_published ? "Blog has been published successfully!" : "Blog has been saved as a draft.")
        setIsMessageModalOpen(true)
        setIsLoading(false)
        setIsConfirmModalOpen(false)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
        console.error('Error fetching data:', error);
      });
  }


  const handleAddCategory = () => {
    setIsAddModalOpen(true);
    setAddModalTitle('Category');
    setAddSectionAPI("/communication/blog-categories")
  }


  return (
    <div className="blog-add-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>
                        {mode === 'edit' ? 'Edit Blog' : 'New Blog'}
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="tab-content" id="pills-tabContent">
                            <div className='form-sec row p-1'>
                              <div className='col-12 '>
                                <div className='w-100 me-2 mb-3'>
                                  <label>Title</label>
                                  <input id="title" placeholder='' value={formData.title} name="title" required onChange={handleInputChange} ></input>
                                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                </div>
                              </div>
                              <div className='col-lg-6 '>
                                <div className='w-100 me-2 mb-3'>
                                  <label>Author</label>
                                  <input id="author" placeholder='' value={formData.author} name="author" required onChange={handleInputChange} ></input>
                                  {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                                </div>
                              </div>
                              <div className='col-lg-6 '>
                                <div className='w-100 me-2 mb-3'>
                                  <div className='d-flex align-items-center justify-content-between'>
                                    <label>Category</label>
                                    <div className='add-button' onClick={handleAddCategory}>
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00877 0.5C8.62853 0.5 9.13931 1.00562 9.13931 1.62694L9.1396 6.88154H14.3778C14.9976 6.88154 15.5 7.38522 15.5 8.00654C15.5 8.62786 14.9976 9.13154 14.3778 9.13154H9.1396L9.13949 14.3718C9.13949 14.9931 8.63708 15.4968 8.01732 15.4968C7.39757 15.4968 6.89516 14.9931 6.89516 14.3718L6.89527 9.13154H1.63714C1.01738 9.13154 0.5 8.61234 0.5 7.99102C0.5 7.3697 1.01738 6.88154 1.63714 6.88154H6.89527L6.89498 1.62694C6.89498 1.00562 7.38901 0.5 8.00877 0.5Z" fill="#0587DB" />
                                      </svg>
                                      <label>Add Category</label>
                                    </div>
                                  </div>

                                  <select className="form-select subject" id="category" name="category" value={formData.category} onChange={handleInputChange}  >
                                    <option value={''}>Select</option>
                                    {categories.map((item, index) => (
                                      <option value={item.id}>{item.name}</option>
                                    ))}
                                  </select>
                                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                                </div>
                              </div>
                              <div className='col-12'>
                                <div className='w-100 me-2 mb-1'>
                                  <label>Image</label>
                                  <ImgFileDropZone
                                    onFileSelect={(imageURL) => handleImgFileSelect(imageURL)}
                                    inputId={`sectionImageInput`}
                                    showPreview={!!formData.image}
                                    imagePreview={formData.image} />
                                  {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                </div>

                                <div className='w-100 me-2 mb-3'>
                                  <label>Alt Text for Image</label>
                                  <input id="image_alt_text" placeholder='Enter alt text' value={formData.image_alt_text} name="image_alt_text" required onChange={handleInputChange} ></input>
                                  {errors.image_alt_text && <div className="invalid-feedback">{errors.image_alt_text}</div>}
                                </div>
                              </div>
                             
                              <div className='col-12 '>
                                <div className='w-100 me-2 mb-3'>
                                  <label>Description</label>
                                  {/* <textarea className='w-100' name='description' value={formData.description} rows={8} onChange={handleInputChange} ></textarea> */}

                                  {/* Rich Text */}
                                  {/* {mode === 'edit' ?
                                    < RichTextEditor sectionId={1} onContentChange={handleDescriptionChange} initialContent={formData.description} />
                                    :
                                    < RichTextEditor sectionId={1} onContentChange={handleDescriptionChange} />
                                  } */}
                                  <RichTextEditor
                                    sectionId={1}
                                    onContentChange={handleDescriptionChange}
                                    initialContent={mode === 'edit' ? formData.description : JSON.stringify({ blocks: [], entityMap: {} })}
                                  />


                                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>
                              </div>

                              <div className='d-flex justify-content-between mt-3 button-box'>
                                <button className='btn-outlined px-4 me-5' onClick={() => navigate('/admin/blog/list')} >Discard</button>
                                <button className='btn-outlined px-4 me-3' onClick={() => handleSubmit(false)} >Save as Draft</button>
                                <button className='btn-primary px-4 me-3' onClick={() => handleSubmit(true)} >Publish</button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Confirm Modal */}
      {isConfirmModalOpen &&
        <div className='custom-modal '>
          <div className='card'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              <h1>Publish</h1>
              <p className="mb-4">Are you sure you want to publish?</p>
              <div className='footer'>
                <button type='button' className='cancel-button' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                <button type='button' className='ok-button' onClick={() => handleSubmit(true)}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      }


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => navigate('/admin/blog/list')} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
      {isAddModalOpen && <AddDataPopup title={addModalTitle} addSectionAPI={addSectionAPI} setterFunction={setIsAddModalOpen} okClickedFunction={loadCategories} />}

    </div>
  )
}


export default BlogAdd