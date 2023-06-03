import './App.css';
import '@aws-amplify/ui-react/styles.css'; 
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Auth, Storage} from 'aws-amplify';


const api_url = "https://2e65g038x5.execute-api.ap-northeast-1.amazonaws.com/staging/tubescript-staging"

function CreateScript(SetToppage,url_data,SetUrl,SetDownlink){
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

  const OnDclick = () => {
    try{
      const url_split = url_data.split('/');
      const video_id = url_split[url_split.length-1];
      const filename = video_id + '.txt'
      Storage.get(filename,{
        level: 'public',
      }).then(data =>{
          console.log(data)
          SetDownlink(
            <a href={data} target="_blank" rel="noreferrer">
              テキストファイル
            </a>
          )
      })
    }catch(error){
      alert('ファイルがダウンロードできません. URLを確認してください');
    }
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
        <button onClick={OnDclick}>Download</button>
        
      </div>
    </div>
  )
}

function App() {
  const [toppage, SetToppage] = useState("");
  const [downloadlink, SetDownlink] = useState("");
  const [url_data, SetUrl] = useState("");
  const [progress, SetProgress] = useState(0);

  
  useEffect(()=>{
    CreateScript(SetToppage,url_data,SetUrl,SetDownlink);
  },[url_data,progress,downloadlink]);

  return (
    <div className="App">
      {toppage}
      {downloadlink}
    </div>
  );
}

export default App;
