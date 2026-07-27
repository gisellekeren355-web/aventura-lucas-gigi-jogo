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
  rerolls?: number;
  dragonBoosts?: number;
  oniMaskUses?: number;
  heartKeyUses?: number;
};

const initialState: GameState = {
  xp: 0,
  level: 1,
  coins: 0,
  unlocked: 1,
  completed: [],
  inventory: ["Mapa do Tesouro"],
  rerolls: 0,
  dragonBoosts: 0,
  oniMaskUses: 0,
  heartKeyUses: 0
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
  const [trustTimer, setTrustTimer] = useState(60);
  const [trustRunning, setTrustRunning] = useState(false);
  const [dragonBoostUsed, setDragonBoostUsed] = useState(false);
  const [lakeMemoryOne, setLakeMemoryOne] = useState(false);
  const [lakeMemoryTwo, setLakeMemoryTwo] = useState(false);
  const [lakeMemoryThree, setLakeMemoryThree] = useState(false);
  const [lakeMessage, setLakeMessage] = useState("");
  const [roadBikeGigi, setRoadBikeGigi] = useState("");
  const [roadBikeLucas, setRoadBikeLucas] = useState("");
  const [roadRolls, setRoadRolls] = useState<number[]>([]);
  const [roadChoice, setRoadChoice] = useState("");
  const [roadMessage, setRoadMessage] = useState("");
  const [roadDragonBoostUsed, setRoadDragonBoostUsed] = useState(false);
  const [roadRerollUsed, setRoadRerollUsed] = useState(false);
  const [roadMaskUsed, setRoadMaskUsed] = useState(false);
  const [roadDiagnostic, setRoadDiagnostic] = useState("");
  const [roadSearchRolls, setRoadSearchRolls] = useState<number[]>([]);
  const [roadQuizAnswers, setRoadQuizAnswers] = useState<string[]>(["", "", "", ""]);
  const [roadTestRolls, setRoadTestRolls] = useState<number[]>([]);
  const [roadPurchasedBike, setRoadPurchasedBike] = useState("");
  const [arenaTeamName, setArenaTeamName] = useState("");
  const [arenaPasses, setArenaPasses] = useState(0);
  const [arenaGoals, setArenaGoals] = useState<number[]>([]);
  const [arenaPromise, setArenaPromise] = useState(false);
  const [arenaScoreGigi, setArenaScoreGigi] = useState(0);
  const [arenaScoreLucas, setArenaScoreLucas] = useState(0);
  const [arenaAttacker, setArenaAttacker] = useState<"Giselle" | "Lucas" | "">("");
  const [arenaKeeper, setArenaKeeper] = useState<"Giselle" | "Lucas" | "">("");
  const [arenaShooter, setArenaShooter] = useState<"Giselle" | "Lucas">("Giselle");
  const [arenaTransferGigi, setArenaTransferGigi] = useState("");
  const [arenaTransferLucas, setArenaTransferLucas] = useState("");
  const [arenaShotMessage, setArenaShotMessage] = useState("Arraste a bola em direção ao gol.");
  const goalRef = useRef<HTMLDivElement | null>(null);
  const [arenaMessage, setArenaMessage] = useState("");
  const [castleTimer, setCastleTimer] = useState(15);
  const [castleRunning, setCastleRunning] = useState(false);
  const [castleChallengeComplete, setCastleChallengeComplete] = useState(false);
  const [castleGateChoice, setCastleGateChoice] = useState("");
  const [castleRolls, setCastleRolls] = useState<number[]>([]);
  const [castleMessage, setCastleMessage] = useState("");
  const [finalChestOpen, setFinalChestOpen] = useState(false);
  const [finalLetterOpen, setFinalLetterOpen] = useState(false);
  const [reflexPenaltiesPending, setReflexPenaltiesPending] = useState(0);
  const [diceContext, setDiceContext] = useState<"village" | "reflex" | "road" | "arena" | "castle" | null>(null);
  const [state, setState] = useGameState();
  const audioRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<{ctx: AudioContext; nodes: AudioNode[]} | null>(null);

  const progress = useMemo(() => Math.min(100, (state.xp % 100)), [state.xp]);

  useEffect(() => {
    if (!trustRunning || trustTimer <= 0) return;
    const timer = window.setInterval(() => setTrustTimer(value => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [trustRunning, trustTimer]);

  useEffect(() => {
    if (trustTimer === 0 && trustRunning) {
      setTrustRunning(false);
      setTrustComplete(true);
      chime(680, .4);
    }
  }, [trustTimer, trustRunning]);

  useEffect(() => {
    if (!castleRunning || castleTimer <= 0) return;
    const timer = window.setInterval(() => setCastleTimer(value => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [castleRunning, castleTimer]);

  useEffect(() => {
    if (castleTimer === 0 && castleRunning) {
      setCastleRunning(false);
      setCastleChallengeComplete(true);
      chime(780, .4);
    }
  }, [castleTimer, castleRunning]);

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

  function stopAmbient() {
    if (!ambientRef.current) return;
    ambientRef.current.nodes.forEach((node: any) => { try { node.stop?.(); } catch {} try { node.disconnect?.(); } catch {} });
    try { ambientRef.current.ctx.close(); } catch {}
    ambientRef.current = null;
  }

  function startAmbient() {
    stopAmbient();
    if (muted || !started) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.035;
    master.connect(ctx.destination);
    const nodes: AudioNode[] = [master];
    [110, 164.81, 220].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = index === 1 ? "triangle" : "sine";
      osc.frequency.value = freq;
      gain.gain.value = index === 0 ? 0.55 : 0.18;
      osc.connect(gain).connect(master);
      osc.start();
      nodes.push(osc, gain);
    });
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.12;
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(master.gain);
    lfo.start();
    nodes.push(lfo, lfoGain);
    ambientRef.current = {ctx, nodes};
  }

  useEffect(() => {
    if (started && !muted) startAmbient(); else stopAmbient();
    return () => stopAmbient();
  }, [started, muted]);

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
      setTimeout(() => { setDiceContext("village"); setShowDice(true); }, 700);
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
        inventory: prev.inventory.includes(dragonItem) ? prev.inventory : [...prev.inventory, dragonItem, "Guardião da Floresta", "Ajuda do Dragão"],
        dragonBoosts: Math.max(prev.dragonBoosts ?? 0, 1)
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
    if (target === "reflex") {
      setReflexRolls(prev => [...prev, result].slice(-2));
      if (result <= 2) {
        setReflexPenaltiesPending(prev => prev + 1);
        setDiceContext("reflex");
        setTimeout(() => setShowDice(true), 450);
      }
    } else setOniRolls(prev => [...prev, result].slice(-2));
  }

  function finishHunters() {
    if (!hunterStyleGigi || !hunterStyleLucas || reflexRolls.length < 2 || reflexPenaltiesPending > 0 || !trustComplete || oniRolls.length < 2) {
      setHunterMessage(reflexPenaltiesPending > 0 ? "Cumpram e confirmem todas as prendas do Teste de Reflexos antes de seguir." : "Concluam os estilos, os testes e a batalha contra o Oni antes de seguir.");
      chime(160, .3);
      return;
    }
    const total = oniRolls[0] + oniRolls[1] + (dragonBoostUsed ? 1 : 0);
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
        inventory: prev.inventory.includes("Máscara do Oni") ? prev.inventory : [...prev.inventory, "Máscara do Oni"],
        oniMaskUses: Math.max(prev.oniMaskUses ?? 0, 1)
      };
    });
  }

  function useDragonBoost() {
    if ((state.dragonBoosts ?? 0) < 1 || oniRolls.length < 2 || dragonBoostUsed) return;
    setDragonBoostUsed(true);
    setState(prev => ({ ...prev, dragonBoosts: Math.max(0, (prev.dragonBoosts ?? 0) - 1) }));
    chime(760, .35);
  }

  function finishLake() {
    if (!lakeMemoryOne || !lakeMemoryTwo || !lakeMemoryThree) {
      setLakeMessage("Vivam e confirmem as três memórias antes de reunir os cristais.");
      chime(160, .3);
      return;
    }
    chime(880, .55);
    setLakeMessage("Os três Cristais da Memória se unem. A Chave do Coração e um novo poder do dragão foram desbloqueados.");
    setState(prev => {
      const first = !prev.completed.includes(5);
      const xp = prev.xp + (first ? 110 : 0);
      const rewards = ["Cristal do Começo", "Cristal do Carinho", "Cristal do Futuro", "Chave do Coração", "Bônus do Dragão"];
      return {
        ...prev,
        xp,
        level: 1 + Math.floor(xp / 100),
        coins: prev.coins + (first ? 30 : 0),
        unlocked: Math.max(prev.unlocked, 6),
        completed: first ? [...prev.completed, 5] : prev.completed,
        rerolls: (prev.rerolls ?? 0) + (first ? 1 : 0),
        heartKeyUses: (prev.heartKeyUses ?? 0) + (first ? 1 : 0),
        inventory: [...prev.inventory, ...rewards.filter(item => !prev.inventory.includes(item))]
      };
    });
  }

  function rollRoadSearch() {
    const result = 1 + Math.floor(Math.random() * 6);
    setRoadSearchRolls(prev => [...prev, result].slice(-2));
    chime(result >= 5 ? 760 : result >= 3 ? 520 : 180, .3);
  }

  function rollRoadTest() {
    const result = 1 + Math.floor(Math.random() * 6);
    setRoadTestRolls(prev => [...prev, result].slice(-2));
    chime(result >= 5 ? 760 : result >= 3 ? 520 : 180, .3);
  }

  function updateRoadQuiz(index: number, answer: string) {
    setRoadQuizAnswers(prev => prev.map((item, i) => i === index ? answer : item));
  }

  function roadScore() {
    const diagnostic = roadDiagnostic === "🔋 Bateria ou sistema elétrico" ? 20 : roadDiagnostic ? 10 : 0;
    const search = roadSearchRolls.reduce((sum, roll) => sum + (roll >= 5 ? 10 : roll >= 3 ? 5 : 0), 0);
    const correct = ["Kawasaki Ninja H2R", "Sistema antitravamento dos freios", "Transmitir a força do motor para a roda traseira", "MT-07"];
    const quiz = roadQuizAnswers.reduce((sum, answer, i) => sum + (answer === correct[i] ? 5 : 0), 0);
    const total = roadTestRolls.length === 2 ? roadTestRolls[0] + roadTestRolls[1] : 0;
    const test = total >= 10 ? 30 : total >= 7 ? 25 : total >= 4 ? 15 : roadTestRolls.length === 2 ? 10 : 0;
    const partnership = roadDiagnostic && roadSearchRolls.length === 2 && roadQuizAnswers.every(Boolean) && roadTestRolls.length === 2 ? 10 : 0;
    return diagnostic + search + quiz + test + partnership;
  }

  function roadScoreDetails() {
    const diagnostic = roadDiagnostic === "🔋 Bateria ou sistema elétrico" ? 20 : roadDiagnostic ? 10 : 0;
    const search = roadSearchRolls.reduce((sum, roll) => sum + (roll >= 5 ? 10 : roll >= 3 ? 5 : 0), 0);
    const correct = ["Kawasaki Ninja H2R", "Sistema antitravamento dos freios", "Transmitir a força do motor para a roda traseira", "MT-07"];
    const quiz = roadQuizAnswers.reduce((sum, answer, i) => sum + (answer === correct[i] ? 5 : 0), 0);
    const total = roadTestRolls.length === 2 ? roadTestRolls[0] + roadTestRolls[1] : 0;
    const test = total >= 10 ? 30 : total >= 7 ? 25 : total >= 4 ? 15 : roadTestRolls.length === 2 ? 10 : 0;
    const partnership = roadDiagnostic && roadSearchRolls.length === 2 && roadQuizAnswers.every(Boolean) && roadTestRolls.length === 2 ? 10 : 0;
    return { diagnostic, search, quiz, test, partnership, total: diagnostic + search + quiz + test + partnership };
  }

  const bikePrices: Record<string, number> = { "MT-03": 30, "MT-07": 50, "R3": 70, "R1": 100 };

  function finishRoad() {
    const score = roadScore();
    if (!roadDiagnostic || roadSearchRolls.length < 2 || roadQuizAnswers.some(answer => !answer) || roadTestRolls.length < 2) {
      setRoadMessage("Concluam o diagnóstico, a busca pelas peças, o quiz e o teste da estrada.");
      chime(160, .3);
      return;
    }
    if (!roadPurchasedBike) {
      setRoadMessage("Escolham uma moto na Loja das Máquinas Lendárias.");
      chime(160, .3);
      return;
    }
    if ((bikePrices[roadPurchasedBike] ?? 999) > score) {
      setRoadMessage("Vocês ainda não possuem pontos suficientes para essa moto. Escolham outra máquina.");
      chime(160, .3);
      return;
    }
    chime(900, .55);
    setRoadMessage(`A ${roadPurchasedBike} foi conquistada! A dupla cruzou a Estrada das Conquistas e liberou a Arena do Futebol.`);
    setState(prev => {
      const first = !prev.completed.includes(6);
      const xp = prev.xp + (first ? 120 : 0);
      const rewards = ["Emblema da Liberdade", `Moto conquistada: ${roadPurchasedBike}`];
      return {
        ...prev, xp, level: 1 + Math.floor(xp / 100), coins: prev.coins + (first ? 35 : 0),
        unlocked: Math.max(prev.unlocked, 7), completed: first ? [...prev.completed, 6] : prev.completed,
        inventory: [...prev.inventory, ...rewards.filter(item => !prev.inventory.includes(item))]
      };
    });
  }

  function chooseArenaRole(player: "Giselle" | "Lucas", role: "Atacante" | "Goleiro") {
    if (player === "Giselle") {
      if (role === "Atacante") { setArenaAttacker("Giselle"); setArenaKeeper("Lucas"); }
      else { setArenaAttacker("Lucas"); setArenaKeeper("Giselle"); }
    } else {
      if (role === "Atacante") { setArenaAttacker("Lucas"); setArenaKeeper("Giselle"); }
      else { setArenaAttacker("Giselle"); setArenaKeeper("Lucas"); }
    }
    setArenaScoreGigi(0);
    setArenaScoreLucas(0);
    setArenaShotMessage("Posições definidas! Arraste a bola para começar o duelo.");
    chime(620,.25);
  }

  function kickArenaBall() {
    if (!arenaAttacker || !arenaKeeper) {
      setArenaShotMessage("Escolham primeiro quem será atacante e quem será goleiro.");
      chime(150,.2);
      return;
    }
    const scored = Math.random() > 0.46;
    if (scored) {
      if (arenaAttacker === "Giselle") setArenaScoreGigi(v => Math.min(3, v + 1));
      else setArenaScoreLucas(v => Math.min(3, v + 1));
      setArenaShotMessage(`⚽ GOL de ${arenaAttacker}!`);
      chime(820, .3);
    } else {
      if (arenaKeeper === "Giselle") setArenaScoreGigi(v => Math.min(3, v + 1));
      else setArenaScoreLucas(v => Math.min(3, v + 1));
      setArenaShotMessage(`🧤 DEFESA de ${arenaKeeper}!`);
      chime(360, .3);
    }
  }

  function rollArenaGoal() {
    const player = arenaGoals.length === 0 ? "Giselle" : "Lucas";
    const result = 1 + Math.floor(Math.random() * 6);
    setArenaGoals(prev => [...prev, result].slice(-2));
    chime(result >= 5 ? 780 : result >= 3 ? 520 : 180, .3);
    if (result <= 2) {
      setArenaShotMessage(`${player} teve o chute defendido. O Dado da Prenda foi despertado.`);
      setTimeout(() => { setDiceContext("arena"); setShowDice(true); }, 450);
    }
  }

  function finishArena() {
    if (!arenaTeamName.trim() || !arenaAttacker || !arenaKeeper || arenaScoreGigi < 3 || arenaScoreLucas < 3 || arenaGoals.length < 2 || !arenaTransferGigi || !arenaTransferLucas) {
      setArenaMessage("Concluam o nome da equipe, escolham atacante e goleiro, completem 3 gols e 3 defesas, façam as duas cobranças e escolham as transferências.");
      chime(160, .3); return;
    }
    chime(860, .5);
    setArenaMessage(`Vitória da dupla! Giselle foi transferida para ${arenaTransferGigi} e Lucas para ${arenaTransferLucas}. O Troféu da Sintonia foi conquistado.`);
    setState(prev => {
      const first = !prev.completed.includes(7);
      const xp = prev.xp + (first ? 125 : 0);
      const items = ["Troféu da Sintonia", `Clube de Giselle: ${arenaTransferGigi}`, `Clube de Lucas: ${arenaTransferLucas}`];
      return {...prev, xp, level: 1 + Math.floor(xp / 100), coins: prev.coins + (first ? 40 : 0), unlocked: Math.max(prev.unlocked, 8), completed: first ? [...prev.completed, 7] : prev.completed, inventory: [...prev.inventory, ...items.filter(i => !prev.inventory.includes(i))]};
    });
  }

  function rollCastleDie() {
    const result = 1 + Math.floor(Math.random() * 6);
    setCastleRolls(prev => [...prev, result].slice(-2));
    chime(result >= 5 ? 820 : result >= 3 ? 520 : 180, .3);
  }

  function finishCastle() {
    if (!castleChallengeComplete || !castleGateChoice || castleRolls.length < 2) {
      setCastleMessage("Concluam o desafio presencial, escolham a chave do portão e realizem as duas rolagens.");
      chime(160, .3); return;
    }
    const total = castleRolls[0] + castleRolls[1];
    if (total < 6) {
      setCastleMessage("O portão resistiu. Cumpram uma prenda do Dado do Destino e tentem as rolagens novamente.");
      setDiceContext("castle"); setShowDice(true); chime(160,.3); return;
    }
    chime(940,.55);
    setCastleMessage("Os portões se abriram. O Anel da Promessa foi conquistado e o caminho para o Tesouro Final apareceu.");
    setState(prev => {
      const first = !prev.completed.includes(8);
      const xp = prev.xp + (first ? 140 : 0);
      return {...prev, xp, level: 1 + Math.floor(xp / 100), coins: prev.coins + (first ? 50 : 0), unlocked: Math.max(prev.unlocked, 9), completed: first ? [...prev.completed, 8] : prev.completed, inventory: prev.inventory.includes("Anel da Promessa") ? prev.inventory : [...prev.inventory, "Anel da Promessa"]};
    });
  }

  function confirmPenalty() {
    if (diceContext === "reflex") setReflexPenaltiesPending(prev => Math.max(0, prev - 1));
    if (diceContext === "castle") { setCastleRolls([]); setCastleMessage("Prenda cumprida. O portão permite uma nova tentativa."); }
    setShowDice(false);
    setDiceContext(null);
    chime(520, .25);
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
            <motion.div className="anime-couple-frame" initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{delay:1.1,duration:1}}><img src="/assets/couple-1.png" alt="Lucas e Gigi"/><div className="anime-glow"></div></motion.div>
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
              <button title="Música ambiente" onClick={() => setMuted(v => !v)}>{muted ? "🔇" : "🎵"}</button>
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
                <p>Um enorme navio de velas negras se aproxima da praia. Seu capitão desce do convés, observa as armas conquistadas e entrega a vocês um antigo mapa incompleto.</p><p>Quando percebe o pequeno dragão ao lado da dupla, ele ergue uma sobrancelha e solta um sorriso: <em>“Hm… interessante. Vocês sobreviveram à floresta e ainda conquistaram a confiança de um dragão. São mais fortes do que parecem.”</em></p>
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
                <p>Antes de rolar, observem a regra da travessia:</p>
                <div className="bridge-rules">
                  <p>✅ <b>Ambos tiram 3 ou mais:</b> atravessam a ponte em segurança.</p>
                  <p>🤝 <b>Apenas um falha:</b> o outro aventureiro poderá salvá-lo.</p>
                  <p>❌ <b>Ambos falham:</b> a ponte desmorona e uma rota alternativa será aberta.</p>
                </div>
                <p>Agora, cada aventureiro deverá rolar o dado uma vez.</p>
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
                {reflexRolls.length === 2 && <div className="outcome-text"><p>1 ou 2: o alvo acerta o jogador e ele cumpre uma prenda.</p><p>3 ou 4: consegue desviar.</p><p>5 ou 6: desvia e destrói o alvo com sua habilidade.</p><b>Resultados: Giselle {reflexRolls[0]} | Lucas {reflexRolls[1]}</b>{reflexPenaltiesPending > 0 && <p className="pending-warning">Prendas pendentes: {reflexPenaltiesPending}. Cumpram todas antes de continuar.</p>}</div>}
              </section>

              <div className="chapter-transition hunter-transition"><span>💞</span><p>Depois dos alvos, o mestre apaga todas as lanternas. Agora não basta enxergar: vocês precisam confiar na voz um do outro.</p><span>💞</span></div>

              <section className="forest-section hunter-section">
                <h3>2. Teste de Confiança</h3>
                <p><b>Desafio presencial obrigatório:</b> coloquem uma moeda entre as testas e caminhem juntos por 1 minuto sem deixá-la cair. Não vale segurar com as mãos. Depois, troquem quem conduz o caminho.</p>
                <div className="physical-challenge">
                  <span>🪙</span>
                  <div><b>{trustComplete ? "Desafio concluído!" : trustRunning ? `Tempo restante: ${trustTimer}s` : "Preparem a moeda e fiquem de frente um para o outro."}</b><small>Este desafio deve ser realizado pessoalmente pelos dois.</small></div>
                </div>
                <button className={trustComplete ? "forest-finish completed-task" : "forest-finish"} disabled={trustComplete} onClick={() => { if (!trustRunning) { setTrustTimer(60); setTrustRunning(true); chime(520,.3); } }}>{trustComplete ? "✓ Teste de confiança concluído" : trustRunning ? "Cronômetro em andamento..." : "Iniciar desafio de 1 minuto"}</button>
              </section>

              <div className="chapter-transition hunter-transition"><span>👹</span><p>Um rugido interrompe o treinamento. Das árvores surge um Oni enorme. O mestre recua e avisa: desta vez, a vitória depende da soma das forças da dupla.</p><span>👹</span></div>

              <section className="forest-section hunter-section oni-section">
                <h3>3. O Ataque do Oni</h3>
                <p>Cada jogador rola o dado uma vez. Depois, os resultados são somados: <b>2 a 5</b> significa falha e prenda; <b>6 a 8</b> derrota o Oni em equipe; <b>9 a 12</b> gera um golpe perfeito.</p>
                <div className="dragon-help-box"><span>🐉</span><div><b>Ajuda do Dragão</b><small>Uma vez durante uma batalha, o dragão pode acrescentar +1 ao resultado final. Disponível: {state.dragonBoosts ?? 0}</small></div></div>
                <div className="pirate-dice-row"><button disabled={oniRolls.length >= 2} onClick={() => rollHunterDie("oni")}>🎲 {oniRolls.length === 0 ? "Rolagem de Giselle" : oniRolls.length === 1 ? "Rolagem de Lucas" : "Batalha concluída"}</button><b>{oniRolls.length ? oniRolls.join(" + ") : "—"}</b></div>
                {oniRolls.length === 2 && <div className="outcome-text"><b>Soma: {oniRolls[0] + oniRolls[1] + (dragonBoostUsed ? 1 : 0)} {dragonBoostUsed && "(com +1 do dragão)"}</b><p>{oniRolls[0] + oniRolls[1] + (dragonBoostUsed ? 1 : 0) <= 5 ? "O Oni resiste. Cumpram uma prenda e tentem novamente." : oniRolls[0] + oniRolls[1] + (dragonBoostUsed ? 1 : 0) <= 8 ? "Vocês derrotam o Oni trabalhando juntos." : "Golpe perfeito! O Oni é derrotado e uma recompensa especial é encontrada."}</p>{!dragonBoostUsed && (state.dragonBoosts ?? 0) > 0 && <button className="mini-action" onClick={useDragonBoost}>Usar +1 do dragão</button>}</div>}
                <button className="forest-finish" onClick={finishHunters}>Finalizar o treinamento</button>
              </section>

              {hunterMessage && <motion.div className={hunterMessage.includes("Máscara") ? "result success" : "result fail"} initial={{ scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><span>{hunterMessage}</span>{hunterMessage.includes("Máscara") && <div className="memory-reveal"><p><b>Recompensa desbloqueada: Máscara do Oni.</b> Pode ser usada uma vez durante a aventura para transformar uma falha em sucesso parcial.</p><p><em>“Vocês chegaram aqui como aventureiros. Agora partem como caçadores.”</em></p><button className="continue-button" onClick={() => { setSelected(null); setHunterMessage(""); }}>Seguir para o Lago das Memórias →</button></div>}</motion.div>}
            </motion.article>
          </motion.div>
        )}

        {selected === 5 && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="parchment lake-parchment" initial={{ scale: .75, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .75, opacity: 0 }} transition={{ type: "spring", damping: 18 }}>
              <button className="close" onClick={() => { setSelected(null); setLakeMessage(""); }}>×</button>
              <div className="scroll-title lake-title"><span>💙</span><div><small>CAPÍTULO V</small><h2>Lago das Memórias</h2><p>As águas do coração</p></div><span>🌙</span></div>
              <div className="story">
                <p>Depois de concluírem o Treinamento dos Caçadores, Lucas, Giselle e o pequeno dragão seguem por um caminho iluminado por luzes azuis.</p>
                <p>Ao final da trilha, encontram um lago completamente parado. A água não reflete seus rostos: ela revela momentos vividos pelos dois.</p>
                <p>Uma voz surge das profundezas: <em>“Neste lago, não existe resposta certa ou errada. Apenas lembranças verdadeiras.”</em></p>
                <p>Para atravessar, vocês precisam recuperar três Cristais da Memória.</p>
              </div>

              <div className="memory-grid">
                <section className={`memory-card ${lakeMemoryOne ? "memory-done" : ""}`}>
                  <span className="crystal">💎</span><h3>1. A Primeira Lembrança</h3>
                  <p>Qual momento do começo da nossa história você gostaria de viver novamente?</p>
                  <small>Os dois devem responder em voz alta, pessoalmente.</small>
                  <button onClick={() => { setLakeMemoryOne(true); chime(600,.25); }}>{lakeMemoryOne ? "✓ Cristal do Começo desbloqueado" : "Nós dois respondemos"}</button>
                </section>
                <section className={`memory-card ${lakeMemoryTwo ? "memory-done" : ""}`}>
                  <span className="crystal">💗</span><h3>2. O Reflexo do Carinho</h3>
                  <p>Olhem um para o outro e completem: “Uma coisa em você que sempre consegue me fazer bem é...”</p>
                  <small>Respondam olhando um para o outro.</small>
                  <button onClick={() => { setLakeMemoryTwo(true); chime(640,.25); }}>{lakeMemoryTwo ? "✓ Cristal do Carinho desbloqueado" : "Nós dois completamos"}</button>
                </section>
                <section className={`memory-card ${lakeMemoryThree ? "memory-done" : ""}`}>
                  <span className="crystal">🔮</span><h3>3. Uma Memória do Futuro</h3>
                  <p>Cada um escreve, sem mostrar ao outro, uma coisa que gostaria muito que vocês vivessem juntos no futuro. Revelem ao mesmo tempo.</p>
                  <small>Se escreverem coisas parecidas, o dragão concede uma nova chance de rolagem.</small>
                  <button onClick={() => { setLakeMemoryThree(true); chime(680,.25); }}>{lakeMemoryThree ? "✓ Cristal do Futuro desbloqueado" : "Revelamos nossas respostas"}</button>
                </section>
              </div>

              <div className="chapter-transition lake-transition"><span>🐉</span><p>Quando os três cristais são reunidos, o lago começa a brilhar. O pequeno dragão toca a água com a pata, e uma caixa sobe lentamente até a superfície.</p><span>🗝️</span></div>

              <section className="forest-section lake-secret">
                <h3>O Segredo do Lago</h3>
                <div className="heart-key">🗝️💗</div>
                <p><b>A Chave do Coração</b> permite cancelar uma penalidade ou permitir que o parceiro repita uma tentativa.</p>
                <p><b>Bônus do Dragão:</b> vocês ganham uma repetição de dado para usar em uma fase futura.</p>
                <button className="forest-finish" onClick={finishLake}>Reunir os três cristais</button>
              </section>

              {lakeMessage && <motion.div className={lakeMessage.startsWith("Os três") ? "result success" : "result fail"} initial={{ scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><span>{lakeMessage}</span>{lakeMessage.startsWith("Os três") && <div className="memory-reveal"><p>Recompensas guardadas no Baú da Dupla: Chave do Coração, três Cristais da Memória e uma repetição de dado.</p><button className="continue-button" onClick={() => { setSelected(null); setLakeMessage(""); }}>Seguir para a Estrada das Conquistas →</button></div>}</motion.div>}
            </motion.article>
          </motion.div>
        )}


        {selected === 6 && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="parchment road-parchment" initial={{ scale: .72, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .72, opacity: 0 }}>
              <button className="close" onClick={() => { setSelected(null); setRoadMessage(""); }}>×</button>
              <div className="scroll-title road-title"><span>🏍️</span><div><small>CAPÍTULO VI</small><h2>Estrada das Conquistas</h2><p>A Oficina Perdida</p></div><span>🔧</span></div>
              <div className="story"><p>Vocês deixam o Lago das Memórias montados em uma CB 300. A estrada serpenteia entre montanhas, enquanto o pequeno dragão se equilibra no banco e abre as asas contra o vento.</p><p>De repente, o painel pisca, o motor perde força e a CB 300 para diante de uma oficina abandonada. Uma placa enferrujada anuncia: <em>“Somente quem conhece sua máquina e confia em sua dupla seguirá viagem.”</em></p><p>Para consertar a moto, acumular pontos e comprar uma nova máquina, vocês enfrentarão quatro desafios.</p></div>

              <section className="forest-section road-section"><h3>1. Diagnóstico da CB 300 — até 20 pontos</h3><p>O painel apagou, o motor perdeu força e a moto começou a falhar antes de parar. Qual é a causa mais provável?</p><ChoiceGroup title="Escolham juntos" value={roadDiagnostic} setValue={setRoadDiagnostic} options={["⛽ Falta de combustível", "🔋 Bateria ou sistema elétrico", "⛓️ Corrente frouxa", "🌡️ Superaquecimento"]}/>{roadDiagnostic && <p className="outcome-text">{roadDiagnostic === "🔋 Bateria ou sistema elétrico" ? "Diagnóstico perfeito: 20 pontos. O dragão encontra um cabo solto próximo à bateria." : "Boa tentativa: 10 pontos. O dragão entrega uma pista e conduz vocês até o sistema elétrico."}</p>}</section>

              <section className="forest-section road-section"><h3>2. Busca pelas peças — até 20 pontos</h3><div className="bridge-rules"><p>1 ou 2: nenhuma peça.</p><p>3 ou 4: uma peça e 5 pontos.</p><p>5 ou 6: duas peças e 10 pontos.</p></div><div className="pirate-dice-row"><button disabled={roadSearchRolls.length >= 2} onClick={rollRoadSearch}>🎲 {roadSearchRolls.length === 0 ? "Giselle procura" : roadSearchRolls.length === 1 ? "Lucas procura" : "Busca concluída"}</button><b>{roadSearchRolls.length ? roadSearchRolls.join(" + ") : "—"}</b></div></section>

              <section className="forest-section road-section"><h3>3. Quiz da Oficina Perdida — até 20 pontos</h3><p>Escolham uma resposta em cada pergunta. Cada acerto vale 5 pontos.</p>{[
                ["Qual destas motos é conhecida por alcançar uma das maiores velocidades em pista?", ["Yamaha R3","Honda CB 300","Kawasaki Ninja H2R","Yamaha MT-03"], "Kawasaki Ninja H2R"],
                ["O que significa ABS em uma moto?", ["Sistema de aceleração automática","Sistema antitravamento dos freios","Ajuste básico de suspensão","Assistência de bateria"], "Sistema antitravamento dos freios"],
                ["Para que serve a corrente da moto?", ["Resfriar o motor","Transmitir a força do motor para a roda traseira","Acionar o farol","Controlar o combustível"], "Transmitir a força do motor para a roda traseira"],
                ["Qual destas possui maior cilindrada?", ["MT-03","R3","MT-07","CB 300"], "MT-07"]
              ].map((question,i)=><div className="quiz-question" key={question[0] as string}><b>{i+1}. {question[0] as string}</b><div>{(question[1] as string[]).map(answer=><button type="button" key={answer} className={roadQuizAnswers[i]===answer?"selected-choice":""} onClick={()=>updateRoadQuiz(i,answer)}>{answer}</button>)}</div>{roadQuizAnswers[i] && <small className={roadQuizAnswers[i]===question[2]?"quiz-correct":"quiz-wrong"}>{roadQuizAnswers[i]===question[2]?"✓ Resposta certa: +5 pontos":"✗ Resposta registrada: 0 pontos"}</small>}</div>)}</section>

              <aside className="road-scoreboard"><h3>Placar da Oficina</h3><div><span>Diagnóstico <b>{roadScoreDetails().diagnostic}/20</b></span><span>Busca pelas peças <b>{roadScoreDetails().search}/20</b></span><span>Quiz <b>{roadScoreDetails().quiz}/20</b></span><span>Teste da estrada <b>{roadScoreDetails().test}/30</b></span><span>Bônus de parceria <b>{roadScoreDetails().partnership}/10</b></span></div><strong>Total: {roadScoreDetails().total}/100 pontos</strong><p>{Object.entries(bikePrices).map(([bike,price]) => `${bike}: ${Math.max(0, price-roadScoreDetails().total)} pts restantes`).join(" • ")}</p></aside>

              <section className="forest-section road-section"><h3>4. Teste da Estrada — até 30 pontos</h3><div className="bridge-rules"><p>Soma 10–12: 30 pontos.</p><p>Soma 7–9: 25 pontos.</p><p>Soma 4–6: 15 pontos.</p><p>Soma 2–3: 10 pontos.</p><p>Ao concluírem todos os desafios, recebem ainda 10 pontos de parceria.</p></div><div className="pirate-dice-row"><button disabled={roadTestRolls.length >= 2} onClick={rollRoadTest}>🎲 {roadTestRolls.length===0?"Giselle pilota":roadTestRolls.length===1?"Lucas pilota":"Teste concluído"}</button><b>{roadTestRolls.length?roadTestRolls.join(" + "):"—"}</b></div></section>

              <section className="forest-section road-shop"><h3>Loja das Máquinas Lendárias</h3><div className="score-orb">{roadScore()} <small>pontos do casal</small></div><div className="bike-shop">{Object.entries(bikePrices).map(([bike,price])=><button key={bike} disabled={roadScore()<price} className={roadPurchasedBike===bike?"selected-bike":""} onClick={()=>setRoadPurchasedBike(bike)}><span>{bike === "R1" ? "🏍️✨" : "🏍️"}</span><b>{bike}</b><small>{price} pontos</small></button>)}</div>{roadPurchasedBike && <p className="outcome-text">Máquina escolhida: <b>{roadPurchasedBike}</b>. Ela será guardada no Baú de Conquistas.</p>}<button className="forest-finish" onClick={finishRoad}>Comprar a moto e concluir a estrada</button></section>
              {roadMessage && <motion.div className={roadMessage.includes("conquistada") ? "result success" : "result fail"} initial={{scale:.85,opacity:0}} animate={{scale:1,opacity:1}}><span>{roadMessage}</span>{roadMessage.includes("conquistada") && <div className="memory-reveal"><button className="continue-button" onClick={()=>{setSelected(null);setRoadMessage("")}}>Seguir para a Arena do Futebol →</button></div>}</motion.div>}
            </motion.article>
          </motion.div>
        )}

        {selected === 7 && (
          <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.article className="parchment arena-parchment" initial={{scale:.72,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.72,opacity:0}}>
            <button className="close" onClick={()=>{setSelected(null);setArenaMessage("")}}>×</button><div className="scroll-title arena-title"><span>⚽</span><div><small>CAPÍTULO VII</small><h2>Arena do Futebol</h2><p>Quando dois jogam como um</p></div><span>🏆</span></div>
            <div className="story"><p>A nova moto conduz vocês até um estádio escondido entre montanhas. As arquibancadas estão vazias, mas tochas se acendem quando a dupla entra no gramado.</p><p>O Guardião da Arena anuncia: <em>“Talento individual marca gols. Confiança e parceria conquistam campeonatos.”</em></p></div>
            <section className="forest-section arena-section"><h3>1. Batizem a equipe</h3><input className="team-input" value={arenaTeamName} onChange={e=>setArenaTeamName(e.target.value)} placeholder="Nome da equipe de Lucas & Gigi"/></section>
            <section className="forest-section arena-section"><h3>2. Duelo de Ataque e Defesa</h3><p>Escolham as posições. Um será o <b>atacante</b> e precisa marcar 3 gols. O outro será o <b>goleiro</b> e precisa defender 3 bolas. As funções não podem ser iguais.</p><div className="role-picker"><div><b>Giselle quer ser:</b><button className={arenaAttacker==="Giselle"?"selected-choice":""} onClick={()=>chooseArenaRole("Giselle","Atacante")}>⚽ Atacante</button><button className={arenaKeeper==="Giselle"?"selected-choice":""} onClick={()=>chooseArenaRole("Giselle","Goleiro")}>🧤 Goleira</button></div><div><b>Lucas quer ser:</b><button className={arenaAttacker==="Lucas"?"selected-choice":""} onClick={()=>chooseArenaRole("Lucas","Atacante")}>⚽ Atacante</button><button className={arenaKeeper==="Lucas"?"selected-choice":""} onClick={()=>chooseArenaRole("Lucas","Goleiro")}>🧤 Goleiro</button></div></div><div className="soccer-score"><span>Atacante: <b>{arenaAttacker || "—"}</b> {arenaAttacker==="Giselle"?arenaScoreGigi:arenaScoreLucas}/3 gols</span><span>Goleiro: <b>{arenaKeeper || "—"}</b> {arenaKeeper==="Giselle"?arenaScoreGigi:arenaScoreLucas}/3 defesas</span></div><div className="soccer-mini-game" ref={goalRef}><div className="goal-net"></div><div className="moving-keeper">🧤</div><motion.div className="soccer-ball" drag dragConstraints={goalRef} dragElastic={0.15} onDragEnd={kickArenaBall}>⚽</motion.div></div><p className="shot-message">{arenaShotMessage}</p></section>
            <section className="forest-section arena-section"><h3>3. Cobranças do Destino</h3><div className="bridge-rules"><p>1–2: defesa do goleiro; o jogador cumpre uma prenda.</p><p>3–4: gol com dificuldade.</p><p>5–6: golaço e bônus de torcida.</p></div><div className="pirate-dice-row"><button disabled={arenaGoals.length>=2} onClick={rollArenaGoal}>🎲 {arenaGoals.length===0?"Cobrança de Giselle":arenaGoals.length===1?"Cobrança de Lucas":"Cobranças concluídas"}</button><b>{arenaGoals.length?arenaGoals.join(" | "):"—"}</b></div></section>
            <section className="forest-section arena-section"><h3>4. Mercado de Transferências</h3><p>Depois da partida, os maiores clubes do reino enviam propostas. Cada jogador escolhe seu novo time.</p><ChoiceGroup title="Transferência de Giselle" value={arenaTransferGigi} setValue={setArenaTransferGigi} options={["Real Madrid","Barcelona","Atlético de Madrid","Santos"]}/><ChoiceGroup title="Transferência de Lucas" value={arenaTransferLucas} setValue={setArenaTransferLucas} options={["Real Madrid","Barcelona","Atlético de Madrid","Santos"]}/><button className="forest-finish" onClick={finishArena}>Encerrar a partida</button></section>
            {arenaMessage && <motion.div className={arenaMessage.startsWith("Vitória")?"result success":"result fail"} initial={{scale:.85,opacity:0}} animate={{scale:1,opacity:1}}><span>{arenaMessage}</span>{arenaMessage.startsWith("Vitória")&&<div className="memory-reveal"><p>Recompensa: Troféu da Sintonia.</p><button className="continue-button" onClick={()=>{setSelected(null);setArenaMessage("")}}>Seguir para o Castelo do Destino →</button></div>}</motion.div>}
          </motion.article></motion.div>
        )}

        {selected === 8 && (
          <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.article className="parchment castle-parchment" initial={{scale:.72,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.72,opacity:0}}>
            <button className="close" onClick={()=>{setSelected(null);setCastleMessage("")}}>×</button><div className="scroll-title castle-title"><span>🏰</span><div><small>CAPÍTULO VIII</small><h2>Castelo do Destino</h2><p>O último portão</p></div><span>💍</span></div>
            <div className="story"><p>Com o Troféu da Sintonia em mãos, vocês chegam ao castelo que guarda o caminho para o tesouro. O portão não possui fechadura comum: ele reconhece todas as escolhas feitas durante a aventura.</p><p>Uma voz ecoa: <em>“Antes de receberem o destino, provem que conseguem caminhar unidos mesmo quando o tempo é curto.”</em></p></div>
            <section className="forest-section castle-section"><h3>1. Desafio presencial — Beijo às Cegas</h3><p>Coloquem vendas nos olhos e, sem usar as mãos para guiar o rosto do outro, tentem dar um selinho. Façam devagar e com cuidado para não baterem a cabeça.</p><div className="castle-timer">00:{String(castleTimer).padStart(2,"0")}</div><button className="mini-action" disabled={castleChallengeComplete} onClick={()=>{setCastleTimer(10);setCastleRunning(true)}}>{castleRunning?"Aproximem-se com cuidado...":castleChallengeComplete?"✓ Selinho concluído":"Iniciar contagem de 10 segundos"}</button></section>
            <section className="forest-section castle-section"><h3>2. As Chaves da Jornada</h3><p>Diante do portão, quatro símbolos conquistados durante a aventura começam a brilhar. Cada um representa uma parte da história de vocês.</p><div className="key-meanings"><p><b>🗝️ Chave Dourada:</b> a chave que abriu novos caminhos e mostrou que juntos vocês sempre encontram uma saída.</p><p><b>💗 Chave do Coração:</b> o amor, o carinho e as memórias que mantêm vocês conectados.</p><p><b>🏆 Troféu da Sintonia:</b> a prova de que vocês sabem jogar no mesmo time e comemorar juntos.</p><p><b>🏍️ Emblema da Liberdade:</b> os sonhos e as estradas que ainda querem percorrer lado a lado.</p></div><ChoiceGroup title="Escolham o símbolo que melhor representa a força da dupla" value={castleGateChoice} setValue={setCastleGateChoice} options={["🗝️ Chave Dourada","💗 Chave do Coração","🏆 Troféu da Sintonia","🏍️ Emblema da Liberdade"]}/><p className="outcome-text">Não existe escolha errada. O castelo quer conhecer a lembrança mais poderosa de vocês.</p></section>
            <section className="forest-section castle-section"><h3>3. O Portão do Destino</h3><div className="bridge-rules"><p>Cada um rola um dado. A soma precisa ser 6 ou mais.</p><p>Se a soma for menor, cumpram uma prenda e tentem novamente.</p></div><div className="pirate-dice-row"><button disabled={castleRolls.length>=2} onClick={rollCastleDie}>🎲 {castleRolls.length===0?"Giselle toca o portão":castleRolls.length===1?"Lucas toca o portão":"Destino revelado"}</button><b>{castleRolls.length?castleRolls.join(" + "):"—"}</b></div><button className="forest-finish" onClick={finishCastle}>Abrir o Castelo do Destino</button></section>
            {castleMessage && <motion.div className={castleMessage.startsWith("Os portões")?"result success":"result fail"} initial={{scale:.85,opacity:0}} animate={{scale:1,opacity:1}}><span>{castleMessage}</span>{castleMessage.startsWith("Os portões")&&<div className="memory-reveal"><p><b>Recompensa desbloqueada: Anel da Promessa.</b></p><p><em>“O verdadeiro destino não é o lugar onde vocês chegam, mas a escolha de continuar caminhando juntos.”</em></p><button className="continue-button" onClick={()=>{setSelected(null);setCastleMessage("")}}>O Tesouro Final está desbloqueado →</button></div>}</motion.div>}
          </motion.article></motion.div>
        )}

        {selected === 9 && (
          <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.article className="parchment final-parchment" initial={{scale:.72,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.72,opacity:0}}>
            <button className="close" onClick={()=>setSelected(null)}>×</button><div className="scroll-title final-title"><span>💎</span><div><small>CAPÍTULO FINAL</small><h2>O Tesouro Final</h2><p>O verdadeiro prêmio da jornada</p></div><span>❤️</span></div>
            <div className="story"><p>As portas do último salão se abrem. Todos os símbolos conquistados flutuam ao redor de vocês, enquanto o pequeno dragão pousa sobre um enorme baú dourado.</p><p>Ele bate a pata na tampa, olha para Lucas e Gigi e parece dizer: <em>“Chegaram até aqui juntos. Agora descubram o que sempre esteve no centro desta aventura.”</em></p></div>
            <div className={`treasure-chest ${finalChestOpen?"chest-open":""}`} onClick={()=>{setFinalChestOpen(true);chime(980,.6)}}><div className="chest-lid">✨</div><div className="chest-body">💎</div></div>
            {!finalChestOpen && <button className="forest-finish" onClick={()=>{setFinalChestOpen(true);chime(980,.6)}}>Abrir o baú</button>}
            {finalChestOpen && <motion.div className="magic-scroll" initial={{scale:0,rotate:-8,opacity:0}} animate={{scale:1,rotate:0,opacity:1}} onClick={()=>setFinalLetterOpen(true)}><span>📜</span><b>Clique no pergaminho</b></motion.div>}
            {finalLetterOpen && <motion.div className="final-letter" initial={{y:40,opacity:0}} animate={{y:0,opacity:1}}><h3>Oi, Baby ❤️</h3><p>Espero que tenha gostado do joguinho/RPG. Pensei em você e coloquei um pouquinho da nossa história em cada fase.</p><p><b>Feliz aniversário! Te amo e obrigada por tudo.</b></p><p>Agora fale as palavras mágicas:</p><div className="magic-words">“Camarazinho e Tilapinha”</div><p>…e o seu presente será entregue. 🎁</p><p className="signature">Com amor, Giselle.</p></motion.div>}
          </motion.article></motion.div>
        )}

        {showDice && (
          <motion.div className="modal-backdrop dice-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="dice-panel" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <button className="close" onClick={() => setShowDice(false)}>×</button>
              <small>AS PROVAÇÕES DA AVENTURA</small><h2>Dado do Destino</h2>
              <p>{diceContext === "reflex" ? "Um dos jogadores foi atingido no Teste de Reflexos. Role a prenda e cumpra-a pessoalmente antes de continuar." : diceContext === "road" ? "A tempestade venceu esta tentativa. Cumpram a prenda para poder tentar a estrada novamente." : diceContext === "arena" ? "O goleiro defendeu o chute. Role uma prenda, cumpra-a pessoalmente e depois continuem a partida." : diceContext === "castle" ? "O portão resistiu. Role a prenda, cumpra-a e depois tentem novamente." : "Nem toda batalha se vence com espada. Lance o D6 e aceite o que o destino escolher."}</p>
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
              {!rolling && diceContext && <button className="continue-button" onClick={confirmPenalty}>Confirmamos que a prenda foi cumprida</button>}
            </motion.article>
          </motion.div>
        )}

        {inventoryOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="inventory-panel" initial={{ x: 250 }} animate={{ x: 0 }} exit={{ x: 250 }}>
              <button className="close" onClick={() => setInventoryOpen(false)}>×</button>
              <h2>Baú de Conquistas</h2><p>Tudo o que vocês conquistaram e ainda podem usar durante a jornada.</p>
              <div className="resource-strip"><span>🎲 Repetições: <b>{state.rerolls ?? 0}</b></span><span>🐉 Ajuda do Dragão: <b>{state.dragonBoosts ?? 0}</b></span><span>🎭 Máscara do Oni: <b>{state.oniMaskUses ?? 0}</b></span><span>🗝️ Chave do Coração: <b>{state.heartKeyUses ?? 0}</b></span></div>
              <div className="inventory-grid">{state.inventory.map((item, i) => <div key={item}><span>{["🗺️","💬","🗝️","💎","🎭","💍"][i % 6]}</span><b>{item}</b><small>{item === "Ajuda do Dragão" ? "+1 em uma batalha" : item === "Máscara do Oni" ? "Transforma falha em sucesso parcial" : item === "Bônus do Dragão" ? "Permite repetir um dado" : item === "Chave do Coração" ? "Cancela penalidade ou repete tentativa" : "Conquista da aventura"}</small></div>)}</div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
