import {Form, Input, Select, Typography} from "antd";
import {modifyStateProperty} from "../../../Utils/UtilsState";
import {validateFormDataInputPostalCode} from "../../../Utils/UtilsValidations";
import {EnvironmentOutlined, HomeOutlined} from "@ant-design/icons";
import countries from "../../../Static/countries";

const {Text} = Typography;
const {Option} = Select;

const GeolocationForm = ({formData, setFormData, formErrors, setFormErrors}) => {

    return (
        <>
            <Form.Item
            >
                <Select
                    placeholder="Write or select your country"
                    showSearch
                    optionFilterProp="value"
                    filterSort={(optionA, optionB) =>
                        (optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
                    }
                    style={{ width: "100%" }}
                    value={formData.country || undefined} // Mantener valor seleccionado
                    onChange={(value) => {
                        modifyStateProperty(formData, setFormData, "country", value);
                    }}
                >
                    {countries.map((country) => (
                        <Option key={country.code} value={country.name}>
                            <img src={country.flag} alt="" style={{ width: 20, marginRight: 8 }} />
                            {country.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
            >
                <Input
                    placeholder="Address"
                    prefix={<HomeOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                    value={formData.address || ""}
                    onChange={(i) => {
                        modifyStateProperty(formData, setFormData, "address", i.currentTarget.value);
                    }}
                />
            </Form.Item>

            <Form.Item
                validateStatus={validateFormDataInputPostalCode(formData, "postalCode", formErrors, setFormErrors) ? "success" : "error"}
            >
                <Input
                    placeholder="Postal Code"
                    prefix={<EnvironmentOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                    value={formData.postalCode || ""} // Mantener valor
                    onChange={(i) => {
                        modifyStateProperty(formData, setFormData, "postalCode", i.currentTarget.value);
                    }}
                />
                {formErrors?.postalCode?.msg && <Text type="danger">{formErrors?.postalCode?.msg}</Text>}
            </Form.Item>
        </>
    );
};

export default GeolocationForm;
