// toastConfig.js

import { toast } from 'react-toastify';

// Configure global toast settings
toast.configure({
  autoClose: 1000, // Set the desired autoClose duration in milliseconds (2 seconds in this example)
  position: 'bottom-right', // You can customize the position here as well
  // Add other global configuration options as needed
});

export default toast;
