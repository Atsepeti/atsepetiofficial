"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Play,
  RotateCcw,
  Coins,
  Flag,
  Trophy,
  AlertTriangle,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type RacerInfo = {
  id: number;
  name: string;
  colorHex: string;
  speed: number;
};

type Phase = "select" | "countdown" | "racing" | "finished";

const FINISH_X = 230;
const LANE_GAP = 3;

const COMMENTARY_OPENERS = [
  "Ve yarış başladı! Nallar havada uçuşuyor!",
  "Başlangıç harika! Ahır sakinleri şaşkın!",
  "Hop dedik, gittiler! Tribünler ayakta (kutu insanlar)!",
];

const COMMENTARY_MID = [
  (l: string) => `${l} önde ama arkadan rüzgar gibi bir hırs geliyor!`,
  (l: string) => `${l} kulvarında bir dans, bir bale izliyoruz!`,
  (l: string) => `${l} bugün kahvaltıda fazladan havuç yemiş belli ki!`,
  (_: string, last: string) => `${last} son sırada ama fotojenikliğinden bir şey kaybetmedi!`,
  (l: string) => `${l} rakiplerini tek tek selamlayarak geçiyor!`,
  (l: string) => `${l} hızlandı! Hipodrom mikrofonları titriyor!`,
];

const COMMENTARY_END = [
  (w: string) => `VE BİTTİ! Kazanan ${w}! Tribünler kutu seyirci çığlıklarıyla inliyor!`,
  (w: string) => `Finiş! ${w} damalı bayrağı gördü ve kişnedi!`,
];

type Racer = RacerInfo & {
  group: THREE.Group;
  legs: THREE.Object3D[];
  tail: THREE.Object3D;
  headParts: THREE.Object3D[];
  pos: number;
  vel: number;
  phaseSeed: number;
  surge: number;
  surgeTimer: number;
  finished: boolean;
  finishTime: number;
};

function hexToNumber(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}

function buildHorse(colorNum: number) {
  const group = new THREE.Group();
  const base = new THREE.Color(colorNum);
  const bodyMat = new THREE.MeshStandardMaterial({ color: base, roughness: 0.75 });
  const darkMat = new THREE.MeshStandardMaterial({
    color: base.clone().multiplyScalar(0.55),
    roughness: 0.9,
  });
  const mesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number
  ) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    group.add(m);
    return m;
  };

  // Gövde
  mesh(new THREE.BoxGeometry(2.4, 1.1, 1.0), bodyMat, 0, 1.35, 0);
  // Boyun
  const neck = mesh(new THREE.BoxGeometry(0.55, 1.05, 0.6), bodyMat, 1.05, 1.95, 0);
  neck.rotation.z = -0.45;
  // Kafa
  const head = mesh(new THREE.BoxGeometry(0.85, 0.5, 0.5), bodyMat, 1.7, 2.35, 0);
  head.rotation.z = -0.2;
  // Burun
  mesh(new THREE.BoxGeometry(0.35, 0.3, 0.38), darkMat, 2.12, 2.24, 0);
  // Kulaklar
  const earGeo = new THREE.ConeGeometry(0.09, 0.3, 4);
  mesh(earGeo, darkMat, 1.5, 2.68, 0.12);
  mesh(earGeo, darkMat, 1.5, 2.68, -0.12);
  // Yele
  const mane = mesh(new THREE.BoxGeometry(0.18, 1.15, 0.22), darkMat, 0.82, 2.0, 0);
  mane.rotation.z = -0.45;
  // Kuyruk
  const tail = mesh(new THREE.BoxGeometry(0.8, 0.24, 0.24), darkMat, -1.45, 1.55, 0);
  tail.rotation.z = 0.55;

  // Bacaklar (pivot grupları)
  const legs: THREE.Object3D[] = [];
  const legGeo = new THREE.BoxGeometry(0.24, 1.0, 0.3);
  const legPositions = [
    [0.85, 0.35],
    [0.85, -0.35],
    [-0.85, 0.35],
    [-0.85, -0.35],
  ];
  for (const [lx, lz] of legPositions) {
    const pivot = new THREE.Group();
    pivot.position.set(lx, 1.0, lz);
    const leg = new THREE.Mesh(legGeo, bodyMat);
    leg.position.y = -0.5;
    leg.castShadow = true;
    pivot.add(leg);
    group.add(pivot);
    legs.push(pivot);
  }

  return { group, legs, tail, headParts: [head, neck, mane] };
}

function buildWorld(scene: THREE.Scene) {
  // Zemin (çim)
  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 200),
    new THREE.MeshStandardMaterial({ color: 0x4f8f46, roughness: 1 })
  );
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(120, -0.05, 0);
  grass.receiveShadow = true;
  scene.add(grass);

  // Pist (toprak)
  const track = new THREE.Mesh(
    new THREE.BoxGeometry(560, 0.12, LANE_GAP * 6 + 2.4),
    new THREE.MeshStandardMaterial({ color: 0xb08050, roughness: 1 })
  );
  track.position.set(120, 0, 0);
  track.receiveShadow = true;
  scene.add(track);

  // Kulvar çizgileri
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const laneCount = 6;
  for (let i = 0; i <= laneCount; i++) {
    const z = (i - laneCount / 2) * LANE_GAP;
    const line = new THREE.Mesh(new THREE.BoxGeometry(560, 0.02, 0.12), lineMat);
    line.position.set(120, 0.08, z);
    scene.add(line);
  }

  // Bitiş çizgisi (damalı)
  const half = (LANE_GAP * 6) / 2;
  const cols = 12;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < cols; j++) {
      const black = (i + j) % 2 === 0;
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.03, (half * 2) / cols),
        new THREE.MeshBasicMaterial({ color: black ? 0x222222 : 0xf6f2e8 })
      );
      tile.position.set(
        FINISH_X + (i - 0.5) * 0.6,
        0.1,
        -half + (j + 0.5) * ((half * 2) / cols)
      );
      scene.add(tile);
    }
  }

  // Tribün
  const standMat = new THREE.MeshStandardMaterial({ color: 0xc7a06a, roughness: 0.9 });
  for (let s = 0; s < 3; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(120, 1.2, 3), standMat);
    step.position.set(60, 0.6 + s * 1.2, -16 - s * 2.6);
    step.castShadow = true;
    scene.add(step);
  }
  // Kutu seyirciler
  const crowdColors = [0xc6362c, 0xf0a63c, 0x8fc6e8, 0xfaf3e7, 0x7a4ea3, 0x2c5a2e];
  const crowd: THREE.Mesh[] = [];
  for (let i = 0; i < 90; i++) {
    const s = Math.floor(Math.random() * 3);
    const c = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.7 + Math.random() * 0.3, 0.55),
      new THREE.MeshStandardMaterial({
        color: crowdColors[Math.floor(Math.random() * crowdColors.length)],
        roughness: 0.8,
      })
    );
    c.position.set(
      60 - 57 + Math.random() * 114,
      1.2 + s * 1.2 + 0.45,
      -16 - s * 2.6 + (Math.random() - 0.5) * 1.4
    );
    c.userData.seed = Math.random() * Math.PI * 2;
    c.userData.baseY = c.position.y;
    scene.add(c);
    crowd.push(c);
  }

  // Ağaçlar
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2a, roughness: 1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f6b30, roughness: 1 });
  for (let i = 0; i < 14; i++) {
    const x = -20 + i * 22 + (Math.random() - 0.5) * 8;
    const z = 16 + Math.random() * 14;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.2, 6), trunkMat);
    trunk.position.set(x, 1.1, z);
    trunk.castShadow = true;
    scene.add(trunk);
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.4, 6), leafMat);
    leaf.position.set(x, 3.4, z);
    leaf.castShadow = true;
    scene.add(leaf);
  }

  // Bulutlar
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
  const clouds: THREE.Group[] = [];
  for (let i = 0; i < 5; i++) {
    const g = new THREE.Group();
    for (let j = 0; j < 3; j++) {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(2.2 + Math.random() * 1.4, 10, 8),
        cloudMat
      );
      puff.position.set(j * 3 - 3, Math.random(), Math.random());
      g.add(puff);
    }
    g.position.set(Math.random() * 280 - 40, 22 + Math.random() * 8, -30 + Math.random() * 24);
    clouds.push(g);
    scene.add(g);
  }

  // Bayrak direği
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xdddddd })
  );
  pole.position.set(FINISH_X + 2, 4, -8);
  scene.add(pole);
  const flag = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.2, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xc6362c })
  );
  flag.position.set(FINISH_X + 3.1, 7.2, -8);
  scene.add(flag);

  // Başlangıç kapısı kemeri
  const archMat = new THREE.MeshStandardMaterial({ color: 0xf0a63c, roughness: 0.7 });
  const archTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1, 1), archMat);
  archTop.position.set(-6, 6.4, 0);
  archTop.rotation.y = Math.PI / 2;
  archTop.scale.set(1, 1, 6);
  scene.add(archTop);
  const postGeo = new THREE.CylinderGeometry(0.25, 0.25, 6, 8);
  const p1 = new THREE.Mesh(postGeo, archMat);
  p1.position.set(-6, 3, -9.5);
  scene.add(p1);
  const p2 = new THREE.Mesh(postGeo, archMat);
  p2.position.set(-6, 3, 9.5);
  scene.add(p2);

  return { crowd, clouds, flag };
}

export default function RaceGame({
  racers,
  balance,
}: {
  racers: RacerInfo[];
  balance: number | null;
}) {
  const router = useRouter();
  const mountRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<{
    racers: Racer[];
    renderer: THREE.WebGLRenderer;
    raf: number;
  } | null>(null);
  const raceRef = useRef({
    phase: "select" as Phase,
    t: 0,
    commentTimer: 0,
    chosenId: -1,
    bet: 0,
    settled: false,
  });

  const [phase, setPhase] = useState<Phase>("select");
  const [chosenId, setChosenId] = useState<number>(racers[0]?.id ?? -1);
  const [bet, setBet] = useState<number>(50);
  const [countText, setCountText] = useState("");
  const [commentary, setCommentary] = useState("");
  const [liveRank, setLiveRank] = useState<{ name: string; pct: number; color: string }[]>([]);
  const [result, setResult] = useState<{
    ranks: string[];
    myPos: number;
    meName: string;
    payout: number;
    newBalance: number | null;
    bet: number;
  } | null>(null);
  const [apiError, setApiError] = useState("");

  const loggedIn = balance !== null;
  const [balanceState, setBalanceState] = useState<number | null>(balance);

  // 3D kurulumu
  useEffect(() => {
    if (!mountRef.current || racers.length === 0) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8fc6e8);
    scene.fog = new THREE.Fog(0x8fc6e8, 120, 380);

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / Math.max(1, mount.clientHeight),
      0.1,
      600
    );
    camera.position.set(-18, 7, 14);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xbfe3ff, 0x3a5a34, 0.9);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2d9, 1.6);
    sun.position.set(40, 60, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -80;
    sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -40;
    scene.add(sun);

    const { crowd, clouds, flag } = buildWorld(scene);

    const racers3d: Racer[] = racers.map((r, i) => {
      const built = buildHorse(hexToNumber(r.colorHex));
      built.group.position.set(-i * 1.2, 0, (i - (racers.length - 1) / 2) * LANE_GAP);
      scene.add(built.group);
      return {
        ...r,
        ...built,
        pos: 0,
        vel: 0,
        phaseSeed: Math.random() * 10,
        surge: 0,
        surgeTimer: 0,
        finished: false,
        finishTime: 0,
      };
    });

    worldRef.current = { racers: racers3d, renderer, raf: 0 };

    const clock = new THREE.Clock();
    let disposed = false;

    const animate = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const race = raceRef.current;
      const t = clock.elapsedTime;

      // Seyirciler zıplasın
      const crowdEnergy = race.phase === "racing" ? 1.8 : 0.35;
      for (const c of crowd) {
        c.position.y =
          c.userData.baseY +
          Math.abs(Math.sin(t * 3.2 + c.userData.seed)) * 0.28 * crowdEnergy;
      }
      // Bulutlar süzülsün
      for (const cl of clouds) {
        cl.position.x += dt * 1.2;
        if (cl.position.x > 320) cl.position.x = -60;
      }
      flag.rotation.y = Math.sin(t * 2.4) * 0.25;

      if (race.phase === "racing") {
        race.t += dt;
        let allFinished = true;
        for (const r of racers3d) {
          if (!r.finished) {
            allFinished = false;
            const ramp = Math.min(race.t / 1.4, 1);
            r.surgeTimer -= dt;
            if (r.surgeTimer <= 0) {
              r.surgeTimer = 0.6 + Math.random() * 0.9;
              r.surge = (Math.random() - 0.5) * 1.6;
            }
            r.surge *= Math.pow(0.35, dt);
            const target =
              (11.5 + r.speed * 0.55) * ramp +
              Math.sin(race.t * (0.9 + r.phaseSeed * 0.05) + r.phaseSeed) * 1.2 +
              r.surge;
            r.vel += (target - r.vel) * Math.min(dt * 3, 1);
            r.pos += r.vel * dt;
            if (r.pos >= FINISH_X) {
              r.finished = true;
              r.finishTime = race.t;
              r.pos = FINISH_X;
            }
          } else {
            // bitenler yavaşlasın
            r.vel *= Math.pow(0.4, dt);
          }
          r.group.position.x = -6 + r.pos;
          if (r.finished) {
            r.group.position.x = -6 + FINISH_X + (race.t - r.finishTime) * 2.5 * Math.max(0, 1 - (race.t - r.finishTime) * 0.4);
          }
        }
        if ((allFinished || race.t > 40) && !race.settled) {
          race.settled = true;
          race.phase = "finished";
          finishRace(racers3d);
        }
      }

      // Koşu animasyonu
      for (const r of racers3d) {
        const running =
          race.phase === "racing" ? Math.max(0.25, r.vel / 14) : 0.12;
        const freq = 9 + r.speed * 0.4;
        r.legs.forEach((leg, li) => {
          leg.rotation.x =
            Math.sin(t * freq + r.phaseSeed + (li % 2 === 0 ? 0 : Math.PI) + Math.floor(li / 2) * 0.7) *
            0.95 *
            running;
        });
        r.group.position.y = Math.abs(Math.sin(t * freq * 0.5 + r.phaseSeed)) * 0.18 * running;
        r.tail.rotation.x = Math.sin(t * 6 + r.phaseSeed) * 0.35 * (0.4 + running);
        for (const part of r.headParts) {
          part.rotation.x = Math.sin(t * freq * 0.5 + r.phaseSeed + 1) * 0.08 * running;
        }
      }

      // Kamera: lideri takip
      let leader = racers3d[0];
      for (const r of racers3d) if (r.pos > leader.pos) leader = r;
      const camTargetX = leader.group.position.x - 1;
      const desired = new THREE.Vector3(camTargetX - 9, 6.4, 13.5);
      camera.position.lerp(desired, Math.min(dt * 2.2, 1));
      const look = new THREE.Vector3(camTargetX + 6, 1.6, 0);
      camera.lookAt(look);

      renderer.render(scene, camera);
      raceRef.current.commentTimer += dt;

      worldRef.current!.raf = requestAnimationFrame(animate);
    };
    worldRef.current.raf = requestAnimationFrame(animate);

    const onResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / Math.max(1, mountRef.current.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(worldRef.current?.raf ?? 0);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [racers.length]);

  // Canlı sıralamayı React tarafına köprüle
  useEffect(() => {
    const iv = setInterval(() => {
      const w = worldRef.current;
      const race = raceRef.current;
      if (!w || race.phase !== "racing") return;
      const sorted = [...w.racers].sort((a, b) => {
        if (a.finished && b.finished) return a.finishTime - b.finishTime;
        if (a.finished) return -1;
        if (b.finished) return 1;
        return b.pos - a.pos;
      });
      setLiveRank(
        sorted.map((r) => ({
          name: r.name,
          pct: Math.min(100, Math.round((r.pos / FINISH_X) * 100)),
          color: r.colorHex,
        }))
      );
      // Spiker
      if (race.commentTimer > 2.6 && race.t > 1) {
        race.commentTimer = 0;
        const lead = sorted[0];
        const last = sorted[sorted.length - 1];
        const fn = COMMENTARY_MID[Math.floor(Math.random() * COMMENTARY_MID.length)];
        setCommentary(fn(lead.name, last.name));
      }
    }, 220);
    return () => clearInterval(iv);
  }, []);

  function resetRacers() {
    const w = worldRef.current;
    if (!w) return;
    for (const r of w.racers) {
      r.pos = 0;
      r.vel = 0;
      r.finished = false;
      r.finishTime = 0;
      r.surge = 0;
      r.phaseSeed = Math.random() * 10;
      r.group.position.x = -w.racers.indexOf(r) * 1.2;
      r.group.position.y = 0;
    }
    raceRef.current.t = 0;
    raceRef.current.settled = false;
    raceRef.current.commentTimer = 0;
  }

  function startRace() {
    if (!worldRef.current) return;
    setResult(null);
    setApiError("");
    setLiveRank([]);
    resetRacers();
    raceRef.current.chosenId = chosenId;
    raceRef.current.bet = loggedIn ? bet : 0;
    raceRef.current.phase = "countdown";
    setPhase("countdown");
    setCountText("3");
    setCommentary("");
    setTimeout(() => setCountText("2"), 800);
    setTimeout(() => setCountText("1"), 1600);
    setTimeout(() => {
      setCountText("DIIIĞIDIĞIIIK!");
      setCommentary(
        COMMENTARY_OPENERS[Math.floor(Math.random() * COMMENTARY_OPENERS.length)]
      );
      raceRef.current.t = 0;
      raceRef.current.phase = "racing";
      setPhase("racing");
      setTimeout(() => setCountText(""), 900);
    }, 2400);
  }

  function finishRace(rs: Racer[]) {
    const sorted = [...rs].sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.pos - a.pos;
    });
    const ranks = sorted.map((r) => r.name);
    const meIdx = sorted.findIndex((r) => r.id === raceRef.current.chosenId);
    const myPos = meIdx >= 0 ? meIdx + 1 : 1;
    const betAmt = raceRef.current.bet;
    setPhase("finished");
    setCommentary(
      COMMENTARY_END[Math.floor(Math.random() * COMMENTARY_END.length)](ranks[0])
    );

    if (betAmt > 0 && loggedIn) {
      fetch("/api/yaris/sonuc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          horseName: sorted[meIdx].name,
          bet: betAmt,
          position: myPos,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            setApiError(data.error ?? "Sonuç kaydedilemedi.");
            setResult({ ranks, myPos, meName: sorted[meIdx].name, payout: 0, newBalance: null, bet: betAmt });
            return;
          }
          setBalanceState(data.newBalance);
          setResult({
            ranks,
            myPos,
            meName: sorted[meIdx].name,
            payout: data.payout,
            newBalance: data.newBalance,
            bet: betAmt,
          });
          router.refresh();
        })
        .catch(() => {
          setApiError("Skor tablosuna bağlanılamadı; atlar veriyi saman sandı.");
          setResult({ ranks, myPos, meName: sorted[meIdx].name, payout: 0, newBalance: null, bet: betAmt });
        });
    } else {
      setResult({
        ranks,
        myPos,
        meName: sorted[meIdx]?.name ?? "Atın",
        payout: 0,
        newBalance: null,
        bet: 0,
      });
    }
  }

  function backToSelect() {
    raceRef.current.phase = "select";
    resetRacers();
    setPhase("select");
    setResult(null);
    setLiveRank([]);
    setCommentary("");
  }

  if (racers.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-mocha/40 p-10 text-center text-mocha">
        Hipodrom hazırlanıyor. Nal sesleri geliyor, az kaldı.
      </div>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
      {/* 3D sahne */}
      <div className="sticker relative overflow-hidden rounded-3xl bg-skyblue">
        <div ref={mountRef} className="h-[420px] w-full sm:h-[500px]" />

        {/* Üst şerit: damalı */}
        <div className="checkered pointer-events-none absolute inset-x-0 top-0 h-3" />

        {/* Geri sayım */}
        {countText && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="animate-pop rounded-3xl border-4 border-ink bg-hay px-8 py-4 font-display text-5xl text-ink shadow-[6px_8px_0_#241708] sm:text-7xl">
              {countText}
            </span>
          </div>
        )}

        {/* Spiker */}
        {(phase === "racing" || phase === "finished") && commentary && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 animate-pop">
            <p className="mx-auto max-w-xl rounded-2xl border-2 border-ink bg-ink/90 px-4 py-2.5 text-center text-sm font-bold text-cream">
              <Volume2 className="mr-2 inline-block h-4 w-4 text-hay" />
              {commentary}
            </p>
          </div>
        )}

        {/* Seçim aşamasında bilgi etiketi */}
        {phase === "select" && (
          <span className="absolute left-4 top-6 -rotate-2 rounded-xl border-2 border-ink bg-cream px-3 py-1.5 text-xs font-extrabold shadow-[2px_3px_0_#241708]">
            Hipodrom hazır — atları ısınırken izle
          </span>
        )}
      </div>

      {/* Kontrol paneli */}
      <aside className="space-y-4">
        {phase === "select" && (
          <div className="sticker rounded-3xl bg-white/85 p-6">
            <h2 className="font-display text-2xl">Atını Seç</h2>
            <div className="mt-4 space-y-2">
              {racers.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setChosenId(r.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left transition-all ${
                    chosenId === r.id
                      ? "border-ink bg-hay/40 shadow-[2px_3px_0_#241708]"
                      : "border-mocha/25 bg-cream hover:border-ink"
                  }`}
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded-full border-2 border-ink"
                    style={{ backgroundColor: r.colorHex }}
                  />
                  <span className="grow font-display text-base leading-tight">
                    {r.name}
                  </span>
                  <span className="text-[11px] font-extrabold text-mocha">
                    Hız {r.speed}/10
                  </span>
                </button>
              ))}
            </div>

            {loggedIn ? (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-mocha">
                    Bahis (AtCoin)
                  </label>
                  <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-hay px-2.5 py-0.5 text-xs font-extrabold">
                    <Coins className="h-3.5 w-3.5" />
                    {(balanceState ?? 0).toLocaleString("tr-TR")} AC
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[25, 50, 100, 250].map((v) => (
                    <button
                      key={v}
                      onClick={() => setBet(v)}
                      className={`rounded-xl border-2 py-2 text-sm font-extrabold transition-colors ${
                        bet === v
                          ? "border-ink bg-brick text-cream"
                          : "border-ink/30 bg-cream hover:border-ink"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={10}
                  max={balanceState ?? 0}
                  value={bet}
                  onChange={(e) => setBet(Math.floor(Number(e.target.value) || 0))}
                  className="mt-2 w-full rounded-xl border-2 border-ink bg-cream px-4 py-2.5 font-extrabold outline-none focus:ring-4 focus:ring-hay/40"
                />
                {bet > (balanceState ?? 0) && (
                  <p className="mt-1.5 text-xs font-bold text-brick">
                    Bakiyen {(balanceState ?? 0).toLocaleString("tr-TR")} AC — at
                    tefecilik yapmaz.
                  </p>
                )}
                <p className="mt-2 text-[11px] font-bold text-mocha">
                  Birincilik = 4 kat ödeme. Min. bahis 10 AC. Bahissiz koşmak
                  istersen miktarı 0 yap.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border-2 border-dashed border-mocha/50 bg-parchment/70 p-4 text-center">
                <p className="text-sm font-bold text-mocha">
                  Bahis heyecanı üyelere özeldir. Giriş yapmadan da
                  eğlencesine koşturabilirsin.
                </p>
                <Link
                  href="/giris?next=/yaris"
                  className="mt-2 inline-block font-extrabold text-brick underline underline-offset-2"
                >
                  Giriş yap — 1.000 AC ile başla
                </Link>
              </div>
            )}

            <button
              onClick={startRace}
              disabled={loggedIn && (bet > (balanceState ?? 0) || (bet !== 0 && bet < 10))}
              className="sticker mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-grass px-4 py-4 font-display text-xl tracking-wide text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Play className="h-5 w-5" />
              Yarışı Başlat
            </button>
          </div>
        )}

        {(phase === "countdown" || phase === "racing") && (
          <div className="sticker rounded-3xl bg-white/85 p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <Flag className="h-5 w-5 text-brick" />
              Canlı Sıralama
            </h2>
            <div className="mt-4 space-y-2.5">
              {(liveRank.length ? liveRank : racers.map((r) => ({ name: r.name, pct: 0, color: r.colorHex }))).map(
                (r, i) => (
                  <div key={r.name}>
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className={r.color === racers.find(x => x.id === chosenId)?.colorHex && racers.find(x => x.id === chosenId)?.name === r.name ? "text-brick" : ""}>
                        {i + 1}. {r.name}
                      </span>
                      <span className="text-mocha">%{r.pct}</span>
                    </div>
                    <div className="mt-1 h-3 overflow-hidden rounded-full border border-ink bg-sand">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{ width: `${r.pct}%`, backgroundColor: r.color }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {phase === "finished" && result && (
          <div className="sticker animate-pop rounded-3xl bg-white/85 p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <Trophy className="h-6 w-6 text-haydark" />
              Sonuçlar
            </h2>
            <div className="mt-4 space-y-1.5">
              {result.ranks.map((name, i) => (
                <div
                  key={name}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-extrabold ${
                    i === 0
                      ? "border-ink bg-hay/50"
                      : name === result.meName
                        ? "border-brick/60 bg-[#ffe3df]"
                        : "border-mocha/20 bg-cream"
                  }`}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink bg-white text-[11px]">
                    {i + 1}
                  </span>
                  {name}
                  {name === result.meName && (
                    <span className="ml-auto rounded-full bg-brick px-2 py-0.5 text-[10px] text-cream">
                      SENİN ATIN
                    </span>
                  )}
                </div>
              ))}
            </div>

            {result.bet > 0 && (
              <div
                className={`mt-4 rounded-2xl border-2 border-ink p-4 text-center font-display text-xl ${
                  result.payout > 0 ? "bg-[#dff3e0] text-grassdark" : "bg-[#ffe3df] text-brick"
                }`}
              >
                {result.payout > 0
                  ? `KAZANDIN! +${result.payout.toLocaleString("tr-TR")} AC`
                  : `${result.bet.toLocaleString("tr-TR")} AC gitti... Atın özür diliyor (yalan).`}
                {result.newBalance !== null && (
                  <span className="mt-1 block text-sm font-bold">
                    Yeni bakiye: {result.newBalance.toLocaleString("tr-TR")} AC
                  </span>
                )}
              </div>
            )}
            {result.bet === 0 && (
              <p className="mt-4 rounded-2xl border-2 border-dashed border-mocha/40 bg-parchment/70 p-3 text-center text-sm font-bold text-mocha">
                Bahissiz koştun, heyecan bedavaydı. Giriş yapıp AtCoin ile
                oynarsan kalp atışların da yarışır.
              </p>
            )}

            {apiError && (
              <p className="mt-3 flex items-start gap-2 rounded-xl border-2 border-ink bg-[#ffe3df] p-3 text-xs font-bold text-brick">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {apiError}
              </p>
            )}

            <button
              onClick={backToSelect}
              className="sticker mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 font-display text-lg text-cream transition-transform hover:-translate-y-0.5"
            >
              <RotateCcw className="h-5 w-5" />
              Yeni Yarış
            </button>
          </div>
        )}

        <div className="rounded-2xl border-2 border-dashed border-mocha/40 bg-parchment/70 p-4 text-xs font-bold leading-relaxed text-mocha">
          Hipodrom kuralları: Atlar kutu fontendendir, duyguları gerçektir.
          Kamera lideri takip eder; kaybedenler kadraja giremez (meslek
          deformasyonu). Tribündeki seyirciler tamamen kartondur.
        </div>
      </aside>
    </div>
  );
}
