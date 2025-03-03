import {isDatePreviousToToday, templateToTimestamp} from "./UtilsDates";

export let validateFormDataInputRequired =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexNotEmpty = /^(.+)$/;
        let errorMessage = "Required"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }

export let validateFormDataPrice = (formData, inputKey, formErrors, setFormErrors) => {
    let regexPrice = /^[0-9]+(\.[0-9]{1,2})?/
    let errorMessage = "Not price format"
    return validateFormDataInput(
        formData, inputKey, formErrors, setFormErrors, regexPrice, errorMessage)
}

export let validateFormDataInputEmail =
    (formData, inputKey, formErrors, setFormErrors) => {

        //let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        let errorMessage = "Not email format"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexEmail, errorMessage)
    }

export let validateFormDataInputTest = (formData, inputKey, formErrors, setFormErrors) => {
    let regexTest = /^[a-zA-Z\s]*$/;
    let errorMessage = "Only letters"
    return validateFormDataInput(
        formData, inputKey, formErrors, setFormErrors, regexTest, errorMessage)
}

export let validateFormDataInputIdentityDocument = (formData, inputKey, formErrors, setFormErrors) => {
    let regexIdentityDocument = /^[XYZKLM]?\d{7,8}[A-Z]$/;
    let errorMessage = "Not identity document format"
    return validateFormDataInput(
        formData, inputKey, formErrors, setFormErrors, regexIdentityDocument, errorMessage)
}

export let validateFormDataInputPostalCode = (formData, inputKey, formErrors, setFormErrors) => {
    let regexPostalCode = /^\d{5,5}$/;
    let errorMessage = "Not postal code format"
    return validateFormDataInput(
        formData, inputKey, formErrors, setFormErrors, regexPostalCode, errorMessage)
}
export let validateFormDataInput =
    (formData, inputKey, formErrors, setFormErrors, regex, msgError) => {
        // not write Yet
        if (formData[inputKey] == null) {
            return true
        }

        // have a serverError
        if (formErrors[inputKey]?.type == "server") {
            return false
        }

        // Have some value, remove the error only client erros
        if ((formData[inputKey] != null && regex?.test(formData[inputKey]))) {
            if (formErrors[inputKey] != null ) {
                formErrors[inputKey] = null;
                setFormErrors(formErrors)
                // don't put again the value in state
            }
            return true;
        }

        // Dont have value put the error
        if (formErrors[inputKey] == null) {
            formErrors[inputKey] = {msg: msgError }
            setFormErrors(formErrors)
        }

        return false;

    }



export let allowSubmitForm = (formData, formErrors, requiredInputWithNoErrors) => {
    let result = true;
    requiredInputWithNoErrors.forEach(inputKey => {
        // With client errors you cant not submit form
        if (formData[inputKey] == null
            || formErrors[inputKey] != null ) {

            result = false;
            return;
        }
    })
    return result;
}

export let validateFormDateInput = (formData, inputKey, formErrors, setFormErrors) => {

    let date = templateToTimestamp(formData[inputKey]) ;
    let isPrevious = isDatePreviousToToday(date);
    if (isPrevious=== false) {
        let errorMessage = "The date has to be previous to today";
        formErrors[inputKey] = {msg: errorMessage}
        setFormErrors(formErrors)
        return false;
    } else if (isPrevious === true) {
        formErrors[inputKey] = null;
        return true;
    }
};

export let setServerErrors = (serverErrors, setFormErrors) => {
    let newFormErrors = {} //delete all previous
    if ( Array.isArray(serverErrors)){
        serverErrors.forEach(e => {
            newFormErrors[e.field] = { msg: e.msg, type: "server" }
        });
    }
    // destroy all previous errors is a new SET
    setFormErrors(newFormErrors)
}

export let joinAllServerErrorMessages = (serverErrors) => {
    let generalErrorMessage = "";
    if ( Array.isArray(serverErrors)){
        serverErrors.forEach(e => {
            generalErrorMessage += e.msg
        });
    } else {
        if (serverErrors?.msg != null){
            generalErrorMessage = serverErrors.msg;
        }
    }
    return generalErrorMessage
}