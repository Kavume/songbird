const data = window.birdsData;

let answered = false;

const shuffleData = arr => arr.sort((a, b) => 0.5 - Math.random());

let currentTab = 0;
let currentData = shuffleData(data[0]);

let renderedPlayerItem = currentData[Math.floor(Math.random() * currentData.length)];

const questionSection = document.querySelector('.section.section__current-question');
const playerTitle = questionSection.querySelector('.player__title');

const button = document.querySelector('.button.button__square');

button.addEventListener('click', () => {

    if (currentTab < 5) {

        nextTab()
        renderAnswers()
    } else {
        window.location.href = "./../result/index.html"
    }

})

function activateButton() {

    button.classList.add('button__color');
    button.style.pointerEvents = "auto";
}

function deactivateButton() {
    button.classList.remove('button__color');
    button.style.pointerEvents = "none";
}

function refreshVariantAnswer() {

    const panelAnswersVariantDescription = document.querySelector('.panel-answers__variant-description-wrap');
    panelAnswersVariantDescription.innerHTML = '';

    const panelAnswersVariantText = document.createElement('div');
    panelAnswersVariantText.classList.add('.panel-answers__text-wrap');
    panelAnswersVariantDescription.append(panelAnswersVariantText);

    const variantText = document.createElement('p');
    variantText.innerHTML = 'Послушайте плеер.';
    variantText.classList.add('text');
    panelAnswersVariantText.append(variantText);

    const variantText2 = document.createElement('p');
    variantText2.innerHTML = 'Выберите птицу из списка';
    variantText2.classList.add('text');
    panelAnswersVariantText.append(variantText2);
}

let score = 0;
let number = 0;

const scoreNumber = document.querySelector('.score__number');
localStorage.setItem('score', score);

function countScore() {

    score += number;
    scoreNumber.innerHTML = score;

    localStorage.setItem('score', score);
}

let numberClick = 0;

function countClick() {

    numberClick += 1;
}

function nextTab() {
    answered = false

    displayTime()

    numberClick = 0;

    refreshVariantAnswer();

    playerTitle.innerHTML = '*******';

    selectedIdImage.src = './../../assets/images/default.jpg';
    selectedIdImage.style.height = '560px';
    selectedIdImage.style.objectFit = 'cover';
    selectedIdImage.style.objectPosition = ' -300px -160px';

    const currentActive = document.querySelector('.panel-question__theme.active');
    currentActive.classList.remove('active');

    currentTab++;

    const nextTab = document.querySelector(`[data-id="${currentTab}"]`);
    nextTab.classList.add('active');

    currentData = shuffleData(data[currentTab]);

    renderedPlayerItem = currentData[Math.floor(Math.random() * currentData.length)];

    audioNew.src = renderedPlayerItem.audio;

    const progress = document.querySelector('.progress-line');
    progress.style.width = `${0}%`;

    audioPause();

}

function renderPlayer() {
    playerTitle.innerHTML = renderedPlayerItem.name;
}

const answersPanel = document.querySelector('.panel-answers__variant');


const audio = new Audio();

const selectedIdImage = document.querySelector('.current-question__image.image-default');


function handleVariantClick(event) {
    if (answered) return;

    const selectedId = parseInt(event.currentTarget.querySelector('input').getAttribute('id'));

    const selectedInput = event.currentTarget.querySelector('input');

    if (selectedId === renderedPlayerItem.id) {

        renderPlayer();

        selectedInput.classList.add('correct');

        audio.src = './../../assets/sounds/winner.mp3';
        audio.play();

        activateButton();


        selectedIdImage.src = renderedPlayerItem.image;
        selectedIdImage.style.width = '240px';
        selectedIdImage.style.height = '180px';
        selectedIdImage.style.objectFit = 'cover';
        selectedIdImage.style.objectPosition = 'center center';

        answered = true;

        const player = document.querySelector('audio');
        player.pause();

        const playerButton = document.querySelector('.player__button-image');
        playerButton.src = './../../assets/icons/play-button.png';
        const playerWrap = document.querySelector('.player')
        playerWrap.classList.remove('play')
    }

    if (selectedId !== renderedPlayerItem.id) {

        selectedInput.classList.add('incorrect');

        audio.src = './../../assets/sounds/error.mp3';
        audio.play();

    }

    countClick();

    if (numberClick === 1 && selectedId === renderedPlayerItem.id) {
        number = 5;
    } else if (numberClick > 1 && selectedId === renderedPlayerItem.id) {
        number = 3;
    } else {
        number = 0;
    }

    countScore();

}

function cleanAnswers() {

    answersPanel.innerHTML = '';
}

const audioPlayer = document.querySelector('.player');
const audioNew = document.createElement('audio');
audioNew.classList.add('audio');
// audioNew.setAttribute('preload', 'metadata');
// audioNew.onloadedmetadata;
audioPlayer.append(audioNew);
audioNew.addEventListener('timeupdate', updateProgress);
audioNew.src = renderedPlayerItem.audio;


const playerVolume = document.querySelector('.player__volume');
const playerInput = document.querySelector('.player__input');
const playerVolumeIcon = document.querySelector('.player__volume-icon');

function setVolume() {
    audioNew.volume = playerInput.value / 100;

    if (audioNew.volume === 0.01 && !playerVolumeIcon.className.includes('off')) {
        playerVolumeIcon.classList.add('off');
    } else {
        playerVolumeIcon.classList.remove('off');
    }
}

setVolume()


const currentTime = document.querySelector('.current-time');
const totalTime = document.querySelector('.total-time');

function displayTime() {

    totalTime.innerHTML = '00:00'
    currentTime.innerHTML = '00:00'
    const progressLine = document.querySelector('.progress-line');

    setTimeout(() => {
        totalTime.innerHTML = formatTime(audioNew.duration);
    }, 300)

    setInterval(() => {
        currentTime.innerHTML = formatTime(audioNew.currentTime)
    }, 500)

}

displayTime()

function formatTime(time) {

    let min = Math.floor(time / 60);
    if (min < 10) {
        min = `0${min}`;
    }

    let sec = Math.floor(time % 60);
    if (sec < 10) {
        sec = `0${sec}`
    }

    return `${min}:${sec}`;
}

const buttonPlayer = document.querySelector('.player__button-image');

function audioPause() {
    audioPlayer.classList.remove('play');
    audioNew.pause();
    buttonPlayer.src = './../../assets/icons/play-button.png';
}

function audioPlay() {
    audioPlayer.classList.add('play');
    audioNew.play()
    buttonPlayer.src = './../../assets/icons/pause.png'

}

buttonPlayer.addEventListener('click', () => {


    if (audioPlayer.classList.contains('play')) {

        audioPause()
    } else {
        audioPlay()
    }

    const audio = document.querySelector('audio');
    const player = document.querySelector('.player');
    audio.addEventListener('ended', function() {
        buttonPlayer.src = './../../assets/icons/play-button.png';
        player.classList.remove('play');
    });
})

function updateProgress(event) {
    const {duration, currentTime} = event.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    const progress = document.querySelector('.progress-line');
    progress.style.width = `${progressPercent}%`;
}

function renderAnswers() {

    cleanAnswers();
    deactivateButton();

    for (let i = 0; i < currentData.length; i++) {

        const variant = document.createElement('div');
        const input = document.createElement('input');
        const label = document.createElement('label');

        variant.addEventListener('click', handleVariantClick);

        label.innerHTML = currentData[i].name;
        label.classList.add('variant__label');
        label.setAttribute('htmlFor', currentData[i].id);

        input.classList.add('variant__input');
        input.setAttribute('type', 'radio');
        input.setAttribute('id', currentData[i].id);

        variant.append(input);
        variant.append(label);
        variant.className = 'variant';


        variant.addEventListener('click', () => {
            const panelAnswersVariant = document.querySelector('.panel-answers__variant-description-wrap')
            panelAnswersVariant.innerHTML = '';

            const panelAnswersVariantWrap = document.createElement('div');
            panelAnswersVariantWrap.classList.add('answer__variant-wrap');
            panelAnswersVariant.append(panelAnswersVariantWrap)

            const imageWrap = document.createElement('div');
            imageWrap.classList.add('answer__variant-image-wrap');
            panelAnswersVariantWrap.append(imageWrap);

            const image = document.createElement('img');
            image.classList.add('answer__variant-image');
            image.src = currentData[i].image;
            imageWrap.append(image);

            const variantInfo = document.createElement('div');
            variantInfo.classList.add('answer__variant-info');
            panelAnswersVariantWrap.append(variantInfo);

            const answersVariantText = document.createElement('h2');
            answersVariantText.classList.add('answer__variant-title');
            variantInfo.append(answersVariantText);
            answersVariantText.innerHTML = currentData[i].name;

            const separateLine = document.createElement('div');
            separateLine.classList.add('answer__variant-separate-line');
            variantInfo.append(separateLine);

            const species = document.createElement('p');
            species.classList.add('answer__variant-species');
            species.innerHTML = currentData[i].species;
            variantInfo.append(species);

            const separateLine2 = document.createElement('div');
            separateLine2.classList.add('answer__variant-separate-line');
            variantInfo.append(separateLine2);

            const answersVariantDescription = document.createElement('p');
            answersVariantDescription.innerHTML = currentData[i].description;
            answersVariantDescription.classList.add('answer__variant-text');
            panelAnswersVariant.append(answersVariantDescription);

            const playerWrap = document.createElement('div');
            playerWrap.classList.add('answer__variant-player');
            variantInfo.append(playerWrap);

            const variantPlayerButton = document.createElement('button');
            variantPlayerButton.classList.add('variant-player__button');
            playerWrap.append(variantPlayerButton);

            const variantPlayerButtonImage = document.createElement('img');
            variantPlayerButtonImage.classList.add('variant-player__button-image');
            variantPlayerButtonImage.src = './../../assets/icons/play-button.png'
            variantPlayerButton.append(variantPlayerButtonImage);

            const progressLine = document.createElement('div');
            progressLine.classList.add('variant-player__progress-line');
            playerWrap.append(progressLine);


            const progress = document.createElement('div');
            progress.classList.add('variant-player__progress');
            progressLine.append(progress);

            const audioPlayer = document.querySelector('.answer__variant-player');
            const audioNew = document.createElement('audio');
            audioNew.classList.add('audio');
            audioPlayer.append(audioNew);
            audioNew.addEventListener('timeupdate', updateProgressVariant);

            audioNew.src = currentData[i].audio;

            const buttonPlayer = document.querySelector('.variant-player__button-image');
            buttonPlayer.addEventListener('click', () => {

                if (audioPlayer.classList.contains('play')) {

                    audioPlayer.classList.remove('play');
                    audioNew.pause();
                    buttonPlayer.src = './../../assets/icons/play-button.png';

                } else {
                    audioPlayer.classList.add('play');
                    audioNew.play()
                    buttonPlayer.src = './../../assets/icons/pause.png'

                }
            })

        })

        answersPanel.append(variant);
    }

}

function updateProgressVariant(event) {
    const {duration, currentTime} = event.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    const progress = document.querySelector('.variant-player__progress');
    progress.style.width = `${progressPercent}%`;
}

function init() {

    renderAnswers();
}

init()


