import {useEffect, useState} from "react";
import {eksApi} from "../../../api/api.js";

export const NewsMk2 = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        handleNews();
    },[])

    const handleNews = async () => {
        try {
            const getNews = await eksApi.get("/news");
            console.log(getNews.data);
            !getNews.data.isEmpty && setNews(getNews.data);
        } catch {
            console.log("server is not running");
        }
    };

    return (
        <div className="min-w-[300px] h-[33vh] rounded-[25px] border-[3px] border-solid border-[#f5f5f5] shadow-[2px_2px_2px_2px_#f5f5f5] flex flex-col py-3">
                <p className={"news_title font-bold text-lg p-3 ml-2"}>뉴스</p>
                <div className={"h-full overflow-y-scroll scrollbar-custom"}
                style={{animation: `opacityAnimation 1s ease-out forwards`}}>
                    {news.map((item, index) => (
                        <div className={"hover:bg-gray-200 hover:cursor-pointer text-sm font-semibold rounded-xl py-3 px-2 ml-3 flex items-center gap-1"}
                             key={index}>
                            <a
                                className={"w-[200px]"}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{color: `black`}}>
                                {item.title}
                            </a>
                            {item.imagePath !== null && <img className={"w-16 h-12 rounded-xl"} src={`https://repick.site/api/v1/news/img/${item.imagePath}`}/>}
                        </div>
                    ))}
                </div>
        </div>
    )
}