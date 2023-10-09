import * as Yup from "yup";
import moment from 'moment'

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
    colour: Yup.string("Please enter only letters"),
    model: Yup.string().required('Please select model'),
    bill_number: Yup.string().required('Please enter bill number'),
    storage: Yup.string().required('Please select storage'),
    installment: Yup.string().required('Please select installment'),
    installment_charge: Yup.number().typeError('Please enter only numbers').required('Please enter installment charge'),
    dp: Yup.string().required("Please Enter Down Payment."),
});

export const NewPhoneValues = {
    date: moment(new Date()).format("yyyy-MM-D"),
    company_name: "",
    storage: "",
    model: "",
    iemi : "",
    colour : "",
    price: "",
    installment: "",
    installment_charge: "",
    dp: "",
    net_payable: "",
}
