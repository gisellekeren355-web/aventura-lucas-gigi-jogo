"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type GameState = {
  xp: number;
  level: number;
  coins: number;
  unlocked: number;
  completed: number[];
  inventory: string[];
};

const initialState: GameState = {
  xp: 0,
  level: 1,
  coins: 0,
  unlocked: 1,
  completed: [],
  inventory: ["Mapa do Tesouro"]
};

const regions = [
  { id: 1, name: "Vila Inicial", icon: "🏡", x: 17, y: 39 },
  { id: 2, name: "Floresta Jurássica", icon: "🌲", x: 38, y: 27 },
  { id: 3, name: "Ilha dos Piratas", icon: "🏴", x: 67, y: 28 },
  { id: 4, name: "Treinamento dos Caçadores", icon: "⚔️", x: 86, y: 31 },
  { id: 5, name: "Lago das Memórias", icon: "💙", x: 76, y: 55 },
  { id: 6, name: "Estrada das Conquistas", icon: "🏍️", x: 57, y: 66 },
  { id: 7, name: "Arena do Futebol", icon: "⚽", x: 37, y: 78 },
  { id: 8, name: "Castelo do Destino", icon: "🏰", x: 17, y: 77 },
  { id: 9, name: "Tesouro Final", icon: "💎", x: 8, y: 59 }
];

function useGameState() {
  const [state, setState] = useState<GameState>(initialState);
  useEffect(() => {
    const saved = localStorage.getItem("lucas-gigi-rpg");
    if (saved) setState(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("lucas-gigi-rpg", JSON.stringify(state));
  }, [state]);
  return [state, setState] as const;
}


function ChoiceGroup({ title, value, setValue, options }: { title: string; value: string; setValue: (value: string) => void; options: string[] }) {
  return <div className="choice-group"><b>{title}</b><div>{options.map(option => <button key={option} className={value === option ? "selected-choice" : ""} onClick={() => setValue(option)}>{option}</button>)}</div></div>;
}

export default function Game() {
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [showDice, setShowDice] = useState(false);
  const [dice, setDice] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState("");
  const [muted, setMuted] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [gigiWeapon, setGigiWeapon] = useState("");
  const [lucasWeapon, setLucasWeapon] = useState("");
  const [forestStrategy, setForestStrategy] = useState("");
  const [dragonElement, setDragonElement] = useState("");
  const [dragonLook, setDragonLook] = useState("");
  const [dragonPersonality, setDragonPersonality] = useState("");
  const [dragonName, setDragonName] = useState("");
  const [forestMessage, setForestMessage] = useState("");
  const [state, setState] = useGameState();
  const audioRef = useRef<AudioContext | null>(null);

  const progress = useMemo(() => Math.min(100, (state.xp % 100)), [state.xp]);

  function chime(freq = 440, duration = 0.18) {
    if (muted) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = audioRef.current || new AudioCtx();
    audioRef.current = ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.03);
  }

  function chooseAnswer(index: number) {
    if (index === 1) {
      chime(720, 0.35);
      setMessage("Memória desbloqueada! O primeiro comentário foi encontrado.");
      setState(prev => {
        const xp = prev.xp + 50;
        return {
          ...prev,
          xp,
          level: 1 + Math.floor(xp / 100),
          coins: prev.coins + 10,
          unlocked: Math.max(prev.unlocked, 2),
          completed: prev.completed.includes(1) ? prev.completed : [...prev.completed, 1],
          inventory: prev.inventory.includes("O Primeiro Comentário") ? prev.inventory : [...prev.inventory, "O Primeiro Comentário"]
        };
      });
    } else {
      chime(150, 0.4);
      setMessage("Resposta errada. O Dado do Destino foi despertado...");
      setTimeout(() => setShowDice(true), 700);
    }
  }

  function continueJourney() {
    chime(560, 0.25);
    setSelected(null);
    setMessage("");
  }

  function finishForest() {
    if (!gigiWeapon || !lucasWeapon || !forestStrategy || !dragonElement || !dragonLook || !dragonPersonality || !dragonName.trim()) {
      setForestMessage("Preencham todas as escolhas antes de seguir.");
      chime(160, .3);
      return;
    }
    chime(760, .45);
    setForestMessage("O Guardião da Floresta foi despertado! A Ilha dos Piratas está desbloqueada.");
    setState(prev => {
      const xp = prev.xp + (prev.completed.includes(2) ? 0 : 70);
      const dragonItem = `Dragão: ${dragonName.trim()}`;
      return {
        ...prev,
        xp,
        level: 1 + Math.floor(xp / 100),
        coins: prev.coins + (prev.completed.includes(2) ? 0 : 15),
        unlocked: Math.max(prev.unlocked, 3),
        completed: prev.completed.includes(2) ? prev.completed : [...prev.completed, 2],
        inventory: prev.inventory.includes(dragonItem) ? prev.inventory : [...prev.inventory, dragonItem, "Guardião da Floresta"]
      };
    });
  }

  function rollDice() {
    setRolling(true);
    chime(220, 0.6);
    let ticks = 0;
    const timer = setInterval(() => {
      setDice(1 + Math.floor(Math.random() * 6));
      ticks += 1;
      if (ticks > 12) {
        clearInterval(timer);
        const result = 1 + Math.floor(Math.random() * 6);
        setDice(result);
        setRolling(false);
      }
    }, 80);
  }

  return (
    <main className="game-shell">
      <div className="grain" />
      <div className="embers">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.section key="intro" className="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.15 }} transition={{ duration: 1.2 }}>
            <div className="moon" />
            <div className="mountains mountain-a" />
            <div className="mountains mountain-b" />
            <motion.div className="hero-emblem" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .5, duration: 1.2 }}>
              <span className="kicker">UMA JORNADA ESCRITA PELO DESTINO</span>
              <h1>A Aventura de<br /><strong>Lucas & Gigi</strong></h1>
              <p>Duas almas. Mil histórias. Um destino: nós dois.</p>
              <button onClick={() => { setStarted(true); chime(520, .5); }} className="start-button"><span>✦</span> Iniciar Jornada <span>✦</span></button>
            </motion.div>
            <div className="couple-silhouette"><span>14</span><span>02</span></div>
            <div className="dragon-float">🐉</div>
          </motion.section>
        ) : (
          <motion.section key="world" className="world" initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4 }}>
            <header className="hud">
              <div className="crest">LG</div>
              <div className="level-box"><small>NÍVEL</small><b>{state.level}</b></div>
              <div className="xp-wrap"><div className="xp-label"><span>Experiência</span><span>{state.xp} XP</span></div><div className="xp-track"><motion.div animate={{ width: `${progress}%` }} /></div></div>
              <div className="currency">🪙 {state.coins}</div>
              <button onClick={() => setInventoryOpen(true)}>🎒 Inventário</button>
              <button onClick={() => setMuted(v => !v)}>{muted ? "🔇" : "🎵"}</button>
            </header>

            <div className="map-viewport">
              <div className="map-canvas">
                <img src="/assets/world-map.png" alt="Mapa da aventura" draggable={false} />
                <div className="mist mist-a" /><div className="mist mist-b" />
                <svg className="glow-path" viewBox="0 0 1000 700" preserveAspectRatio="none"><path d="M160,285 C280,170 350,175 420,205 S620,180 700,230 S850,230 875,300 S780,390 720,420 S620,490 570,500 S420,560 350,570 S210,570 150,515 S80,450 100,390" /></svg>
                {regions.map(region => {
                  const locked = region.id > state.unlocked;
                  const done = state.completed.includes(region.id);
                  return <button key={region.id} className={`map-node ${locked ? "locked" : ""} ${done ? "done" : ""}`} style={{ left: `${region.x}%`, top: `${region.y}%` }} onClick={() => !locked && setSelected(region.id)}>
                    <span className="node-ring"><b>{locked ? "🔒" : region.icon}</b></span>
                    <em>{region.id}. {region.name}</em>
                  </button>;
                })}
                <div className="map-dragon">🐉</div>
              </div>
            </div>

            <footer className="world-footer"><span>Arraste mentalmente pelo mapa e escolha o próximo destino</span><span>Progresso: {state.completed.length}/9</span></footer>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected === 1 && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="parchment" initial={{ rotateX: -70, scale: .7, opacity: 0 }} animate={{ rotateX: 0, scale: 1, opacity: 1 }} exit={{ scale: .7, opacity: 0 }} transition={{ type: "spring", damping: 18 }}>
              <button className="close" onClick={() => { setSelected(null); setMessage(""); }}>×</button>
              <div className="scroll-title"><span>🏡</span><div><small>CAPÍTULO I</small><h2>Vila Inicial</h2><p>O começo de tudo</p></div><span>🌳</span></div>
              <div className="story">
                <p>Duas pessoas. Duas histórias.<br />Dois caminhos que, até então, seguiam separados.</p>
                <p>Lucas tinha acabado de sair de um romance complexo e estava desacreditado no amor. Giselle, por outro lado, estava apenas vivendo mais um dia comum, assistindo vídeos e comentando no Instagram.</p>
                <p>Até que um comentário completamente aleatório chamou sua atenção. A cada comentário, uma nova pergunta surgia: <em>“Quem é essa garota?”</em></p>
                <p className="date">✦ 03/08/2025 ✦<small>O dia em que nos encontramos pessoalmente pela primeira vez.</small></p>
              </div>
              <div className="elder-hint"><div className="elder">🧙‍♂️</div><div><b>Dica do Ancião da Vila</b><p>“As memórias deste acontecimento estão escondidas em um vídeo caótico...”</p><small>Um grupo de homens fazendo algo tão perigoso quanto engraçado.</small></div></div>
              <div className="question"><h3>Qual foi o primeiro comentário de Giselle que chamou a atenção de Lucas?</h3>
                {["Pesou, pesou o clima.", "Tinha que ser homis kskks", "Por isso, nós mulheres pretas somos as mais mais."].map((answer, i) => <button key={answer} onClick={() => chooseAnswer(i)}><span>{String.fromCharCode(65+i)}</span>{answer}</button>)}
              </div>
              {message && <motion.div className={message.startsWith("Memória") ? "result success" : "result fail"} initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <span>{message}</span>
                {message.startsWith("Memória") && <button className="continue-button" onClick={continueJourney}>Continuar jornada →</button>}
              </motion.div>}
            </motion.article>
          </motion.div>
        )}

        {selected === 2 && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="parchment forest-parchment" initial={{ rotateY: -55, scale: .75, opacity: 0 }} animate={{ rotateY: 0, scale: 1, opacity: 1 }} exit={{ scale: .75, opacity: 0 }} transition={{ type: "spring", damping: 18 }}>
              <button className="close" onClick={() => { setSelected(null); setForestMessage(""); }}>×</button>
              <div className="scroll-title forest-title"><span>🦖</span><div><small>CAPÍTULO II</small><h2>Floresta Jurássica</h2><p>Os heróis da floresta</p></div><span>🧭</span></div>
              <div className="story">
                <p>Depois de recuperarem a primeira memória de sua aventura, um novo caminho foi revelado.</p>
                <p>As árvores são tão altas que escondem a luz do céu. Sons misteriosos ecoam entre as folhas, enquanto criaturas antigas observam silenciosamente cada passo dado pelos aventureiros.</p>
                <p>Dizem que esta floresta guarda um grande tesouro. Mas apenas aqueles que lutam juntos serão capazes de encontrá-lo.</p>
              </div>

              <section className="forest-section">
                <h3>1. Escolha das armas</h3>
                <p>Em um antigo acampamento abandonado, cinco armas lendárias se revelam diante dos heróis.</p>
                <div className="weapon-columns">
                  <ChoiceGroup title="Giselle" value={gigiWeapon} setValue={setGigiWeapon} options={["⚔️ Espada", "🏹 Arco", "🪓 Machado", "🛡️ Escudo", "🪄 Cajado Mágico"]} />
                  <ChoiceGroup title="Lucas" value={lucasWeapon} setValue={setLucasWeapon} options={["⚔️ Espada", "🏹 Arco", "🪓 Machado", "🛡️ Escudo", "🪄 Cajado Mágico"]} />
                </div>
              </section>

              <section className="forest-section raptor-section">
                <h3>2. O ataque dos raptores</h3>
                <p>Um galho se quebra. Depois outro. Três raptores surgem entre as árvores e cercam vocês.</p>
                <div className="raptor-roar">GRRRRRRRRRR!</div>
                <h4>3. A força da dupla</h4>
                <ChoiceGroup title="Como vocês enfrentarão a batalha?" value={forestStrategy} setValue={setForestStrategy} options={["⚔️ Ataque duplo", "🛡️ Ataque e defesa", "🌿 Estratégia", "🏃 Fugir"]} />
              </section>

              <section className="forest-section dragon-section">
                <div className="dragon-birth"><span>🥚</span><span>🐉</span></div>
                <h3>4. A descoberta — Um dragão nasceu!</h3>
                <p>Depois da batalha, vocês encontram um enorme ovo coberto por escamas brilhantes. Uma pequena luz escapa pelas rachaduras e a criatura abre os olhos pela primeira vez.</p>
                <div className="dragon-customizer">
                  <ChoiceGroup title="Elemento" value={dragonElement} setValue={setDragonElement} options={["🔥 Fogo", "❄️ Gelo", "⚡ Raio", "🌑 Sombra", "🌿 Natureza"]} />
                  <ChoiceGroup title="Aparência" value={dragonLook} setValue={setDragonLook} options={["Pequeno e fofo", "Imponente", "Misterioso", "Ameaçador", "Engraçado"]} />
                  <ChoiceGroup title="Personalidade" value={dragonPersonality} setValue={setDragonPersonality} options={["Corajoso", "Inteligente", "Explosivo", "Leal", "Caótico"]} />
                </div>
                <label className="dragon-name">Todo grande dragão precisa de um nome<input value={dragonName} onChange={e => setDragonName(e.target.value)} placeholder="Nome do dragão" maxLength={24} /></label>
                <button className="forest-finish" onClick={finishForest}>Concluir a Floresta Jurássica</button>
              </section>

              {forestMessage && <motion.div className={forestMessage.startsWith("O Guardião") ? "result success" : "result fail"} initial={{ scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <span>{forestMessage}</span>
                {forestMessage.startsWith("O Guardião") && <button className="continue-button" onClick={() => { setSelected(null); setForestMessage(""); }}>Seguir para o mapa →</button>}
              </motion.div>}
            </motion.article>
          </motion.div>
        )}

        {showDice && (
          <motion.div className="modal-backdrop dice-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="dice-panel" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <button className="close" onClick={() => setShowDice(false)}>×</button>
              <small>AS PROVAÇÕES DA AVENTURA</small><h2>Dado do Destino</h2>
              <p>Nem toda batalha se vence com espada. Lance o D6 e aceite o que o destino escolher.</p>
              <div className={`dice3d ${rolling ? "rolling" : ""}`}><div className="dice-face">{dice}</div></div>
              <button className="roll-button" onClick={rollDice} disabled={rolling}>{rolling ? "O destino está girando..." : "Lançar o dado"}</button>
              {!rolling && <div className="penalty"><b>Resultado {dice}</b><span>{[
                "Retire 2 peças de roupa.",
                "Sussurre no ouvido do parceiro 3 coisas que você ama nele(a).",
                "Conte sua primeira impressão após o primeiro date.",
                "Fique algemado(a) e vendado(a) por 5 minutos enquanto recebe um carinho surpresa.",
                "Diga o que acha que te cativou no seu parceiro.",
                "Crítico natural! Você está livre e escolhe uma prenda para o parceiro."
              ][dice - 1]}</span></div>}
            </motion.article>
          </motion.div>
        )}

        {inventoryOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="inventory-panel" initial={{ x: 250 }} animate={{ x: 0 }} exit={{ x: 250 }}>
              <button className="close" onClick={() => setInventoryOpen(false)}>×</button>
              <h2>Inventário da Dupla</h2><p>Relíquias encontradas durante a jornada.</p>
              <div className="inventory-grid">{state.inventory.map((item, i) => <div key={item}><span>{["🗺️","💬","🗝️","💎","🎭","💍"][i % 6]}</span><b>{item}</b><small>Item especial</small></div>)}</div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
