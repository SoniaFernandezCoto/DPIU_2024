import { Form, Input, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { modifyStateProperty } from "../../../Utils/UtilsState";
import { validateFormDataInputEmail, validateFormDataInputRequired } from "../../../Utils/UtilsValidations";

const { Text } = Typography;

const PersonalDataForm = ({ formData, setFormData, formErrors, setFormErrors }) => {

    return (
        <>
            <Form.Item
                validateStatus={validateFormDataInputEmail(formData, "email", formErrors, setFormErrors) ? "success" : "error"}
                mandatory
            >
                <Input
                    prefix={<MailOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                    placeholder="yourEmail@email.com"
                    value={formData.email || ""}
                    onChange={(i) => {
                        modifyStateProperty(formData, setFormData, "email", i.currentTarget.value);
                    }}
                />
                {formErrors?.email?.msg && <Text type="danger">{formErrors?.email?.msg}</Text>}
            </Form.Item>

            <Form.Item
                validateStatus={validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}
            >
                <Input.Password
                    prefix={<LockOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                    placeholder="your password"
                    value={formData.password || ""}
                    onChange={(i) => {
                        modifyStateProperty(formData, setFormData, "password", i.currentTarget.value);
                    }}
                />
                {formErrors?.password?.msg && <Text type="danger">{formErrors?.password?.msg}</Text>}
            </Form.Item>
        </>
    );
};

export default PersonalDataForm;
