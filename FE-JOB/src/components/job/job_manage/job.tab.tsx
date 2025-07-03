import JobPage from "@/pages/admin/manage.job";
import { Tabs, TabsProps } from "antd";
import TableSkill from "../skill_manage/table.skill";

const JobTabs = () => {
    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Manage Jobs',
            children: <JobPage />,
        },
        {
            key: '2',
            label: 'Manage Skills',
            children: <TableSkill />,
        },

    ];
    return (
        <div>

            <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
            />

        </div>);
}

export default JobTabs;