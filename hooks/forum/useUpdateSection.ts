import {useCallback, useState} from "react";
import {fetchWrapper} from "@/utils/fetchWrapper";
import {getSession} from "next-auth/react";

const useUpdateSection = <T>(): {
    data: T | null;
    error: any;
    isLoading: boolean;
    fetchData: (sectionData: any) => Promise<void>;
} => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = useCallback(async (sectionData: any) => {
        const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT}section/update/${sectionData.id}`;

        setIsLoading(true);
        setError(null);
        setData(null);
        try {
            const session = await getSession();
            // @ts-ignore
            const token = session?.accessToken;

            const config = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "id": sectionData.id,
                    "name": sectionData.name,
                    "order": sectionData.order,
                })
            };
            const result = await fetchWrapper<T>(endpoint, config);
            setData(result);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {data, error, isLoading, fetchData};

};

export default useUpdateSection;
