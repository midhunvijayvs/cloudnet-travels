
import API from './API';
import { UK_COUNTIES } from './Constants';
import { saveAs } from 'file-saver'; // Import file-saver library
import InvoiceTemplate from './InvoiceTemplate';
import ResumeTemplate from './ResumeTemplate';
import { pdf } from '@react-pdf/renderer'; // Import from react-pdf/renderer
import { Filter } from "bad-words"; 


// google map navigation
export const navigateToGoogleMapLocation = (lat, lng) => {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(googleMapsUrl, '_blank');
};

export const createRoomName = (userId1, userId2)=> {
  const min = Math.min(userId1, userId2);
  const max = Math.max(userId1, userId2);
  return `${min}_${max}`;
}

export const getFileNameFromUrl = (url) => {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
};

export const getMediaTypeFromUrl = (url) => {
  if (url) {
    // Extract the file extension correctly
    const fileExtension = url.split('.').pop().toLowerCase();

    // Check for image types, including '.jpg' and '.jpeg'
    if (/^(png|jpe?g|gif|bmp|webp)$/i.test(fileExtension)) {
      return 'image'; // Image file types
    }

    // Check for PDF files
    if (/^(pdf)$/i.test(fileExtension)) {
      return 'pdf'; // PDF file
    }

    // Check for Word documents
    if (/^(docx?)$/i.test(fileExtension)) {
      return 'document'; // Word document file
    }
  }
  return 'file'; // Default for other file types
};

export const formatChatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  }
};

export const parseBotMessage = (message) => {
  if (typeof message === 'string') {
    try {
      const parsedMessage = JSON.parse(message);
      return parsedMessage.message; // Return the parsed message's "message" field
    } catch (error) {
      return 'Error parsing message'; // Fallback if JSON is malformed
    }
  }
  return message; // If it's not a string, return as is
};

export function formatDateToDDMMYY(isoDate) {
  const date = new Date(isoDate);

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const yy = String(date.getFullYear());

  return `${dd}-${mm}-${yy}`;
}


export const isoToDatetimeLocal = (isoString) => {
  if (!isoString) return ""; // Handle empty or undefined values
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16); // Convert to YYYY-MM-DDTHH:MM format
};

export const convertTo12HourTime = (timeString) => {
  // Extract time part from the ISO string
  const time = new Date(timeString); // Convert the ISO string to a Date object

  // Get hours and minutes from the Date object
  let hours = time.getHours(); // Get hours in 24-hour format
  const minutes = time.getMinutes(); // Get minutes

  // Determine AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12 || 12; // If hours is 0 (midnight), set it to 12

  // Format the time string
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;

  return formattedTime;
}

export const convertTimeString12Hour = (timeString) => {
  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(':').map(Number);

  // Determine AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  const adjustedHours = hours % 12 || 12; // If hours is 0 (midnight), set it to 12

  // Format the time string
  const formattedTime = `${adjustedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;

  return formattedTime;
};


export const fetchInvoiceDataAndGeneratePdf = async (id) => {
  try {
    const response = await API.get(`/payments/invoices/${id}/`);
    const invoiceData = response.data;
    // Generate and save PDF blob
    const blob = await pdf(

      <InvoiceTemplate data={invoiceData} />

    ).toBlob();

    saveAs(blob, 'invoice.pdf'); // Automatically trigger download. save as is a very useful library to download files. it will replace the following 9 commented lines

    //   const blobUrl = URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.style.display = 'none';
    //   a.href = blobUrl;
    //   a.download = 'invoice.pdf';
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    //   URL.revokeObjectURL(blobUrl);
    // 
  }
  catch (error) {
    console.error('Error fetching invoice data:', error);
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString('en-GB', options).split('/').reverse().join('-');
};

export const fetchResumeDataAndGeneratePdf = async (id) => {
  try {
    const response = await API.get(`download-resume/${id}/`);
    const invoiceData = response.data.invoice_data;

    // Generate and save PDF blob
    const blob = await pdf(

      <ResumeTemplate invoiceData={invoiceData} />

    ).toBlob();

    saveAs(blob, 'resume.pdf'); // Automatically trigger download. save as is a very useful library to download files. it will replace the following 9 commented lines

    //   const blobUrl = URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.style.display = 'none';
    //   a.href = blobUrl;
    //   a.download = 'invoice.pdf';
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    //   URL.revokeObjectURL(blobUrl);
    // 
  }
  catch (error) {
    console.error('Error fetching invoice data:', error);
  }
};


export function formatDateTime(inputDate) {
  const date = new Date(inputDate);
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit' };

  // Helper function to format date
  function formatTime(date) {
    return date.toLocaleTimeString([], options).replace(/(\d+):(\d+)/, "$1:$2");
  }

  // Check if the date is today
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return `Today, ${formatTime(date)}`;
  }

  // Check if the date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isYesterday) {
    return `Yesterday, ${formatTime(date)}`;
  }

  // Format date as '25 March 2024, 8:00 PM'
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}, ${formatTime(date)}`;
}

export function formatDateTimeToMonthYear(dateString) {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB', options);

  // Rearrange the date format to "day month, year"
  const [day, month, year] = formattedDate.split(' ');
  return `${day} ${month}, ${year}`;
}

export function formatDateTime2MonthYearTime(timestamp) {
  const date = new Date(timestamp);

  const padZero = (num) => (num < 10 ? `0${num}` : num);

  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1); // Months are zero-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'

  const formattedDate = `${day}-${month}-${year}`;
  const formattedTime = `${padZero(hours)}:${minutes} ${ampm}`;

  return `${formattedDate} ${formattedTime}`;
}

export function IsoDateTimeToFormatedTime(timestamp) {
  const date = new Date(timestamp);

  const padZero = (num) => (num < 10 ? `0${num}` : num);

  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // Convert '0' to '12'

  return `${padZero(hours)}:${minutes} ${ampm}`;
}


export function formatReviewCount(count) {
  if (count >= 1_000_000) {
    // Format in millions, removing decimal if it is .0
    const millions = (count / 1_000_000).toFixed(1);
    return millions.endsWith('.0') ? `${Math.floor(count / 1_000_000)}M+` : `${millions}M+`;
  } else if (count >= 1_000) {
    // Format in thousands, removing decimal if it is .0
    const thousands = (count / 1_000).toFixed(1);
    return thousands.endsWith('.0') ? `${Math.floor(count / 1_000)}k+` : `${thousands}k+`;
  } else {
    return count.toString();
  }
}

export const timeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diff = now - past;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hr${hours !== 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

const GoogleMapApiKey = process.env.REACT_APP_GOOGLEMAP_APIKEY;
export const fetchBrowserCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // Use Google Maps Geocoding API to get address from lat/lng
          let apiUrl = `/communication/get-address/?lat=${lat}&lng=${lng}`;
          API.get(apiUrl)
            .then(response => {
              const address = response.data.results[0]?.formatted_address || 'Current location';
              // Resolve with the location data
              resolve({
                name: 'Current Location',
                address: address,
                lat,
                lng,
              });
            })
            .catch(error => {
              reject('Error fetching address');
              // setIsErrorModalOpen(true);
            });
        },
        (error) => {
          console.error('Error fetching location', error);
          if (error.code === error.PERMISSION_DENIED) {
            // Show a popup to the user if location access is denied
            alert('Location access is blocked. Please enable it in your browser settings.');
          }
          reject('Unable to fetch location');
        }
      );
    } else {
      // Reject if geolocation is not supported
      reject('Geolocation not supported');
    }
  });
};


export function getAddressFromLatLng(lat, lng) {
  let apiUrl = `/communication/get-address/?lat=${lat}&lng=${lng}`;
  return API.get(apiUrl)
    .then(response => {
      const address = response.data.results[0]?.formatted_address || 'Current location';
      return address;
    })
    .catch(error => {
      return 'Location';
    });
}


export function formatTimeFromMinutes(minutes) {
  minutes = minutes.toFixed(0)
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hr${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min${mins > 1 ? '' : ''}` : ''}`;
  } else {
    return `${minutes} min${minutes > 1 ? '' : ''}`;
  }
}

export function convertRichTextJsonToText(jsonData) {
  // Check if jsonData is undefined or null
  if (jsonData === undefined || jsonData === null) {
    return ''; // Return an empty string if no data is passed
  }
  let parsedData;
  // Try to parse the JSON, if it fails treat the description as plain text
  try {
    parsedData = JSON.parse(jsonData);
  } catch (error) {
    // If it's not JSON, treat it as plain text
    const isEmpty = jsonData.trim().length === 0;
    return isEmpty ? '' : jsonData; // Return the description if it's not empty
  }
  // If the parsing is successful, handle it as JSON
  const textWithNewLines = parsedData.blocks
    .map((block) => block.text)
    .join('\n'); // Join each block's text with a newline

  return textWithNewLines;
}

export const getTimeLeft = (orderPlacedTime, maxTimeInMinutes) => {
  const orderPlacedDate = new Date(orderPlacedTime);
  const currentTime = new Date();

  // Calculate the difference in milliseconds
  const timeDiff = currentTime - orderPlacedDate;

  // Convert difference to seconds
  const timeDiffInSeconds = Math.floor(timeDiff / 1000);

  // Calculate remaining time
  const remainingTime = (maxTimeInMinutes * 60) - timeDiffInSeconds;

  // Return remaining time (if positive), otherwise return 0
  return Math.max(remainingTime, 0);
};


export const playSound = (soundFile) => {
  const audio = new Audio(soundFile);
  audio.play().catch((error) => {
    console.error('Error playing sound:', error);
  });
};

// Notification sound function
export const playNotificationSound = () => {
  const notificationSound = '/audio/notifications/message-alert.mp3';
  playSound(notificationSound);
};

// New order sound function
export const playNewOrderSound = () => {
  const newOrderSound = '/audio/notifications/new-order.mp3';
  playSound(newOrderSound);
};

export const slugify = (title) => {
  return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Replace spaces and special characters with hyphens
      .replace(/^-+|-+$/g, '');      // Trim hyphens from the start/end
};
export const deslugify = (slug) => {
  return slug
      .replace(/-/g, ' ')             // Replace hyphens with spaces
      .replace(/\b\w/g, char => char.toUpperCase());  // Capitalize first letter of each word
};

export const formatDeliveryStatus = (status) => {
  const exceptions = ['and', 'by', 'for', 'to', 'the', 'of']; 
  return status
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => exceptions.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};


export function formatOpeningTime(nextOpeningTime) {
  if (!nextOpeningTime) {
    return "Opening time unavailable";
  }

  try {
    const openingTime = new Date(nextOpeningTime);
    const now = new Date();
    const diffMs = openingTime.getTime() - now.getTime();
    const diffMin = Math.round(diffMs / (60 * 1000)); // Difference in minutes

    if (diffMin < 0) {
      return "Already Opened"; // Or handle as needed (e.g., "Closed")
    }

    if (diffMin < 60) {
      if (diffMin <= 1) {
        return "Opens in 1 min";
      }
      return `Opens in ${diffMin} min`;
    } else if (openingTime.getDate() === now.getDate()) {
        const formattedTime = openingTime.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
        return `Opens at ${formattedTime}`
    }
     else {
      const formattedTime = openingTime.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `Opens Tomorrow ${formattedTime}`;
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid opening time format";
  }
}

export function formatClosingTime(nextClosingTime) {
  if (!nextClosingTime) {
    return null; // Return null if no closing time is provided
  }

  try {
    const closingTime = new Date(nextClosingTime);
    const now = new Date();
    const diffMs = closingTime.getTime() - now.getTime();
    const diffMin = Math.round(diffMs / (60 * 1000)); // Difference in minutes

    if (diffMin < 0) {
        return null; // If the time has already passed
    }

    if (diffMin < 60) {
      if (diffMin <= 1) {
        return "Closing in 1min";
      }
        return `Closing in ${diffMin}min`;
    } else {
      return null; // Return null if closing time is more than 1 hour away
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return null; // Or handle the error as needed
  }
}

// filter offensice words
export const sanitizeOffensiveText = (text) => {
  const filter = new Filter();
  const customBadWords = []; // Add custom words
  filter.addWords(...customBadWords);
  console.log(filter);
  
  return filter.clean(text);
};


export const  generateBookingId=() =>{
  const now = new Date();

  const pad = (num) => String(num).padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // Months are 0-based
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `CLDNTBOOK${year}${month}${day}${hours}${minutes}${seconds}`;
}
export const  generateTransactionId=() =>{
  const now = new Date();

  const pad = (num) => String(num).padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // Months are 0-based
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `CLDNTTXN${year}${month}${day}${hours}${minutes}${seconds}`;
}