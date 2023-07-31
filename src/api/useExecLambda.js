import { useState } from 'react';
import axios from 'axios';

export const useExecLambda = () => {
    const api_url = "https://2e65g038x5.execute-api.ap-northeast-1.amazonaws.com/staging/tubescript-staging"

    const [url_youtube, SetYoutubeUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const onUrlChange = (event)=>{
        const v =event.target.value;
          SetYoutubeUrl(v);
    }

    const postLambda = () =>{
        // クリックしたらLambdaが実行 & S3に実行結果が保存
        setLoading(true);
        setError(false);
        console.log(api_url)
        axios.post(api_url,
            { url: url_youtube },
            { headers: { "Content-type": "text/plain" } }
        )
        .then((res) => {
            console.log(res.data);
        })
        .catch((error) => {
            setError(true);
            console.log(error);
            alert('URLを入力してください.')
        })
        .finally(()=>{
            setLoading(false);
        })
    }
    return {onUrlChange, postLambda, loading, error, url_youtube};
}