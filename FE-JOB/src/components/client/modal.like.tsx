import { Modal, Tabs, TabsProps } from "antd";
import { useCurrentApp } from "../context/app.context";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import modalLikeStyles from "../../styles/modal.like.module.scss";
import { App } from 'antd';


interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const JobLike = () => {
    const { likedJobs, toggleLikeJob } = useCurrentApp();
    const { notification } = App.useApp();
    if (!likedJobs.length) {
        return <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>Chưa có công việc nào được thích.</div>;
    }
    return (
        <div className={modalLikeStyles.likeList}>
            {likedJobs.map((job) => (
                <div key={job.id} className={modalLikeStyles.likeItem}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                        <div className={modalLikeStyles.companyLogo}>
                            {job.company?.logo ? (
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${job.company.logo}`}
                                    alt={job.company.name}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                job.company?.name?.[0] || "?"
                            )}
                        </div>
                        <div className={modalLikeStyles.infoBlock}>
                            <Link to={`/job/${job.id}`} className={modalLikeStyles.title}>{job.name}</Link>
                            <div className={modalLikeStyles.company}>{job.company?.name}</div>
                            <div className={modalLikeStyles.address}>{job.company?.address}</div>
                            <div className={modalLikeStyles.time}>
                                Đăng {job.updatedAt ? dayjs(job.updatedAt).locale('vi').fromNow() : ''}
                            </div>
                        </div>
                    </div>
                    <div className={modalLikeStyles.actionBlock}>
                        <button
                            className={modalLikeStyles.applyBtn}
                            onClick={() => window.location.href = `/job/${job.id}`}
                        >
                            Ứng tuyển
                        </button>
                        <button
                            className={modalLikeStyles.heartBtn}
                            onClick={() => {
                                toggleLikeJob(job);
                                notification.info({
                                    message: 'Đã bỏ yêu thích việc làm',
                                    duration: 2
                                });
                            }}
                            aria-label="Bỏ thích"
                        >
                            <span style={{ color: '#ff424e' }}>♥</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}


const LikeModal = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = () => { };

    const items: TabsProps['items'] = [

        {
            key: 'job-liked',
            label: `Danh sách`,
            children: <JobLike />,
        },

    ];


    return (
        <>
            <Modal
                title="Công việc đã thích"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width="1000px"
                className={modalLikeStyles.likeModal}
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="job-liked"
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )

}
export default LikeModal;