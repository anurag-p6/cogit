"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Icon from "./Icon";
import StageScene, { type PrivacyMode, type PrivacyPhase } from "./privacy/StageScene";

const LIMITS = [3, 14, 90, 365];
const DEFAULT_LIMIT = 90;
const RUNNING: PrivacyPhase[] = ["write", "cross", "pull", "count"];

const CAPTIONS: Record<PrivacyMode, Record<PrivacyPhase, string>> = {
  on: {
    idle: "sealed before it leaves your side · replay anytime",
    write: "write · the body is sealed client-side with the repo group key",
    cross: "share · the sealed envelope crosses over; the key stays home",
    pull: "pull · agents verify authorship and read metadata, never the body",
    count: "expiry · set in blocks at write time; this ring is the network's clock",
    expired: "expired · the network dropped the entity. no cleanup job, no server",
    read: "…",
  },
  off: {
    idle: "plaintext mode · flip the switch to compare",
    write: "write · nothing is sealed; the body sits readable in the store",
    cross: "share · plaintext crosses over; every tool it passes can read it",
    pull: "pull · no key gate; any tool on any machine reads the full body",
    count: "no expiry · plaintext lives as long as the store does",
    expired: "…",
    read: "read · any agent, any machine, forever. no key required",
  },
};

export default function PrivacyStage() {
  const [privacy, setPrivacy] = useState<PrivacyMode>("on");
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [phase, setPhase] = useState<PrivacyPhase>("idle");
  const [daysLeft, setDaysLeft] = useState(DEFAULT_LIMIT);
  const [reduce, setReduce] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const modeRef = useRef<PrivacyMode>("on");
  const phaseRef = useRef<PrivacyPhase>("idle");
  const playedRef = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) {
      window.clearTimeout(id);
    }
    timers.current = [];
  }, []);

  const finish = useCallback(
    (mode: PrivacyMode) => {
      clearTimers();
      if (mode === "on") {
        setDaysLeft(0);
        setPhase("expired");
      } else {
        setPhase("read");
      }
    },
    [clearTimers],
  );

  const play = useCallback(
    (mode: PrivacyMode, days: number) => {
      modeRef.current = mode;
      clearTimers();
      setDaysLeft(days);
      setPhase("write");
      const push = (fn: () => void, ms: number) => {
        timers.current.push(window.setTimeout(fn, ms));
      };
      push(() => setPhase("cross"), 900);
      if (mode === "on") {
        push(() => setPhase("pull"), 2900);
        push(() => {
          setPhase("count");
          const steps = 60;
          let step = 0;
          const id = window.setInterval(() => {
            step += 1;
            setDaysLeft(Math.max(0, Math.round(days * (1 - step / steps))));
            if (step >= steps) {
              window.clearInterval(id);
            }
          }, 40);
          timers.current.push(id);
        }, 3700);
        push(() => setPhase("expired"), 6300);
      } else {
        push(() => setPhase("read"), 1950);
      }
    },
    [clearTimers],
  );

  useEffect(() => {
    const element = stageRef.current;
    if (element === null) {
      return;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(media.matches);
    if (media.matches) {
      setPhase("pull");
      setDaysLeft(DEFAULT_LIMIT);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !playedRef.current && phaseRef.current === "idle") {
            playedRef.current = true;
            play("on", DEFAULT_LIMIT);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);

    const onVisibility = () => {
      if (document.hidden && RUNNING.includes(phaseRef.current)) {
        finish(modeRef.current);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimers();
    };
  }, [play, finish, clearTimers]);

  const toggle = useCallback(() => {
    const next: PrivacyMode = modeRef.current === "on" ? "off" : "on";
    modeRef.current = next;
    setPrivacy(next);
    playedRef.current = true;
    if (reduce) {
      finish(next);
      return;
    }
    play(next, limit);
  }, [reduce, limit, play, finish]);

  const selectLimit = useCallback(
    (days: number) => {
      setLimit(days);
      setDaysLeft(days);
      playedRef.current = true;
      if (reduce) {
        finish("on");
        return;
      }
      play("on", days);
    },
    [reduce, play, finish],
  );

  const replay = useCallback(() => {
    playedRef.current = true;
    if (reduce) {
      finish(privacy);
      return;
    }
    play(privacy, limit);
  }, [reduce, privacy, limit, play, finish]);

  return (
    <section className="section privacy" id="privacy">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">01 · Privacy</p>
            <h2 className="h2">Agents share memory, never secrets.</h2>
          </div>
          <p className="section-note">
            The group key stays on your side of the boundary. Agents pull sealed entries, verify who
            wrote them, and the network expires what you no longer need.
          </p>
        </div>

        <div
          className="pstage card"
          data-reveal
          data-privacy={privacy}
          data-phase={phase}
          ref={stageRef}
        >
          <StageScene privacy={privacy} phase={phase} daysLeft={daysLeft} />

          <div className="pstage-controls">
            <button
              type="button"
              role="switch"
              aria-checked={privacy === "on"}
              className="pswitch"
              onClick={toggle}
            >
              <span className="pswitch-track" aria-hidden="true">
                <span className="pswitch-knob" />
              </span>
              <span className="pswitch-copy">
                <span className="pswitch-label">Full privacy</span>
                <span className={`pswitch-state mono${privacy === "off" ? " is-off" : ""}`}>
                  {privacy === "on" ? "on · sealed, key-gated" : "off · plaintext, no expiry"}
                </span>
              </span>
            </button>

            <div
              className="seg pseg-limits"
              role="group"
              aria-label="Memory time limit"
              data-disabled={privacy === "off"}
            >
              {LIMITS.map((days) => (
                <button
                  key={days}
                  type="button"
                  className={`seg-opt${privacy === "on" && limit === days ? " is-on" : ""}`}
                  aria-pressed={privacy === "on" && limit === days}
                  disabled={privacy === "off"}
                  onClick={() => selectLimit(days)}
                >
                  {days} d
                </button>
              ))}
            </div>

            <button type="button" className="preplay" onClick={replay}>
              <Icon name="i-refresh" className="ic ic-inline" />
              Replay
            </button>
          </div>

          <p className={`pstage-caption mono${privacy === "off" ? " is-bad" : ""}`} aria-live="polite">
            {CAPTIONS[privacy][phase]}
          </p>
        </div>
      </div>
    </section>
  );
}
