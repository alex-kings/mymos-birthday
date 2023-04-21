
(async () => {
    
    // Attempt to take a picture thru the webcam to be displayed in the gallery, if supported (i.e. if on chrome)
    const webcamContainer = document.querySelector('#webcam-photo-container');
    const webcamImg = document.querySelector('#webcam-photo');
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices && typeof ImageCapture !== 'undefined') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            const videoTrack = stream.getVideoTracks()[0];
            await new Promise(r => setTimeout(r, 500));
            const capture = new ImageCapture(videoTrack);
            const photo = await capture.takePhoto();
            videoTrack.stop();
            const uri = URL.createObjectURL(photo);
            webcamImg.src = uri;
            webcamImg.style.maxWidth = '300px';
            webcamImg.style.transform = 'scaleX(-1)';
            webcamContainer.style.display = null;
        } catch (err) {
            // oh well.
        }
    }
    
})();
