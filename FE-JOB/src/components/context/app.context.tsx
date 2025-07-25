
import { fetchAccountAPI } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";

interface IFilter {
    skill?: string;
    level?: string;
    company?: string;
    city?: string;
    keyword?: string;
}

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
    user: IUser | null;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
    filter: IFilter;
    setFilter: React.Dispatch<React.SetStateAction<IFilter>>;
    likedJobs: IJob[];
    toggleLikeJob: (job: IJob) => void;
}
const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
    children: React.ReactNode
}

export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<IFilter>({});
    const [likedJobs, setLikedJobs] = useState<IJob[]>(() => {
        const stored = localStorage.getItem('likedJobs');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('likedJobs', JSON.stringify(likedJobs));
    }, [likedJobs]);

    const toggleLikeJob = (job: IJob) => {
        setLikedJobs((prev) => {
            const exists = prev.some((j) => j.id === job.id);
            if (exists) {
                return prev.filter((j) => j.id !== job.id);
            } else {
                return [...prev, job];
            }
        });
    };

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI()
            if (res.data) {
                setUser(res.data.user)
                setIsAuthenticated(true)
            }
            setIsAppLoading(false);
        }

        fetchAccount();
    }, [])

    return (
        <>
            {isAppLoading === false ?
                <CurrentAppContext.Provider value={{ isAuthenticated, user, setUser, setIsAuthenticated, isAppLoading, setIsAppLoading, filter, setFilter, likedJobs, toggleLikeJob }}>
                    {props.children}
                </CurrentAppContext.Provider> : <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <PacmanLoader
                        size={50}
                        color="#36d6b4"

                    />
                </div>
            }
        </>
    );
};

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "useCurrentApp has to be used within <CurrentUserContext.Provider>"
        );
    }

    return currentAppContext;
};


