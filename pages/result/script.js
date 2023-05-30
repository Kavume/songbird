const score = localStorage.getItem('score');

const scoreNum = document.querySelectorAll('.score__number');
scoreNum.forEach( item => item.innerHTML = score);