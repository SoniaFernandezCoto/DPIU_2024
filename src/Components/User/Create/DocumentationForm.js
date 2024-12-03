import {Form, Input, Typography, DatePicker, Select} from "antd";
import {modifyStateProperty} from "../../../Utils/UtilsState";
import {
    validateFormDataInputIdentityDocument,
    validateFormDataInputRequired, validateFormDataInputTest,
    validateFormDateInput,
} from "../../../Utils/UtilsValidations";
import {dateFormatTemplate, templateToTimestamp, timestampToDate} from "../../../Utils/UtilsDates";
import {IdcardOutlined} from "@ant-design/icons";

const {Text} = Typography;

const DocumentationForm = ({formData, setFormData, formErrors, setFormErrors}) => {

    return (
        <>
            <Form.Item
                validateStatus={validateFormDataInputTest(formData, "name", formErrors, setFormErrors) ? "success" : "error"}
            >
                <Input
                    prefix={<IdcardOutlined  style={{ color: "rgba(0,0,0,.45)" }} />}
                    placeholder="Your name"
                    value={formData.name || ""}
                    onChange={(i) => {
                        modifyStateProperty(formData, setFormData, "name", i.currentTarget.value);
                    }}
                />
                {formErrors?.name?.msg && <Text type="danger">{formErrors?.name?.msg}</Text>}
            </Form.Item>

            <Form.Item
                validateStatus={validateFormDataInputTest(formData, "surname", formErrors, setFormErrors) ? "success" : "error"}
            >
                <Input
                    prefix={<IdcardOutlined  style={{ color: "rgba(0,0,0,.45)" }} />}
                    placeholder="Your surname"
                    value={formData.surname || ""}
                    onChange={(i) => {
                        modifyStateProperty(formData, setFormData, "surname", i.currentTarget.value);
                    }}
                />
                {formErrors?.surname?.msg && <Text type="danger">{formErrors?.name?.msg}</Text>}
            </Form.Item>

            <Form.Item
                validateStatus={validateFormDateInput(formData, "birthday", formErrors, setFormErrors) ? "success" : "error"}
            >
                <DatePicker
                    placeholder="birthday" format={ dateFormatTemplate }
                    style={{width: "100%"}}
                    onChange={(date, dateString) => {
                        modifyStateProperty(formData, setFormData, "birthday", templateToTimestamp(dateString));
                    }}
                />
                {formErrors?.birthday?.msg && <Text type="danger">{formErrors?.birthday?.msg}</Text>}
            </Form.Item>

            <Form.Item>
                <Select
                    placeholder="Document Type"
                    style={{width: "100%"}}
                    value={formData.documentIdentity || undefined}
                    onChange={(value) => {
                        modifyStateProperty(formData, setFormData, "documentIdentity", value);
                    }}
                >
                    <Select.Option value="passport">Passport</Select.Option>
                    <Select.Option value="idCard">ID Card</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                validateStatus={validateFormDataInputIdentityDocument(formData, "documentNumber", formErrors, setFormErrors) ? "success" : "error"}
            >
                <Input
                    prefix={<IdcardOutlined  style={{ color: "rgba(0,0,0,.45)" }} />}
                    placeholder="Document Number"
                    value={formData.documentNumber || ""}
                    onChange={(i) => {
                        modifyStateProperty(formData, setFormData, "documentNumber", i.currentTarget.value);
                    }}
                />
                {formErrors?.documentNumber?.msg && <Text type="danger">{formErrors?.documentNumber?.msg}</Text>}
            </Form.Item>
        </>
    );
};

export default DocumentationForm;
