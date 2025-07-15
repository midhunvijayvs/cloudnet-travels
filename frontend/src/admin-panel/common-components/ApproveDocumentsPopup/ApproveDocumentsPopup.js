
import React, { useEffect, useState } from 'react';
import "../../../CustomPopup.scss";
import "./ApproveDocumentsPopup.scss";
import API from '../../../API'
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate, Link } from 'react-router-dom';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";

const ApproveDocumentsPopup = ({ setterFunction, loadData, selectedId, SelectedItem, resourseName }) => {

  const navigate = useNavigate()

  const [data, setData] = useState(false);
  const [bankData, setBankData] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectionLoading, setIsRejectionLoading] = useState(false);
  const [isBankLoading, setIsBankLoading] = useState(false);
  const [isSecondScreenShown, showSecondScreen] = useState(false)
  const [formFrrors, setFormErrors] = useState({});
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [idSelected, selectId] = useState(null);

  const [isBankDetailsVisible, setBankDetailsVisible] = useState(false);
  const [isBankDetailsMasked, setIsBankDetailsMasked] = useState(true);
  const [isMaskLoading, setIsMaskLoading] = useState(false);
  const toggleBankDetailsVisibility = () => {
    setBankDetailsVisible(!isBankDetailsVisible);
  };


  let requiredDocuments = [
    "Business Registration Certificate",
    "Health & Safety Certificate",
    "Public Liability Insurance",
    "Premises licence",
  ];

  if (resourseName === "grocery_store") {
    requiredDocuments = [
      "Business Registration Certificate",
      "Food Safety & Hygiene Certificate",
      "Retail License",
      "Public Liability Insurance"
    ];
  }


  useEffect(() => {
    // console.log(SelectedItem, selectedId);
    loadDocData();
    loadBankData();
  }, [])


  const loadDocData = () => {
    setIsLoading(true)
    let apiUrl;
    if (resourseName === 'grocery_store') {
      apiUrl = `/grocery/documents/?grocery_store_id=${selectedId}`
    } else {
      apiUrl = `/restaurants/documents/?restaurant_id=${selectedId}`
    }
    API.get(apiUrl)
      .then((response) => {
        setData(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
      })
  }

  const loadBankData = () => {
    if (SelectedItem.user) {
      API.get(`/payments/receiver-bank-details/?user=${SelectedItem.user}`)
        .then((response) => {
          setBankData(response.data?.[0] || null)
        })
        .catch((error) => {
        })
    }
  }
  const toggleMasking = () => {
    if (isBankDetailsMasked) {
      if (bankData.id) {
        setIsMaskLoading(true)
        API.get(`/payments/receiver-bank-details/${bankData.id}/`)
          .then((response) => {
            setIsBankDetailsMasked((prev) => !prev);
            setIsMaskLoading(false);
          })
          .catch((error) => {
            setIsMaskLoading(false)
          })
      }
    } else {
      setIsBankDetailsMasked(true)
    }

  };


  const verifyBankAccount = () => {
    setIsBankLoading(true);
    let apiUrl = `/restaurants/verify-bank-details/${selectedId}/`
    if (resourseName === 'grocery_store') {
      apiUrl = `/grocery/verify-bank-details/${selectedId}/`
    }
    API.post(apiUrl)
      .then(response => {
        setIsBankLoading(false);
        setMessage('Verification successful.');
        setIsMessageModalOpen(true)
        loadBankData()
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true)
        setIsBankLoading(false);
      });

  }


  const approve = (id) => {
    selectId(id);
    setIsLoading(true)
    let data = { is_verified: "True" }
    let apiUrl = `/restaurants/documents/${id}/`
    if (resourseName === 'grocery_store') {
      apiUrl = `/grocery/documents/${id}/`
    }
    API.put(apiUrl, data)
      .then(response => {
        setIsLoading(false)
        loadDocData()
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true)
        setIsLoading(false)
      });
  }
  const rejectDoc = (id) => {
    selectId(id);
    setIsRejectionLoading(true)
    let data = { is_rejected: "True" }
    let apiUrl = `/restaurants/documents/${id}/`
    if (resourseName === 'grocery_store') {
      apiUrl = `/grocery/documents/${id}/`
    }
    API.put(apiUrl, data)
      .then(response => {
        setIsRejectionLoading(false)
        loadDocData()
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true)
        setIsRejectionLoading(false)
      });
  }

  // view docs
  const [blobUrl, setBlobUrl] = useState(null);
  // const [fileUrl, setFileUrl] = useState(null);
  // const [passwordInput, setPasswordInput] = useState("");
  // const onPasswordChange = (e) => {
  //   setPasswordInput(e.target.value)
  // }
  // const handleDocsView = (doc)=>{
  //   setIsPasswordModalOpen(true);
  //   setFileUrl(doc?.file);

  // }

  const handleDocsView = async (fileUrl) => {
    // if (!passwordInput) {
    //   setMessage("Password is required to view the document.");
    //   setIsErrorModalOpen(true);
    //   return;
    // }
    try {
      // First, verify the password
      // await API.post(`/restaurants/documents/verify_password`, { password: passwordInput });

      // Once password is verified, proceed to fetch and view the document
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      // setIsPasswordModalOpen(false)
      // setPasswordInput('')
      window.open(url, '_blank'); // Opens the blob in a new tab
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setIsErrorModalOpen(true);
    }
  };

  const handlePDFView = (file) => {
    const fileId = file.id; // Get the file ID
    // navigate(`/admin/restaurant/pdf/${fileId}`)
    let newTabUrl = `${window.location.origin}/admin/restaurant/pdf/${fileId}`; // Full URL with fileId
    if (resourseName === 'grocery_store') {
      newTabUrl = `${window.location.origin}/admin/grocery-store/pdf/${fileId}`; // Full URL with fileId

    }
    window.open(newTabUrl, '_blank'); // Open the URL in a new tab without triggering an app reload
  };




  return (
    <div className='custom-modal document-approve-modal'>
      <div className='card'>

        <div className='first-screen'>
          <h1>Verify Documents</h1>
          <div className='body'>
            <table className='mb-3'>
              <tr>
                <th>Doc. Name</th>
                <th>Number</th>
                <th>File</th>
                <th>Approve</th>
                <th>Reject</th>
              </tr>
              {requiredDocuments.map((docName) => {
                const matchingDoc = data?.results?.find((item) => item.name === docName);

                return (
                  <tr key={docName}>
                    <td>
                      <div className='doc-name'>
                        {docName}
                      </div>
                    </td>
                    <td>
                      <div className='doc-number'>
                        {matchingDoc ? matchingDoc.documentno : "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className='d-flex justify-content-center align-items-center'>
                        {matchingDoc?.file ? (
                          <button className='doc-view-btn'
                            onClick={() => handlePDFView(matchingDoc)}
                          // onClick={() => handleDocsView(matchingDoc)}
                          >
                            View
                          </button>
                          // <Link to={matchingDoc.file}>
                          // </Link>
                        ) : (
                          <span className='not-available'>
                            N/A
                          </span>
                        )}
                      </div>

                    </td>
                    <td>
                      <div className='d-flex justify-content-center align-items-center'>
                        {matchingDoc ? (
                          matchingDoc.is_verified ? (
                            <div className='approve-btn active'>
                              Approved
                              <img className='verified'
                                src='/images/admin-panel/document-verify-popup/tick.svg'
                                alt='Verified'
                              />
                            </div>
                          ) : (
                            isLoading && idSelected === matchingDoc.id ? (
                              <img
                                style={{ height: "40px" }}
                                src='/images/loader.gif'
                                alt='Loading'
                              />
                            ) : (
                              <button
                                onClick={() => approve(matchingDoc.id)}
                                className='approve-btn'
                              >
                                Approve
                              </button>
                            )
                          )
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </td>
                    <td>
                      <div className='d-flex justify-content-center align-items-center'>
                        {matchingDoc ? (
                          matchingDoc.is_verified ? (
                            "N/A"
                          ) : (
                            matchingDoc.is_rejected ? (
                              <div className='reject-btn active'>
                                Rejected
                                <img
                                  className='verified'
                                  src='/images/admin-panel/document-verify-popup/reject.svg'
                                  alt='Rejected'
                                />
                              </div>
                            ) : (
                              isRejectionLoading && idSelected === matchingDoc.id ? (
                                <img
                                  style={{ height: "40px" }}
                                  src='/images/loader.gif'
                                  alt='Loading'
                                />
                              ) : (
                                <button
                                  onClick={() => rejectDoc(matchingDoc.id)}
                                  className='reject-btn'
                                  disabled={matchingDoc?.is_verified}
                                  data-tooltip={!matchingDoc?.is_verified ?
                                    'Reject the document and send an email to the restaurant user requesting them to upload a new document for verification.'
                                    : null}
                                >
                                  Reject
                                </button>
                              )
                            )
                          )
                        ) : (
                          "N/A"
                        )}
                      </div>

                    </td>
                  </tr>
                );
              })}
              {
                SelectedItem?.selling_alcohol &&
                <tr>
                  <td colSpan={5} className='alcohol'>
                    <div className='providing-alcohol'>
                      * Restaurant is providing alcohol. Please verify the premises license as well.
                    </div>
                  </td>
                </tr>
              }
              {/* Bank Details Row */}
              <tr>
                <td colSpan={2} className="bank-details">
                  <div className='doc-name'>
                    Bank Details
                  </div>
                </td>
                {bankData &&
                  <td >
                    <div className='d-flex justify-content-center align-items-center'>
                      <button className='doc-view-btn' onClick={toggleBankDetailsVisibility}>View</button>
                    </div>
                  </td>
                }

                {bankData ?
                  <td colSpan={2}>
                    <div className='w-100 d-flex justify-content-center align-items-center'>
                      {bankData?.is_bank_verified ?
                        <div className='approve-btn active'>
                          Verified
                          <img className='ms-2' style={{ height: "20px", margin: "0px" }} src='/images/admin-panel/document-verify-popup/tick.svg'></img>
                        </div>
                        :
                        isBankLoading ? <img style={{ height: "40px" }} src='/images/loader.gif'></img>
                          : <button className='approve-btn' onClick={verifyBankAccount}>Verify Bank Details</button>}
                    </div>

                  </td>
                  :
                  <td colSpan={3}>
                    <div className='w-100 d-flex justify-content-center align-items-center'>
                      N/A
                    </div>
                  </td>
                }

              </tr>
            </table>
          </div>

          <div className='footer single-button-footer'>
            <button type='button' className='cancel-button' onClick={() => { loadData(); setterFunction(false) }}>Close</button>

          </div>
        </div>

      </div>
      {isBankDetailsVisible &&
        <div className='custom-modal bank'>
          <div className='card'>
            <div className='first-screen'>
              <div className='verify-bank-acc'>
                <h1>Bank Details</h1>
                <div className="bank-details">
                  <div className="">
                    <p>
                      <span className="col-name">Account Number:</span>{" "}
                      {bankData?.account_no
                        ? isBankDetailsMasked
                          ? `XXXX-XXXX-XXXX-${bankData.account_no.slice(-4)}`
                          : bankData?.account_no
                        : "N/A"}
                    </p>
                    <p>
                      <span className="col-name">Account Holder Name:</span>{" "}
                      {bankData?.account_holder_name || "N/A"}
                    </p>
                    <p>
                      <span className="col-name">SWIFT Code:</span>{" "}
                      {bankData.swift_code
                        ? isBankDetailsMasked
                          ? bankData?.swift_code.replace(/./g, "*")
                          : bankData.swift_code
                        : "N/A"}
                    </p>
                    <p>
                      <span className="col-name">Sort Code:</span>{" "}
                      {bankData.sort_code
                        ? isBankDetailsMasked
                          ? bankData?.sort_code.replace(/\d{2}(?=\d)/g, "**").replace(/(\*\*\d{2})(\d{2})$/, "$1-$2")
                          : bankData.sort_code
                        : "N/A"}
                    </p>
                    <p>
                      <span className="col-name">IBAN:</span>{" "}
                      {bankData.iban
                        ? isBankDetailsMasked
                          ? bankData?.iban.replace(/.(?=.{4})/g, "*")
                          : bankData.iban
                        : "N/A"}
                    </p>
                  </div>
                  <div className='d-flex justify-content-center align-items-center'>
                    <button onClick={toggleMasking} className="toggle-mask-btn" disabled={isMaskLoading}>
                      {isMaskLoading ? (
                        <div className="spinner-border spinner-border-sm text-secondary" role="status" >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : isBankDetailsMasked ? (
                        <img src='/images/admin-panel/document-verify-popup/hide.svg' alt="Hide" />
                      ) : (
                        <img src='/images/admin-panel/document-verify-popup/show.svg' alt="Show" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className='footer mt-2'>
                <button type='button' className='btn-outlined' onClick={toggleBankDetailsVisibility} >Close</button>
                {/* <button type='button' className='btn-primary'
                >Proceed</button> */}
              </div>
            </div>
          </div>
        </div>
      }
      {/* {isPasswordModalOpen &&
        <div className='custom-modal password-confirm'>
          <div className='card'>

            <div className='first-screen'>
              <input
                type='password'
                name='password'
                value={passwordInput}
                onChange={onPasswordChange}
                placeholder='Enter Your Password'
                autoComplete="new-password"
              />

              <div className='footer mt-3'>
                <button type='button' className='cancel-button' onClick={() => { setIsPasswordModalOpen(false) }}>Close</button>
                <button type='button' className='ok-button' onClick={verifyDocumentPassword}>Submit</button>
              </div>
            </div>

          </div>
        </div>
      } */}
      <ErrorModal message={message} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { setIsErrorModalOpen(false) }} />
      {isLoading && <FixedOverlayLoadingSpinner />}
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { setterFunction(false); loadData() }} />}

    </div>
  );
};

export default ApproveDocumentsPopup;

