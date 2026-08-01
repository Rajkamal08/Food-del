import React from 'react'
import "./AppDownload.css"
import { assets } from '../../assets/assets'
const AppDownload = () => {
    return (
        <div className="app-download" id="app-download">
            <p className='app-download-title'>For a Better Experience Download the <br /><span className='highlight'>FeastFlow App</span></p>
            <div className='app-download-platforms'>
                <img src={assets.play_store} alt="Google Play Store" />
                <img src={assets.app_store} alt="Apple App Store" />
            </div>
        </div>
    )
}

export default AppDownload
