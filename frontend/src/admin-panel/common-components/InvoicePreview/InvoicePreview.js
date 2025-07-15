import React from 'react'
import './InvoicePreview.scss'

const InvoicePreview = ( {visibleFields} ) => {
    if (visibleFields === undefined ){
        visibleFields = [
            {label:"Sl No.", key_name:"sl_no"}, 
            {label:"Product", key_name:"item"},
            {label:"Duration", key_name:"duration"},
            {label:"Amount", key_name:"amount"},
          ]
    }
  return (
    <div className='invoice-preview'>
        <div className='title-header'>
            <div className='app-logo'>
                <img src='/images/admin-panel/app-logo.svg' alt=''></img>
            </div>
            <div className='title'>
                <h1>Zog Global Ltd</h1>
                <p>Suite V3, 4 Woodland Road,</p>
                <p>Darlington, DL3 7PJ</p>
            </div>
        </div>
        <div className='sec-2'>
            <div className='left'>
                <p className='invoice-num'>Invoice for <span>ZgukS15201</span></p>
                <h1>Mango. Inc</h1>
                <p>Apto. 761 13975 Santos</p>
                <p>Travessa,</p>
                <p>Câmara de Lobos, UT 4431</p>
            </div>
            <div className='right'>
                <p>Amount Due</p>
                <h1>£ 169.95</h1>
                <p className='issued'>Due on Nov 23, 2024 |<span> Issued on</span> Feb 20, 2024</p>
            </div>
        </div>
        <div className='sec-3'>
            <table>
                <thead>
                    
                    <tr>
                    {visibleFields.map((field, index) => (
                        field.key_name !== 'sl_no' &&
                        <th key={index}>{field.label}</th>
                    ))}
                
                        
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Digital Engineering</td>
                        <td>25/12/2023 - 28/12/2023</td>
                        <td>£450.62</td>
                    </tr>
                    <tr>
                        <td>Cybersecurity</td>
                        <td>25/12/2023 - 28/12/2023</td>
                        <td>£450.62</td>
                    </tr>
                    <tr>
                        <td>Cybersecurity</td>
                        <td>25/12/2023 - 28/12/2023</td>
                        <td>£450.62</td>
                    </tr>
                    <tr>
                        <td>Cybersecurity</td>
                        <td>25/12/2023 - 28/12/2023</td>
                        <td>£450.62</td>
                    </tr>

                    <tr className='overview'>
                        <td colSpan={3}>
                        <div className='calculation sub-total'>
                                <span className='key '>Sub Total</span>
                                <span className='value'>£ 169.95</span>
                        </div>
                        </td>
                    </tr>
                    <tr className='overview'>
                        <td colSpan={3}>
                        <div className='calculation'>
                                <span className='key'>Admin Fee</span>
                                <span className='value'>£ 169.95</span>
                        </div>
                        </td>
                    </tr>
                    <tr className='overview'>
                        <td colSpan={3}>
                        <div className='calculation'>
                                <span className='key'>VAT</span>
                                <span className='value'>£ 169.95</span>
                        </div>
                        </td>
                    </tr>
                    <tr className='overview'>
                        <td colSpan={3}>
                        <div className='calculation'>
                                <span className='key'>Discount</span>
                                <span className='value'>£ 169.95</span>
                        </div>
                        </td>
                    </tr>
                    <tr className='overview'>
                        <td colSpan={3}>
                        <div className='calculation grand-total'>
                                <span className='key'>Grand Total</span>
                                <span className='value'>£ 169.95</span>
                        </div>
                        </td>
                    </tr>
                    <tr className='overview'>
                        <td colSpan={3}>
                        <div className='account acc-num'>
                                <span className='key'>Account Number :</span>
                                <span className='value'>XXXX-XXXX-XXXX-1234</span>
                        </div>
                        <div className='account sort-code'>
                                <span className='key'>Sort Code :</span>
                                <span className='value'>04-06-XX</span>
                        </div>
                        </td>
                    </tr>
                

                </tbody>
                
            </table>
        </div>
    </div>
  )
}

export default InvoicePreview