
    (function(){
      const stage = document.getElementById('vd-stage');
      const steps = stage.querySelectorAll('.vd-step');
      const fill = document.getElementById('vd-prog-fill');
      const markers = document.querySelectorAll('.vd-marker');
      const playBtn = document.getElementById('vd-play');
      const totalEl = document.getElementById('vd-total');
      const coinsTop = document.querySelector('.vd-coins-top');
      const liveEl = document.getElementById('vd-live-n');

      const DURATIONS = [3500, 3800, 3800, 4000, 3800, 3800, 4500];
      const TOTAL = DURATIONS.reduce((a,b)=>a+b,0);
      let elapsed = 0, playing = true, last = 0, currentStep = -1;
      let totalBC = 0, targetBC = 0, bcRaf;

      function tweenBC(to, duration=600) {
        const from = totalBC, start = performance.now();
        cancelAnimationFrame(bcRaf);
        function tick(now) {
          const t = Math.min(1, (now - start)/duration);
          totalBC = Math.round(from + (to - from) * t);
          totalEl.textContent = totalBC;
          if (t < 1) bcRaf = requestAnimationFrame(tick);
        }
        bcRaf = requestAnimationFrame(tick);
      }
      function pulseCoins(){ coinsTop.classList.add('pulse'); setTimeout(()=>coinsTop.classList.remove('pulse'),600); }
      function flyCoins(containerId, from, to, n=6) {
        const c = document.getElementById(containerId); if (!c) return;
        const r = c.getBoundingClientRect();
        c.innerHTML = '';
        for (let i=0;i<n;i++) {
          const coin = document.createElement('div');
          coin.className = 'vd-coin';
          coin.style.left = (from.x - r.left) + 'px';
          coin.style.top = (from.y - r.top) + 'px';
          coin.style.setProperty('--dx', ((to.x - from.x) + (Math.random()*40-20)) + 'px');
          coin.style.setProperty('--dy', ((to.y - from.y) + (Math.random()*20-10)) + 'px');
          coin.style.animationDelay = (i*80) + 'ms';
          c.appendChild(coin);
        }
        setTimeout(()=>{ c.innerHTML=''; }, 1400);
      }
      function rain(n=10) {
        const c = document.getElementById('vd-rain'); if (!c) return;
        c.innerHTML = '';
        for (let i=0;i<n;i++) {
          const d = document.createElement('div');
          d.className = 'vd-rc';
          d.style.left = (Math.random()*90+5) + '%';
          d.style.animationDelay = (i*100) + 'ms';
          c.appendChild(d);
        }
      }

      // Step event schedules (relative to step start)
      function runStep(i) {
        steps.forEach((s,k)=>{
          s.classList.toggle('active', k===i);
          const bg = s.getAttribute('data-bg');
          if (bg && k === i && !s.style.backgroundImage) s.style.backgroundImage = 'url("' + bg + '")';
        });
        stage.classList.toggle('has-step-bg', !!steps[i].getAttribute('data-bg'));
        markers.forEach((m,k)=>m.classList.toggle('active', k===i));

        if (i === 0) {
          const sil = document.getElementById('vd-sil');
          const det = document.getElementById('vd-detect');
          if (sil) { sil.classList.remove('walk'); setTimeout(()=>sil.classList.add('walk'), 300); }
          if (det) { det.classList.remove('show'); setTimeout(()=>det.classList.add('show'), 1800); }
          // Reset counter only when looping back to the very first step
          totalBC = 0; totalEl.textContent = 0;
          return;
        }
        if (i === 1) {
          const c1 = document.getElementById('vd-ic-1');
          const c2 = document.getElementById('vd-ic-2');
          const c3 = document.getElementById('vd-ic-3');
          [c1,c2,c3].forEach(c=>c && c.classList.remove('show'));
          setTimeout(()=>c1 && c1.classList.add('show'), 300);
          setTimeout(()=>{ c2 && c2.classList.add('show'); tweenBC(10, 600); pulseCoins(); }, 900);
          setTimeout(()=>c3 && c3.classList.add('show'), 1500);
          return;
        }
        if (i === 2) {
          const qr = document.getElementById('vd-qr2');
          const welcome = document.getElementById('vd-welcome');
          const scanState = document.getElementById('vd-scan-state');
          qr.classList.remove('show'); welcome.classList.remove('show');
          scanState.classList.remove('show','done'); scanState.textContent = 'Scan en cours…';
          setTimeout(()=>qr.classList.add('show'), 250);
          setTimeout(()=>scanState.classList.add('show'), 600);
          setTimeout(()=>{
            qr.classList.remove('show');
            welcome.classList.add('show');
            scanState.classList.add('done');
            scanState.textContent = '✓ Profil créé !';
            pulseCoins();
          }, 2100);
          return;
        }
        if (i === 3) {
          const timerC = document.getElementById('vd-timer-c');
          const timerN = document.getElementById('vd-timer-n');
          const ansB = document.getElementById('vd-ans-b');
          const toast = document.getElementById('vd-s2-toast');
          timerC.style.transition='none'; timerC.style.strokeDashoffset='0'; timerN.textContent='15';
          ansB.classList.remove('correct'); toast.classList.remove('show');
          setTimeout(()=>{
            timerC.style.transition='stroke-dashoffset 3.5s linear';
            timerC.style.strokeDashoffset='57';
            let t = 15;
            const ti = setInterval(()=>{ t--; if (t>=8) timerN.textContent=t; else clearInterval(ti); }, 500);
          }, 150);
          setTimeout(()=>{ ansB.classList.add('correct'); }, 1500);
          setTimeout(()=>{
            const btn = ansB.getBoundingClientRect(), tr = coinsTop.getBoundingClientRect();
            flyCoins('vd-coinfly-2', {x:btn.left+btn.width/2,y:btn.top+btn.height/2}, {x:tr.left+tr.width/2,y:tr.top+tr.height/2}, 8);
            tweenBC(57, 800); pulseCoins();
          }, 2000);
          setTimeout(()=>toast.classList.add('show'), 2500);
          return;
        }
        if (i === 4) {
          const rows = steps[4].querySelectorAll('.vd-lb-row');
          const meRow = steps[4].querySelector('.me');
          const rankEl = document.getElementById('vd-lb-rank-me');
          const bcEl = document.getElementById('vd-lb-bc-me');
          const toast = document.getElementById('vd-s3-toast');
          meRow.classList.remove('win'); toast.classList.remove('show');
          rows[0].style.order=1; rows[1].style.order=2; rows[2].style.order=3; rows[3].style.order=4; meRow.style.order=5;
          rankEl.textContent = '5'; bcEl.textContent = (totalBC||67) + ' BC';
          // Cumulative progression — don't reset totalBC. Lucas climbs by gaining more BC over time.
          const jumps = [
            { t: 400,  order: 4, rank: '4', bc: '180 BC', total: 180 },
            { t: 1000, order: 3, rank: '3', bc: '240 BC', total: 240 },
            { t: 1600, order: 2, rank: '2', bc: '290 BC', total: 290 },
            { t: 2300, order: 1, rank: '1', bc: '341 BC', total: 341 }
          ];
          jumps.forEach(j => setTimeout(()=>{
            meRow.style.order = j.order;
            rankEl.textContent = j.rank;
            bcEl.textContent = j.bc;
            tweenBC(j.total, 400); pulseCoins();
          }, j.t));
          setTimeout(()=>{ meRow.classList.add('win'); toast.classList.add('show'); rain(12); }, 2600);
          return;
        }
        if (i === 5) {
          // decor-only, css handles animations
          return;
        }
        if (i === 6) {
          const eyebrow = document.getElementById('vd-bil-eyebrow');
          const title = document.getElementById('vd-bil-title');
          const s1 = document.getElementById('vd-bil-s1');
          const s2 = document.getElementById('vd-bil-s2');
          const s3 = document.getElementById('vd-bil-s3');
          const cta = document.getElementById('vd-bil-cta');
          [eyebrow,title,s1,s2,s3,cta].forEach(el=>el && el.classList.remove('show'));
          setTimeout(()=>eyebrow && eyebrow.classList.add('show'), 100);
          setTimeout(()=>title && title.classList.add('show'), 350);
          setTimeout(()=>s1 && s1.classList.add('show'), 900);
          setTimeout(()=>s2 && s2.classList.add('show'), 1150);
          setTimeout(()=>s3 && s3.classList.add('show'), 1400);
          setTimeout(()=>cta && cta.classList.add('show'), 1900);
          return;
        }
      }

      function setStep(i, resetElapsed=true) {
        if (i === currentStep) return;
        currentStep = i;
        if (resetElapsed) {
          elapsed = DURATIONS.slice(0,i).reduce((a,b)=>a+b,0);
        }
        runStep(i);
      }

      function frame(t) {
        if (!last) last = t;
        const dt = t - last; last = t;
        if (playing) {
          elapsed += dt;
          if (elapsed >= TOTAL) { elapsed = 0; totalBC = 0; totalEl.textContent = 0; currentStep = -1; }
          fill.style.width = (elapsed/TOTAL*100) + '%';
          let acc = 0, si = 0;
          for (let i=0;i<DURATIONS.length;i++) { if (elapsed < acc+DURATIONS[i]) { si = i; break; } acc += DURATIONS[i]; }
          if (si !== currentStep) { currentStep = si; runStep(si); }
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      markers.forEach((m,i)=>m.addEventListener('click', ()=>{ setStep(i); }));
      document.getElementById('vd-prev').addEventListener('click', ()=>setStep(Math.max(0,currentStep-1)));
      document.getElementById('vd-next').addEventListener('click', ()=>setStep(Math.min(5,currentStep+1)));
      playBtn.addEventListener('click', ()=>{
        playing = !playing;
        playBtn.textContent = playing ? '⏸ Pause' : '▶ Lecture';
      });

      // Touch swipe
      let tx = 0;
      stage.addEventListener('touchstart', e=>{ tx = e.touches[0].clientX; }, {passive:true});
      stage.addEventListener('touchend', e=>{
        const dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 40) setStep(dx < 0 ? Math.min(5,currentStep+1) : Math.max(0,currentStep-1));
      });

      // Live count jitter
      setInterval(()=>{
        const n = parseInt(liveEl.textContent) + Math.floor(Math.random()*5)-2;
        liveEl.textContent = Math.max(42, Math.min(52, n));
      }, 4000);
    })();
  

    (function() {
      const QUESTIONS = [
        { q: "Qui a réalisé 'Le Parrain' ?", a: ["Brian De Palma", "Francis Ford Coppola", "Martin Scorsese", "Sergio Leone"], correct: 1,
          punch: { fast: "Même Vito Corleone aurait commandé une tournée.", slow: "Vous avez hésité. Don Corleone n'hésitait jamais.", wrong: "Scarface ? Sérieusement ? Posez ce verre.", timeout: "15 secondes pour répondre. Le Parrain, lui, n'attend pas." } },
        { q: "En quelle année est sorti le film 'Apollo 13' ?", a: ["1993", "1995", "1997", "1999"], correct: 1,
          punch: { fast: "Houston confirme : vous êtes le meilleur de la soirée.", slow: "Vous y êtes arrivé. Comme Apollo 13 — de justesse.", wrong: "Interstellar ? On était en 1995, pas dans l'espace.", timeout: "Houston, on a un problème. C'est vous." } },
        { q: "Qui prononce 'I'll be back' pour la première fois ?", a: ["Sylvester Stallone", "Bruce Willis", "Arnold Schwarzenegger", "Jean-Claude Van Damme"], correct: 2,
          punch: { fast: "I'll be back. Et vos clients aussi, grâce à BarCoins.", slow: "Correct. Mais Schwarzenegger aurait répondu en 3s.", wrong: "Robocop ? Il protège Detroit, pas les classements.", timeout: "Hasta la vista, BarCoins. Vous avez laissé filer les points." } },
        { q: "Qui a réalisé 'Titanic' ?", a: ["Steven Spielberg", "Ridley Scott", "James Cameron", "Michael Bay"], correct: 2,
          punch: { fast: "Roi du monde ce soir. Votre bar aussi avec BarCoins.", slow: "Exact. Le Titanic a coulé, pas votre score.", wrong: "Braveheart ? William Wallace ne montait pas sur des bateaux.", timeout: "Le Titanic a coulé en 2h40. Vous en 15 secondes." } },
        { q: "Qui joue le rôle principal dans 'Taxi Driver' ?", a: ["Al Pacino", "Robert De Niro", "Dustin Hoffman", "Jack Nicholson"], correct: 1,
          punch: { fast: "Tu parles à moi ? Oui. Et BarCoins aussi parle à vos clients.", slow: "Bonne réponse. De Niro est fier. Un peu.", wrong: "Serpico ? Même Al Pacino a fait mieux ce soir.", timeout: "Tu parles à moi ? Non. Tu regardes le timer sans répondre." } }
      ];
      const PLAYERS = [
        { id: 'sl', name: 'Sophie L.', initials: 'SL', color: '#7c3aed', coins: 340 },
        { id: 'ma', name: 'Marc A.', initials: 'MA', color: '#2563eb', coins: 290 },
        { id: 'tr', name: 'Thomas R.', initials: 'TR', color: '#16a34a', coins: 240 },
        { id: 'cm', name: 'Claire M.', initials: 'CM', color: '#ea580c', coins: 180 },
        { id: 'me', name: 'VOUS', initials: 'V', color: '#C9902A', coins: 0, me: true }
      ];

      let qIdx = 0, timer = 15, timerInt, nextTimeout, advanceInt, answered = false, myCoins = 0, myRank = 5, lbBotInt, liveInt;

      const root = document.getElementById('qz-root');
      const toastsEl = document.getElementById('qz-toasts');

      function toast(msg) {
        const el = document.createElement('div');
        el.className = 'qz-toast';
        el.textContent = msg;
        toastsEl.innerHTML = '';
        toastsEl.appendChild(el);
        setTimeout(() => el.remove(), 3000);
      }

      function renderLB() {
        const sorted = [...PLAYERS].sort((a, b) => b.coins - a.coins);
        const newMyRank = sorted.findIndex(p => p.me) + 1;
        const list = document.getElementById('qz-lb-list');
        list.innerHTML = sorted.map((p, i) => {
          const prevRank = p._prev || (i + 1);
          const arrow = p._delta > 0 ? '↑' : (p._delta < 0 ? '↓' : '');
          const arrowCls = p._delta > 0 ? 'up' : (p._delta < 0 ? 'down' : '');
          return '<div class="qz-lb-row' + (p.me ? ' me' : '') + '">' +
            '<div class="qz-lb-rank' + (i < 3 ? ' top' : '') + '">' + (i + 1) + '</div>' +
            '<div class="qz-lb-avatar" style="background:' + p.color + '">' + p.initials + '</div>' +
            '<div class="qz-lb-name">' + p.name + '</div>' +
            '<div class="qz-lb-coins">' + p.coins + '</div>' +
            '<div class="qz-lb-arrow ' + arrowCls + '">' + arrow + '</div>' +
            '</div>';
        }).join('');
        if (myRank && newMyRank < myRank) {
          if (newMyRank === 1) toast('👑 Vous êtes en tête ! Tenez bon.');
          else toast('📈 Vous passez N°' + newMyRank + ' !');
        }
        myRank = newMyRank;
      }

      function startLBBot() {
        lbBotInt = setInterval(() => {
          PLAYERS.forEach(p => {
            if (!p.me) {
              const prev = [...PLAYERS].sort((a,b)=>b.coins-a.coins).findIndex(x=>x.id===p.id);
              p.coins += Math.floor(Math.random() * 28) + 8;
              const now = [...PLAYERS].sort((a,b)=>b.coins-a.coins).findIndex(x=>x.id===p.id);
              p._delta = prev - now;
            }
          });
          renderLB();
        }, 5000);
      }

      function startLive() {
        liveInt = setInterval(() => {
          const el = document.getElementById('qz-live-count');
          let n = parseInt(el.textContent);
          n += Math.floor(Math.random() * 5) - 2;
          el.textContent = Math.max(40, Math.min(55, n));
        }, 6000);
      }

      function loadQuestion() {
        clearTimeout(nextTimeout); clearInterval(advanceInt);
        answered = false; timer = 15;
        const Q = QUESTIONS[qIdx];
        document.getElementById('qz-q-cur').textContent = qIdx + 1;
        document.getElementById('qz-progress-fill').style.width = ((qIdx) / QUESTIONS.length * 100) + '%';
        document.getElementById('qz-question').textContent = Q.q;
        document.getElementById('qz-feedback').innerHTML = '';
        document.getElementById('qz-punchbox').innerHTML = '';
        document.getElementById('qz-next-btn').style.display = 'none';
        document.getElementById('qz-card').classList.remove('danger');

        const ansEl = document.getElementById('qz-answers');
        ansEl.innerHTML = Q.a.map((a, i) => '<button class="qz-answer" data-i="' + i + '"><span>' + a + '</span><span class="qz-icon"></span></button>').join('');
        ansEl.querySelectorAll('.qz-answer').forEach(btn => {
          btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.i)));
        });

        runTimer();
      }

      function runTimer() {
        updateTimerUI();
        clearInterval(timerInt);
        timerInt = setInterval(() => {
          timer--;
          updateTimerUI();
          if (timer <= 0) { clearInterval(timerInt); if (!answered) timeoutQ(); }
        }, 1000);
      }

      function updateTimerUI() {
        const ring = document.getElementById('qz-timer-ring');
        const circ = 2 * Math.PI * 24;
        ring.style.strokeDasharray = circ;
        ring.style.strokeDashoffset = circ * (1 - timer / 15);
        document.getElementById('qz-timer-num').textContent = timer;
        const card = document.getElementById('qz-card');
        if (timer <= 3) { ring.setAttribute('stroke', '#ef4444'); card.classList.add('danger'); }
        else if (timer <= 7) { ring.setAttribute('stroke', '#f59e0b'); card.classList.remove('danger'); }
        else { ring.setAttribute('stroke', '#C9902A'); card.classList.remove('danger'); }
      }

      function selectAnswer(idx) {
        if (answered) return;
        answered = true;
        clearInterval(timerInt);
        const Q = QUESTIONS[qIdx];
        const correct = idx === Q.correct;
        const btns = document.querySelectorAll('#qz-answers .qz-answer');
        btns.forEach((b, i) => {
          b.classList.add('disabled');
          if (i === Q.correct) { b.classList.add('correct'); b.querySelector('.qz-icon').textContent = '✓'; }
          else if (i === idx) { b.classList.add('wrong'); b.querySelector('.qz-icon').textContent = '✗'; }
        });

        if (correct) {
          const coinsGain = timer >= 10 ? 50 : (timer >= 5 ? 35 : 20);
          myCoins += coinsGain;
          PLAYERS.find(p => p.me).coins = myCoins;
          const badge = document.getElementById('qz-coins-badge');
          document.getElementById('qz-coins').textContent = myCoins;
          badge.classList.add('pulse');
          setTimeout(() => badge.classList.remove('pulse'), 600);
          launchCoins(btns[idx]);
          if (timer >= 10) toast('⚡ Réponse éclair ! Vous gagnez le max de BarCoins');
          renderLB();
          showPunch(Q.punch, timer >= 10 ? 'fast' : 'slow');
        } else {
          toast('💀 Raté ! Sophie L. prend de l\\'avance…');
          showPunch(Q.punch, 'wrong');
        }
        scheduleNext();
      }

      function timeoutQ() {
        answered = true;
        const Q = QUESTIONS[qIdx];
        const btns = document.querySelectorAll('#qz-answers .qz-answer');
        btns.forEach((b, i) => {
          b.classList.add('disabled');
          if (i === Q.correct) { b.classList.add('correct'); b.querySelector('.qz-icon').textContent = '✓'; }
        });
        toast('⏱ Trop lent ! Marc A. vient de passer N°2');
        showPunch(Q.punch, 'timeout');
        scheduleNext();
      }

      function showPunch(punch, type) {
        if (!punch || !punch[type]) return;
        const good = (type === 'fast' || type === 'slow');
        const icon = good ? '🎬' : '🍺';
        const box = document.getElementById('qz-punchbox');
        box.innerHTML = '<div class="qz-punch ' + (good ? 'good' : 'bad') + '">' +
          '<span class="qz-punch-icon">' + icon + '</span>' +
          '<span>' + punch[type] + '</span>' +
        '</div>';
      }

      function scheduleNext() {
        document.getElementById('qz-next-btn').style.display = 'inline-flex';
        const fb = document.getElementById('qz-feedback');
        let sec = 3;
        fb.innerHTML = '<span class="qz-fb-main">Feedback</span>Question suivante dans ' + sec + '…';
        advanceInt = setInterval(() => {
          sec--;
          if (sec > 0) fb.innerHTML = '<span class="qz-fb-main">Feedback</span>Question suivante dans ' + sec + '…';
        }, 1000);
        nextTimeout = setTimeout(() => { clearInterval(advanceInt); nextQuestion(); }, 3000);
      }

      function nextQuestion() {
        qIdx++;
        if (qIdx >= QUESTIONS.length) return showFinal();
        loadQuestion();
      }

      function launchCoins(fromEl) {
        const burst = document.getElementById('qz-coin-burst');
        const r = fromEl.getBoundingClientRect();
        const parent = burst.parentElement.getBoundingClientRect();
        burst.style.left = (r.left - parent.left + r.width/2) + 'px';
        burst.style.top = (r.top - parent.top + r.height/2) + 'px';
        burst.innerHTML = '';
        for (let i = 0; i < 6; i++) {
          const c = document.createElement('div');
          c.className = 'qz-coin';
          c.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
          c.style.animationDelay = (i * 80) + 'ms';
          burst.appendChild(c);
        }
        setTimeout(() => { burst.innerHTML = ''; }, 1500);
      }

      function showFinal() {
        clearInterval(lbBotInt); clearInterval(liveInt);
        const score = Math.round(myCoins / 50);
        const scorePct = (score / QUESTIONS.length) * 100;
        let label = '😅 Première soirée ?';
        if (score === 5) label = '👑 Expert ciné absolu !';
        else if (score === 4) label = '🎬 Excellent joueur';
        else if (score === 3) label = '🍺 Pas mal du tout';

        const sorted = [...PLAYERS].sort((a,b)=>b.coins-a.coins);
        const finalRank = sorted.findIndex(p=>p.me) + 1;
        let posMsg = 'Sophie L. vous attend au prochain quiz.';
        if (finalRank === 1) posMsg = 'Vous dominez la soirée.';
        else if (finalRank <= 3) posMsg = 'Podium ! Revenez demain pour la N°1.';

        const podium = sorted.slice(0, 3).map((p, i) =>
          '<div class="qz-podium-item' + (i === 0 ? ' p1' : '') + '">' +
            '<div class="qz-podium-rank">N°' + (i+1) + '</div>' +
            '<div class="qz-podium-av" style="background:' + p.color + '">' + p.initials + '</div>' +
            '<div class="qz-podium-name">' + p.name + '</div>' +
          '</div>').join('');

        const main = document.querySelector('.qz-main');
        const circ = 2 * Math.PI * 54;
        main.innerHTML = '<div class="qz-final">' +
          '<div class="qz-ring-wrap">' +
            '<svg width="140" height="140" viewBox="0 0 140 140">' +
              '<defs><linearGradient id="qz-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9902A"/><stop offset="1" stop-color="#E9C16B"/></linearGradient></defs>' +
              '<circle cx="70" cy="70" r="54" fill="none" stroke="rgba(233,193,107,0.12)" stroke-width="8"/>' +
              '<circle cx="70" cy="70" r="54" fill="none" stroke="url(#qz-grad)" stroke-width="8" stroke-linecap="round" transform="rotate(-90 70 70)" style="stroke-dasharray:' + circ + ';stroke-dashoffset:' + circ + ';transition:stroke-dashoffset 1.2s ease-out" id="qz-score-ring"/>' +
            '</svg>' +
            '<div class="qz-ring-score"><div class="big">' + score + '/5</div><div class="lbl">Score final</div></div>' +
          '</div>' +
          '<div class="qz-final-label">' + label + '</div>' +
          '<div class="qz-final-pos">N°' + finalRank + ' · ' + posMsg + '</div>' +
          '<div class="qz-podium">' + podium + '</div>' +
          '<div class="qz-cta-card">' +
            '<h4>Vos clients adorent jouer.</h4>' +
            '<p>Ce quiz tourne chaque soir dans votre bar. Classement en temps réel. BarCoins misables. Ils reviennent pour défendre leur rang.</p>' +
            '<div class="qz-cta-btns"><a href="https://tally.so/r/WOeA1J" target="_blank" rel="noopener" class="qz-btn-primary">Rejoindre la beta →</a><a href="#" class="qz-btn-ghost">Voir la démo →</a></div>' +
          '</div>' +
          '<div class="qz-badge-slots">{'// 2 PLACES RESTANTES · PERPIGNAN · JUILLET 2026'}</div>' +
          '<button class="qz-replay" id="qz-replay">Rejouer</button>' +
          '</div>';

        setTimeout(() => {
          document.getElementById('qz-score-ring').style.strokeDashoffset = circ * (1 - scorePct / 100);
        }, 100);
        document.getElementById('qz-replay').addEventListener('click', () => location.reload());
      }

      document.getElementById('qz-next-btn').addEventListener('click', () => {
        clearTimeout(nextTimeout); clearInterval(advanceInt); nextQuestion();
      });

      renderLB();
      startLive();

      // Lazy start when scrolled into view
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          io.disconnect();
          toast('🎮 La soirée commence — 47 joueurs connectés');
          startLBBot();
          loadQuestion();
        }
      }, { threshold: 0.3 });
      io.observe(root);
    })();
  

    (function() {
      const PLANS = {
        starter: { cost: 89, maxJoueurs: 50, engagementRate: 0.20, sites: 1, label: 'Starter', barClass: 's', explain: 'Plan Starter — <strong>50 joueurs max</strong>, taux d\\'engagement <strong>20%</strong>. Sans push ni CRM, l\\'activation repose sur la présence physique et le QR code. Idéal pour tester BarCoins ou pour un petit bar avec clientèle fidèle restreinte.' },
        standard: { cost: 149, maxJoueurs: 150, engagementRate: 0.30, sites: 1, label: 'Standard', barClass: 'std', explain: 'Plan Standard — <strong>150 joueurs max</strong>, taux d\\'engagement <strong>30%</strong>. Les push notifications (taux d\\'ouverture ~50%) + CRM complet + mode TV leaderboard activent 50% de joueurs supplémentaires vs Starter. Le plan optimal pour la majorité des bars.' },
        premium: { cost: 249, maxJoueurs: 9999, engagementRate: 0.38, sites: 3, label: 'Premium', barClass: 'p', explain: 'Plan Premium — <strong>joueurs illimités + 3 sites</strong>, taux d\\'engagement <strong>38%</strong>. Le blind test PvP misable crée une rétention compétitive documentée. Multi-sites = émulation inter-établissements. Rentable dès 150+ joueurs actifs réguliers.' }
      };
      let currentPlan = 'starter';

      function updSlider(sl) {
        const pct = ((sl.value - sl.min) / (sl.max - sl.min)) * 100;
        sl.style.setProperty('--pct', pct + '%');
      }

      function calc(k, soirees, clients) {
        const p = PLANS[k];
        const joueursCouverts = Math.min(clients, p.maxJoueurs);
        const joueursActifs = Math.round(joueursCouverts * p.engagementRate);
        const sitesBonus = k === 'premium' ? Math.min(p.sites, 1 + Math.floor(clients / 120)) : 1;
        const caAdd = Math.round(joueursActifs * 6 * soirees * sitesBonus);
        const coutSoir = Math.round((p.cost / soirees) * 100) / 100;
        const recompenses = Math.round(caAdd * 0.08);
        const marge = Math.round(caAdd * 0.70 - p.cost - recompenses);
        const roi = p.cost > 0 ? Math.round((marge / p.cost) * 100) : 0;
        const nonCouverts = Math.max(0, clients - p.maxJoueurs);
        return { caAdd, coutSoir, marge, roi, joueursActifs, nonCouverts, sitesBonus };
      }

      function render() {
        const sS = document.getElementById('rs-sl-soirees');
        const sC = document.getElementById('rs-sl-clients');
        const soirees = parseInt(sS.value);
        const clients = parseInt(sC.value);
        updSlider(sS); updSlider(sC);
        document.getElementById('rs-v-soirees').innerHTML = soirees + ' <span>soirées</span>';
        document.getElementById('rs-v-clients').innerHTML = clients + ' <span>clients</span>';

        const res = calc(currentPlan, soirees, clients);
        const p = PLANS[currentPlan];
        document.getElementById('rs-r-ca').textContent = '+' + res.caAdd.toLocaleString('fr-FR') + '€';
        document.getElementById('rs-r-cout').textContent = res.coutSoir.toFixed(2).replace('.', ',') + '€';
        const mEl = document.getElementById('rs-r-marge');
        mEl.textContent = (res.marge >= 0 ? '+' : '') + res.marge.toLocaleString('fr-FR') + '€';
        mEl.style.color = res.marge >= 0 ? '#22C55E' : '#f87171';

        let sub = res.joueursActifs + ' joueurs actifs / soirée';
        if (res.nonCouverts > 0) {
          const nextPlan = currentPlan === 'starter' ? 'Standard' : 'Premium';
          sub += ' <span style="color:var(--gold-400);font-size:10px;display:block;margin-top:4px">→ Passez au ' + nextPlan + ' pour couvrir tous vos clients</span>';
        }
        if (res.sitesBonus > 1) sub += ' <span style="color:#22C55E;font-size:10px">× ' + res.sitesBonus + ' sites</span>';
        document.getElementById('rs-r-ca-sub').innerHTML = sub;
        document.getElementById('rs-plan-explain').innerHTML = p.explain;

        const allRes = {};
        let maxMarge = 1, bestPlan = 'starter';
        ['starter','standard','premium'].forEach(k => {
          allRes[k] = calc(k, soirees, clients);
          if (allRes[k].marge > maxMarge) { maxMarge = allRes[k].marge; bestPlan = k; }
        });

        document.getElementById('rs-plans-compare').innerHTML = ['starter','standard','premium'].map(k => {
          const r = allRes[k];
          const pct = Math.max(3, Math.round((Math.max(0, r.marge) / maxMarge) * 100));
          const isActive = k === currentPlan;
          const isBest = k === bestPlan;
          const mC = r.marge >= 0 ? (isBest ? '#22C55E' : 'var(--gold-400)') : '#f87171';
          const lbl = PLANS[k].label + (isBest ? '<span class="badge-best">Optimal</span>' : '');
          const bTxt = r.marge > 300 ? (r.marge >= 0 ? '+' : '') + r.marge.toLocaleString('fr-FR') + '€' : '';
          return '<div class="pc-row"><div class="pc-label ' + (isActive ? 'active-plan' : '') + '">' + lbl + '</div><div class="pc-bar-track"><div class="pc-bar ' + PLANS[k].barClass + '" style="width:' + pct + '%">' + bTxt + '</div></div><div class="pc-marge" style="color:' + mC + '">' + (r.marge >= 0 ? '+' : '') + r.marge.toLocaleString('fr-FR') + '€</div></div>';
        }).join('');

        const soirsR = Math.max(1, Math.ceil(p.cost / Math.max(1, res.caAdd / soirees * 0.62)));
        document.getElementById('rs-be-soir').textContent = soirsR <= 1 ? '1ère' : soirsR + 'ème';
        const cMin = Math.ceil(p.cost / Math.max(1, soirees * 6 * p.engagementRate * 0.62));
        document.getElementById('rs-be-clients').textContent = cMin + ' clients';
        const roiDisplay = Math.max(0, res.roi);
        const pctEl = document.getElementById('rs-be-pct');
        const sufEl = document.getElementById('rs-be-suffix');
        if (roiDisplay > 500) { pctEl.textContent = '+500'; sufEl.textContent = '%+ ROI'; }
        else { pctEl.textContent = '+' + roiDisplay; sufEl.textContent = '% ROI'; }
        document.getElementById('rs-be-val').style.color = res.roi > 0 ? '#22C55E' : '#f87171';
      }

      document.querySelectorAll('.roi-sim-plan-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          currentPlan = this.getAttribute('data-plan');
          document.querySelectorAll('.roi-sim-plan-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          render();
        });
      });
      document.getElementById('rs-sl-soirees').addEventListener('input', render);
      document.getElementById('rs-sl-clients').addEventListener('input', render);
      render();
    })();
  

  // Nav burger / drawer
  (function(){
    const burger = document.getElementById('nav-burger');
    const drawer = document.getElementById('nav-drawer');
    const scrim  = document.getElementById('nav-scrim');
    if (!burger || !drawer || !scrim) return;
    function close() {
      burger.classList.remove('open'); drawer.classList.remove('open'); scrim.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-locked');
    }
    function open() {
      burger.classList.add('open'); drawer.classList.add('open'); scrim.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-locked');
    }
    burger.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
    scrim.addEventListener('click', close);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 960) close(); });
  })();

  // Journey cards — reveal on scroll
  (function(){
    const cards = document.querySelectorAll('.journey-card');
    if (!cards.length) return;
    if (!('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' });
    cards.forEach(c => io.observe(c));
  })();
