"use client";

import { ArrowDown, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LoginForm from "@/components/form/login-form";

export default function LoginPage() {
  const [lightOn, setLightOn] = useState(false);

  return (
    <main className={`lamp-scene ${lightOn ? "light-on" : "light-off"}`}>
      <div className="scene-stars" />
      <div className="scene-glow" />
      <div className="scene-floor" />

      <div className="desk-lamp" aria-hidden="true">
        <div className="lamp-beam" />
        <div className="lamp-floor-glow" />
        <div className="lamp-shade">
          <div className="lamp-shade-top" />
          <div className="lamp-inner" />
          <div className="lamp-bulb" />
        </div>
        <div className="lamp-neck lamp-neck-upper" />
        <div className="lamp-neck lamp-neck-lower" />
        <div className="lamp-joint" />
        <div className="lamp-foot-joint" />
        <div className="lamp-base" />
        <button
          type="button"
          className="lamp-switch"
          aria-label={lightOn ? "Turn the lamp off" : "Turn the lamp on"}
          onClick={() => setLightOn((current) => !current)}
        >
          <span className="pull-string" />
          <span className="pull-handle" />
        </button>
        {!lightOn && (
          <button
            type="button"
            className="lamp-instruction"
            onClick={() => setLightOn(true)}
          >
            <span className="instruction-arrow">
              <ArrowDown className="size-4" />
            </span>
            <span>
              <strong>LIGHT THE WAY</strong>
              <small>Pull the cord to unlock your workspace</small>
            </span>
          </button>
        )}
      </div>

      <div className="lamp-scene-caption">
        <span className="caption-indicator" />
        {lightOn ? "SECURE SESSION READY" : "WORKSPACE STANDBY"}
      </div>

      <section className="lamp-login-panel" aria-label="Sign in">
        <div className="panel-topline">
          <div className="panel-brand">
            <span className="brand-symbol">DA</span>
            <span>
              <b>DEVELOPER</b> ASSESSMENTS
            </span>
          </div>
          <div className="panel-status">
            <span />
            ENCRYPTED ACCESS
          </div>
        </div>

        <div className="panel-heading">
          <p className="panel-eyebrow">WELCOME BACK</p>
          <h1>
            Sign in to your <span>workspace.</span>
          </h1>
          <p className="panel-subtitle">
            Continue building better technical hiring decisions.
          </p>
        </div>

        <LoginForm />

        <div className="lamp-panel-footer">
          <LockKeyhole className="footer-spark size-3" />
          Your assessment data stays private and protected
        </div>
      </section>

      <footer className="lamp-scene-footer">
        <Link href="/">DEVELOPER ASSESSMENTS</Link>
        <span className="hidden sm:inline">
          EVIDENCE-FIRST TECHNICAL HIRING
        </span>
        <Link href="/about-us">
          <Sparkles className="mr-1 inline size-3" />
          HOW IT WORKS
        </Link>
      </footer>
    </main>
  );
}
