import * as Yup from "yup";

export const PhoneSchema = Yup.object({
    iemi: Yup.string()
        .test('trim', 'Must not contain leading or trailing spaces', (value) => {
            if (value) {
                return value.trim() === value;
            }
            return true;
        })
        .min(15, "Please enter valid IMEI no.")
        .max(15, "Please enter valid IMEI no.")
        .required("Please Enter IMEI no."),
    date: Yup.date().required('Please select date'),
    company_name: Yup.string().required('Please select company'),
    colour: Yup.string().required('Please enter colour'),
    model: Yup.string().required('Please select model'),
    storage: Yup.string().required('Please select storage'),
    installment: Yup.string().required('Please select installment'),
    installment_charge: Yup.number().typeError('Please enter only numbers').required('Please enter installment charge'),
    dp: Yup.number().typeError('DP must be a number').positive('DP must be positive')
});

export const NewPhoneValues = {
    date: "",
    company_name: "",
    storage: "",
    model: "",
    iemi : "",
    color : "",
    price: "",
    installment: "",
    installment_charge: "",
    dp: "",
    net_payable: "",
}
