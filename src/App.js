import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Storage } from 'aws-amplify';
import { Button } from '@aws-amplify/ui-react';
import step1_1 from './images/tubelearn_step1_1.png';
import step1_2 from './images/tubelearn_step1_2.png';
import step2 from './images/tubelearn_step2.png';
import step3 from './images/tubelearn_step3.png';

const api_url = "https://2e65g038x5.execute-api.ap-northeast-1.amazonaws.com/staging/tubescript-staging"

function CreateScript(SetToppage,SetDownbutton,url_data,SetUrl,SetDownlink){
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
        SetDownbutton(
            <Button variation='primary' onClick={OnDclick}>Download</Button>  
        )
      })
      .catch((error) => {
        console.log(error);
        alert('URLを入力してください.')
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
          SetDownlink(
              <a href={data} target="_blank" rel="noreferrer">
                スクリプトデータ
              </a>
          )
      })
    }catch(error){
      alert('ファイルがダウンロードできません. URLを確認してください');
    }
  }
  SetToppage(
    <div>
      <h1>TubeLearn</h1>
      <p className='text-center fs-4'>~YouTubeの動画で英語学習を~ </p>
      <p className='text-center text-danger'>※ 字幕設定がOFFの動画は利用できません</p>
        <label>
          <input type="text" name="url" className='form-control ' placeholder='動画URL' onChange={onUrlChange} />
        </label>
          <Button type="submit"  className='ms-1' variation='primary' onClick={OnClick}>Submit</Button>
    </div> 
  )
}

function App() {
  const [toppage, SetToppage] = useState("");
  const [downloadbutton, SetDownbutton] = useState("");
  const [downloadlink, SetDownlink] = useState("");
  const [url_data, SetUrl] = useState("");

  useEffect(()=>{
    CreateScript(SetToppage,SetDownbutton,url_data,SetUrl,SetDownlink);
  },[url_data]);

  return (
    <div className="App">
      {toppage}
      {downloadbutton}
      <div className='ms-2 mt-1'>
        {downloadlink}
      </div>
      <div className='container'>
        <div className="d-flex flex-column my-4 bg-light">
          <h3 className="alert alert-primary" role="alert">
            使い方
          </h3>
          <p className='fs-3 text-start mt-2'>
            Step1: ブラウザ上のURLか共有を開いた時のURLをコピーします
          </p>
          <img src ={step1_1} className='img-fluid mx-auto d-block' alt='...'/>
          <img src ={step1_2} className='img-fluid mx-auto d-block' alt='...'/>
          <p className='fs-3 text-start mt-2'>
            Step2: URLを貼り付けたら「Submit」をクリック(タップ)
          </p>
          <img src ={step2} className='img-fluid mx-auto d-block' alt='...'/>
          <p className='text-start fs-3 text-wrap mt-2'>
            Step3: 5~10秒後にDownloadが表示されるので, それを押す. 
            すると, 「スクリプトデータ」と表示されるので, それをクリックするとテキストファイルがDLされます.
          </p>
          <img src ={step3} className='img-fluid mx-auto d-block' alt='...'/>
        </div>
      </div>
      
    </div>
  );
}

export default App;
