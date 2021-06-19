window.onload = function() {
  function Card(suit,num) {
    this.suit = suit;
    this.num = num;
    this.front;
    this.setFront = function() {
      this.front = `${this.suit}${this.num<10 ? '0' : ''}${this.num}.gif`;
    }
  }

const cards = [];
const suits = ['s', 'd', 'h', 'c'];
for(let i = 0; i < suits.length; i++) {
  for(let j = 1; j <= 13; j++) {
    let card = new Card(suits[i],j);
    card.setFront();
    cards.push(card);
  }
}

function shuffle() {
  for (let i = 0; i < 13 * 4; i++) {
    let ccard = cards[i];
    r = Math.floor(Math.random() * 13 * 4);
    cards[i] = cards[r];
    cards[r] = ccard;
  }
}

function cardset () {
  const table = document.getElementById('table');
  for(let i = 0; i < suits.length; i++) {
    let tr = document.createElement('tr');
    for(let j = 0; j < 13; j++) {
      let td = document.createElement('td');
      let tempCard = cards[i*13+j];
      td.classList.add('card', 'back');
      td.style.backgroundImage=`url(images/${tempCard.front})`;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}
  
  let c = '';
  const counter = document.getElementById('result');

  function game () {
    const cardtachi = [];
    let m = 0;
    for (let i = 0; i < cards.length; i++) {
      cardtachi[i] = document.getElementsByClassName('card')[i];
      cardtachi[i].addEventListener('click', (e) => {
        c = e.target;
        c.classList.remove('back');
        c.classList.add('open');
        m++;
        switch(m) {
          case 1:
            judge1();
            break;
          case 2:
            judge2();
            counter.textContent = `${paircount}ペア`;
            if (paircount === 8) {
              counter.textContent = `${paircount}ペア
お楽しみはこれからだ！`;
            } else if (paircount === 14) {
              counter.textContent = `${paircount}ペア
そのデッキ回りすぎだろ…`;
            } else if (paircount === 22) {
              counter.textContent = `${paircount}ペア
スゴイぞーカッコいいぞー！！`;
            } else if (paircount === 25) {
              counter.textContent = `${paircount}ペア
ファイナルターン！`;
            } else if (paircount === 26) {
              counter.textContent = 'Congratulations!!'
              setTimeout(resetalert, 1000);
              clearTimeout(timeoutId);
              elapsedTime = new Date(Date.now() - startTime);;
              if (elapsedTime > 0) {
                timecount.style.display = 'none';
                const m = String(elapsedTime.getMinutes()).padStart(2, '0');
                const s = String(elapsedTime.getSeconds()).padStart(2, '0');
                const ms = String(elapsedTime.getMilliseconds()).padStart(3, '0');
                counter.textContent = `Congratulations!!\nTIME:${m}:${s}.${ms}`;
                // counter.textContent = `TIME:${elapsedTime}`
              }
            }
            break;
          case 3:
            judge3();
          default:
            return;
        }
      });
    }
  }

  let res1 = 0;
  let res2 = 0;
  let res3 = '';
  let res4 = '';
  let paircount = 0;
  
  function judge1() {
    res3 = c;
    let source = c.outerHTML;
    let res = parseInt(source.replace(/[^0-9]/g, ''), 10);
    res1 = res;
  }
  function judge2() {
    res4 = c;
    let source = c.outerHTML;
    let res = parseInt(source.replace(/[^0-9]/g, ''), 10);
    res2 = res
    //カードを揃えてすぐ次のカードを開くと開いたままになってしまう
    if (res1 === res2) {
      paircount++;
      setTimeout(() => {
      res3.classList.add('match');
      res4.classList.add('match');
      game();
    }, 300);
    } else {
      res3.classList.remove('open');
      res4.classList.remove('open');
      game();
    }
  }
  function judge3 () {
    res3.classList.add('back');
    res4.classList.add('back');
    res3.classList.remove('open');
    res4.classList.remove('open');
  }
  function tableremove () {
    const table = document.getElementById('table');
    while(table.firstChild) {
      table.removeChild(table.firstChild);
    }
  }
  const timeattack = () => {
    const options = {
        text: 'タイムアタックしますか？',
        buttons: {
            cancel: 'しない',
            ok: 'する'
        }
    };
    swal(options).then(function(value){
        if(value){
          counter.textContent = '';
          swal('START!');
          startTime = Date.now();
          countUp();
          time.textContent = '00:00.000';
          elapsedTime = 0;
          timecount.style.display = 'block';
        } else {
          timecount.style.display = 'none';
        }
    });
  }
  const resetalert = () => {
    const options = {
        text: 'もう一度デュエルを申し込みますか？',
        buttons: {
            cancel: 'デュエルしない',
            ok: 'デュエルする'
        }
    };
    swal(options).then(function(value){
        if(value){
          counter.textContent = '';
          swal('この一戦でオレの運命が決まる！！\n勝負だ相棒！！');
          timeattack();
          tableremove();
          cardset();
          paircount = 0;
          time.textContent = '00:00.000';
          elapsedTime = 0;
          game();
      } else {
        tableremove();
        paircount = 0;
        bord.textContent = '';
        bord.style.display = 'none';
        start.style.display = 'block';
        }
    });
  }
  const bord = document.getElementsByClassName('textboard')[0];
  const start = document.getElementById('startbtn');
  const timecount = document.getElementById('time');
  bord.style.display = 'none';
  timecount.style.display = 'none';
  start.addEventListener('click', () => {
    start.style.display = 'none';
    bord.style.display = 'block';
    timeattack();
    // shuffle();
    cardset();
    game();
  });

  const time = document.getElementById('time');

  let startTime;
  let timeoutId;;

  function countUp() {
    const d = new Date(Date.now() - startTime);
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    time.textContent = `${m}:${s}.${ms}`;
    timeoutId = setTimeout(() => {
      countUp();
    }, 10);
  }
}

