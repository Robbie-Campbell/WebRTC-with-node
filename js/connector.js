'use strict';

const constraints = window.constraints = {
    audio: false,
    video: true
}

function handleSuccess(stream) {
    const video = document.querySelector('video');
    const videoTracks = stream.getVideoTracks();
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream;
    video.srcObject = stream;
}

function handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
        const v = constraints.video;
        errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    }else if (error.name === 'PermissionDeniedError') {
        errorMsg('You have not granted us access to use your camera and microphone');
    }
    errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
    const errorElement = document.querySelector('#error');
    errorElement.innerHTML = `<p>${msg}</p>`;
    if (typeof error !== `undefined`) {
        console.log(error);
    }
}

function closeVideo(e) {
    try{
        window.stream.getVideoTracks().forEach((track) => {
            track.stop();
        });
        e.target.style.display = 'none';
        document.querySelector('#showVideo').style.display = 'block';
        document.querySelector('video').style.display = 'hidden';
    }catch {
        handleError(e);
    }
}

async function init(e) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
        e.target.style.display = 'none';
        document.querySelector('#closeVideo').style.display = 'block';
    } catch (e) {
        handleError(e);
    }
}

document.querySelector('#showVideo').addEventListener('click', e => init(e));
document.querySelector('#closeVideo').addEventListener('click', e => closeVideo(e));