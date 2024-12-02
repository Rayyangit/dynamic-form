import React, { useState } from "react";



// Mock backend API responses
const mockApiResponses = {
  "User Information": {
    fields: [
      { name: "FirstName", type: "text", label: "First Name", required: true },
      { name: "LastName", type: "text", label: "Last Name", required: true },
      { name: "Age", type: "number", label: "Age", required: false },
    ],
  },
  "Address Information": {
    fields: [
      { name: "Street", type: "text", label: "Street", required: true },
      { name: "City", type: "text", label: "City", required: true },
      {
        name: "State",
        type: "dropdown",
        label: "State",
        options: ["California", "Texas", "New York"],
        required: true,
      },
      { name: "ZipCode", type: "text", label: "Zip Code", required: false },
    ],
  },
  "Payment Information": {
    fields: [
      { name: "CardNumber", type: "text", label: "Card Number", required: true },
      { name: "ExpiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "CVV", type: "password", label: "CVV", required: true },
      { name: "CardHolderName", type: "text", label: "Cardholder Name", required: true },
    ],
  },
};

const DynamicForm = () => {
  const [selectedForm, setSelectedForm] = useState("User Information");
  const [formFields, setFormFields] = useState(mockApiResponses[selectedForm].fields);
  const [formValues, setFormValues] = useState({});
  const [userData, setUserData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null); 
  const [editForm, setEditForm] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  // Update progress bar
  const updateProgress = () => {
    const totalFields = formFields.length;
    const filledFields = formFields.filter((field) => formValues[field.name]);
    const progressValue = Math.round((filledFields.length / totalFields) * 100);
    setProgress(progressValue);
  };

  // Handle dropdown selection
  const handleFormChange = (formType) => {
    setSelectedForm(formType);
    setFormFields(mockApiResponses[formType].fields);
    setFormValues({});
    setProgress(0);
    setFeedbackMessage("");
    setError("");
    setEditIndex(null);
    setEditForm(""); 
  };

  // Handle form field input change
  const handleInputChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setError(""); 
    updateProgress(); 
  };

  // Validate required fields
  const validateFields = () => {
   
    for (let field of formFields) {
      if (field.required && !formValues[field.name]) {
        setError(`Please fill the required field: ${field.label}`);
        return false;
      }
  
     
      if (selectedForm === "User Information") {
        if (field.name === "FirstName" || field.name === "LastName") {
          if (!/^[A-Za-z]+$/.test(formValues[field.name])) {
            setError(`${field.label} should only contain letters.`);
            return false;
          }
        }
        if (field.name === "age") {
          if (formValues[field.name] <= 0) {
            setError(`Age should be a positive number greater than 0.`);
            return false;
          }
        }
      }
  
      // Address Information Validations
      if (selectedForm === "Address Information" && field.name === "City") {
        if (!/^[A-Za-z\s]+$/.test(formValues[field.name])) {
          setError(`City should only contain letters.`);
          return false;
        }
      }
  
      // Payment Information Validations
      if (selectedForm === "Payment Information") {
        if (field.name === "CardNumber") {
          if (!/^\d+$/.test(formValues[field.name])) {
            setError(`Card number should only contain digits.`);
            return false;
          }
        }
        if (field.name === "CVV") {
          if (!/^\d{3,4}$/.test(formValues[field.name])) {
            setError(`CVV should be a 3 or 4 digit number.`);
            return false;
          }
        }
        if (field.name === "CardHolderName") {
          if (!/^[A-Za-z\s]+$/.test(formValues[field.name])) {
            setError(`Cardholder name should only contain letters.`);
            return false;
          }
        }
      }
    }
  
    // If all validations passed
    setError(""); 
    return true;
  };
  

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return;
  
    // Proceed with adding or editing the data
    if (editIndex !== null) {
      
      const updatedData = { user: [...userData], address: [...addressData], payment: [...paymentData] };
  
      if (editForm === "User Information") {
        updatedData.user[editIndex] = formValues;
        setUserData(updatedData.user);
      } else if (editForm === "Address Information") {
        updatedData.address[editIndex] = formValues;
        setAddressData(updatedData.address);
      } else if (editForm === "Payment Information") {
        updatedData.payment[editIndex] = formValues;
        setPaymentData(updatedData.payment);
      }
  
      setFeedbackMessage("Changes saved successfully.");
      setEditIndex(null);
      setEditForm("");
    } else {
      // Add new entry
      if (selectedForm === "User Information") {
        setUserData((prev) => [...prev, formValues]);
      } else if (selectedForm === "Address Information") {
        setAddressData((prev) => [...prev, formValues]);
      } else if (selectedForm === "Payment Information") {
        setPaymentData((prev) => [...prev, formValues]);
      }
  
      
    }
    setIsButtonClicked(true); 
    setTimeout(() => {
      setIsModalOpen(true); 
      setIsButtonClicked(false); 
    }, 1000);
  
    setFormValues({});
    setProgress(0);
  };
  
  // Handle row deletion
  const handleDelete = (index, formType) => {
    if (formType === "User Information") {
      setUserData((prev) => prev.filter((_, i) => i !== index));
    } else if (formType === "Address Information") {
      setAddressData((prev) => prev.filter((_, i) => i !== index));
    } else if (formType === "Payment Information") {
      setPaymentData((prev) => prev.filter((_, i) => i !== index));
    }
    setFeedbackMessage("Entry deleted successfully.");
  };

  // Handle row editing
  const handleEdit = (index, formType) => {
    setEditIndex(index);
    setEditForm(formType);
    setFormValues(
      formType === "User Information"
        ? userData[index]
        : formType === "Address Information"
        ? addressData[index]
        : paymentData[index]
    );
    setFeedbackMessage("");
  };

  return (
    <div className="p-6  bg-gradient-to-r from-white to-white">
      {/* Header */}
      <header className="text-center bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-lg shadow-lg py-4 mb-6">
        <h1 className="text-2xl font-bold ">Dynamic Form</h1>
      </header>

      {/* Dropdown to select form */}
      <div className="flex justify-center items-center  mt-5 ">
  <div className=" bg-gradient-to-r from-white
   to-white p-8 border border-gray-300 rounded-lg shadow-lg w-full sm:w-1/2">
    {/* Dropdown to select form */}
    <div className="mb-5">
      <label className="block font-medium mb-2">Select Form Type:</label>
      <select
        value={selectedForm}
        onChange={(e) => handleFormChange(e.target.value)}
        className="block w-3/4 sm:w-3/4 p-2 border border-gray-300 rounded"
      >
        {Object.keys(mockApiResponses).map((formType) => (
          <option key={formType} value={formType}>
            {formType}
          </option>
        ))}
      </select>
    </div>

    {/* Error and Feedback Messages */}
    {error && <p className="text-red-500 mb-4">{error}</p>}
    {feedbackMessage && <p className="text-green-500 mb-4">{feedbackMessage}</p>}

    {/* Progress Bar */}
    <div className="mb-6">
      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          className="bg-blue-500 h-2 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">Progress: {progress}%</p>
    </div>

    {/* Dynamic Form */}
    <form onSubmit={handleSubmit}>
  {formFields.map((field) => (
    <div className="mb-6 relative" key={field.name}>
      {field.type === "dropdown" ? (
        <>
          <select
            value={formValues[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="block max-w-full relative
             p-2 border border-gray-300 rounded bg-transparent peer"
          >
            <option value="" disabled>
              Select {field.label}
            </option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label
            htmlFor={field.name}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-2 bg-white px-1 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
          >
            {field.label}
          </label>
        </>
      ) : (
        <>
          <input
            id={field.name}
            type={field.type}
            value={formValues[field.name] || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            className="block w-full p-2 border border-gray-300 bg-transparent rounded peer"
            placeholder=" "
          />
          <label
            htmlFor={field.name}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 left-2 bg-white px-1 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-black"
          >
            {field.label}
          </label>
        </>
      )}
    </div>
  ))}
  <button
    type="submit"
    className={`px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition duration-100 ${isButtonClicked ? "animate-ping" : ""}`}
  >
    {isButtonClicked ? "Submitting..." : "Submit"}
  </button>
</form>


    {isModalOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Form Submitted Successfully!</h2>
          <p className="mb-4">Your form has been submitted. Thank you!</p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </div>
</div>

      {/* Tabular Display for User Information */}
      <h2 className="text-xl font-bold mt-8 text-center">User Information</h2>
{userData.length > 0 && (
  <table className="mt-6 w-full border  border-gray-700">
    <thead className="bg-gray-200 ">
      <tr>
        {Object.keys(userData[0]).map((key) => (
          <th key={key} className="px-4 py-2 text-center bg-gray-300">
            {key}
          </th>
        ))}
        <th className="px-4 py-2 text-center bg-gray-300">Actions</th>
      </tr>
    </thead>
    <tbody>
      {userData.map((data, index) => (
        <tr key={index} className="border-t">
          {Object.values(data).map((value, idx) => (
            <td key={idx} className="px-4 bg-gray-300  py-2 text-center">
              {value}
            </td>
          ))}
          <td className="px-4 py-2 bg-gray-300 text-center">
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              onClick={() => handleEdit(index, "User Information")}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(index, "User Information")}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}


      {/* Repeat the same for Address and Payment tables */}
      <h2 className="text-xl font-bold mt-8 text-center">Address Information</h2>
{addressData.length > 0 && (
  <table className="mt-6 w-full border border-gray-700">
    <thead className="bg-gray-300">
      <tr>
        {Object.keys(addressData[0]).map((key) => (
          <th key={key} className="px-4 py-2 text-center">
            {key}
          </th>
        ))}
        <th className="px-4 py-2 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {addressData.map((data, index) => (
        <tr key={index} className="border-t">
          {Object.values(data).map((value, idx) => (
            <td key={idx} className="px-4 py-2 text-center bg-gray-300">
              {value}
            </td>
          ))}
          <td className="px-4 py-2 text-center  bg-gray-300">
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              onClick={() => handleEdit(index, "Address Information")}
              className="bg-yellow-500 text-white px-3 py-1  rounded hover:bg-yellow-600 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(index, "Address Information")}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

<h2 className="text-xl font-bold mt-8 text-center">Payment Information</h2>
{paymentData.length > 0 && (
  <table className="mt-6 w-full border border-gray-700">
    <thead className="bg-gray-300">
      <tr>
        {Object.keys(paymentData[0]).map((key) => (
          <th key={key} className="px-4 py-2 text-center">
            {key}
          </th>
        ))}
        <th className="px-4 py-2 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {paymentData.map((data, index) => (
        <tr key={index} className="border-t">
          {Object.values(data).map((value, idx) => (
            <td key={idx} className="px-4 py-2 text-center bg-gray-300">
              {value}
            </td>
          ))}
   <td className="px-4 py-2 text-center bg-gray-300">
  <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2">
    <button
      onClick={() => handleEdit(index, "Payment Information")}
      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
    >
      Edit
    </button>
    <button
      onClick={() => handleDelete(index, "Payment Information")}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Delete
    </button>
  </div>
</td>


        </tr>
      ))}
    </tbody>
  </table>
)}

      {/* Footer */}
      <footer className="text-center bg-gray-800 text-white py-4 mt-6">
        <p>&copy; 2024 Dynamic Form. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DynamicForm;
