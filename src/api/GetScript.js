import { Storage } from "aws-amplify";

export const GetScript = (url_data,setScriptData,setGetS3Flag) =>{
    
    try{
        const url_split = url_data.split('/');
        const video_id = url_split[url_split.length-1];
        const filename = video_id + '.txt'
        if(filename!==".txt"){
          Storage.get(filename,{
            level: 'public',
          }).then(data =>{
              console.log(data);
              setScriptData(data);
              setGetS3Flag(true);
          })
        }
      }catch(error){
        alert('ファイルがダウンロードできません. URLを確認してください');
    }
}