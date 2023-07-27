import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:4000/',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = {
    ...config.headers,
    Authorization: token ? `${token}` : '',
    ContentType: 'application/json',
    timeout: 1000,
  };
  return config;
});



// export default {
//   getData: () => {
//     return instance({
//       'method': 'GET',
//       'url': '/query',
//       'data': {
//         'item1': 'data1',
//       },
//       'headers': {
//         'content-type': 'application/json' 
//       },
//     })
//   },

// }



// User --------------------------------------------

export const SignUp = (data) => {
  return instance({
    'url': '/user/Usersignup',
    'method': 'POST',
    'data': data,
  })
}

export const SignIn = (data) => {
  return instance({
    'url': '/user/login',
    'method': 'POST',
    'data': data,
  })
}

export const userDetail = () => {
  return instance({
    'url': '/user/detail',
    'method': 'GET',
  })
}


// Installment --------------------------------------------

export const AddInstallment = (data) => {
  return instance({
    'url': '/installment/addinstallment',
    'method': 'POST',
    'data': data,
  })
}

export const getCustomersByInstallment = (installment_id) => {
  return instance({
    'url': `/installment/${installment_id}`,
    'method': 'GET',
  })
}

export const getAllInstallment = () => {
  return instance({
    'method': 'GET',
    'url': '/installment',
    'headers': {
      'content-type': 'application/json'
    },
  })
}

export const DeleteInstallment = (id) => {
  return instance({
    'url': `/installment/delete/${id}`,
    'method': 'DELETE',
    'data': id,
  })
}

export const UpdateInstallment = (data) => {
  return instance({
    'url': `/installment/update/${data.id}`,
    'method': 'PUT',
    'data': data,
  })
}

// Admin -------------------------------------------------------

export const Admindetails = (id) => {
  return instance({
    'url': `/admin/details/${id}`,
    'method': 'GET',
  })
}

export const UpdateAdmin = (data) => {
  return instance({
    'url': `/admin/update`,
    'method': 'PUT',
    'data': data,
  })
}

// Customer -------------------------------------------------------

export const AddCustomer = (data) => {
  return instance({
    'url': '/customer/addcustomer',
    'method': 'POST',
    'data': data,
    'headers': {
      'content-type': "multipart/form-data"
    },
  })
}

export const getAllCustomer = (pageNo, searchedValue) => {
  return instance({
    'url': `/customer/List/${pageNo}/${searchedValue}`,
    'method': 'GET',
    'headers': {
      'content-type': "multipart/form-data"
    },
  })
}

export const UpdateCustomer = (data) => {
  return instance({
    'url': `/customer/update`,
    'method': 'PUT',
    'data': data,
    'headers': {
      'content-type': "multipart/form-data"
    },
  })
}

export const getCustomerByid = (id) => {
  return instance({
    'url': `/customer/details/${id}`,
    'method': 'GET',
    'data': id,
  })
}

export const DeleteCustomer = (id) => {
  return instance({
    'url': `/customer/delete/${id}`,
    'method': 'DELETE',
    'data': id,
  })
}


// Company -------------------------------------------------------------------

export const AddCompany = (data) => {
  return instance({
    'url': '/company/addcompany',
    'method': 'POST',
    'data': data,
  })
}

export const EditCompany = (data) => {
  return instance({
    'url': `/company/update/${data.id}`,
    'method': 'PUT',
    'data': data,
  })
}

export const DeleteCompany = (id) => {
  return instance({
    'url': `/company/delete/${id}`,
    'method': 'DELETE',
    'data': id,
  })
}

export const getAllCompanies = () => {
  return instance({
    'method': 'GET',
    'url': '/company',
    'headers': {
      'content-type': 'application/json'
    },
  })
}

// Phone ----------------------------------------------------------------

export const AddNewPhone = (data) => {
  return instance({
    'url': '/phone/addphone',
    'method': 'POST',
    'data': data,
  })
}

export const DeletePhone = (id) => {
  return instance({
    'url': `/phone/delete/${id}`,
    'method': 'DELETE',
    'data': id,
  })
}

export const UpdatePhone = (data) => {
  return instance({
    'url': `/phone/update/${data.id}`,
    'method': 'PUT',
    'data': data,
  })
}

export const searchPhone = (modelName) => {
  return instance({
    'url': `/phone/search/${modelName}`,
    'method': 'GET',
  })
}

export const getAllPhone = (pageNo) => {
  return instance({
    'method': 'GET',
    'url': `/phone/List/${pageNo.pageNo}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}

export const getModelByCompany = (id) => {
  return instance({
    'method': 'GET',
    'url': `/phone/getModelByCompany/${id}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}


// Purchase ----------------------------------------------------------

export const AddNewPurchase = (data) => {
  return instance({
    'url': `/purchase/addpurchase`,
    'method': 'POST',
    'data': data,
  })
}

export const getAllPurchase = (pageNo) => {
  return instance({
    'method': 'GET',
    'url': `/purchase/List/${pageNo.pageNo}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}

export const getPurchaseCustomerbyId = (id) => {
  return instance({
    'method': 'GET',
    'url': `/purchase/Customer_details/${id}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}


export const DeletePurchase = (id) => {
  return instance({
    'url': `/purchase/delete/${id}`,
    'method': 'DELETE',
    'data': id,
  })
}

// EMI ----------------------------------------------------------------

export const getEmiPurchasebyId = (id) => {
  return instance({
    'method': 'GET',
    'url': `/emi/Emi_details/${id}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}

export const getPendingEmi = (pageNo) => {
  return instance({
    'method': 'GET',
    'url': `/emi/pending/${pageNo}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}

export const getEMICustomers = (searchedValue) => {
  return instance({
    'method': 'GET',
    'url': `/emi/search/${searchedValue.pageNo}/${searchedValue.search}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}

export const getSingleEmi = (id) => {
  return instance({
    'method': 'GET',
    'url': `/emi/details/${id}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}



// Transections ------------------------------------------------------------

export const AddTransection = (data) => {
  return instance({
    'url': `/transaction/addtransaction`,
    'method': 'POST',
    'data': data,
  })
}

export const getallTransection = (pageNo) => {
  return instance({
    'method': 'GET',
    'url': `/transaction/List/${pageNo}`,
  })
}

export const getReceiptbyReceiptId = (id) => {
  return instance({
    'method': 'GET',
    'url': `/transaction/ReceiptId/${id}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}

// Reciept ------------------------------------------------------------
export const getallReceipt = (pageNo) => {
  return instance({
    'method': 'GET',
    'url': `/receipt/List/${pageNo}`,
  })
}

export const getReceiptbyPurchaseId = (id) => {
  return instance({
    'method': 'GET',
    'url': `/receipt/search/${id}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}

export const deleteReceiptById = (id) => {
  return instance({
    'method': 'DELETE',
    'url': `/receipt/delete/${id}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}

export const getReceiptbyEmiId = (id) => {
  return instance({
    'method': 'GET',
    'url': `/receipt/searchbyEmi/${id}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}

export const onerecieptDetailsbyNumber = (search) => {
  return instance({
    'method': 'GET',
    'url': `/receipt/search/${search.pageNo}/${search.search}`,
    'headers': {
      'content-type': 'application/json'
    },
  })
}

// Specifiaction ------------------------------------------------------

export const AddSpecification = (data) => {
  return instance({
    'url': '/specification/addspecification',
    'method': 'POST',
    'data': data,
  })
}

export const getallSpecification = () => {
  return instance({
    'method': 'GET',
    'url': '/specification',
  })
}

export const getallSpecificationById = (id) => {
  return instance({
    'method': 'GET',
    'url': `/specification/${id}`,
  })
}

export const UpdateSpecification = (data) => {
  return instance({
    'url': `/specification/update/${data.id}`,
    'method': 'PUT',
    'data': data,
  })
}

export const deleteSpecification = (id) => {
  return instance({
    'method': 'DELETE',
    'url': `/specification/Delete/${id}`,
  })
}

//----------------REPORT--------
export const getReport = () => {
  return instance({
    'method': 'GET',
    'url': `/report`,
  })
}

export const getMonthWiseReport = () => {
  return instance({
    'method': 'GET',
    'url': `/report/month`,
  })
}