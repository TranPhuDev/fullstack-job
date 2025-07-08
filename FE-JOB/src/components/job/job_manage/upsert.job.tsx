import {
    Breadcrumb,
    Col,
    ConfigProvider,
    Divider,
    Row,
    Form,
    notification,
    App,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FooterToolbar,
    ProForm,
    ProFormDatePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
} from "@ant-design/pro-components";
import styles from "styles/admin.module.scss";
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from "antd/lib/locale/en_US";
import dayjs from "dayjs";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";
import {
    callCreateJob,
    callUpdateJob,
    callFetchJobById,
    callFetchAllSkill,
    callFetchCompany,
} from "@/services/api";
import { DebounceSelect } from "@/components/user/debounce.select";
import { ICompanySelect } from "@/components/user/create.user";

const LOCATION_OPTIONS = [
    { label: "Hà Nội", value: "Hà Nội" },
    { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
    { label: "Đà Nẵng", value: "Đà Nẵng" },
];

const WORKPLACE_OPTIONS = [
    { label: "Remote", value: "Remote" },
    { label: "Onsite", value: "Onsite" },
    { label: "Office", value: "Office" },
];

const EXPERTISE_OPTIONS = [
    { label: "Frontend", value: "Frontend" },
    { label: "Backend", value: "Backend" },
    { label: "Fullstack", value: "Fullstack" },
    { label: "Mobile", value: "Mobile" },
    { label: "Data Science", value: "Data Science" },
    { label: "DevOps", value: "DevOps" },
    { label: "UI/UX Design", value: "UI/UX Design" },
    { label: "QA", value: "QA" },
    { label: "Tester", value: "Tester" },
    { label: "Project Manager", value: "Project Manager" },
    { label: "Business Analyst", value: "Business Analyst" },
    { label: "Comtor", value: "Comtor" }
];

interface ISkillSelect {
    label: string;
    value: string;
    key?: string;
}

const ViewUpsertJob = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();
    const [description, setDescription] = useState<string>("");
    const [skills, setSkills] = useState<Array<{ label: string; value: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<IJob | null>(null);
    const [value, setValue] = useState<string>("");

    // Fetch skills and companies
    useEffect(() => {
        const fetchData = async () => {
            // fetch skills
            const skillRes = await callFetchAllSkill("page=1&pageSize=100");
            setSkills(
                (skillRes?.data?.result as ISkill[] | undefined)?.map((s: ISkill) => ({
                    label: s.name ?? '',
                    value: s.id ?? '',
                })) || []
            );

            if (id) {
                const res = await callFetchJobById(id);
                if (res && res.data) {
                    setDataUpdate(res.data);
                    // set company select
                    const companyValue = res.data.company
                        ? {
                            label: res.data.company.name,
                            value: `${res.data.company.id}@#$${res.data.company.logo}`,
                            key: res.data.company.id,
                        }
                        : undefined;
                    // set skills select
                    const skillsValue = res.data.skills?.map((item: ISkill) => ({
                        label: item.name,
                        value: item.id,
                        key: item.id,
                    }));
                    form.setFieldsValue({
                        ...res.data,
                        company: companyValue,
                        skills: skillsValue,
                        startDate: res.data.startDate ? dayjs(res.data.startDate) : undefined,
                        endDate: res.data.endDate ? dayjs(res.data.endDate) : undefined,
                    });
                    setValue(res.data.description || '');
                }
            } else {
                setDataUpdate(null);
                form.resetFields();
                setValue('');
            }
        };
        fetchData();
        return () => form.resetFields();
    }, [id]);

    // DebounceSelect fetcher
    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompany(`page=1&size=100&name ~ '${name}'`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: `${item.id}@#$${item.logo}` as string
                }
            })
            return temp;
        } else return [];
    }

    const onFinish = async (values: any) => {
        const cp = values?.company?.value?.split('@#$');
        const arrSkills = values?.skills?.map((item: { value: string }) => ({ id: item.value }));
        const job = {
            name: values.name,
            skills: arrSkills,
            company: {
                id: cp && cp.length > 0 ? cp[0] : "",
                name: values.company.label,
                logo: cp && cp.length > 1 ? cp[1] : ""
            },
            location: values.location,
            salary: values.salary,
            quantity: values.quantity,
            level: values.level,
            expertise: values.expertise,
            workplace: values.workplace,
            description: value,
            startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.startDate) ? dayjs(values.startDate, 'DD/MM/YYYY').toDate() : values.startDate,
            endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.endDate) ? dayjs(values.endDate, 'DD/MM/YYYY').toDate() : values.endDate,
            active: values.active,
        };
        if (id) {
            const res = await callUpdateJob(job, id);
            if (res.data || res.statusCode === 200) {
                message.success("Cập nhật job thành công");

                navigate('/admin/job');

            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const res = await callCreateJob(job);
            if (res.data) {
                message.success("Tạo mới job thành công");

                navigate('/admin/job')

            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    return (
        <div className={styles["upsert-job-container"]}>
            <div className={styles["title"]}>
                <Breadcrumb
                    separator=">"
                    items={[
                        { title: <Link to="/admin/job">Manage Job</Link> },
                        { title: id ? "Edit Job" : "Create Job" },
                    ]}
                />
            </div>
            <div>
                <ConfigProvider locale={enUS}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        loading={loading}
                        onReset={() => {
                            form.resetFields();
                            setDescription("");
                            navigate("/admin/job");
                        }}
                        submitter={{
                            searchConfig: {
                                resetText: "Hủy",
                                submitText: id ? "Cập nhật Job" : "Tạo mới Job",
                            },
                            render: (_: unknown, dom: React.ReactNode[]) => <FooterToolbar>{dom}</FooterToolbar>,
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />,
                            },
                        }}
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={12}>
                                <ProFormText
                                    label="Tên Job"
                                    name="name"
                                    rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                                    placeholder="Nhập tên job"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="skills"
                                    label="Kỹ năng yêu cầu"
                                    options={skills}
                                    mode="multiple"
                                    allowClear
                                    fieldProps={{ labelInValue: true }}
                                    placeholder="Chọn kỹ năng"
                                    rules={[{ required: true, message: "Vui lòng chọn kỹ năng!" }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="location"
                                    label="Địa điểm"
                                    options={LOCATION_OPTIONS}
                                    placeholder="Chọn địa điểm"
                                    rules={[{ required: true, message: "Vui lòng chọn địa điểm!" }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Mức lương"
                                    name="salary"
                                    rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                                    placeholder="Nhập mức lương"
                                    fieldProps={{
                                        addonAfter: " đ",
                                        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                                        parser: (value) => +(value || "").replace(/\$\s?|,*/g, ""),
                                    }}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Số lượng"
                                    name="quantity"
                                    rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                                    placeholder="Nhập số lượng"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="level"
                                    label="Trình độ"
                                    valueEnum={{
                                        INTERN: "INTERN",
                                        FRESHER: "FRESHER",
                                        JUNIOR: "JUNIOR",
                                        MIDDLE: "MIDDLE",
                                        SENIOR: "SENIOR",
                                    }}
                                    placeholder="Chọn trình độ"
                                    rules={[{ required: true, message: "Vui lòng chọn trình độ!" }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <Form.Item
                                    name="company"
                                    label="Thuộc Công Ty"
                                    rules={[{ required: true, message: "Vui lòng chọn công ty!" }]}
                                >
                                    <DebounceSelect
                                        allowClear
                                        showSearch
                                        value={form.getFieldValue("company")}
                                        placeholder="Chọn công ty"
                                        fetchOptions={fetchCompanyList}
                                        onChange={(newValue) => {
                                            form.setFieldsValue({ company: newValue });
                                        }}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={6}>
                                <ProFormDatePicker
                                    label="Ngày bắt đầu"
                                    name="startDate"
                                    fieldProps={{ format: "DD/MM/YYYY" }}
                                    rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
                                    placeholder="dd/mm/yyyy"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDatePicker
                                    label="Ngày kết thúc"
                                    name="endDate"
                                    fieldProps={{ format: "DD/MM/YYYY" }}
                                    rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
                                    placeholder="dd/mm/yyyy"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="workplace"
                                    label="Nơi làm việc"
                                    options={WORKPLACE_OPTIONS}
                                    placeholder="Chọn nơi làm việc"
                                    rules={[{ required: true, message: "Vui lòng chọn nơi làm việc!" }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="expertise"
                                    label="Chuyên môn"
                                    options={EXPERTISE_OPTIONS}
                                    placeholder="Chọn chuyên môn"
                                    rules={[{ required: true, message: "Vui lòng chọn chuyên môn!" }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="active"
                                    checkedChildren="ACTIVE"
                                    unCheckedChildren="INACTIVE"
                                    initialValue={true}
                                    fieldProps={{
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <ProForm.Item
                                    name="description"
                                    label="Miêu tả job"
                                    rules={[{ required: true, message: "Vui lòng nhập miêu tả job!" }]}
                                >
                                    <Editor
                                        value={value}
                                        onEditorChange={(content) => setValue(content)}
                                        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                        init={{
                                            height: 200,
                                            menubar: false,
                                            plugins: ['lists link image table code wordcount'],
                                            toolbar:
                                                'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | outdent indent | removeformat | h1 h2 h3 h4 h5',
                                            block_formats: 'Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Paragraph=p',
                                        }}
                                    />
                                </ProForm.Item>
                            </Col>
                        </Row>
                        <Divider />
                    </ProForm>
                </ConfigProvider>
            </div>
        </div>
    );
};

export default ViewUpsertJob;
