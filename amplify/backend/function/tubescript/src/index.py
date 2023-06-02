import json
from youtube_transcript_api import YouTubeTranscriptApi
import youtube_transcript_api
import numpy as np
import pandas as pd
import boto3

s3 = boto3.client('s3')

def transcript_get(transcript_list):
    
    for transcript in transcript_list:
        if transcript.is_generated == False:
            transcript_English_manually= transcript.fetch()
            transcript_Japanese_manually= transcript.translate('ja').fetch()
            return transcript_English_manually, transcript_Japanese_manually
        else:
            transcript_English_generated = transcript.fetch()
            transcript_Japanese_generated = transcript.translate('ja').fetch()
    
    transcript_English = transcript_English_generated
    transcript_Japanese = transcript_Japanese_generated

    return transcript_English, transcript_Japanese

def handler(event, context):
    print('received event:')
    print(event)
    try:
        params = json.loads(event.get('body'))
        video_url = params['url'] # 本番はフロントエンドから読み込む
        video_id = video_url.split("/")[-1]
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        #  字幕がない動画に対するテスト
        # transcript_list = YouTubeTranscriptApi.list_transcripts('QQilSZmTX4c') 
        
    except youtube_transcript_api._errors.TranscriptsDisabled:
        print('字幕がありません')
    else:
        transcript_English, transcript_Japanese = transcript_get(transcript_list)

        # DataFrameのための準備
        text_EG = [English['text'] for English in transcript_English]
        text_JA = [Japanese['text'] for Japanese in transcript_Japanese]
        
        start_EG = [English['start'] for English in transcript_English]
        start_JA = [Japanese['start'] for Japanese in transcript_Japanese]

        text_EG_dataframe = pd.DataFrame({'start': start_EG, 'EG': text_EG})
        text_JA_dataframe = pd.DataFrame({'start': start_JA, 'JA': text_JA})

        merge_dataframe = pd.merge(text_EG_dataframe,text_JA_dataframe,on='start', how='left')
        dataframe_length = len(merge_dataframe['start'])

        bucket_name = "tube-learn-app-storage-5e7b612064413-staging"
        text_file = '/tmp/test.txt'
        savepath = 'public/{}.txt'.format(video_id)

        with open(text_file,'w',encoding='utf-8') as f:
            f.write("開始時間"+"    "+"英文"+"     "+"和訳".rjust(40)+'\n')
            for i in range(dataframe_length):
                if str(merge_dataframe['JA'][i]) == "nan":
                    f.write(str(merge_dataframe['start'][i])+"    "+str(merge_dataframe['EG'][i])+"\n")
                else:
                    f.write(str(merge_dataframe['start'][i])+"    "+str(merge_dataframe['EG'][i])+"     "+str(merge_dataframe['JA'][i]).rjust(10)+'\n\n')
        s3.upload_file(text_file, bucket_name, savepath)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps('Hello from your new Amplify Python lambda!')
  }