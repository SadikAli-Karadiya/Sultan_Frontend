import * as Yup from "yup";

export const adminSchema = Yup.object({
    username: Yup.string()
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .min(2, "Minimum 2 characters are required")
        .required("Please Enter Username")
        .matches(/[^\s*].*[^\s*]/g, "* This field cannot contain only blankspaces"),

    password: Yup.string()
        .required("Please Enter Password")
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        }),

    full_name: Yup.string()
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .min(2, "Minimum 2 characters are required")
        .required("Please Enter Full Name")
        .matches(/[^\s*].*[^\s*]/g, "* This field cannot contain only blankspaces"),

    email: Yup.string().email()
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .required("Please Enter Email"),


    pin: Yup.string()
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .min(4, "Please enter valid pin")
        .max(4, "Please enter valid pin")
        .required("Please Enter PIN"),
        
    whatsapp_no: Yup.string()
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .min(10, "Please enter valid mobile no")
        .max(10, "Please enter valid mobile no")
        .required("Please Enter Mobile Number"),

    alternate_mobile: Yup.string()
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .min(10, "Please enter valid mobile no").max(10, "Please Enter Valid Mobile No"),

    dateofbirth
        : Yup.date()
            .max(new Date(), 'Please select valid DOB')
            .required("Please enter your date of birth")
            .nullable(),

    gender: Yup.string().required("Please Select Gender"),

    address: Yup.string()
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .required("Please Enter Address"),

    qualification: Yup.string()
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .required("Please Enter Qualification"),


    dateofjoining: Yup.date()
        .max(new Date(), 'Please select valid date')
        .required("Please Enter Date")
        .nullable(),
});


export const initialValues = {
    username: "",
    password: "",
    full_name: "",
    pin: "",
    email: "",
    whatsapp_no: "",
    alternate_mobile: "",
    dateofbirth: "",
    gender: "",
    address: "",
    qualification: "",
    dateofjoining: ""
}
