import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { Button } from '@aws-amplify/ui-react';
import { TopPage } from './components/TopPage';
import { useExecLambda } from './api/useExecLambda';
import { Headline } from './components/Headline';
import { GetScript } from './api/GetScript';
import { useEffect, useState } from 'react';

function App() {
  const {onUrlChange, postLambda, loading, error, url_youtube} = useExecLambda();
  const [scriptData, setScriptData] = useState("");
  const [onClickflag, setOnClickFlag] = useState(false);
  const [getS3flag, setGetS3Flag] = useState(false);
  const OnClick = () =>{
    postLambda();
    setOnClickFlag(true);
  }

  useEffect(()=>{
    GetScript(url_youtube,setScriptData,setGetS3Flag);
  },[onClickflag]);

  console.log(loading,error,onClickflag,getS3flag);
  return (
    <div className="App">
      <Headline />
      <label>
          <input type="text" name="url" className='form-control ' placeholder='動画URL' onChange={onUrlChange} />
      </label>
      <Button type="submit"  className='ms-1' variation='primary' onClick={OnClick}>Submit</Button>
      {error ? (
          <p style={{ color: "red" }}>データの取得に失敗しました</p>
        ) : loading ? (
          <p>Loading...</p>
        ) :getS3flag&&(
          <>
            <br />
            <a href={scriptData} target="_blank" rel="noreferrer">
                  スクリプトデータ
            </a>
          </>
          )}
      <TopPage />
    </div>
  );
}

export default App;
