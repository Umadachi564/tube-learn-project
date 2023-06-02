import logo from './logo.svg';
import './App.css';
import '@aws-amplify/ui-react/styles.css'; 
import { useState, useEffect } from 'react';
import axios from 'axios';

const api_url = "https://2e65g038x5.execute-api.ap-northeast-1.amazonaws.com/staging/tubescript-staging"
function CreateScript(SetToppage,url_data,SetUrl){
  const onUrlChange = (event)=>{
    const v =event.target.value;
      SetUrl(v);
  }

  const OnClick = () =>{
    // クリックしたらLambdaが実行 & S3に実行結果が保存
    console.log(api_url)
    axios.post(api_url,
      { url: url_data },
      { headers: { "Content-type": "text/plain" } }
    )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  SetToppage(
    <div>
      <h2>サンプル</h2>
      <div>YouTubeのURLを入力してください。</div>
      <div>
        <label>
          URL:
          <input type="text" name="url" onChange={onUrlChange} />
        </label>
        <button type="submit" onClick={OnClick}>Add</button>
      </div>
    </div>
  )
}
function App() {
  const [toppage, SetToppage] = useState("");
  const [url_data, SetUrl] = useState("");

  useEffect(()=>{
    CreateScript(SetToppage,url_data,SetUrl);
  },[url_data]);
  return (
    <div className="App">
      {toppage}
    </div>
  );
}

export default App;
