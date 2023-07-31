import step1_2 from '../images/tubelearn_step1_2.png';
import step2 from '../images/tubelearn_step2.png';
import step3 from '../images/tubelearn_step3.png';

export const TopPage = () => {
    return(
        <div className='container'>
            <div className="d-flex flex-column my-4 bg-light">
            <h3 className="alert alert-primary" role="alert">
                使い方
            </h3>
            <p className='fs-3 text-start mt-2'>
                Step1: 共有を開いた時のURLをコピーします
            </p>
            <img src ={step1_2} className='img-fluid mx-auto d-block' alt='...'/>
            <p className='fs-3 text-start mt-2'>
                Step2: URLを貼り付けたら「Submit」をクリック(タップ)
            </p>
            <img src ={step2} className='img-fluid mx-auto d-block' alt='...'/>
            <p className='text-start fs-3 text-wrap mt-2'> 
                すると, 「スクリプトデータ」と表示されるので, それをクリックするとテキストファイルがDLされます.
            </p>
            <img src ={step3} className='img-fluid mx-auto d-block' alt='...'/>
            </div>
        </div>
    )
}