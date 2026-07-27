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
  const [pirateMethod, setPirateMethod] = useState("");
  const [pirateRolls, setPirateRolls] = useState<number[]>([]);
  const [bridgeRolls, setBridgeRolls] = useState<number[]>([]);
  const [parrotAnswer, setParrotAnswer] = useState("");
  const [pirateMessage, setPirateMessage] = useState("");
  const [pirateBonusChoice, setPirateBonusChoice] = useState("");
  const [pirateBonusRoll, setPirateBonusRoll] = useState<number | null>(null);
  const [hunterStyleGigi, setHunterStyleGigi] = useState("");
  const [hunterStyleLucas, setHunterStyleLucas] = useState("");
  const [reflexRolls, setReflexRolls] = useState<number[]>([]);
  const [trustComplete, setTrustComplete] = useState(false);
  const [oniRolls, setOniRolls] = useState<number[]>([]);
  const [hunterMessage, setHunterMessage] = useState("");
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

  function rollPirateDie(target: "chest" | "bridge") {
    const result = 1 + Math.floor(Math.random() * 6);
    chime(result >= 5 ? 700 : result >= 3 ? 480 : 180, .3);
    if (target === "chest") setPirateRolls(prev => [...prev.slice(-1), result]);
    else setBridgeRolls(prev => [...prev.slice(-1), result]);
  }

  function finishPirates() {
    const chestFailed = pirateRolls.length > 0 && pirateRolls[pirateRolls.length - 1] <= 2;
    if (!pirateMethod || pirateRolls.length < 1 || (chestFailed && pirateBonusRoll === null) || bridgeRolls.length < 2 || !parrotAnswer) {
      setPirateMessage("Concluam todas as escolhas e rolagens da ilha antes de abrir o tesouro.");
      chime(160, .3);
      return;
    }
    chime(820, .5);
    setPirateMessage("Tesouro da ilha encontrado! A Chave Dourada, a Moeda Pirata e o Fragmento do Mapa foram conquistados.");
    setState(prev => {
      const first = !prev.completed.includes(3);
      const xp = prev.xp + (first ? 85 : 0);
      const rewards = ["Chave Dourada", "Moeda Pirata", "Fragmento do Mapa"];
      return {
        ...prev,
        xp,
        level: 1 + Math.floor(xp / 100),
        coins: prev.coins + (first ? 20 : 0),
        unlocked: Math.max(prev.unlocked, 4),
        completed: first ? [...prev.completed, 3] : prev.completed,
        inventory: [...prev.inventory, ...rewards.filter(item => !prev.inventory.includes(item))]
      };
    });
  }

  function rollHunterDie(target: "reflex" | "oni") {
    const result = 1 + Math.floor(Math.random() * 6);
    chime(result >= 5 ? 720 : result >= 3 ? 500 : 180, .3);
    if (target === "reflex") setReflexRolls(prev => [...prev, result].slice(-2));
    else setOniRolls(prev => [...prev, result].slice(-2));
  }

  function finishHunters() {
    if (!hunterStyleGigi || !hunterStyleLucas || reflexRolls.length < 2 || !trustComplete || oniRolls.length < 2) {
      setHunterMessage("Concluam os estilos, os testes e a batalha contra o Oni antes de seguir.");
      chime(160, .3);
      return;
    }
    const total = oniRolls[0] + oniRolls[1];
    chime(total >= 9 ? 860 : 620, .5);
    setHunterMessage(total >= 9 ? "Golpe perfeito! O Oni foi derrotado e a Máscara do Oni foi conquistada." : "Vocês derrotaram o Oni trabalhando juntos. A Máscara do Oni foi conquistada.");
    setState(prev => {
      const first = !prev.completed.includes(4);
      const xp = prev.xp + (first ? 95 : 0);
      return {
        ...prev,
        xp,
        level: 1 + Math.floor(xp / 100),
        coins: prev.coins + (first ? 25 : 0),
        unlocked: Math.max(prev.unlocked, 5),
        completed: first ? [...prev.completed, 4] : prev.completed,
        inventory: prev.inventory.includes("Máscara do Oni") ? prev.inventory : [...prev.inventory, "Máscara do Oni"]
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
              </div>
              <div className="elder-hint"><div className="elder">🧙‍♂️</div><div><b>Dica do Ancião da Vila</b><p>“As memórias deste acontecimento estão escondidas em um vídeo caótico...”</p><small>Um grupo de homens fazendo algo tão perigoso quanto engraçado.</small></div></div>
              <div className="question"><h3>Qual foi o primeiro comentário de Giselle que chamou a atenção de Lucas?</h3>
                {["Pesou, pesou o clima.", "Tinha que ser homis kskks", "Por isso, nós mulheres pretas somos as mais mais."].map((answer, i) => <button key={answer} onClick={() => chooseAnswer(i)}><span>{String.fromCharCode(65+i)}</span>{answer}</button>)}
              </div>
              {message && <motion.div className={message.startsWith("Memória") ? "result success" : "result fail"} initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <span>{message}</span>
                {message.startsWith("Memória") && <div className="memory-reveal">
                  <p>Depois daquele comentário que chamou a atenção de Lucas, as mensagens deixaram de ser apenas comentários perdidos em um vídeo. Vocês começaram a conversar, descobriram afinidades e, pouco a pouco, a curiosidade virou vontade de se conhecer.</p>
                  <p className="date">✦ 03/08/2025 ✦<small>O dia em que vocês se encontraram pessoalmente pela primeira vez.</small></p>
                  <p>Naquele primeiro encontro, a impressão foi quase a mesma vista por ângulos opostos: Giselle achou Lucas muito alto, enquanto Lucas achou Giselle baixinha. E foi assim, entre surpresa, risadas e curiosidade, que a aventura realmente começou.</p>
                  <button className="continue-button" onClick={continueJourney}>Continuar jornada →</button>
                </div>}
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

              <div className="chapter-transition">
                <span>✦</span>
                <p>Com as armas escolhidas, vocês deixam o acampamento para trás. A trilha se estreita entre raízes antigas e folhas gigantes. O ar fica mais frio, os pássaros se calam e marcas recentes surgem na lama. Lucas ergue o escudo, Giselle observa o movimento das árvores e, por alguns segundos, a floresta parece prender a respiração.</p>
                <p>Então, um galho se parte bem perto de vocês.</p>
                <span>✦</span>
              </div>

              <section className="forest-section raptor-section">
                <h3>2. O ataque dos raptores</h3>
                <p>Um galho se quebra. Depois outro. Três raptores surgem entre as árvores e cercam vocês.</p>
                <div className="raptor-roar">GRRRRRRRRRR!</div>
                <div className="combat-actions">
                  <h4>⚔ Ação de combate</h4>
                  <p>Cada herói utiliza a habilidade da arma escolhida:</p>
                  <div><b>Giselle:</b> {gigiWeapon || "escolha uma arma"} → {gigiWeapon.includes("Espada") ? "ATACAR" : gigiWeapon.includes("Arco") ? "MIRAR" : gigiWeapon.includes("Machado") ? "GOLPE DEVASTADOR" : gigiWeapon.includes("Escudo") ? "PROTEGER" : gigiWeapon.includes("Cajado") ? "LANÇAR MAGIA" : "—"}</div>
                  <div><b>Lucas:</b> {lucasWeapon || "escolha uma arma"} → {lucasWeapon.includes("Espada") ? "ATACAR" : lucasWeapon.includes("Arco") ? "MIRAR" : lucasWeapon.includes("Machado") ? "GOLPE DEVASTADOR" : lucasWeapon.includes("Escudo") ? "PROTEGER" : lucasWeapon.includes("Cajado") ? "LANÇAR MAGIA" : "—"}</div>
                </div>
                <h4>3. A força da dupla</h4>
                <ChoiceGroup title="Como vocês enfrentarão a batalha?" value={forestStrategy} setValue={setForestStrategy} options={["⚔️ Ataque duplo", "🛡️ Ataque e defesa", "🌿 Estratégia", "🏃 Fugir"]} />
                {forestStrategy && <div className="strategy-consequence">{forestStrategy.includes("Ataque duplo") ? "Grande dano é causado aos inimigos, mas ambos ficam vulneráveis." : forestStrategy.includes("Ataque e defesa") ? "O dano é menor, porém a dupla avança com maior segurança." : forestStrategy.includes("Estratégia") ? "Enigma da floresta: o que fica mais forte quando é dividido? Resposta: a confiança." : "Vocês sobrevivem, mas perdem uma recompensa desta fase."}</div>}
              </section>

              <div className="chapter-transition">
                <span>✦</span>
                <p>Quando o último rugido desaparece entre as árvores, o silêncio retorna. A batalha deixou marcas no chão, mas também revelou uma passagem escondida atrás de cipós. Seguindo um brilho fraco, vocês encontram uma pequena caverna aquecida por uma luz pulsante.</p>
                <p>No centro dela, alguma coisa começa a se mover.</p>
                <span>✦</span>
              </div>

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

        {selected === 3 && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="parchment pirate-parchment" initial={{ rotateY: 55, scale: .75, opacity: 0 }} animate={{ rotateY: 0, scale: 1, opacity: 1 }} exit={{ scale: .75, opacity: 0 }} transition={{ type: "spring", damping: 18 }}>
              <button className="close" onClick={() => { setSelected(null); setPirateMessage(""); }}>×</button>
              <div className="scroll-title pirate-title"><span>🏴‍☠️</span><div><small>CAPÍTULO III</small><h2>A Ilha dos Piratas</h2><p>Coragem, escolhas e destino</p></div><span>🧭</span></div>
              <div className="story">
                <p>Após atravessarem a Floresta Jurássica, Lucas, Giselle e o pequeno dragão finalmente chegam ao litoral.</p>
                <p>Um enorme navio de velas negras se aproxima da praia. Seu capitão desce do convés, observa as armas conquistadas e entrega a vocês um antigo mapa incompleto.</p>
                <p><em>“Somente aqueles guiados por suas escolhas e pelo destino encontrarão o verdadeiro tesouro.”</em></p>
              </div>

              <div className="chapter-transition pirate-transition"><span>☠</span><p>O capitão aponta para os destroços de embarcações antigas espalhados pela areia. Entre tábuas quebradas, cordas e moedas enferrujadas, um baú permanece intacto. O primeiro fragmento do mapa pode estar lá dentro — mas a ilha não entrega seus segredos sem um teste.</p><span>☠</span></div>

              <section className="forest-section pirate-section">
                <h3>1. Praia dos Naufrágios</h3>
                <ChoiceGroup title="Escolham apenas uma forma de abrir o baú" value={pirateMethod} setValue={setPirateMethod} options={["🪓 Arrombar o baú", "🔐 Decifrar a fechadura", "🔎 Procurar a chave"]} />
                <div className="pirate-dice-row">
                  <button onClick={() => rollPirateDie("chest")}>🎲 Rolar o Dado do Destino</button>
                  <b>{pirateRolls.length ? `Resultado: ${pirateRolls[pirateRolls.length - 1]}` : "Aguardando o destino..."}</b>
                </div>
                {pirateRolls.length > 0 && <div className="outcome-text">{pirateRolls.at(-1)! <= 2 ? <>
                  <b>Falha: piratas inimigos aparecem entre os destroços.</b>
                  <p>O capitão grita para vocês não desistirem. Uma trilha secreta se abre entre as pedras: concluam a missão bônus para escapar do ataque e recuperar a pista.</p>
                  <ChoiceGroup title="Missão bônus — como vocês escapam?" value={pirateBonusChoice} setValue={setPirateBonusChoice} options={["Investigar as margens", "Pedir ajuda ao dragão", "Atravessar pelas pedras"]} />
                  <div className="pirate-dice-row"><button disabled={!pirateBonusChoice} onClick={() => { const r=1+Math.floor(Math.random()*6); setPirateBonusRoll(r); chime(r>=3?650:220,.3); }}>🎲 Rolar dado bônus</button><b>{pirateBonusRoll === null ? "Aguardando..." : `Resultado: ${pirateBonusRoll}`}</b></div>
                  {pirateBonusRoll !== null && <p>{pirateBonusRoll <= 2 ? "Vocês se molham e se perdem por alguns minutos, mas encontram pegadas misteriosas e conseguem continuar." : pirateBonusRoll <= 4 ? "Vocês encontram uma pista verdadeira do fragmento e escapam dos piratas." : "Vocês encontram a pista, uma Moeda Pirata extra e o dragão comemora a vitória!"}</p>}
                </> : pirateRolls.at(-1)! <= 4 ? "Sucesso parcial: vocês abrem o baú, mas parte do conteúdo foi danificada." : "Sucesso total: o primeiro fragmento do mapa e uma Moeda Pirata foram encontrados."}</div>}
              </section>

              <div className="chapter-transition pirate-transition"><span>✦</span><p>Com a primeira pista em mãos, vocês avançam para o interior da ilha. O caminho termina diante de uma ponte antiga suspensa sobre um vale profundo. As tábuas rangem, a corda está desgastada e o pequeno dragão voa de um lado para o outro, claramente desconfiado.</p><span>✦</span></div>

              <section className="forest-section pirate-section">
                <h3>2. A Ponte da Selva Perdida</h3>
                <p>Cada aventureiro deverá rolar o dado uma vez.</p>
                <div className="pirate-dice-row">
                  <button onClick={() => rollPirateDie("bridge")} disabled={bridgeRolls.length >= 2}>🎲 {bridgeRolls.length === 0 ? "Rolagem de Giselle" : bridgeRolls.length === 1 ? "Rolagem de Lucas" : "Rolagens concluídas"}</button>
                  <b>{bridgeRolls.length ? bridgeRolls.join(" + ") : "—"}</b>
                </div>
                {bridgeRolls.length === 2 && <div className="outcome-text">
                  <b>Giselle tirou {bridgeRolls[0]} e Lucas tirou {bridgeRolls[1]}. Soma total: {bridgeRolls[0] + bridgeRolls[1]}.</b>
                  <p>{bridgeRolls[0] >= 3 && bridgeRolls[1] >= 3 ? "Os dois obtiveram 3 ou mais, então atravessam a ponte em segurança." : bridgeRolls[0] < 3 && bridgeRolls[1] < 3 ? "Os dois tiraram menos de 3. Por isso a dupla falhou: a ponte desmorona e o caminho alternativo é desbloqueado." : "Um dos jogadores tirou menos de 3, mas o outro conseguiu 3 ou mais e pode salvá-lo."}</p>
                </div>}
              </section>

              <div className="chapter-transition pirate-transition"><span>🦜</span><p>Do outro lado da mata, um papagaio de chapéu pirata pousa sobre uma placa torta. Ele inclina a cabeça, bate as asas e avisa que a sabedoria abre caminhos. Para revelar a pista final, exige uma resposta que represente tudo o que vocês viveram até aqui.</p><span>🦜</span></div>

              <section className="forest-section pirate-section">
                <h3>3. O Papagaio Pirata</h3>
                <ChoiceGroup title="O que é mais importante para encontrar um tesouro?" value={parrotAnswer} setValue={setParrotAnswer} options={["Força", "Sorte", "Trabalho em equipe"]} />
                {parrotAnswer && <p className="outcome-text">{parrotAnswer === "Trabalho em equipe" ? "O papagaio abre as asas e revela a pista verdadeira: nenhum tesouro é encontrado sozinho." : "O papagaio ri e lembra que a melhor resposta é a que mais combina com a jornada de vocês."}</p>}
              </section>

              <div className="chapter-transition pirate-transition"><span>🗝️</span><p>As pistas se unem e formam um caminho até uma caverna escondida. No interior, a luz dourada de um enorme baú reflete nas paredes. Ao abri-lo, vocês percebem que cada escolha feita na ilha os trouxe exatamente até ali.</p><span>🗝️</span></div>

              <section className="forest-section pirate-section treasure-section">
                <h3>4. O Tesouro da Ilha</h3>
                <p>Dentro do baú estão a Chave Dourada, uma Moeda Pirata e o Fragmento Final do Mapa.</p>
                <div className="treasure-icons"><span>🗝️</span><span>🪙</span><span>🗺️</span></div>
                <p><em>“O verdadeiro tesouro não está nesta ilha...”</em></p>
                <button className="forest-finish" onClick={finishPirates}>Abrir o tesouro da ilha</button>
              </section>

              {pirateMessage && <motion.div className={pirateMessage.startsWith("Tesouro") ? "result success" : "result fail"} initial={{ scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <span>{pirateMessage}</span>
                {pirateMessage.startsWith("Tesouro") && <button className="continue-button" onClick={() => { setSelected(null); setPirateMessage(""); }}>Seguir para o mapa →</button>}
              </motion.div>}
            </motion.article>
          </motion.div>
        )}

        {selected === 4 && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="parchment hunter-parchment" initial={{ scale: .72, opacity: 0, rotateX: -25 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} exit={{ scale: .72, opacity: 0 }} transition={{ type: "spring", damping: 18 }}>
              <button className="close" onClick={() => { setSelected(null); setHunterMessage(""); }}>×</button>
              <div className="scroll-title hunter-title"><span>⚔️</span><div><small>CAPÍTULO IV</small><h2>Treinamento dos Caçadores</h2><p>O despertar das habilidades</p></div><span>👹</span></div>
              <div className="story">
                <p>Depois de deixarem a Ilha dos Piratas, Lucas, Giselle e o pequeno dragão seguem o caminho revelado pela Chave Dourada.</p>
                <p>No alto de uma montanha, encontram um antigo campo de treinamento. Um caçador mascarado observa os aventureiros e declara:</p>
                <p><em>“Sobreviver aos perigos foi apenas o começo. Agora vocês precisam aprender a lutar como uma verdadeira dupla.”</em></p>
              </div>

              <section className="forest-section hunter-section">
                <h3>Escolham seu estilo</h3>
                <div className="weapon-columns">
                  <ChoiceGroup title="Giselle" value={hunterStyleGigi} setValue={setHunterStyleGigi} options={["🔥 Chama", "💧 Água", "⚡ Raio", "🌪️ Vento", "💗 Coração"]} />
                  <ChoiceGroup title="Lucas" value={hunterStyleLucas} setValue={setHunterStyleLucas} options={["🔥 Chama", "💧 Água", "⚡ Raio", "🌪️ Vento", "💗 Coração"]} />
                </div>
              </section>

              <div className="chapter-transition hunter-transition"><span>🎯</span><p>O mestre conduz vocês até um corredor de alvos de madeira. Flechas surgem de pontos escondidos e cada aventureiro precisa confiar nos próprios reflexos.</p><span>🎯</span></div>

              <section className="forest-section hunter-section">
                <h3>1. Teste de Reflexos</h3>
                <p>Cada jogador deverá rolar o Dado do Destino uma vez.</p>
                <div className="pirate-dice-row"><button disabled={reflexRolls.length >= 2} onClick={() => rollHunterDie("reflex")}>🎲 {reflexRolls.length === 0 ? "Rolagem de Giselle" : reflexRolls.length === 1 ? "Rolagem de Lucas" : "Teste concluído"}</button><b>{reflexRolls.length ? reflexRolls.join(" + ") : "—"}</b></div>
                {reflexRolls.length === 2 && <div className="outcome-text"><p>1 ou 2: o alvo acerta o jogador e ele cumpre uma prenda.</p><p>3 ou 4: consegue desviar.</p><p>5 ou 6: desvia e destrói o alvo com sua habilidade.</p><b>Resultados: Giselle {reflexRolls[0]} | Lucas {reflexRolls[1]}</b></div>}
              </section>

              <div className="chapter-transition hunter-transition"><span>💞</span><p>Depois dos alvos, o mestre apaga todas as lanternas. Agora não basta enxergar: vocês precisam confiar na voz um do outro.</p><span>💞</span></div>

              <section className="forest-section hunter-section">
                <h3>2. Teste de Confiança</h3>
                <p>Um aventureiro fica vendado enquanto o parceiro o guia apenas pela voz até completar uma tarefa simples. Depois, vocês trocam de posição.</p>
                <button className={trustComplete ? "forest-finish completed-task" : "forest-finish"} onClick={() => { setTrustComplete(true); chime(620,.3); }}>{trustComplete ? "✓ Teste de confiança concluído" : "Concluir o teste de confiança"}</button>
              </section>

              <div className="chapter-transition hunter-transition"><span>👹</span><p>Um rugido interrompe o treinamento. Das árvores surge um Oni enorme. O mestre recua e avisa: desta vez, a vitória depende da soma das forças da dupla.</p><span>👹</span></div>

              <section className="forest-section hunter-section oni-section">
                <h3>3. O Ataque do Oni</h3>
                <p>Cada jogador rola o dado uma vez. Depois, os resultados são somados.</p>
                <div className="pirate-dice-row"><button disabled={oniRolls.length >= 2} onClick={() => rollHunterDie("oni")}>🎲 {oniRolls.length === 0 ? "Rolagem de Giselle" : oniRolls.length === 1 ? "Rolagem de Lucas" : "Batalha concluída"}</button><b>{oniRolls.length ? oniRolls.join(" + ") : "—"}</b></div>
                {oniRolls.length === 2 && <div className="outcome-text"><b>Soma: {oniRolls[0] + oniRolls[1]}</b><p>{oniRolls[0] + oniRolls[1] <= 5 ? "O Oni resiste. Cumpram uma prenda e tentem novamente." : oniRolls[0] + oniRolls[1] <= 8 ? "Vocês derrotam o Oni trabalhando juntos." : "Golpe perfeito! O Oni é derrotado e uma recompensa especial é encontrada."}</p></div>}
                <button className="forest-finish" onClick={finishHunters}>Finalizar o treinamento</button>
              </section>

              {hunterMessage && <motion.div className={hunterMessage.includes("Máscara") ? "result success" : "result fail"} initial={{ scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><span>{hunterMessage}</span>{hunterMessage.includes("Máscara") && <div className="memory-reveal"><p><b>Recompensa desbloqueada: Máscara do Oni.</b> Pode ser usada uma vez durante a aventura para transformar uma falha em sucesso parcial.</p><p><em>“Vocês chegaram aqui como aventureiros. Agora partem como caçadores.”</em></p><button className="continue-button" onClick={() => { setSelected(null); setHunterMessage(""); }}>Seguir para o Lago das Memórias →</button></div>}</motion.div>}
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
