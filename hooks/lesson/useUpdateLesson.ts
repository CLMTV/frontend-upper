import {useCallback, useState} from "react";
import {fetchWrapper} from "@/utils/fetchWrapper";
import { getSession } from "next-auth/react";
import { Lesson } from "@/types/lessonType";

const useUpdateUser = <T>(): {
    data: T | null;
    error: any;
    isLoading: boolean;
    fetchData: (lessonData: Lesson) => Promise<void>;
} => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = useCallback(async (lessonData: Lesson) => {
        const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT}lesson/update/${lessonData.id}`;

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
                    "id": lessonData.id,
                    "content": lessonData.content,
                    "order": lessonData.order,
                    "points": lessonData.points,
                    "videoId": lessonData.videoId,
                    "courseId": lessonData.courseId,
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
export default useUpdateUser;
